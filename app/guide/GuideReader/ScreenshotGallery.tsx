"use client";

import { useState } from "react";
import captures from "../GuideContent/screenshots.json";
import { Capture } from "./Capture";

const collections = [
  { id: "featured", title: "Главные экраны", ids: ["devices-overview", "chat", "modified-files", "agents", "automations", "computer-controls"] },
  { id: "connect", title: "Подключение", ids: ["devices-onboarding", "pairing-options"] },
  { id: "devices", title: "Devices и вход", ids: ["devices-overview", "computer-controls", "mcp-updated", "provider-grok-login", "provider-claude-login", "phone-cache", "computer-cache"] },
  { id: "work", title: "Чат и решения", ids: ["tasks", "chat", "modified-files", "modified-diff", "agents", "agent-messages", "automations", "automation-editor", "workspace-search", "transfer-form", "queue-actions", "delivery", "question-attachments", "approval-details"] },
  { id: "project", title: "Проект и инструменты", ids: ["mesh", "mcp-details", "skill-details", "graph", "health", "usage"] },
  { id: "mac", title: "Mac", ids: ["mac-now", "mac-chat"] },
  { id: "all", title: "Все экраны", ids: captures.map(item => item.id) },
];

export function ScreenshotGallery() {
  const [selected, setSelected] = useState(collections[0]);
  return <section className="guide-screen-gallery" aria-label="Галерея экранов" id="guide-screens">
    <div className="guide-section-heading"><span className="guide-eyebrow">Посмотрите, как это выглядит</span>
      <h2>Настоящие экраны.<br /><em>Понятные действия.</em></h2>
      <p>От первого подключения до проверки результата. Каждый снимок можно увеличить; под ним указаны сборка и учебный сценарий.</p></div>
    <div className="gallery-filters" role="group" aria-label="Отобрать экраны">
      {collections.map(collection => <button key={collection.id} aria-pressed={selected.id === collection.id}
        onClick={() => setSelected(collection)}>{collection.title} · {collection.ids.length}</button>)}
    </div>
    <p className="gallery-count" role="status">{selected.title} · показано экранов: {selected.ids.length}</p>
    <div className="guide-home-gallery">{selected.ids.map(id => <Capture key={id} id={id} />)}</div>
    <p className="gallery-provenance">Реальный интерфейс на учебных данных. Новые экраны — сборка 250 в iOS Simulator. Сохранённые ранние снимки iPhone 230 и Mac 181 отмечены в подписях. У каждого кадра своя дата; художественная иллюстрация подписана отдельно.</p>
  </section>;
}
