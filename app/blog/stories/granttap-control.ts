import type { BlogArticle } from "../articleTypes";

export const granttapControl: BlogArticle = {
  slug: "why-granttap-is-a-control-center",
  date: "2026-10-03",
  minutes: 6,
  cover: "/blog/granttap-control.webp",
  generatedCover: true,
  screenshot: "/product/iphone-command-center.png",
  en: {
    title: "Why GrantTap is a control center for local agents",
    summary: "The task stays visible while providers, sessions, and computers change. Here is the product decision behind that design.",
    category: "Product thinking",
    intro: [
      "A coding agent can do useful work for minutes or hours while you are elsewhere. The hard part is rarely starting one more session. It is knowing which work needs a decision, which computer holds it, and whether a tool was actually allowed and used.",
      "GrantTap treats the Task as the unit a person follows. An Execution is one provider session doing that work. A child agent belongs inside its execution. This lets the visible task survive a provider change or a new native session without inventing a new user request.",
    ],
    sections: [
      { heading: "See the work before you interrupt it", paragraphs: [
        "The Now screen puts Needs You before routine activity. A useful status names the current provider, computer, workspace, last meaningful event, and delivery state. It does not turn every tool call into a notification. The phone and Watch are for a glance, a bounded decision, and a short continuation; the coding runtime remains on the computer.",
        "If a computer goes offline, the task should say so. A message queued for delivery is different from one accepted by a provider, and both differ from a tested code change. We preserve those distinctions because a reassuring green dot can be more misleading than an explicit unknown.",
      ] },
      { heading: "Keep authority close to the action", paragraphs: [
        "GrantTap coordinates Claude Code and Codex as primary integrations; Cursor is Beta and other providers have narrower documented behavior. Each provider retains its own session and controls. Mesh policy can allow, ask, or deny a capability, but a chosen policy is not proof that every computer enforced it. A host must report its observed state.",
        "The relay transports encrypted envelopes. Provider credentials and the local coding environment stay on the computer. This architecture is a choice about where work and authority live, not a promise that every external model service is private: provider traffic still follows that provider's own terms.",
      ] },
      { heading: "Make handoffs legible", paragraphs: [
        "A handoff carries the objective, approved constraints, relevant decisions, blockers, and an explicit target. It does not copy hidden reasoning across providers. Repository identity and resource claims help people notice overlapping work; a receipt shows whether the next execution accepted the transfer.",
        "The measure of success is simple: after stepping away, can you tell what happened, what remains unknown, and where your next decision belongs? GrantTap is being built around that question, with product status shown as carefully as product ambition.",
      ] },
    ],
    screenshotCaption: "GrantTap Now on iPhone, captured with deterministic sample data.",
    closing: "The useful control center is the one that makes a decision smaller and its outcome easier to verify.",
    sources: [
      { label: "GrantTap product and current availability", url: "/" },
      { label: "Task continuity guide", url: "/blog/task-continuity-across-agents" },
      { label: "Security boundaries", url: "/security" },
    ],
    graphic: { title: "One Task, many executions", caption: "A conceptual map of the stable user-visible unit. It is not a live telemetry chart.", rows: [
      { label: "Task", detail: "Objective, decisions, and visible outcome" },
      { label: "Execution", detail: "One provider-native session on one computer" },
      { label: "Child agents", detail: "Nested work inside that execution" },
    ] },
  },
  ru: {
    title: "Зачем GrantTap нужен центр управления локальными агентами",
    summary: "Задача остаётся видимой, даже когда меняются провайдер, сессия и компьютер. Объясняем решение, на котором строится продукт.",
    category: "О продукте",
    intro: [
      "Coding-агент может работать десятки минут, пока вы отошли. Сложнее не открыть ещё одну сессию, а понять, какая работа ждёт решения, на каком она компьютере и был ли инструмент действительно разрешён и использован.",
      "В GrantTap человек следит за Task. Execution — одна сессия провайдера, исполняющая эту задачу. Дочерний агент находится внутри execution. Поэтому задача остаётся одной и той же после смены провайдера или native session.",
    ],
    sections: [
      { heading: "Видеть работу, не прерывая её", paragraphs: [
        "Экран Now ставит Needs You выше обычной активности. Полезный статус называет провайдера, компьютер, рабочую папку, последнее значимое событие и состояние доставки. Он не превращает каждый вызов инструмента в уведомление. Телефон и Watch нужны для быстрого взгляда, ограниченного решения и короткого продолжения; coding runtime остаётся на компьютере.",
        "Если компьютер офлайн, задача должна сообщить об этом. Сообщение в очереди отличается от принятого провайдером, а оба состояния — от проверенного изменения кода. Эти различия важны: успокаивающая зелёная точка иногда хуже честного «неизвестно».",
      ] },
      { heading: "Полномочия рядом с действием", paragraphs: [
        "Основные интеграции GrantTap — Claude Code и Codex; Cursor имеет статус Beta, другие провайдеры поддерживаются в более узких, описанных пределах. У каждого остаются собственные сессии и механизмы контроля. Правило Mesh может разрешить, запросить подтверждение или запретить возможность, но выбор правила ещё не доказывает его применение на каждом компьютере. Нужен наблюдаемый ответ хоста.",
        "Relay переносит зашифрованные сообщения. Учётные данные провайдера и локальная среда остаются на компьютере. Это выбор границы исполнения, а не обещание приватности у внешней модельной службы: её трафик регулируется условиями самого провайдера.",
      ] },
      { heading: "Понятная передача работы", paragraphs: [
        "Handoff переносит цель, действующие ограничения, важные решения, блокеры и явный адрес назначения. Скрытые рассуждения между провайдерами не копируются. Identity репозитория и claims помогают заметить пересечение работ; receipt показывает, приняло ли следующее execution передачу.",
        "Критерий прост: вернувшись к задаче, можно ли понять, что произошло, что остаётся неизвестным и где нужно ваше следующее решение? Вокруг этого вопроса строится GrantTap — с честным различением текущих возможностей и направления развития.",
      ] },
    ],
    screenshotCaption: "Экран Now на iPhone, снятый с детерминированными тестовыми данными.",
    closing: "Полезный центр управления уменьшает размер человеческого решения и позволяет проверить его результат.",
    sources: [
      { label: "Продукт и текущая доступность", url: "/" },
      { label: "Как сохраняется Task", url: "/blog/task-continuity-across-agents" },
      { label: "Границы безопасности", url: "/security" },
    ],
    graphic: { title: "Одна Task, несколько исполнений", caption: "Схема стабильной единицы работы, а не график реальной телеметрии.", rows: [
      { label: "Task", detail: "Цель, решения и видимый результат" },
      { label: "Execution", detail: "Одна native session на одном компьютере" },
      { label: "Child agents", detail: "Вложенная работа внутри execution" },
    ] },
  },
};
