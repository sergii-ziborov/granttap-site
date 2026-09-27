export type BlogLocale = "en" | "ru";

type ArticleText = {
  title: string;
  summary: string;
  category: string;
  intro: string[];
  sections: { heading: string; paragraphs: string[] }[];
  screenshotCaption: string;
  closing: string;
};

export type BlogArticle = {
  slug: string;
  date: string;
  minutes: number;
  cover: string;
  screenshot: string;
  en: ArticleText;
  ru: ArticleText;
};

export const articles: BlogArticle[] = [
  {
    slug: "connect-iphone-with-qr",
    date: "2026-09-24",
    minutes: 5,
    cover: "/blog/device-network.webp",
    screenshot: "/product/iphone-security-settings.png",
    en: {
      title: "Connect your iPhone without another account",
      summary: "The computer shows the pairing QR. The phone scans it. A Mesh invitation is a different action.",
      category: "Getting started",
      intro: [
        "GrantTap connects a phone to a local computer that already runs your coding tools. You do not need to add GrantTap under Codex Connected accounts, and a chat message cannot substitute for device pairing. The connection must be confirmed through the local GrantTap helper and the phone.",
        "Think of this as adding a trusted controller to a computer. A Mesh is a separate collaboration scope; joining one does not pair a device to the computer network.",
      ],
      sections: [
        { heading: "Start on the computer", paragraphs: [
          "Install the compatible GrantTap plugin and granttap-mcp runtime, then run granttap setup. Open the GrantTap connection card in the coding app and choose Add a device. That card displays a short-lived, one-time QR; granttap.com/connect handles coding-app approval and observations. Never paste the QR into chat or a support ticket.",
          "If the card cannot contact the helper, check that the local helper is running and the plugin uses the same protocol version. A relay being online only proves one part of the route. It does not prove that an approval hook, background sync, or this phone is ready.",
        ] },
        { heading: "Finish on the phone", paragraphs: [
          "In GrantTap on iPhone or iPad, open Settings → Connections → Add a device (Scan QR). Scan the code shown by the computer and confirm the computer identity on both sides. The computer then appears in Connections. Repeat the same process for each additional Mac or PC; scanning a second computer adds a link rather than replacing the first.",
          "An already trusted phone may show an expiring QR for another controller in its Settings. That joins another iPhone or iPad to the device network. It is separate from inviting a person into a particular Mesh, which has its own role and access choices.",
        ] },
        { heading: "Check the whole path", paragraphs: [
          "After pairing, verify that the computer reports Live, that the intended coding app has its GrantTap hooks or plugin active, and that a real task event reaches the phone. A saved pairing record and a green relay light alone are insufficient. If a coding app was open before installation, restart that app so it loads the new integration.",
          "Keep the QR private until it expires. If the wrong device was added, revoke that link in Connections and pair again with a fresh code. Do not share a Mesh merely to make a phone able to manage your own computers.",
        ] },
      ],
      screenshotCaption: "GrantTap Settings in demo mode. The Scan QR action belongs to Connections; the image contains sample data.",
      closing: "One computer may have several trusted controllers, and one phone may connect to several computers. Mesh membership is granted separately.",
    },
    ru: {
      title: "Как подключить iPhone без дополнительного аккаунта",
      summary: "Компьютер показывает QR для привязки, телефон его сканирует. Приглашение в Mesh — отдельное действие.",
      category: "Начало работы",
      intro: [
        "GrantTap связывает телефон с локальным компьютером, на котором уже работают ваши coding tools. Добавлять GrantTap в Codex Connected accounts не нужно; сообщение в чате не заменяет привязку устройства. Соединение подтверждают локальный helper и телефон.",
        "Это добавление доверенного управляющего устройства к компьютеру. Mesh — отдельная область совместной работы; вступление в Mesh не подключает телефон к сети устройств.",
      ],
      sections: [
        { heading: "Начните на компьютере", paragraphs: [
          "Установите совместимые версии GrantTap plugin и granttap-mcp, затем выполните granttap setup. Откройте панель GrantTap в coding app и нажмите Add a device. Эта панель покажет одноразовый QR с коротким сроком жизни; granttap.com/connect служит для подтверждения coding app и наблюдения. Не отправляйте QR в чат или поддержку.",
          "Если карточка не видит helper, проверьте, что локальный процесс запущен и версии протокола совпадают. Online relay подтверждает только часть маршрута: это ещё не доказательство работы approval hooks, фоновой синхронизации и связи с телефоном.",
        ] },
        { heading: "Завершите на телефоне", paragraphs: [
          "В GrantTap на iPhone или iPad откройте Settings → Connections → Add a device (Scan QR). Отсканируйте код с компьютера и подтвердите его идентичность с обеих сторон. После этого компьютер появится в Connections. Для каждого следующего Mac или PC повторите привязку: новая связь не заменит старую.",
          "Уже доверенный телефон может показать временный QR для второго управляющего телефона в Settings. Это добавление iPhone или iPad в сеть устройств. Приглашение человека в конкретный Mesh с ролью и правами находится отдельно.",
        ] },
        { heading: "Проверьте весь путь", paragraphs: [
          "После привязки проверьте статус Live у компьютера, активность GrantTap plugin или hooks в нужном coding app и доставку реального события задачи на телефон. Сохранённая привязка и зелёный индикатор relay сами по себе недостаточны. Если coding app был открыт до установки, перезапустите его.",
          "Не показывайте QR посторонним до истечения срока. Если подключили не то устройство, отзовите связь в Connections и создайте новый код. Не открывайте Mesh только ради управления собственными компьютерами с другого телефона.",
        ] },
      ],
      screenshotCaption: "GrantTap Settings в демо-режиме. Scan QR относится к Connections; на снимке тестовые данные.",
      closing: "К одному компьютеру могут подключаться несколько доверенных контроллеров, а один телефон может управлять несколькими компьютерами. Доступ к Mesh выдаётся отдельно.",
    },
  },
  {
    slug: "task-continuity-across-agents",
    date: "2026-09-24",
    minutes: 5,
    cover: "/blog/task-continuity.webp",
    screenshot: "/product/iphone-handoff.png",
    en: {
      title: "One Task, several executions",
      summary: "How a stable Task keeps its history when work moves between a provider, a computer, or a native session.",
      category: "Workflow",
      intro: [
        "A coding agent's native session is useful, but it is a fragile unit for human coordination. The session can end, the provider can change, and a second computer can take over. GrantTap presents the Task as the stable unit you follow on your phone.",
        "Each execution is one provider session working on that Task. Child agents remain nested under that execution. This structure keeps an agent handoff from looking like an unrelated new request.",
      ],
      sections: [
        { heading: "What travels with the Task", paragraphs: [
          "The useful handoff is a bounded record of the objective, current owner, relevant decisions, blockers, resource claims, and a route to the next execution. It is not a copy of hidden reasoning or a demand that every provider share its private transcript. The human still sees one Task and the sequence of executions that performed it.",
          "A handoff should name the target computer and provider explicitly. If the selected host is offline or lacks the required capability, the route must be refused or queued with a visible reason; silently choosing a different host would change the user's decision.",
        ] },
        { heading: "Why branches and receipts matter", paragraphs: [
          "Parallel agents can touch the same repository. Separate branches or worktrees and resource claims make their overlap visible before a merge conflict. A handoff receipt records that the next execution accepted the work. It does not prove that the next agent understood every decision or that a code change passed verification.",
          "When a Task finishes, inspect the outcome, tests, and any remaining unknowns. A process printing text is not evidence of success if the process failed. GrantTap should keep delivery, execution, and verified result as separate facts.",
        ] },
        { heading: "Use the phone for decisions", paragraphs: [
          "The phone is best at answering a specific question, approving or denying a bounded action, and checking where the Task is now. It should not need to own every byte of the coding runtime. The execution stays on a computer; the controller carries the authority and the concise history needed for the next step.",
        ] },
      ],
      screenshotCaption: "Demo handoff screen. A real transfer depends on target and policy readiness at the time of execution.",
      closing: "A Task can outlive one session, but continuity is only trustworthy when the next execution receives the current approved state and reports what actually happened.",
    },
    ru: {
      title: "Одна Task, несколько исполнений",
      summary: "Как задача сохраняет историю при смене агента, компьютера или native session.",
      category: "Рабочий процесс",
      intro: [
        "Native session агента полезна, но для управления человеком это ненадёжная единица: сессия заканчивается, провайдер меняется, работу принимает другой компьютер. GrantTap показывает на телефоне стабильную Task.",
        "Execution — одна сессия провайдера, выполняющая эту Task. Дочерние агенты остаются внутри execution. Передача работы поэтому не выглядит как новая, не связанная с предыдущей, просьба.",
      ],
      sections: [
        { heading: "Что передаётся вместе с Task", paragraphs: [
          "Полезная передача содержит ограниченный набор: цель, текущего владельца, применимые решения, блокеры, claims на ресурсы и маршрут следующего исполнения. Она не копирует скрытые рассуждения и не требует общего приватного transcript у всех провайдеров. Человек видит одну Task и последовательность выполнявших её executions.",
          "Handoff должен явно назвать компьютер и провайдера. Если хост офлайн или нужная возможность недоступна, маршрут получает отказ либо очередь с понятной причиной. Незаметная подмена хоста изменила бы решение пользователя.",
        ] },
        { heading: "Зачем нужны ветки и receipts", paragraphs: [
          "Параллельные агенты могут менять один репозиторий. Отдельные ветки или worktrees и claims на ресурсы показывают пересечения до конфликта при слиянии. Receipt передачи говорит, что следующее execution приняло работу. Он ещё не доказывает, что агент усвоил решения или что изменения кода прошли проверку.",
          "После завершения Task проверьте итог, тесты и неизвестные факты. Текст в stdout не означает успех, если процесс завершился с ошибкой. Доставка, исполнение и подтверждённый результат — разные события.",
        ] },
        { heading: "Телефон для точечных решений", paragraphs: [
          "Телефон удобен, чтобы ответить на конкретный вопрос, разрешить или запретить ограниченное действие и увидеть текущую точку Task. Ему не нужно хранить всё состояние coding runtime. Исполнение остаётся на компьютере; контроллер переносит полномочия и краткую историю для следующего шага.",
        ] },
      ],
      screenshotCaption: "Демо-экран handoff. Реальная передача зависит от готовности целевого хоста и правил в момент запуска.",
      closing: "Task может пережить одну сессию, но преемственность надёжна, только когда следующее исполнение получает актуальное разрешённое состояние и честно сообщает о результате.",
    },
  },
  {
    slug: "linked-projects-without-merging-access",
    date: "2026-09-24",
    minutes: 6,
    cover: "/blog/linked-work.webp",
    screenshot: "/product/iphone-weavatrix-graph.png",
    en: {
      title: "Linked Mesh spaces keep separate permissions",
      summary: "One Mesh can link several repositories; links between Mesh spaces do not merge access.",
      category: "Mesh",
      intro: [
        "A product may span an iOS app, a local bridge, an Engine, and a public website. One Mesh can link all of those repositories without turning them into one provider project.",
        "A repository binding tells Mesh which checkout is available to it. A verified architecture relation means code or runtime evidence supports a dependency. The UI distinguishes those two links.",
      ],
      sections: [
        { heading: "Three questions behind one group", paragraphs: [
          "First, which repository is this? Multiple checkouts can point to one remote; a folder name is not an identity. Second, which Mesh owns the Task, policy, memory, and members? Third, what relation has Weavatrix verified between repositories or components? The answers can differ.",
          "For example, a Mesh can link an internal app and a public site repository. That does not give every member access to both. A code dependency is verified only when its source revision and evidence are present.",
        ] },
        { heading: "What a good group view shows", paragraphs: [
          "A useful Mesh view shows each Mesh, its linked repositories, computers, recent Tasks, and why they appear together. The label distinguishes a binding, a declared link, and Weavatrix evidence. A missing report remains unknown rather than erasing a connection.",
          "A Mesh can link ten repositories while each member sees only resources granted to them. Host receipts show where access was applied.",
        ] },
        { heading: "Names are for people, IDs are for routing", paragraphs: [
          "Two Mesh spaces called ‘general-codex’ may have separate permissions; two checkout folders called ‘granttap’ may be the same repository. Names help orientation but cannot drive deduplication, routing, or access.",
        ] },
      ],
      screenshotCaption: "A deterministic demo graph with explicit component relations. It does not claim a live scan of the linked repositories.",
      closing: "Grouping is a map for the person; it must never become an accidental permission grant.",
    },
    ru: {
      title: "Связанные Mesh сохраняют отдельные права",
      summary: "Один Mesh может связывать несколько репозиториев, а связи между Mesh не объединяют доступ.",
      category: "Mesh",
      intro: [
        "Один продукт может включать iOS-приложение, локальный bridge, Engine и публичный сайт. Один Mesh связывает эти репозитории без смешения проектов разных провайдеров.",
        "Привязка репозитория показывает, какой checkout доступен Mesh. Подтверждённая архитектурная связь означает другое: код или наблюдение во время выполнения подкрепляют зависимость. Интерфейс различает эти связи.",
      ],
      sections: [
        { heading: "Три вопроса за одной группой", paragraphs: [
          "Первый: что это за репозиторий? Разные checkout могут указывать на один remote; имя папки не является identity. Второй: какой Mesh владеет Task, правилами, памятью и участниками? Третий: какую связь подтвердил Weavatrix? Ответы могут различаться.",
          "Например, Mesh связывает внутреннее приложение и публичный сайт. Это не выдаёт каждому участнику доступ к обоим репозиториям. Кодовая зависимость подтверждается только при наличии свидетельства и ревизии источника.",
        ] },
        { heading: "Что должна показывать группа", paragraphs: [
          "Обзор показывает Mesh, связанные репозитории, компьютеры, недавние Tasks и причины связей. Подпись отличает привязку от подтверждённой Weavatrix зависимости. Отсутствие отчёта означает неизвестность, а не отсутствие связи.",
          "Mesh может связывать десять репозиториев, но каждый участник видит только разрешённые ресурсы. Отчёты компьютеров показывают, где доступ действительно применён.",
        ] },
        { heading: "Имена для человека, ID для маршрута", paragraphs: [
          "Два Mesh с именем general-codex могут иметь разные права; две папки granttap могут быть рабочими копиями одного репозитория. Имена помогают ориентироваться, но не служат основанием для маршрутизации и выдачи доступа.",
        ] },
      ],
      screenshotCaption: "Демонстрационный граф с явными связями компонентов. Снимок не доказывает живой анализ связанных репозиториев.",
      closing: "Группировка — карта для человека; она не должна случайно выдавать доступ.",
    },
  },
  {
    slug: "architecture-graph-with-evidence",
    date: "2026-09-24",
    minutes: 6,
    cover: "/blog/architecture-evidence.webp",
    screenshot: "/product/iphone-health-code-towers.png",
    en: {
      title: "A graph should answer a code question",
      summary: "How to read Weavatrix evidence, full-screen code towers, and the difference between a report and a repository binding.",
      category: "Architecture",
      intro: [
        "A graph is useful when it helps answer where a change could matter, which component owns a behavior, and what evidence supports a relation. A polished picture with unverified edges is worse than a smaller, honest report.",
        "GrantTap's architecture view uses Weavatrix reports for components and evidenced relations. The Health code map gives a full-screen way to inspect files and symbols. The two views should carry the same revision context rather than competing stories about the repository.",
      ],
      sections: [
        { heading: "Read the report label first", paragraphs: [
          "Check the repository, engine version, source revision, scan time, and completeness. A report generated for another checkout or an old commit may still be interesting, but it is not current proof for your Task. Search and component inspection help narrow the view; a missing edge should not be interpreted as proof that no dependency exists outside the analyzed scope.",
          "The graph screenshot on this site is a deterministic fixture labelled demo-revision. It shows navigation and rendering behavior, not an independent scan of a customer's private code.",
        ] },
        { heading: "Use code towers to orient, then inspect", paragraphs: [
          "The full-screen Health map groups code visually so you can find a file or symbol, understand its neighborhood, and open details. Tall or bright geometry is a navigation aid, not a quality score. A component deserves a stronger claim only when its underlying source and relation evidence can be inspected.",
          "If architecture is unavailable on one computer, first check that its repository is bound and that the Engine can reach that checkout. The product should offer an explicit build or refresh action when supported. It must not claim that a connected Weavatrix library is absent merely because this chat has no current report.",
        ] },
        { heading: "From graph to action", paragraphs: [
          "For a coding Task, the next useful step is a revision-bound impact packet: what changed, which related components may be affected, why, and how fresh that conclusion is. The graph can supply evidence to Cortex context selection, but a stale or missing impact packet must be visible. A relation by itself does not calculate cost, authorize a command, or prove a test passed.",
        ] },
      ],
      screenshotCaption: "Full-screen Health code towers from deterministic fixture data, labelled demo-revision in the app.",
      closing: "Treat the graph as a route to evidence. Its value grows when every important edge can be traced back to a repository and revision.",
    },
    ru: {
      title: "Граф должен отвечать на вопрос о коде",
      summary: "Как читать evidence Weavatrix, полноэкранные башни кода и отличать отчёт от привязки репозитория.",
      category: "Архитектура",
      intro: [
        "Граф полезен, если помогает понять, где изменение может повлиять на код, какой компонент отвечает за поведение и на чём основана связь. Красивая картинка с неподтверждёнными рёбрами хуже небольшого, но честного отчёта.",
        "Архитектурный экран GrantTap использует отчёты Weavatrix о компонентах и подтверждённых связях. Карта кода в Health позволяет искать файлы и символы на полном экране. У обоих видов должен быть один revision context, чтобы они не рассказывали разные истории о репозитории.",
      ],
      sections: [
        { heading: "Сначала прочитайте метку отчёта", paragraphs: [
          "Проверьте репозиторий, версию Engine, revision источника, время сканирования и полноту. Отчёт другого checkout или старого commit может быть полезен, но не доказывает состояние вашей текущей Task. Поиск и просмотр компонента сужают область; отсутствие ребра не доказывает, что зависимости вне проанализированной области нет.",
          "Скриншот графа на этом сайте создан на детерминированных данных и помечен demo-revision. Он демонстрирует навигацию и рендеринг, а не независимое сканирование приватного кода клиента.",
        ] },
        { heading: "Башни помогают найти, подробности — проверить", paragraphs: [
          "Полноэкранная карта Health собирает код визуально: можно найти файл или символ, увидеть окружение и открыть детали. Высокая или яркая геометрия — помощь в навигации, не оценка качества. Более сильный вывод о компоненте возможен лишь тогда, когда доступны исходник и evidence связи.",
          "Если архитектура недоступна на одном компьютере, проверьте привязку репозитория и доступ Engine к checkout. Там, где это поддерживается, интерфейс должен предложить явное построение или обновление. Отсутствие актуального отчёта chat не означает, что библиотека Weavatrix не подключена.",
        ] },
        { heading: "От графа к действию", paragraphs: [
          "Для coding Task следующий полезный шаг — impact packet, привязанный к revision: что изменилось, какие связанные компоненты затронуты, почему и насколько свеж вывод. Граф даёт evidence для отбора контекста Cortex, но устаревший или отсутствующий packet должен быть видим. Одна связь не считает стоимость, не разрешает команду и не доказывает прохождение теста.",
        ] },
      ],
      screenshotCaption: "Полноэкранные башни Health на детерминированных данных; в приложении указан demo-revision.",
      closing: "Считайте граф маршрутом к evidence. Его ценность растёт, когда каждую важную связь можно проследить до репозитория и revision.",
    },
  },
  {
    slug: "mcp-skills-and-governance-status",
    date: "2026-09-24",
    minutes: 6,
    cover: "/blog/capability-states.webp",
    screenshot: "/product/iphone-mcp-usage.png",
    en: {
      title: "Configured, available, used: three different facts",
      summary: "A practical way to read MCP and skill status without confusing a catalog entry with working execution.",
      category: "Governance",
      intro: [
        "A tool can appear in a catalog and still be unusable on the computer selected for a Task. It may be requested, approved, installed with a different configuration, missing a credential, or simply not initialized. A trustworthy control screen names these states separately.",
        "GrantTap tracks capability identities, observed host state, and Mesh decisions. The full bundle transfer and per-host durable apply receipts remain work in progress, so the UI must not label a requested MCP or skill as ready just because it was listed or approved.",
      ],
      sections: [
        { heading: "Follow the capability through its lifecycle", paragraphs: [
          "First comes discovery: a host reports a native MCP configuration or skill bundle. A request brings that exact version or digest into a chat review. Approval allows that identity under the chat policy. Then each target host has to apply the configuration or bundle and independently report initialized state. Finally, real invocation evidence can show that a Task actually used it.",
          "The same human-friendly MCP name can hide two different server configurations. For a skill, scripts and references matter as much as SKILL.md. An edit to the bundle changes the digest and requires a new readiness decision rather than inheriting an old approval by name.",
        ] },
        { heading: "Policy and environment are separate", paragraphs: [
          "Governance answers whether a capability may be used. Environment controls which approved process receives a value or reference. A masked field in Settings prevents casual viewing; it does not stop an agent with shell access to the same process from reading its environment. Use-only credentials require a trusted broker that performs a narrow operation without exposing the key to the model.",
          "Likewise, observing token use is not a spending cap. A strict budget needs an atomic reservation before a controlled external action, accounting for work already in flight and unknown outcomes. These budget and use-only flows are still being built and should not be treated as active protection.",
        ] },
        { heading: "What to check today", paragraphs: [
          "Check the exact capability identity, the target computer, its observed configured and initialized states, the chat's allow/ask/deny decision, and the result of a small real invocation. If any state is unknown, keep it unknown. A green catalog card must not stand in for successful use.",
          "For a local MCP connection, also verify the machine helper, transport, provider plugin, and app hooks independently. A relay connection does not prove that an stdio server launched in Cursor or that a Codex session loaded newly trusted hooks.",
        ] },
      ],
      screenshotCaption: "Demo usage and capability view. A listed tool is not evidence that a Task invoked it.",
      closing: "Good governance makes the gap between intended policy and applied reality visible before a Task depends on that capability.",
    },
    ru: {
      title: "Настроено, доступно, использовано: три разных факта",
      summary: "Как читать статусы MCP и skills, не путая запись каталога с работающим исполнением.",
      category: "Governance",
      intro: [
        "Инструмент может быть в каталоге и при этом не работать на компьютере, выбранном для Task. Его могли запросить, одобрить, установить с другой конфигурацией, оставить без credential или не инициализировать. Надёжный экран контроля называет эти состояния по отдельности.",
        "GrantTap отслеживает identity возможностей, наблюдаемое состояние хостов и решения chat. Полный перенос bundle и устойчивые receipts применения на каждом host ещё в работе, поэтому нельзя писать «готово» только потому, что MCP или skill попали в список либо были одобрены.",
      ],
      sections: [
        { heading: "Проследите весь жизненный цикл", paragraphs: [
          "Сначала обнаружение: хост сообщает native MCP configuration или bundle skill. Запрос приносит в chat точную версию или digest. Одобрение разрешает эту identity по правилам chat. Затем каждый целевой host должен применить конфигурацию или bundle и независимо сообщить initialized state. Только evidence реального вызова показывает, что Task действительно использовала инструмент.",
          "За одним удобным именем MCP могут скрываться разные конфигурации сервера. У skill важны scripts и references, а не один SKILL.md. После изменения bundle меняется digest; старое одобрение по имени не подтверждает новую готовность.",
        ] },
        { heading: "Policy и Environment решают разные задачи", paragraphs: [
          "Governance отвечает, можно ли использовать capability. Environment определяет, какой разрешённый процесс получает значение или reference. Скрытое поле Settings защищает от случайного взгляда, но агент с shell в том же процессе всё ещё может читать env. Use-only credential требует доверенного broker, который выполняет узкую операцию и не показывает ключ модели.",
          "Точно так же наблюдение токенов не ограничивает расходы. Строгий бюджет требует атомарного резерва перед управляемым внешним действием с учётом уже идущей работы и неизвестных исходов. Эти budget и use-only сценарии пока разрабатываются и не должны считаться действующей защитой.",
        ] },
        { heading: "Что проверять сейчас", paragraphs: [
          "Смотрите точную identity возможности, целевой компьютер, наблюдаемые configured и initialized состояния, решение allow/ask/deny в chat и результат небольшого реального вызова. Если что-то неизвестно, оставляйте статус неизвестным. Зелёная карточка каталога не равна успешному использованию.",
          "Для локального MCP отдельно проверяйте machine helper, transport, provider plugin и hooks приложения. Связь с relay не доказывает, что stdio server запустился в Cursor или что сессия Codex подхватила новые доверенные hooks.",
        ] },
      ],
      screenshotCaption: "Демо-экран использования и возможностей. Инструмент в списке не доказывает его вызов Task.",
      closing: "Хороший governance показывает разницу между желаемым правилом и фактически применённым состоянием до того, как Task начнёт зависеть от инструмента.",
    },
  },
];

export function getArticle(slug: string) {
  return articles.find(article => article.slug === slug);
}
