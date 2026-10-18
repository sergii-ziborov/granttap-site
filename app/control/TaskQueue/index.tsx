import type { OutgoingCommand } from "../ControlOutbox";

/** New Tasks remain visible while relay has them but the computer has no native session yet. */
export function QueuedTaskCards({ commands, query }: { commands: OutgoingCommand[]; query: string }) {
  return commands.map(command => {
    const payload = command.payload;
    if (payload.type !== "project.task.create" || !`${payload.text} ${payload.agent}`.toLowerCase().includes(query.toLowerCase())) return null;
    return <article className="gt-task-card" key={command.id}>
      <div className="gt-section-heading"><span className="gt-status">New Task</span><span>{payload.agent}</span></div>
      <h3>{payload.text.slice(0, 180)}</h3>
      <p className="gt-delivery" role="status">{command.delivery.state === "stored" ? "Saved on relay · waiting for computer"
        : command.delivery.state === "sending" ? "Saving on relay…" : command.delivery.error || "Relay storage was not confirmed."}</p>
    </article>;
  });
}
