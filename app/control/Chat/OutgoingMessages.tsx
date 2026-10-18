import { useState } from "react";
import type { OutgoingCommand } from "../ControlOutbox";

export function OutgoingMessages({ commands, retry }: { commands: OutgoingCommand[]; retry: (id: string) => Promise<void> }) {
  const [error, setError] = useState("");
  const attempt = async (id: string) => { setError(""); try { await retry(id); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Retry failed."); } };
  return <>{error && <p role="alert">{error}</p>}{commands.map(command => {
    if (command.payload.type !== "user.message") return null;
    const message = command.payload, { delivery } = command;
    return <article key={command.id} className="gt-message" data-kind="user">
      <div className="gt-eyebrow">You</div><div className="gt-message-text">{message.text}</div>
      {message.attachments?.map((file, index) => <small key={index}>{file.name}</small>)}
      <p className="gt-delivery" role="status">{delivery.state === "stored" ? "Saved on relay · waiting for computer"
        : delivery.state === "sending" ? "Saving on relay…" : delivery.error || "Relay storage was not confirmed."}</p>
      {delivery.state === "failed" && <button onClick={() => void attempt(command.id)}>Retry message</button>}
    </article>;
  })}</>;
}
