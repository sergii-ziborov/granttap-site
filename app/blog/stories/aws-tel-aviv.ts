import type { BlogArticle } from "../articleTypes";

export const awsTelAviv: BlogArticle = {
  slug: "aws-summit-tel-aviv-agentic-systems",
  date: "2026-10-24",
  minutes: 6,
  cover: "/blog/tel-aviv-agentic.webp",
  generatedCover: true,
  en: {
    title: "What the AWS Summit Tel Aviv agenda says about agents",
    summary: "The September 2026 program put building, operating, observing, and governing agents in the same conversation.",
    category: "Field notes",
    intro: [
      "AWS Summit Tel Aviv took place at Expo Tel Aviv on September 10, 2026. Its published agenda is a useful signal of the questions teams are asking now: how to build agentic applications, operate them reliably, observe their behavior, and evaluate the outcome. This article reads the public program; it is not a report of first-hand attendance.",
      "The event page described agentic AI alongside serverless and cloud innovation. The Building AI & Agentic Apps track included sessions on production-grade Bedrock applications, an introduction to running agentic applications, best practices, and scaling AI through optimization, observability, and evaluation.",
    ],
    sections: [
      { heading: "From demo to operating system", paragraphs: [
        "A short demo can show a model calling a tool. Production work asks who may call it, with which credentials, under which conditions, and what happens when the response is late or missing. The program's pairing of building sessions with observability and evaluation suggests this operational turn. That is an inference from the agenda, not a claim about what any speaker said on stage.",
        "AgentCore's public documentation shows one infrastructure answer: a gateway can route tool calls through policy evaluation, while observability records what happened. The same pattern becomes harder across local coding agents, because a shell, a native provider hook, and an MCP server may follow different paths.",
      ] },
      { heading: "Why this matters to GrantTap", paragraphs: [
        "GrantTap works at a different scale from AWS infrastructure. It follows local coding Tasks across computers and supported providers. Yet the operational questions are familiar: is this capability allowed, did the correct host apply the decision, did the action run, and can a person inspect the result without reading every transcript?",
        "The answer should be a chain of evidence, not a single success badge. A Mesh policy, a host receipt, an actual invocation, and a verified outcome are related but separate. This is why governance and usage have become central product work rather than decoration around a chat window.",
      ] },
      { heading: "The theme to carry forward", paragraphs: [
        "The most interesting shift in the published program is from asking whether agents can do work to asking how teams can trust ongoing work. Building, observability, evaluation, and governance were all visible in the same day. For a local coding product, the practical version is to keep the person informed at the exact point where judgment is needed.",
        "Conference agendas are evidence of emphasis, not proof of market share or a universal industry priority. We will keep testing these ideas against actual tasks, host behavior, and user decisions.",
      ] },
    ],
    closing: "Agents become useful at scale when decisions and outcomes can be traced through their real execution path.",
    sources: [
      { label: "AWS Summit Tel Aviv 2026 overview", url: "https://aws.amazon.com/events/summits/tel-aviv/" },
      { label: "Official Summit agenda", url: "https://aws.amazon.com/events/summits/tel-aviv/agenda/" },
      { label: "AWS AgentCore Policy", url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html" },
    ],
    graphic: { title: "Four questions from the published program", caption: "Editorial grouping of the official agenda themes; no attendee or session outcome is implied.", rows: [
      { label: "Build", detail: "Production-grade and introductory agentic applications" },
      { label: "Operate", detail: "Best practices for running agentic systems" },
      { label: "Observe", detail: "Optimization, observability, and evaluation" },
      { label: "Govern", detail: "Who may invoke tools and how outcomes are traced" },
    ] },
  },
  ru: {
    title: "Что программа AWS Summit Tel Aviv говорит об агентах",
    summary: "В сентябрьской программе 2026 года рядом оказались разработка, эксплуатация, наблюдаемость и оценка агентных систем.",
    category: "Разбор события",
    intro: [
      "AWS Summit Tel Aviv прошёл 10 сентября 2026 года в Expo Tel Aviv. Его опубликованная программа показывает актуальные вопросы команд: как строить agentic applications, надёжно их запускать, наблюдать за поведением и оценивать результат. Эта статья разбирает открытую программу и не выдаёт себя за репортаж участника.",
      "Страница события ставила agentic AI рядом с serverless и облачными технологиями. В треке Building AI & Agentic Apps были сессии о production-grade приложениях на Bedrock, основах запуска агентных систем, лучших практиках и масштабировании AI через оптимизацию, наблюдаемость и оценку.",
    ],
    sections: [
      { heading: "От демо к эксплуатации", paragraphs: [
        "Короткое демо показывает вызов инструмента моделью. В реальной работе надо ответить, кто может его вызвать, с какими credentials, при каких условиях и что делать с поздним или отсутствующим ответом. Соседство сессий о разработке с observability и evaluation указывает на этот сдвиг. Это наш вывод из программы, а не пересказ слов докладчиков.",
        "Публичная документация AgentCore показывает один инфраструктурный ответ: gateway проводит вызовы инструментов через проверку правил, а observability фиксирует произошедшее. Между локальными coding-агентами задача сложнее: shell, native hook провайдера и MCP-сервер могут идти разными маршрутами.",
      ] },
      { heading: "Почему это важно для GrantTap", paragraphs: [
        "GrantTap решает задачу другого масштаба, чем инфраструктура AWS. Он ведёт локальные coding Tasks между компьютерами и поддерживаемыми провайдерами. Но вопросы похожи: разрешена ли возможность, применил ли решение нужный хост, произошло ли действие и может ли человек проверить результат без чтения каждого transcript?",
        "Ответом должна быть цепочка evidence, а не один бейдж успеха. Правило Mesh, ответ хоста, фактический вызов и проверенный итог связаны, но различаются. Поэтому governance и usage становятся центральной частью продукта, а не украшением чата.",
      ] },
      { heading: "Главный вывод", paragraphs: [
        "В опубликованной программе заметен переход от вопроса «умеет ли агент работать?» к вопросу «можно ли доверять продолжительной работе?». За один день были представлены разработка, наблюдаемость, оценка и управление. Для локального coding-продукта практический ответ — держать человека в курсе именно там, где нужно его решение.",
        "Программа конференции показывает акценты, но не доказывает долю рынка или единую для всех отраслей повестку. Эти идеи нужно проверять на реальных задачах, поведении компьютеров и решениях пользователей.",
      ] },
    ],
    closing: "Агенты становятся полезнее при росте масштаба, когда решения и результаты прослеживаются до реального пути исполнения.",
    sources: [
      { label: "Страница AWS Summit Tel Aviv 2026", url: "https://aws.amazon.com/events/summits/tel-aviv/" },
      { label: "Официальная программа", url: "https://aws.amazon.com/events/summits/tel-aviv/agenda/" },
      { label: "AWS AgentCore Policy", url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html" },
    ],
    graphic: { title: "Четыре вопроса программы", caption: "Наша группировка тем официальной программы; она не утверждает присутствия на событии или результата докладов.", rows: [
      { label: "Разработка", detail: "Production-grade и вводные agentic applications" },
      { label: "Эксплуатация", detail: "Практики запуска агентных систем" },
      { label: "Наблюдение", detail: "Оптимизация, observability и evaluation" },
      { label: "Управление", detail: "Права вызова инструментов и проверка исхода" },
    ] },
  },
};
