"use client";

import { useState } from "react";

const diagrams: Record<string, { title: string; caption: string; steps: { title: string; symbol: string; text: string; href: string }[] }> = {
  delivery: {
    title: "Одно сообщение. Несколько подтверждений.",
    caption: "Схема, а не замер скорости. Нажмите на этап: каждый отвечает на свой вопрос.",
    steps: [
      { title: "Телефон", symbol: "01", text: "Операция сохранена на устройстве. У неё есть собственный ID и исходный чат. Клавиатура может уже закрыться; сеть ещё проверяется.", href: "/guide/message-delivery#route" },
      { title: "Реле", symbol: "02", text: "Saved on relay: зашифрованный пакет сохранён. Компьютер может быть офлайн. Это ещё не получение агентом.", href: "/guide/message-delivery#receipts" },
      { title: "Компьютер", symbol: "03", text: "Mac подтвердил получение. Модуль проверяет маршрут и правила; агент может ждать нативного разрешения или освобождения чата.", href: "/guide/message-queue" },
      { title: "Агент", symbol: "04", text: "Есть связанная активность провайдера. Это подтверждает начало работы, но ещё не её успешный итог.", href: "/guide/message-delivery#receipts" },
      { title: "История", symbol: "05", text: "Ответ возвращается через историю. Открытый экран на ПК может обновиться позднее; видимость в UI и приём сообщения — разные события.", href: "/guide/providers" },
    ],
  },
  task: {
    title: "Task остаётся. Исполнения меняются.",
    caption: "Учебная схема: перенос требует доступного назначения и подтверждения. Это не общий доступ ко всем чатам.",
    steps: [
      { title: "Task", symbol: "T", text: "Задача хранит одну цель и видимую историю в своём Project Mesh.", href: "/guide/task-execution" },
      { title: "Claude · Mac", symbol: "A", text: "Первое исполнение сохраняет собственную нативную историю и рабочую копию.", href: "/guide/providers" },
      { title: "Checkpoint", symbol: "↗", text: "Подтверждённое состояние и выбранный commit готовятся к переносу. Незакоммиченные файлы сами не перемещаются.", href: "/guide/handoff" },
      { title: "Codex · Mac", symbol: "B", text: "Новое исполнение продолжает ту же Task. Провайдер, компьютер и доступ остаются явными.", href: "/guide/task-execution" },
    ],
  },
  governance: {
    title: "Правило становится ограничением на компьютере.",
    caption: "Схема принятия решения. Записанная политика и подтверждённое применение — отдельные состояния.",
    steps: [
      { title: "Область", symbol: "01", text: "Выберите нужный Project Mesh. Правило не должно случайно попадать в другой проект или компьютер.", href: "/guide/mesh-projects" },
      { title: "Правило", symbol: "02", text: "Allow разрешает в пределах остальных ограничений. Ask требует решения. Deny блокирует; более широкое разрешение не снимает запрет.", href: "/guide/governance" },
      { title: "Проверка", symbol: "03", text: "Компьютер применяет поддерживаемый механизм: policy adapter, native hook или другой реализованный путь. Неподдерживаемое не называется Enforced.", href: "/guide/skills-mcp-shell" },
      { title: "Квитанция", symbol: "04", text: "Смотрите состояние применения на конкретном компьютере и подтверждённые события Runtime. Неизвестное остаётся неизвестным.", href: "/guide/audit-evidence" },
    ],
  },
};

export function Diagram({ id }: { id: string }) {
  const data = diagrams[id]; const [selected, setSelected] = useState(0);
  if (!data) return null;
  const step = data.steps[selected];
  return <figure className="guide-diagram">
    <figcaption><span className="guide-eyebrow">Интерактивная схема</span><strong>{data.title}</strong><p>{data.caption}</p></figcaption>
    <div className="diagram-steps" role="group" aria-label={data.title}>
      {data.steps.map((item, index) => <button key={item.title} aria-pressed={index === selected}
        onClick={() => setSelected(index)}><span>{item.symbol}</span><strong>{item.title}</strong></button>)}
    </div>
    <div className="diagram-detail" aria-live="polite"><strong>{step.title}</strong><p>{step.text}</p>
      <a href={step.href}>Подробнее об этом этапе ↗</a></div>
  </figure>;
}
