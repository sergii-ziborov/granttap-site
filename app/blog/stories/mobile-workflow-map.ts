import { composeStory } from "./compose";

const sources = [
  { label: "Claude Code Remote Control", url: "https://code.claude.com/docs/en/remote-control" },
  { label: "OpenAI: Work with Codex from anywhere", url: "https://openai.com/index/work-with-codex-from-anywhere/" },
  { label: "Cursor for iOS", url: "https://cursor.com/docs/cloud-agent/mobile" },
  { label: "GrantTap provider boundaries", url: "https://github.com/sergii-ziborov/granttap-mcp#supported-providers" },
];

export const mobileWorkflowMap = composeStory({
  slug: "choose-a-mobile-coding-agent-workflow",
  date: "2026-10-03",
  cover: "/blog/mobile-workflow-map.webp",
  inlineIllustration: "/blog/choose-a-mobile-coding-agent-workflow-a.webp",
  additionalIllustration: "/blog/choose-a-mobile-coding-agent-workflow-b.webp",
  screenshot: "/product/iphone-tasks.png",
  en: {
    title: "Choosing a mobile coding-agent workflow by the work it must finish",
    summary: "A practical comparison of Claude Code, Codex, Cursor, and GrantTap across five real moments away from the desk.",
    category: "Comparison",
    screenshotCaption: "GrantTap Tasks on iPhone with deterministic sample work. This is a GrantTap capture, not a competing provider's screen.",
    illustrationCaption: "AI-generated map of possible execution locations; it does not depict a provider architecture diagram.",
    additionalIllustrationCaption: "AI-generated editorial illustration of a review path. It is not a live feature matrix or product screenshot.",
    closing: "Choose the route that finishes your real task with the fewest uncertain handoffs, and repeat the test when provider behavior changes.",
    sources,
    graphic: { title: "Five moments to test", caption: "A workflow checklist, not a ranking of providers.", rows: [
      { label: "Start", detail: "Where does the agent loop begin?" },
      { label: "Leave", detail: "What continues when the phone locks?" },
      { label: "Decide", detail: "Where does approval take effect?" },
      { label: "Return", detail: "Can you verify files and tests?" },
      { label: "Switch", detail: "What survives a provider change?" },
    ] },
    body: `A phone is useful for coding work only when it preserves enough context to make a good decision. Reading a chat message while walking is easy; deciding whether a command should run, whether a patch belongs in the intended repository, or whether a task is actually finished is harder. The right mobile workflow depends on that moment of responsibility. We compared the official descriptions of Claude Code Remote Control, OpenAI's Codex mobile preview, and Cursor for iOS with GrantTap's documented local coordination model. This is a source check dated October 3, 2026, not a promise about future plans or availability.

GrantTap keeps a user-visible Task around executions of supported providers and computers. Claude Code and Codex have the deepest integrations; Cursor joins the shared view with a narrower control path. The provider's own client may expose a deeper native view of its sessions. Use the following five moments as a test script with your actual repository. Write down what you see on the phone, which machine performs the work, and which part of the outcome you can independently verify. A polished notification alone cannot answer those questions.

## Moment one: begin work away from the desk

Suppose a test failed after you left the office. Cursor for iOS documents the ability to select a repository and start a cloud agent from the phone. It also describes workers on cloud machines, team pools, and connected personal machines. Those paths have different setup and storage requirements, so choosing Cursor means deciding which worker receives the job. Its mobile screen is a genuine work surface for that system, not merely a viewer of an existing desktop chat. Confirm repository access and environment secrets before treating a mobile launch as a production incident response route.

Claude Code Remote Control begins from an eligible local Claude Code installation or session. The official guide describes server mode, an interactive session, and connecting through the Claude app or web. That makes sense when the repository and tools already live on the computer and you want to keep using Claude's native conversation. OpenAI describes Codex mobile access as a preview that brings live state from connected machines, approvals, and project context into ChatGPT mobile. For either route, check the current account and setup documentation first. GrantTap's path is to find the supported Task and execution already connected through its local helper; it does not launch an arbitrary vendor cloud worker by virtue of being on a phone.

## Moment two: the phone locks and the computer sleeps

Ask what keeps running when you put the phone in your pocket. The answer is determined by the location of the agent loop and tools, not the app icon. Cursor says cloud agents can continue while the phone is locked; a route that uses tools on your own computer still depends on that computer being available. Claude's Remote Control guide describes a local process whose server or interactive session has to be running. If the computer goes offline, the remote surface cannot magically execute local commands. A live indicator should therefore be read as a statement about a connection, not proof of completed work.

For GrantTap, computer and provider availability remain separate signals. A paired phone, an online encrypted relay, and a provider hook capable of receiving a decision are different conditions. If one fails, the interface should show uncertainty or delay rather than imply a command finished. In a test run, deliberately disconnect the computer after a harmless task starts. Observe what the phone shows, whether a decision is queued or rejected, and whether the final event is later confirmed by the host. This small outage drill reveals much more than a feature list that says “remote access.”

## Moment three: an approval needs a human decision

The important question is where an approval is applied. A phone can display a request, but the action happens elsewhere: a local process, a connected executor, or a cloud worker. Claude, Codex, and Cursor each describe their own permission and review models. Those native models may be exactly what a single-provider user needs. Compare the request detail you receive, the scope of the proposed action, the options available, and the evidence that the tool actually resumed. Do not infer that two similarly named buttons have identical policy semantics across providers.

GrantTap distinguishes capability availability, configured policy, and confirmed usage. Its local computer must enforce any applicable deny before a tool proceeds; a phone-side optimistic state is not enforcement. That is a narrower, more testable claim than “governance on mobile.” Use a disposable repository to try a denied operation and an approved operation, then inspect both the provider transcript and the host result. If a route cannot show which computer received a decision, treat that as a material limitation for sensitive work. Never assume that the appearance of an approval card proves the command ran or that its output was valid.

## Moment four: return to code review

When you return to the desk, compare the mobile account of progress with the repository. Cursor's iOS documentation describes reviewing diffs and pull requests and explicitly says the mobile app is not a full IDE; editor, terminal, and file browser remain on the web or desktop. Claude's remote guide describes a connected device that can show a diff for a Git repository, with rules about which changes appear. Codex's mobile preview describes live threads and project context. Those are useful views, but the same verification question applies to every route: which revision did the agent edit, which tests were actually run, and did the reviewer inspect the final state rather than an earlier notification?

GrantTap's Task view is a control and continuity surface. The sample screenshot here shows the product's interface with deterministic data, not an independently verified result for a real project. To test the route, ask the agent to change one file, run a named test, and report the revision. Compare that report with the checkout yourself. If the agent used a worktree or cloud branch, identify it explicitly before merging. A green task state should summarize observed events, while a passing test requires test output and a successful exit from the actual execution environment.

## Moment five: the work changes provider or computer

This is where a single session and a durable Task diverge. A Claude remote session is still a Claude session; a Cursor cloud agent remains within Cursor's workflow; Codex provides native state for Codex work. Each is valuable within its system. If you need to move the same objective to another provider, carry the human goal, repository identity, current revision, decisions, and unresolved risks deliberately. Hidden reasoning and private provider state should not be claimed as transferred. A handoff is an explicit packet of known facts and open questions, not a teleportation of the original mind.

GrantTap models the Task as the stable user-visible unit across supported executions. This makes it possible to keep the objective and decision trail visible while a new execution starts, subject to the supported integration and the destination computer's access. Before accepting a handoff, inspect project linkage, checkout revision, capability policy, and the last confirmed outcome. Mark anything unknown as unknown. If you never use more than one provider, a native app may make this layer unnecessary. If you regularly cross machines or providers, run this exact transition in a test repository and count how much context you must reconstruct. That observed friction, not a marketing chart, is the useful comparison.`,
  },
  ru: {
    title: "Как выбрать мобильный сценарий coding-агента по реальной задаче",
    summary: "Практическое сравнение Claude Code, Codex, Cursor и GrantTap в пяти ситуациях вне рабочего места.",
    category: "Сравнение",
    screenshotCaption: "Экран Tasks в GrantTap с детерминированными тестовыми задачами. Это интерфейс GrantTap, а не экран другого провайдера.",
    illustrationCaption: "Сгенерированная схема возможных мест исполнения; она не является архитектурной диаграммой провайдера.",
    additionalIllustrationCaption: "Сгенерированная иллюстрация проверки результата. Это не таблица действующих функций и не скриншот продукта.",
    closing: "Выбирайте маршрут, который доводит вашу реальную задачу до проверяемого результата с минимумом неясных переходов, и повторяйте проверку по мере изменения продуктов.",
    sources,
    graphic: { title: "Пять моментов для проверки", caption: "Сценарий испытания, а не рейтинг провайдеров.", rows: [
      { label: "Начало", detail: "Где стартует цикл агента?" },
      { label: "Отход", detail: "Что продолжается при заблокированном телефоне?" },
      { label: "Решение", detail: "Где применяется approval?" },
      { label: "Возврат", detail: "Как проверить файлы и тесты?" },
      { label: "Переход", detail: "Что сохранится при смене провайдера?" },
    ] },
    body: `Телефон полезен для coding-задачи, если сохраняет достаточно контекста для правильного решения. Прочитать сообщение агента на ходу легко; определить, следует ли запускать команду, относится ли патч к нужному репозиторию и действительно ли работа завершена, гораздо сложнее. Мобильный сценарий надо выбирать по моменту ответственности. Мы сопоставили официальные описания Claude Code Remote Control, предварительной мобильной версии Codex от OpenAI и Cursor для iOS с документированной моделью локальной координации GrantTap. Сведения проверены 3 октября 2026 года; это не обещание о будущих тарифах и возможностях.

GrantTap сохраняет видимую человеку Task вокруг executions поддерживаемых провайдеров и компьютеров. Наиболее полные интеграции — Claude Code и Codex; Cursor входит в общий обзор с более узким путём управления. Собственный клиент провайдера может показывать нативную сессию глубже. Используйте следующие пять моментов как сценарий испытания на своём репозитории. Запишите, что видно на телефоне, какая машина делает работу и какую часть результата вы способны проверить независимо. Даже красивое уведомление само по себе на эти вопросы не отвечает.

## Момент первый: начать работу вне стола

Допустим, после вашего ухода упал тест. Документация Cursor для iOS описывает выбор репозитория и запуск облачного агента прямо с телефона. Она также перечисляет работников на облачных машинах, в командных пулах и среди подключённых личных компьютеров. У маршрутов разные требования к настройке и хранению данных; выбирая Cursor, следует понимать, какому работнику достанется задача. Мобильный экран здесь служит настоящей рабочей поверхностью системы, а не только просмотром настольного чата. До использования при инциденте проверьте доступ к репозиторию, ветку и настройку секретов среды.

Claude Code Remote Control начинается с подходящей локальной установки или сессии Claude Code. Официальное руководство описывает серверный режим, интерактивную сессию и подключение через приложение Claude либо веб. Это логичный путь, когда репозиторий и инструменты уже находятся на компьютере, а вы хотите сохранить нативный разговор Claude. OpenAI описывает мобильный Codex как предварительную версию с живым состоянием подключённых машин, подтверждениями и контекстом проекта в мобильном ChatGPT. Для обоих маршрутов сначала проверьте актуальные условия аккаунта и настройки. GrantTap находит поддерживаемую Task и execution через локальный helper; само наличие телефона не запускает произвольного облачного работника провайдера.

## Момент второй: телефон заблокирован, компьютер уснул

Спросите, что продолжает работать, когда телефон в кармане. Ответ зависит от места цикла агента и его инструментов, а не от иконки приложения. Cursor пишет, что cloud agents продолжают работу при заблокированном телефоне; маршрут с инструментами на собственном компьютере по-прежнему зависит от его доступности. Руководство Claude Remote Control описывает локальный процесс: сервер или интерактивная сессия должны работать. При отключении компьютера удалённый интерфейс не сможет магически выполнить локальные команды. Индикатор Live следует понимать как состояние связи, а не доказательство успешного окончания задачи.

Для GrantTap доступность компьютера и провайдера — разные сигналы. Спаренный телефон, доступный зашифрованный relay и provider hook, способный принять решение, представляют разные условия. Если одно из них пропало, интерфейс должен сообщать о неопределённости или задержке, а не объявлять команду выполненной. В тестовой задаче намеренно отключите компьютер после безобидного шага. Посмотрите, что показывает телефон, ставится ли решение в очередь или отвергается и подтверждается ли итоговое событие хостом позже. Такое небольшое испытание сбоя расскажет больше, чем пункт «удалённый доступ» в списке возможностей.

## Момент третий: человеку нужно подтвердить действие

Главный вопрос — где применяется approval. Телефон показывает запрос, но действие происходит в другом месте: локальном процессе, подключённом исполнителе или облачном работнике. У Claude, Codex и Cursor есть собственные модели разрешений и проверки. Для пользователя одного провайдера их нативных механизмов может полностью хватать. Сравните детализацию запроса, границы предлагаемого действия, доступные варианты и свидетельство того, что инструмент действительно продолжил работу. Одинаково названные кнопки у разных провайдеров не гарантируют одинаковую семантику политики.

GrantTap разделяет доступность возможности, заданную политику и подтверждённое использование. Локальный компьютер обязан применить действующий запрет до запуска инструмента; оптимистичное состояние на телефоне не является enforcement. Это более узкое и проверяемое утверждение, чем общие слова о governance на мобильном. В пробном репозитории проверьте запрещённое и разрешённое действие, затем изучите транскрипт провайдера и результат на хосте. Если маршрут не показывает, какой компьютер получил решение, считайте это существенным ограничением для чувствительной работы. Карточка approval не доказывает ни запуск команды, ни корректность её вывода.

## Момент четвёртый: вернуться к ревью кода

Вернувшись к рабочему месту, сравните мобильный отчёт о прогрессе с репозиторием. Документация Cursor для iOS описывает просмотр diff и pull request и прямо говорит, что мобильное приложение не является полной IDE: редактор, терминал и файловый браузер остаются на вебе или компьютере. Руководство Claude описывает diff на подключённом устройстве для Git-репозитория с правилами о том, какие изменения попадают в обзор. Мобильная версия Codex показывает живые threads и контекст проекта. Все эти виды полезны, но вопрос проверки один: какую revision агент изменил, какие тесты реально запустил и смотрел ли человек на итог, а не на раннее уведомление?

Task в GrantTap — поверхность управления и преемственности. Приведённый здесь скриншот показывает интерфейс с детерминированными данными, а не независимо проверенный итог реального проекта. Для проверки попросите агента изменить один файл, запустить именованный тест и сообщить revision. Сверьте сообщение со своим checkout. Если использовались worktree или облачная ветка, найдите их явно до слияния. Зелёное состояние Task должно обобщать наблюдавшиеся события; успешный тест требует вывода тестового инструмента и нулевого кода завершения именно в среде исполнения.

## Момент пятый: работа меняет провайдера или компьютер

Здесь проявляется разница между отдельной сессией и устойчивой Task. Удалённая сессия Claude остаётся сессией Claude; облачный агент Cursor работает внутри процесса Cursor; Codex предоставляет нативное состояние своей работы. Всё это ценно внутри соответствующей системы. Если ту же человеческую цель нужно передать другому провайдеру, перенесите цель, идентичность репозитория, текущую revision, принятые решения и открытые риски сознательно. Не следует утверждать, будто скрытые рассуждения и закрытое состояние провайдера автоматически скопированы. Handoff — явный пакет известных фактов и вопросов, а не телепортация первоначального разговора.

GrantTap считает Task стабильной видимой единицей при переходе между поддерживаемыми executions. Это позволяет показывать цель и историю решений, пока начинается новое исполнение, с учётом возможностей интеграции и доступа целевого компьютера. Перед handoff проверьте привязку проекта, revision checkout, правила возможностей и последний подтверждённый результат. Неизвестное так и обозначайте. Если вы никогда не меняете провайдера, нативное приложение может полностью решить задачу. Если регулярно переходите между машинами или агентами, выполните такой переход в тестовом репозитории и посчитайте, сколько контекста приходится восстанавливать. Наблюдаемое трение полезнее любой рекламной таблицы.

Запишите результат проверки в виде короткого протокола: какую задачу запустили, на каком компьютере, через какое приложение, что произошло после отключения сети и какой след сохранился в репозитории. Отдельно отметьте время ожидания человека и число действий, которые пришлось повторить у рабочего стола. Такой протокол поможет не только выбрать мобильный клиент, но и обнаружить слабое место собственного процесса. Если другой участник команды воспроизведёт проверку и придёт к иному выводу, разберитесь в различии настроек, прав и исходного состояния, прежде чем менять инструмент. Это надёжнее впечатления от одной удачной демонстрации.`,
  },
});
