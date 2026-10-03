import type { BlogArticle } from "../articleTypes";

export const awsTelAviv: BlogArticle = {
  slug: "aws-summit-tel-aviv-agentic-systems",
  date: "2026-10-24",
  minutes: 6,
  cover: "/blog/tel-aviv-agentic.webp",
  generatedCover: true,
  screenshot: "/product/iphone-mcp-usage.png",
  en: {
    title: "What the AWS Summit Tel Aviv agenda says about agents",
    summary: "The September 2026 agenda paired building and running agents with optimization, observability, and evaluation.",
    category: "Field notes",
    intro: [
      "AWS Summit Tel Aviv took place at Expo Tel Aviv on September 10, 2026. Its published agenda is a useful signal of the questions teams are asking now: how to build agentic applications, operate them reliably, observe their behavior, and evaluate the outcome. This article reads the public program; it is not a report of first-hand attendance.",
      "The event page described agentic AI alongside serverless and cloud innovation. The Building AI & Agentic Apps track included sessions on production-grade Bedrock applications, an introduction to running agentic applications, best practices, and scaling AI through optimization, observability, and evaluation.",
    ],
    sections: [
      { heading: "From demo to operating system", paragraphs: [
        "A short demo can show a model calling a tool. Production work asks who may call it, with which credentials, under which conditions, and what happens when the response is late or missing. The program's pairing of building sessions with observability and evaluation suggests this operational turn. That is an inference from the agenda, not a claim about what any speaker said on stage.",
        "Separate AgentCore documentation gives one governance example: requests routed through its gateway can be evaluated by policy, with decisions logged. The Summit agenda itself does not establish that local shell commands or every provider-native route pass through such a gateway.",
      ] },
      { heading: "Why this matters to GrantTap", paragraphs: [
        "GrantTap works at a different scale from AWS infrastructure. It follows local coding Tasks across computers and supported providers. Yet the operational questions are familiar: is this capability allowed, did the correct host apply the decision, did the action run, and can a person inspect the result without reading every transcript?",
        "The answer should be a chain of evidence, not a single success badge. A Mesh policy, a host receipt, an actual invocation, and a verified outcome are related but separate. This is why governance and usage have become central product work rather than decoration around a chat window.",
      ] },
      { heading: "The theme to carry forward", paragraphs: [
        "Our reading of the published program is a shift from agent demos toward operating questions. Building, observability, and evaluation appear in the same track; governance is a related question drawn from AgentCore documentation, not a named session in that track. For a local coding product, the practical version is to keep the person informed where judgment is needed.",
        "Conference agendas are evidence of emphasis, not proof of market share or a universal industry priority. We will keep testing these ideas against actual tasks, host behavior, and user decisions.",
      ] },
    ],
    screenshotCaption: "GrantTap Usage on iPhone with deterministic sample values. These are not AWS Summit metrics or live customer telemetry.",
    closing: "Agents become useful at scale when decisions and outcomes can be traced through their real execution path.",
    sources: [
      { label: "AWS Summit Tel Aviv 2026 overview", url: "https://aws.amazon.com/events/summits/tel-aviv/" },
      { label: "Official Summit agenda", url: "https://aws.amazon.com/events/summits/tel-aviv/agenda/" },
      { label: "AWS AgentCore Policy", url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html" },
    ],
    graphic: { title: "From the agenda to operational questions", caption: "Build, operate, and observe summarize the agenda; govern comes from separate AgentCore documentation. This is editorial analysis, not a session report.", rows: [
      { label: "Build", detail: "Production-grade and introductory agentic applications" },
      { label: "Operate", detail: "Best practices for running agentic systems" },
      { label: "Observe", detail: "Optimization, observability, and evaluation" },
      { label: "Govern", detail: "Who may invoke tools and how outcomes are traced" },
    ] },
  },
  ru: {
    title: "Что программа AWS Summit Tel Aviv говорит об агентах",
    summary: "В сентябрьской программе 2026 года рядом оказались разработка и эксплуатация агентов, оптимизация, наблюдаемость и оценка.",
    category: "Разбор события",
    intro: [
      "AWS Summit Tel Aviv прошёл 10 сентября 2026 года в Expo Tel Aviv. Его опубликованная программа показывает актуальные вопросы команд: как строить agentic applications, надёжно их запускать, наблюдать за поведением и оценивать результат. Эта статья разбирает открытую программу и не выдаёт себя за репортаж участника.",
      "Страница события ставила agentic AI рядом с serverless и облачными технологиями. В треке Building AI & Agentic Apps были сессии о production-grade приложениях на Bedrock, основах запуска агентных систем, лучших практиках и масштабировании AI через оптимизацию, наблюдаемость и оценку.",
    ],
    sections: [
      { heading: "От демо к эксплуатации", paragraphs: [
        "Короткое демо показывает вызов инструмента моделью. В реальной работе надо ответить, кто может его вызвать, с какими credentials, при каких условиях и что делать с поздним или отсутствующим ответом. Соседство сессий о разработке с observability и evaluation указывает на этот сдвиг. Это наш вывод из программы, а не пересказ слов докладчиков.",
        "Отдельная документация AgentCore даёт пример governance: запросы через его gateway могут проверяться политикой, а решения записываются в журнал. Сама программа Summit не доказывает, что локальный shell или каждый native маршрут провайдера проходит через такой gateway.",
      ] },
      { heading: "Почему это важно для GrantTap", paragraphs: [
        "GrantTap решает задачу другого масштаба, чем инфраструктура AWS. Он ведёт локальные coding Tasks между компьютерами и поддерживаемыми провайдерами. Но вопросы похожи: разрешена ли возможность, применил ли решение нужный хост, произошло ли действие и может ли человек проверить результат без чтения каждого transcript?",
        "Ответом должна быть цепочка evidence, а не один бейдж успеха. Правило Mesh, ответ хоста, фактический вызов и проверенный итог связаны, но различаются. Поэтому governance и usage становятся центральной частью продукта, а не украшением чата.",
      ] },
      { heading: "Главный вывод", paragraphs: [
        "Наш вывод из программы — переход от демо агентов к вопросам эксплуатации. Разработка, наблюдаемость и оценка стоят рядом в одном треке; governance — связанный вопрос из отдельной документации AgentCore, а не название сессии этого трека. Для локального coding-продукта практический ответ — держать человека в курсе там, где нужно его решение.",
        "Программа конференции показывает акценты, но не доказывает долю рынка или единую для всех отраслей повестку. Эти идеи нужно проверять на реальных задачах, поведении компьютеров и решениях пользователей.",
      ] },
    ],
    screenshotCaption: "Экран Usage в GrantTap с детерминированными тестовыми значениями. Это не статистика AWS Summit и не данные пользователей.",
    closing: "Агенты становятся полезнее при росте масштаба, когда решения и результаты прослеживаются до реального пути исполнения.",
    sources: [
      { label: "Страница AWS Summit Tel Aviv 2026", url: "https://aws.amazon.com/events/summits/tel-aviv/" },
      { label: "Официальная программа", url: "https://aws.amazon.com/events/summits/tel-aviv/agenda/" },
      { label: "AWS AgentCore Policy", url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html" },
    ],
    graphic: { title: "От программы к вопросам эксплуатации", caption: "Разработка, эксплуатация и наблюдение обобщают программу; управление взято из отдельной документации AgentCore. Это редакционный разбор, не репортаж.", rows: [
      { label: "Разработка", detail: "Production-grade и вводные agentic applications" },
      { label: "Эксплуатация", detail: "Практики запуска агентных систем" },
      { label: "Наблюдение", detail: "Оптимизация, observability и evaluation" },
      { label: "Управление", detail: "Права вызова инструментов и проверка исхода" },
    ] },
  },
};
