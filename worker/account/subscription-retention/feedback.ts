import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";
import { UUID } from "../http";

export const cancellationReasons = ["price", "technical_problem", "missing_feature", "not_using", "other"] as const;
export type FeedbackCursor = { createdAt: number; accountId: string; feedbackId: string };
type FeedbackRow = { account_id: string; feedback_id: string; reason: string;
  encrypted_comment: string; created_at: number };

/** Optional, account-scoped support feedback; plaintext is never a metric or log. */
export class SubscriptionCancellationFeedback {
  private readonly key: Buffer;

  constructor(private readonly db: D1Database, secret: Buffer, private readonly now = Date.now) {
    if (secret.length < 32) throw new Error("Feedback encryption is not configured.");
    this.key = Buffer.from(hkdfSync("sha256", secret, Buffer.alloc(0), "granttap-cancellation-feedback-v1", 32));
  }

  async save(accountId: string, id: unknown, reason: unknown, comment: unknown): Promise<"saved" | "invalid" | "limited"> {
    if (typeof id !== "string" || !UUID.test(id) || typeof reason !== "string"
      || !(cancellationReasons as readonly string[]).includes(reason)
      || typeof comment !== "string" || comment.length > 2_000) return "invalid";
    await this.prune();
    const existing = await this.db.prepare(`SELECT feedback_id FROM subscription_cancellation_feedback
      WHERE account_id=? AND feedback_id=?`).bind(accountId, id).first();
    if (existing) return "saved";
    const now = this.now();
    const count = await this.db.prepare(`SELECT COUNT(*) AS count FROM subscription_cancellation_feedback
      WHERE account_id=? AND created_at>?`).bind(accountId, now - 86_400_000).first<{ count: number }>();
    if ((count?.count ?? 0) >= 5) return "limited";
    const nonce = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.key, nonce);
    cipher.setAAD(Buffer.from(`${accountId}:${id}`));
    const ciphertext = Buffer.concat([cipher.update(comment.trim(), "utf8"), cipher.final()]);
    const encrypted = Buffer.concat([nonce, cipher.getAuthTag(), ciphertext]).toString("base64");
    const inserted = await this.db.prepare(`INSERT INTO subscription_cancellation_feedback
      (account_id,feedback_id,reason,encrypted_comment,created_at) SELECT id,?,?,?,? FROM accounts WHERE id=?
        AND (SELECT COUNT(*) FROM subscription_cancellation_feedback WHERE account_id=? AND created_at>?)<5
      ON CONFLICT(account_id,feedback_id) DO NOTHING`)
      .bind(id, reason, encrypted, now, accountId, accountId, now - 86_400_000).run();
    if (inserted.meta.changes === 1) return "saved";
    const retried = await this.db.prepare(`SELECT feedback_id FROM subscription_cancellation_feedback
      WHERE account_id=? AND feedback_id=?`).bind(accountId, id).first();
    return retried ? "saved" : "limited";
  }

  async prune(): Promise<void> {
    await this.db.prepare("DELETE FROM subscription_cancellation_feedback WHERE created_at<=?")
      .bind(this.now() - 90 * 86_400_000).run();
  }

  /** Server operators can read bounded feedback with the existing private server key. */
  async readForOperator(after?: FeedbackCursor) {
    const cursor = after ?? { createdAt: 0, accountId: "", feedbackId: "" };
    if (!Number.isSafeInteger(cursor.createdAt) || cursor.createdAt < 0
      || typeof cursor.accountId !== "string" || typeof cursor.feedbackId !== "string") {
      throw new Error("Invalid feedback cursor.");
    }
    await this.prune();
    const rows = await this.db.prepare(`SELECT account_id,feedback_id,reason,encrypted_comment,created_at
      FROM subscription_cancellation_feedback WHERE (created_at,account_id,feedback_id)>(?,?,?)
      ORDER BY created_at,account_id,feedback_id LIMIT 100`)
      .bind(cursor.createdAt, cursor.accountId, cursor.feedbackId).all<FeedbackRow>();
    return rows.results.map(row => {
      const payload = Buffer.from(row.encrypted_comment, "base64");
      const decipher = createDecipheriv("aes-256-gcm", this.key, payload.subarray(0, 12));
      decipher.setAAD(Buffer.from(`${row.account_id}:${row.feedback_id}`));
      decipher.setAuthTag(payload.subarray(12, 28));
      const comment = Buffer.concat([decipher.update(payload.subarray(28)), decipher.final()]).toString("utf8");
      return { accountId: row.account_id, feedbackId: row.feedback_id, reason: row.reason,
        comment, createdAt: row.created_at };
    });
  }
}
