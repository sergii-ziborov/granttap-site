import { composeStory } from "./compose";

const sources = [
  { label: "Claude Code Remote Control architecture and limits", url: "https://code.claude.com/docs/en/remote-control" },
  { label: "Cursor for iOS", url: "https://cursor.com/docs/cloud-agent/mobile" },
  { label: "Cursor Cloud Agent security overview", url: "https://cursor.com/docs/cloud-agent/security" },
  { label: "OpenAI: Codex from anywhere", url: "https://openai.com/index/work-with-codex-from-anywhere/" },
  { label: "GrantTap runtime and relay boundaries", url: "https://github.com/sergii-ziborov/granttap-mcp" },
];

export const localCloudBoundaries = composeStory({
  slug: "local-cloud-hybrid-agent-boundaries",
  date: "2026-12-05",
  cover: "/blog/local-cloud-boundaries.webp",
  inlineIllustration: "/blog/local-cloud-hybrid-agent-boundaries-a.webp",
  additionalIllustration: "/blog/local-cloud-hybrid-agent-boundaries-b.webp",
  screenshot: "/product/iphone-command-center.png",
  en: {
    title: "Local, cloud, or hybrid: map an agent's real data boundary",
    summary: "The location of the phone is the least useful architecture fact. Follow code, model context, tools, and control decisions instead.",
    category: "Architecture",
    screenshotCaption: "GrantTap command center on iPhone with deterministic sample values. The screen represents local coordination, not a map of every provider's data flow.",
    illustrationCaption: "AI-generated local and cloud environments connected by a conceptual bridge, not a network specification.",
    additionalIllustrationCaption: "AI-generated separation of repository, model context, and tool execution; no live infrastructure is depicted.",
    closing: "A trustworthy architecture comparison names each data path, its operator, and the conditions under which it remains available.",
    sources,
    graphic: { title: "Map four flows", caption: "Ask these questions of every provider route.", rows: [
      { label: "Source", detail: "Where are repository files read and stored?" },
      { label: "Context", detail: "Where is model input processed?" },
      { label: "Tools", detail: "Which machine runs edits and commands?" },
      { label: "Control", detail: "Where is a human decision enforced?" },
    ] },
    body: `A mobile app does not tell you whether a coding agent is local or cloud-based. The phone may be a remote control for a process on your laptop, a viewer for a cloud worker, or a client for a hybrid system where the agent loop and file tools live in different places. Even the word “local” can hide a model call to a hosted service. To understand privacy, availability, and failure behavior, follow four flows separately: repository source, model context, tool execution, and human control. A single arrow labeled “agent” is not a sufficient architecture diagram.

The official documentation we checked on October 3, 2026 describes distinct routes. Claude Code Remote Control exposes a local Claude Code process through the Claude app or web under its documented requirements. Cursor for iOS can start cloud agents and use Remote Control for work involving a personal machine; Cursor describes a cloud agent loop with tools that may execute on the user's computer in that route. OpenAI's Codex mobile preview describes connected machines and live state. GrantTap coordinates supported local agent executions through an encrypted relay between trusted devices. Each path can be appropriate. The decision depends on exactly which component receives code and commands.

## Draw the repository path first

Ask where the authoritative checkout lives and how a worker reaches it. A local process reads a local repository directly. A cloud agent may clone a repository into a remote environment and produce a branch or pull request. A hybrid arrangement can keep file tools on the user's computer while a control loop runs elsewhere. Those patterns have different implications for network outages, uncommitted changes, dependencies, and secrets. If your work relies on a file that exists only on a laptop, a cloud clone cannot see it unless you deliberately transfer or commit it.

Cursor's cloud security documentation describes repository access via its Git provider integration and the cloud environment's data handling. Its mobile docs distinguish cloud workers and personal machines. Claude Remote Control keeps a local process relevant and documents what happens when its server stops. GrantTap's local control model depends on a paired computer and its installed provider integration. These are implementation boundaries, not moral labels. For a given Task, write down the checkout path, revision, and worker identity. A user should not have to infer them from a device icon or a friendly session title.

## Follow model context separately from files

Where files are stored is not necessarily where model input is processed. A local agent can read local files, select excerpts, and send those excerpts to a remote model service. A cloud agent can keep a working copy in its own environment and call a model through the same provider's service. An encrypted control relay may protect messages in transit between a phone and computer without changing the model provider's own context path. Do not collapse these into the blanket statement “your code stays local.” That statement requires a precise definition of code, storage, processing, and retention.

Before adopting a route for sensitive work, inspect the provider's current data handling documentation and organization controls. Ask whether repository contents are copied, how long execution artifacts are retained, which model providers receive prompts, and which administrators can configure access. Cursor's security docs explicitly discuss Privacy Mode and the cloud storage needed for cloud agents; its legacy mode is a different configuration. Claude and Codex have their own account and service requirements. GrantTap does not replace those vendor terms merely by controlling a local execution. The honest answer is a map of participating services, with each service's current documentation attached.

## Locate commands and credentials

Tool execution is the point where an agent changes the world. A shell command on a laptop sees that laptop's filesystem, network access, and environment variables. A command in a cloud VM sees the VM's configured secrets and repository clone. A hybrid route needs both sides to be available when a command is requested. This affects safety and reliability more directly than the phone's visual design. If a task uses production credentials, check which worker actually holds them and whether its network is restricted. Never assume an approval prompt alone creates a sandbox.

Cursor says its cloud agents run in dedicated machines and documents security controls for them. Its mobile route can direct work involving a personal computer under the documented Remote Control design. Claude Remote Control preserves a local tool environment for the connected process. GrantTap's local helper observes and controls supported provider activity on a paired computer; it does not make a cloud worker local. For every route, record one representative command, the machine that ran it, the permissions it had, and where the output was stored. If the product cannot expose that route, test it with a harmless file and network request before entrusting sensitive tasks to it.

## Trace the control message

Human control is another path. A phone can receive a request via a provider service or an encrypted relay, but the decision needs to reach the execution runtime. If the phone loses connectivity, the runtime should follow its configured default, not guess an approval. If the computer is offline, the app should show a delayed or unknown state. If the provider uses a cloud worker, the relevant policy belongs to that worker's tool boundary. The strongest evidence is a host- or worker-side record that the proposed action was allowed or denied before it ran.

GrantTap separates the paired device network, Task policy, and the provider's own execution state. That distinction helps prevent a green relay indicator from being mistaken for a ready approval path. The screenshot here is a deterministic product capture; it is not a proof that an external provider's model context remained on a device. For your architecture review, disconnect one link at a time: phone, relay, local computer, or provider service. Record what continues and what stops. A design that reports uncertainty clearly during those interruptions is easier to operate than one that keeps showing a confident but stale status.

## Choose according to the failure you can tolerate

Local work can preserve access to an uncommitted checkout and existing tools, but it needs an available computer. Cloud work can continue without the user's laptop, but requires its own repository access, environment, and data handling review. Hybrid work may combine familiar local tools with remote coordination, at the cost of more connections whose status must be understood. These are architectural tradeoffs, not a universal ranking. A team may use different paths for a scratch prototype, a private repository, and a production incident.

Run a small evaluation before standardizing one route. Start a Task, note the repository revision, lock the phone, disconnect the laptop, and inspect the resulting state. Then reconnect and verify the exact command, changed files, and test output. Repeat with a second provider only if your workflow actually uses it. Keep the resulting data-flow map alongside the provider docs and revisit it when the products change. The most useful mobile agent is the one whose execution and authority you can explain when something goes wrong, not merely the one whose screen looks most complete.`,
  },
  ru: {
    title: "Локально, в облаке или гибридно: проследите реальные границы агента",
    summary: "Местонахождение телефона мало говорит об архитектуре. Проследите код, контекст модели, инструменты и решения человека.",
    category: "Архитектура",
    screenshotCaption: "Командный центр GrantTap на iPhone с детерминированными тестовыми значениями. Экран показывает локальную координацию, а не потоки данных всех провайдеров.",
    illustrationCaption: "Сгенерированные локальная и облачная среды, соединённые условным мостом, не спецификация сети.",
    additionalIllustrationCaption: "Сгенерированное разделение репозитория, контекста модели и исполнения инструментов; это не живая инфраструктура.",
    closing: "Надёжное сравнение архитектур называет каждый путь данных, его оператора и условия доступности.",
    sources,
    graphic: { title: "Четыре потока", caption: "Задайте эти вопросы каждому маршруту провайдера.", rows: [
      { label: "Исходники", detail: "Где читается и хранится репозиторий?" },
      { label: "Контекст", detail: "Где обрабатывается ввод модели?" },
      { label: "Инструменты", detail: "Какая машина меняет файлы и запускает команды?" },
      { label: "Управление", detail: "Где применяется решение человека?" },
    ] },
    body: `Мобильное приложение само по себе не сообщает, является ли coding-агент локальным или облачным. Телефон может служить пультом для процесса на ноутбуке, окном к облачному работнику либо клиентом гибридной системы, где цикл агента и файловые инструменты живут в разных местах. Даже слово «локально» способно скрыть запрос к удалённой модели. Чтобы понять приватность, доступность и поведение при сбоях, отдельно проследите четыре потока: исходники репозитория, контекст модели, исполнение инструментов и управление человеком. Одной стрелки с подписью «агент» для архитектурной схемы недостаточно.

Официальные документы, сверенные нами 3 октября 2026 года, описывают разные маршруты. Claude Code Remote Control открывает доступ к локальному процессу Claude Code через приложение Claude или веб при задокументированных условиях. Cursor для iOS умеет запускать cloud agents и использовать Remote Control для работы с личным компьютером; для этого маршрута Cursor описывает облачный цикл агента и инструменты, которые могут выполняться на компьютере пользователя. Мобильная предварительная версия Codex от OpenAI описывает подключённые машины и живое состояние. GrantTap координирует поддерживаемые локальные executions через зашифрованный relay доверенных устройств. Каждый путь может быть уместен. Выбор зависит от того, какой компонент получает код и команды.

## Сначала нарисуйте путь репозитория

Выясните, где находится основной checkout и как работник получает доступ к нему. Локальный процесс читает локальный репозиторий напрямую. Облачный агент может клонировать репозиторий в удалённую среду и создать ветку или pull request. Гибридная схема иногда оставляет файловые инструменты на пользовательском компьютере, хотя цикл управления работает в другом месте. У этих вариантов разные последствия при сбоях сети, незакоммиченных изменениях, зависимостях и секретах. Если задача зависит от файла, существующего лишь на ноутбуке, облачный клон его не увидит без сознательного переноса или коммита.

Документация Cursor о безопасности cloud agents описывает доступ к репозиториям через интеграцию Git-провайдера и обращение с данными облачной среды. Мобильные документы различают облачных работников и личные машины. Claude Remote Control сохраняет значение локального процесса и объясняет, что происходит при остановке сервера. Локальная модель GrantTap требует спаренного компьютера и установленной интеграции провайдера. Это границы реализации, а не моральные ярлыки. Для конкретной Task запишите путь checkout, revision и идентичность работника. Пользователю не должно приходиться угадывать их по значку устройства или дружелюбному названию сессии.

## Контекст модели идёт отдельным путём

Место хранения файлов не обязательно совпадает с местом обработки ввода модели. Локальный агент способен прочитать файлы на машине, выбрать фрагменты и отправить их удалённому модельному сервису. Облачный агент может держать рабочую копию в собственной среде и обращаться к модели через сервис провайдера. Зашифрованный управляющий relay может защищать сообщения между телефоном и компьютером, но не менять путь модельного контекста у провайдера. Не сводите это к широкому обещанию «код остаётся локально». Такое утверждение требует точного определения кода, хранения, обработки и срока удержания данных.

Перед использованием маршрута для чувствительной работы изучите актуальные документы провайдера об обращении с данными и организационные настройки. Спросите, копируется ли репозиторий, как долго хранятся артефакты исполнения, какие модельные сервисы получают prompts и какие администраторы настраивают доступ. Документы Cursor прямо обсуждают Privacy Mode и облачное хранение, нужное cloud agents; старый режим Legacy — иная конфигурация. У Claude и Codex свои требования аккаунта и сервиса. GrantTap не отменяет условия этих вендоров только тем, что управляет локальным execution. Честный ответ — карта участвующих сервисов с их действующей документацией.

## Найдите команды и credentials

Исполнение инструментов — точка, где агент изменяет мир. Shell-команда на ноутбуке видит его файловую систему, сеть и переменные среды. Команда в облачной VM видит настроенные для неё секреты и клон репозитория. Гибридному маршруту в момент запроса команды могут требоваться обе стороны. Это влияет на безопасность и надёжность сильнее оформления мобильного экрана. Если Task использует production credentials, проверьте, какой работник ими располагает и ограничена ли его сеть. Не считайте один approval prompt готовым sandbox.

Cursor пишет, что cloud agents работают на выделенных машинах, и документирует их защитные настройки. Его мобильный маршрут может направлять работу, затрагивающую личный компьютер, по описанной схеме Remote Control. Claude Remote Control сохраняет локальную инструментальную среду подключённого процесса. Helper GrantTap наблюдает и контролирует поддерживаемую активность провайдера на спаренном компьютере; он не превращает облачного работника в локального. Для каждого маршрута запишите одну показательную команду, машину запуска, её права и место хранения вывода. Если продукт не показывает путь, испытайте его на безвредном файле и сетевом запросе до доверия чувствительной задачи.

## Проследите управляющее сообщение

Управление человеком идёт ещё одним путём. Телефон может получить запрос через сервис провайдера или зашифрованный relay, но решение должно дойти до исполняющего runtime. Когда телефон теряет связь, runtime следует настроенному правилу по умолчанию, а не угадывает согласие. Когда компьютер offline, приложение должно показать задержку или неизвестное состояние. Если провайдер использует облачного работника, соответствующая политика относится к его инструментальной границе. Сильнейшее evidence — запись со стороны хоста или работника о том, что предложенное действие разрешено или запрещено до запуска.

GrantTap разделяет сеть спаренных устройств, политику Task и собственное состояние исполнения провайдера. Это помогает не принимать зелёный индикатор relay за готовый маршрут approval. Скриншот здесь — детерминированный снимок продукта, а не доказательство того, что контекст внешнего провайдера остался на устройстве. Для архитектурной проверки отключайте по одному звену: телефон, relay, локальный компьютер или сервис провайдера. Записывайте, что продолжает работу, а что останавливается. Дизайном, который честно показывает неопределённость при таких перебоях, управлять легче, чем тем, который продолжает уверенно показывать устаревшее состояние.

## Выбирайте допустимый для себя сбой

Локальная работа может сохранить доступ к незакоммиченному checkout и привычным инструментам, но требует доступного компьютера. Облачная работа может продолжаться без ноутбука пользователя, но нуждается в собственном доступе к репозиторию, среде и проверке обращения с данными. Гибрид сочетает привычные локальные инструменты с удалённой координацией ценой дополнительных соединений, состояние которых надо понимать. Это архитектурные компромиссы, а не универсальный рейтинг. Команда может выбрать разные маршруты для чернового прототипа, частного репозитория и production-инцидента.

До стандартизации проведите небольшой эксперимент. Начните Task, запишите revision репозитория, заблокируйте телефон, отключите ноутбук и посмотрите на итоговое состояние. Затем восстановите связь и проверьте точную команду, изменённые файлы и вывод теста. Повторяйте с другим провайдером, только если ваш процесс действительно его использует. Храните карту потоков данных рядом с документами провайдеров и возвращайтесь к ней при изменении продуктов. Лучший мобильный агент — тот, чьё исполнение и полномочия вы способны объяснить при сбое, а не просто самый насыщенный экран.

Для команды такая карта полезна и при выборе места хранения секретов. Если облачный работник не нуждается в production credential, не выдавайте его на всякий случай. Если локальный агент должен только читать исходники, ограничьте его сетевые и файловые права до начала работы. При смене маршрута заново проверьте разрешения: одинаковое название Task не делает два исполнения эквивалентными по доступу. Сохраняйте эти договорённости рядом с проектной документацией и периодически сверяйте с текущими настройками провайдера. Так архитектурная схема становится рабочим инструментом, а не картинкой для презентации.`,
  },
});
