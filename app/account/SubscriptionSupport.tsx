"use client";

import { useRef, useState } from "react";
import type { Locale } from "../components/Locale";
const reasons = ["price", "technical_problem", "missing_feature", "not_using", "other"];
const copy = {
  en: { title: "Subscription support", manage: "Manage or cancel with Apple", reason: "Reason (optional)",
    choose: "Choose a reason", labels: ["Price", "Technical problem", "Missing a feature", "Not using it", "Other"],
    comment: "Comment (optional)", send: "Send feedback", sending: "Saving…", retry: "Retry saving feedback", saved: "Thank you. Your feedback was saved.",
    failed: "Could not save your feedback. Please try again.",
    note: "Apple handles cancellation. Access continues until the current period ends. Cancel a free trial at least 24 hours before it ends to avoid renewal.",
    offer: "Eligible existing subscribers can check for a one-month discounted offer in the GrantTap app under Subscription → Manage or cancel. Apple confirms the localized price and regular renewal before purchase. TestFlight remains free.",
    privacy: "Feedback is optional and goes to GrantTap support. Comments are encrypted at rest, kept for up to 90 days, and removed with your account. Sending feedback does not cancel or change a subscription." },
  ru: { title: "Поддержка по подписке", manage: "Управление и отмена в Apple", reason: "Причина (необязательно)",
    choose: "Выберите причину", labels: ["Цена", "Техническая проблема", "Не хватает функции", "Не пользуюсь", "Другое"],
    comment: "Комментарий (необязательно)", send: "Отправить отзыв", sending: "Сохраняем…", retry: "Повторить сохранение отзыва", saved: "Спасибо. Ваш отзыв сохранён.",
    failed: "Не удалось сохранить отзыв. Попробуйте ещё раз.",
    note: "Отмена выполняется в Apple. Доступ сохраняется до конца текущего периода. Чтобы пробная подписка не продлилась, отмените её минимум за 24 часа до окончания.",
    offer: "Подписчики могут проверить предложение на один месяц со скидкой в приложении GrantTap: Подписка → Управление или отмена. Apple покажет местную цену и обычное продление перед покупкой. TestFlight остаётся бесплатным.",
    privacy: "Отзыв необязателен и направляется в поддержку GrantTap. Комментарии зашифрованы при хранении, сохраняются до 90 дней и удаляются вместе с аккаунтом. Отзыв не отменяет и не меняет подписку." },
};

export function SubscriptionSupport({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const pending = useRef(false);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [feedbackId, setFeedbackId] = useState<string>();
  const [state, setState] = useState<"idle" | "sending" | "saved" | "failed">("idle");
  const hasFeedback = !!reason || comment.trim().length > 0;
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!hasFeedback || pending.current || state === "saved") return;
    pending.current = true;
    const id = feedbackId ?? crypto.randomUUID();
    setFeedbackId(id); setState("sending");
    try {
      const response = await fetch("/api/account/subscriptions/cancellation-feedback", { method: "POST",
        credentials: "same-origin", headers: { "content-type": "application/json" },
        body: JSON.stringify({ feedbackId: id, reason: reason || "other", comment }) });
      if (!response.ok || (await response.json()).saved !== true) throw Error("Feedback unavailable");
      setState("saved");
    } catch { setState("failed"); }
    finally { pending.current = false; }
  }
  return <section aria-labelledby="subscription-support-title" className="account-boundary">
    <h2 id="subscription-support-title">{t.title}</h2>
    <p><a href="https://apps.apple.com/account/subscriptions">{t.manage}</a></p>
    <p>{t.note}</p><p>{t.offer}</p>
    {state === "saved" ? <p role="status">{t.saved}</p> : <form onSubmit={event => void submit(event)}>
      <p><label htmlFor="cancellation-reason">{t.reason}</label><br />
        <select id="cancellation-reason" disabled={!!feedbackId} value={reason} onChange={event => setReason(event.target.value)}>
          <option value="">{t.choose}</option>
          {reasons.map((value, index) => <option key={value} value={value}>{t.labels[index]}</option>)}
        </select></p>
      <p><label htmlFor="cancellation-comment">{t.comment}</label><br />
        <textarea id="cancellation-comment" disabled={!!feedbackId} rows={4} maxLength={2000} value={comment}
          onChange={event => setComment(event.target.value)} /></p>
      <button type="submit" disabled={!hasFeedback || state === "sending"}>{state === "sending" ? t.sending : state === "failed" ? t.retry : t.send}</button>
      {state === "failed" && <p role="alert">{t.failed}</p>}
    </form>}
    <p>{t.privacy}</p>
  </section>;
}
