import { composeStory } from "./compose";

const sources = [
  { label: "GrantTap runtime and observed usage", url: "https://github.com/sergii-ziborov/granttap-mcp" },
  { label: "Cortex Loom source and measurement scope", url: "https://github.com/sergii-ziborov/cortex-loom" },
  { label: "AWS AgentCore observability", url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html" },
  { label: "AWS runtime metrics and billing caveat", url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-runtime-metrics.html" },
  { label: "OpenAI API pricing definitions", url: "https://developers.openai.com/api/docs/pricing" },
];

export const usageEvidence = composeStory({
  slug: "what-agent-usage-metrics-can-prove",
  date: "2026-10-05",
  cover: "/blog/usage-evidence.webp",
  inlineIllustration: "/blog/what-agent-usage-metrics-can-prove-a.webp",
  additionalIllustration: "/blog/what-agent-usage-metrics-can-prove-b.webp",
  screenshot: "/product/iphone-mcp-usage.png",
  en: {
    title: "What agent usage metrics can prove—and what they cannot",
    summary: "Token counts, plan limits, tool calls, cost, and useful output are different measurements. Here is a more honest dashboard vocabulary.",
    category: "Evidence",
    screenshotCaption: "GrantTap usage view with deterministic sample values. It demonstrates presentation, not measured savings or provider billing.",
    illustrationCaption: "AI-generated representation of observed signals passing through measurement; the particles are not real token data.",
    additionalIllustrationCaption: "AI-generated illustration of distinct metric layers; it contains no live usage figures.",
    closing: "Keep the unit, source, scope, and uncertainty beside every number. Then evaluate whether the resulting work was actually useful.",
    sources,
    graphic: { title: "Name the unit", caption: "A number becomes useful only with its denominator and source.", rows: [
      { label: "Tokens", detail: "Model input, output, or cached tokens?" },
      { label: "Calls", detail: "Requests, tool calls, or completed actions?" },
      { label: "Cost", detail: "Estimate or authoritative bill?" },
      { label: "Result", detail: "Tested change or agent assertion?" },
    ] },
    body: `Agent dashboards often put dissimilar numbers next to each other: tokens, messages, time, requests, tool calls, plan limits, and money. A rising line can look informative while leaving the reader unsure what was measured. One provider may report usage at a session level; another may expose a plan window; a third may provide runtime telemetry in a separate observability product. None of those numbers alone says whether a coding task produced a correct change. A useful dashboard begins by stating its unit, measurement source, time window, and missing data.

GrantTap's product boundary explicitly separates capability availability, policy, and confirmed usage. Unknown usage stays unknown. That is especially important when the app coordinates several providers with different reporting surfaces. Cortex Loom, a separate project, can be discussed in terms of evidence-aware context selection and token efficiency hypotheses, but a numerical savings claim requires a repeatable before-and-after benchmark. AWS AgentCore's observability documentation shows a broader cloud telemetry model with sessions, latency, errors, and token usage; its runtime metrics guide warns that telemetry can differ from authoritative billing. We checked these primary sources on October 3, 2026.

## Count the thing that actually happened

A message sent to an agent is not necessarily a model request. A model request is not necessarily one tool call. A tool call may fail or be denied, and a command that ran can still leave the task unfinished. Therefore a dashboard should not use a single “activity” bar as a substitute for all of them. If it shows tokens, say whether they are input, output, or cached. If it shows calls, say whether they are proposed, attempted, completed, or confirmed by the host. If the integration supplies no reliable value, an empty or unknown state is more truthful than zero.

The screenshot below shows GrantTap's usage interface with deterministic sample data. Those values are fixtures, not measurements from a live customer or a claim of provider billing. A real observation must be traced to a source event or provider report. Attach the provider, execution, time window, and method used to collect it. When a Task includes multiple executions, avoid silently adding incompatible units. The same “one task” label does not make a Codex plan limit, Claude token count, and an AWS runtime invocation directly comparable.

## Distinguish limits from consumption

A rate limit or plan allowance tells a user how much access remains under a particular account rule. It is not necessarily the number of tokens consumed by the current Task. A usage screen can help a person decide when to continue work, but it must label the account scope and reset window. A value may be stale if the provider has not refreshed it. A client that does not receive a limit should not infer one from a progress animation or a few recent sessions. This is the same epistemic discipline as reporting a disconnected computer as unknown rather than idle.

Cost estimates require still more care. Model pricing can distinguish input, cached input, and output tokens, and tool or compute charges may be separate. Provider plans can bundle usage in ways that do not map cleanly to public API prices. A calculation made from public token rates may be helpful for an experiment, but it is not an invoice. AWS's AgentCore runtime guide explicitly notes that monitoring telemetry may differ from billed usage because of timing, reconciliation, and precision. If a product shows a currency figure, it should state whether it is an estimate and point to the provider's authoritative billing surface for financial decisions.

## Compare context strategies with a benchmark

Cortex Loom's idea of selecting evidence relevant to a Task rather than sending the whole repository every time is plausible as an efficiency strategy. Plausibility is not a percentage. To claim token savings, choose a fixed corpus of representative tasks, one model configuration, and a baseline retrieval method. Record input and output token counts, cache behavior, number of retries, tool calls, task success, and reviewer effort. Run the two approaches on comparable repository revisions. Include the cost of indexing and retrieval if the claim concerns total resource use, not just the prompt sent to the model.

A smaller prompt can be worse if it omits a critical file and causes multiple retries or a wrong patch. Conversely, a larger first prompt might reduce total work when it prevents repeated searches. Measure both quality and resource consumption. Report median and spread across tasks, not a single impressive example. Keep unsuccessful runs in the dataset. If the provider does not expose enough token accounting to make the comparison, state the limitation and use a narrower claim such as “selected fewer source files” or “reduced context bytes in this benchmark.” That language is less exciting but much more useful to an engineer deciding whether to adopt the technique.

## Observability serves debugging as well as budgeting

AWS AgentCore Observability illustrates why a single token graph is incomplete. Its docs describe telemetry for sessions, latency, duration, token usage, error rates, and traces. Those signals help investigate a slow or failing agent even when cost is not the immediate question. For a coding workflow, the analogous evidence includes elapsed time, the commands attempted, tests run, failures, retries, and the exact revision produced. A high token count might reflect waste, a hard problem, or a thorough investigation. A low count might reflect efficiency or an incomplete job. The number needs the execution trace.

GrantTap's useful role is to keep such signals attached to the right Project, Task, and Execution where its integrations can observe them. It should not invent metrics for a provider that exposes none. A metric is strongest when the user can move from a card to the underlying event or provider source. If that link is unavailable, a label should explain that the value is reported rather than independently confirmed. This approach also prevents a capability toggle from appearing as activity: allowing a skill, accepting a prompt, and actually using a tool are three distinct events.

## Build a dashboard that invites verification

For each number, add four small pieces of context: the unit, source, time window, and status of confirmation. Show unknown values visibly rather than filling them with zero. Separate plan availability from actual execution consumption. When comparing providers, use common outcomes only where they truly share a definition, such as “Task finished with named test passing on revision X.” Even that outcome needs the test log, because an agent assertion is not a test run. This is a product design constraint as much as a statistical one.

An effective weekly review can stay simple. Pick several completed Tasks and ask how many required retries, how much provider usage was reported, how much was observed locally, and which results passed independent checks. Then inspect cases where high usage delivered little progress and cases where low usage hid missing work. Use the findings to adjust context selection, task scope, or approval rules. Do not optimize solely for the smallest token count. The aim is a trustworthy result per unit of effort, with enough evidence for a human to challenge the story the dashboard tells.`,
  },
  ru: {
    title: "Что метрики использования агентов доказывают, а что нет",
    summary: "Токены, лимиты тарифа, вызовы инструментов, стоимость и полезный результат — разные измерения. Разбираем честный язык дашборда.",
    category: "Доказательства",
    screenshotCaption: "Экран usage в GrantTap с детерминированными тестовыми значениями. Он показывает представление данных, а не измеренную экономию или счёт провайдера.",
    illustrationCaption: "Сгенерированное изображение наблюдаемых сигналов при измерении; частицы не являются реальными токенами.",
    additionalIllustrationCaption: "Сгенерированная иллюстрация разных уровней метрик без живых показателей использования.",
    closing: "Держите единицу, источник, область и неопределённость рядом с каждым числом. Затем проверяйте, принесла ли работа полезный результат.",
    sources,
    graphic: { title: "Назовите единицу", caption: "Число полезно вместе с источником и знаменателем.", rows: [
      { label: "Токены", detail: "Входные, выходные или кешированные?" },
      { label: "Вызовы", detail: "Запросы, инструменты или завершённые действия?" },
      { label: "Стоимость", detail: "Оценка или официальный счёт?" },
      { label: "Результат", detail: "Проверенная правка или заявление агента?" },
    ] },
    body: `Дашборды агентов часто ставят рядом разнородные числа: токены, сообщения, время, запросы, вызовы инструментов, лимиты тарифа и деньги. Растущая линия выглядит содержательно, хотя читателю непонятно, что именно измерено. Один провайдер сообщает usage сессии; другой показывает окно тарифного лимита; третий предоставляет телеметрию runtime в отдельной системе наблюдения. Ни одна цифра сама по себе не доказывает корректность изменения кода. Полезный дашборд начинается с указания единицы, источника измерения, временного окна и недостающих данных.

Продуктовая граница GrantTap явно разделяет доступность возможности, политику и подтверждённое использование. Неизвестное usage остаётся неизвестным. Это особенно важно при координации нескольких провайдеров с разными поверхностями отчётности. Cortex Loom, отдельный проект, можно обсуждать как подход к выбору контекста на основе evidence и гипотезу об эффективности токенов, но численное обещание экономии требует воспроизводимого сравнения до и после. Документация AWS AgentCore показывает более широкую облачную телеметрию с сессиями, задержкой, ошибками и токенами; руководство по метрикам предупреждает, что телеметрия может расходиться с официальным биллингом. Первичные источники проверены 3 октября 2026 года.

## Считайте именно произошедшее событие

Сообщение агенту не обязательно является модельным запросом. Один модельный запрос не обязательно соответствует одному вызову инструмента. Вызов может не состояться из-за отказа или ошибки, а запущенная команда может оставить Task незавершённой. Поэтому одной полосой «активности» нельзя заменять все эти состояния. Если показаны токены, уточняйте входные, выходные и кешированные. Если показаны вызовы, различайте предложенные, предпринятые, завершённые и подтверждённые хостом. Когда интеграция не предоставляет надёжного значения, пустое поле или «неизвестно» честнее нуля.

Скриншот ниже показывает интерфейс usage в GrantTap с детерминированными тестовыми данными. Эти значения — фикстуры, а не измерения живого клиента или заявление о счёте провайдера. Реальное наблюдение должно восходить к событию источника или отчёту провайдера. Привяжите его к провайдеру, execution, временному окну и способу сбора. Если Task содержит несколько executions, не складывайте молча несовместимые единицы. Общая надпись «одна задача» не делает лимит Codex, число токенов Claude и количество вызовов AWS AgentCore сопоставимыми величинами.

## Отделяйте лимиты от расхода

Rate limit или allowance тарифа сообщает, сколько доступа осталось по конкретному правилу аккаунта. Это не обязательно количество токенов, потреблённых текущей Task. Экран usage помогает решить, продолжать ли работу, но обязан указывать область аккаунта и время сброса. Значение может устареть, если провайдер ещё не обновил его. Клиент, не получивший лимит, не должен выводить его из анимации прогресса или нескольких последних сессий. Здесь действует та же дисциплина, что и при отображении отключённого компьютера как неизвестного, а не неактивного.

Оценка стоимости требует ещё большей осторожности. Цены модели могут различать входные, кешированные и выходные токены; инструменты и вычисления могут оплачиваться отдельно. Провайдерские тарифы иногда объединяют расход так, что он не отображается напрямую публичной стоимостью API. Расчёт по открытым токенным ценам полезен для эксперимента, но не является счётом. Руководство AWS по runtime прямо отмечает, что телеметрия для мониторинга может отличаться от биллинга из-за времени агрегации, согласования и точности. Если продукт показывает сумму в валюте, он должен назвать её оценкой и направить к официальной платёжной поверхности провайдера для финансовых решений.

## Сравнивайте стратегии контекста экспериментом

Идея Cortex Loom выбирать evidence, относящееся к Task, вместо отправки всего репозитория в каждый запрос выглядит разумной стратегией экономии. Правдоподобие не даёт процента. Для заявления об экономии токенов выберите фиксированный набор представительных задач, одну конфигурацию модели и базовый способ поиска контекста. Запишите входные и выходные токены, поведение кеша, число повторов, вызовы инструментов, успех задачи и усилия ревьюера. Запускайте подходы на сопоставимых revisions репозитория. Учитывайте стоимость индексации и retrieval, если утверждение касается всех ресурсов, а не только prompt модели.

Более короткий prompt может оказаться хуже, если пропустит критический файл и вызовет несколько повторов или неверный патч. И наоборот, более крупный первый контекст иногда сокращает общую работу, предотвращая повторные поиски. Измеряйте и качество, и ресурсы. Сообщайте медиану и разброс на нескольких задачах, а не один эффектный пример. Не исключайте неудачные прогоны. Если провайдер не раскрывает достаточно точный учёт токенов, назовите ограничение и используйте более узкое утверждение: например, «отобрано меньше исходных файлов» или «сокращён объём контекста в байтах в данном эксперименте». Такой язык менее эффектен, зато полезнее инженеру.

## Наблюдаемость нужна и для отладки

AWS AgentCore Observability показывает, почему одного графика токенов мало. Документация описывает данные о сессиях, задержке, длительности, токенах, ошибках и traces. Эти сигналы помогают разбирать медленного или падающего агента, даже когда стоимость не главный вопрос. В coding-сценарии аналогичное evidence включает время, попытки команд, реально запущенные тесты, сбои, повторы и точную созданную revision. Большой расход токенов может означать расточительность, сложную задачу или тщательное исследование. Малый — эффективность либо незавершённую работу. Числу нужен след исполнения.

Роль GrantTap — привязывать доступные наблюдения к правильным Project, Task и Execution там, где интеграции способны их увидеть. Не следует выдумывать метрики для провайдера, который их не сообщает. Значение сильнее, когда из карточки можно перейти к исходному событию или источнику провайдера. Если ссылки нет, подпись должна объяснять, что показатель сообщён, а не независимо подтверждён. Это не позволяет также считать переключатель capability активностью: разрешение навыка, принятие prompt и фактическое использование инструмента представляют три разных события.

## Делайте дашборд пригодным для проверки

Рядом с числом показывайте четыре элемента контекста: единицу, источник, временное окно и статус подтверждения. Неизвестные значения отображайте явно, не заполняйте их нулями. Отделяйте доступность тарифа от фактического расхода исполнения. При сравнении провайдеров используйте общий исход лишь там, где определение действительно одно, например «Task закончена, именованный тест прошёл на revision X». И этот исход требует лога теста: заявление агента не является запуском. Это и продуктовое ограничение, и статистическая необходимость.

Еженедельный обзор может быть простым. Возьмите несколько завершённых Tasks и спросите, сколько было повторов, какое usage сообщил провайдер, что наблюдалось локально и какие итоги прошли независимую проверку. Затем изучите случаи большого расхода при малом прогрессе и малого расхода со скрытым незавершением. Используйте выводы для настройки отбора контекста, масштаба задачи или правил approval. Не оптимизируйте только минимальное число токенов. Цель — надёжный результат на единицу усилия, снабжённый evidence, которое позволяет человеку оспорить историю, рассказанную дашбордом.

Если команда хочет публично заявить процент экономии от Cortex Loom или иной стратегии, опубликуйте методику вместе с числом. Назовите репозитории или их характеристики, типы задач, базовый метод, версию модели, параметры кеша и критерий успешности. Покажите не только победившие случаи, но и задачи, где результат ухудшился. Сравнивайте одинаковые этапы работы: нельзя считать токены первого запроса одного подхода против полного цикла другого. Отдельно укажите, какие данные пришли от провайдера, а какие рассчитаны локально. Пока такого эксперимента нет, честнее говорить об архитектурной цели сократить ненужный контекст, а не об уже доказанной денежной экономии.`,
  },
});
