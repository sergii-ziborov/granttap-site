import { composeStory } from "./compose";

const sources = [
  { label: "GrantTap Project Governance implementation and coverage", url: "https://github.com/sergii-ziborov/granttap-mcp#project-governance" },
  { label: "GrantTap security model", url: "/security" },
  { label: "GrantTap capability lifecycle", url: "/blog/mcp-skills-and-governance-status" },
  { label: "GrantTap approval boundary analysis", url: "/blog/agent-approvals-at-the-execution-boundary" },
];

export const granttapMeshGovernance = composeStory({
  slug: "granttap-mesh-governance-allow-ask-deny-local-agents",
  date: "2026-10-05",
  cover: "/blog/granttap-mesh-governance-allow-ask-deny-local-agents-cover.webp",
  inlineIllustration: "/blog/granttap-mesh-governance-allow-ask-deny-local-agents-a.webp",
  additionalIllustration: "/blog/granttap-mesh-governance-allow-ask-deny-local-agents-b.webp",
  screenshot: "/product/iphone-governance.png",
  en: {
    title: "GrantTap Mesh Governance: allow, ask, and deny for local coding agents",
    summary: "How Project policy reaches each computer, what coverage means, and how to verify a rule before trusting it with a real Task.",
    category: "GrantTap guide",
    screenshotCaption: "Actual GrantTap Project Governance interface with deterministic sample rules. The screenshot shows product layout, not a live denial on your computer.",
    illustrationCaption: "Original generated concept of allow, ask, and deny routes to a local computer; not a screenshot or exact implementation diagram.",
    additionalIllustrationCaption: "Original generated concept separating discovered, permitted, and observed tools; not real telemetry.",
    closing: "A useful governance view tells you which rule you wanted, which revision the host applied, and what happened to the actual call.",
    sources,
    body: `Coding agents are valuable because they can read, edit, run tools, and continue work while a person is elsewhere. Those same abilities need explicit boundaries. GrantTap Mesh Governance gives a Project policy for supported local agents, with allow, ask, or deny decisions for capabilities. The policy is authored on iPhone, delivered to the computers in that Project, and reported back with enforcement coverage. It is designed to make one person's everyday coding work more legible, not to imitate an enterprise identity platform.

The first distinction is between a Project and a Task. A Project is the scope that binds repositories, computers, people, rules, and work. A Task is the stable user-visible objective; it can continue through more than one provider-native Execution. GrantTap Project Governance is decided per Project, not per Task. Separate personal approval modes can narrow later actions for an exact Task where a provider offers a deterministic local hook. Keeping the two levels separate prevents a user from believing that a temporary task choice silently rewrote the whole Project's policy.

## Name the capability precisely

GrantTap's Project rules cover kinds such as skills, MCP servers, shell and scripts, file writes, deployment, and network actions. A rule can name a particular capability rather than every member of a kind. For shell work, the runtime fingerprints a command such as 'git', 'rm', or 'npm'; it can identify a deploy or network action by a more specific phrase such as 'git push' or 'curl'. This lets a Project ask about one command while allowing routine work elsewhere. A named rule wins over its kind, and a global provider deny wins over the Project.

Precision matters because a friendly label is rarely enough to review an action. An MCP server may have an endpoint and credential; a skill may run a script; a shell command may carry an irreversible target. The rule is useful only if its identity matches the action the host will evaluate. If the command changes or a server bundle is replaced, revisit the decision. The [capability lifecycle guide](/blog/mcp-skills-and-governance-status) separates discovery from request, approval, initialization, and observed use; this article focuses on how the Project policy reaches the enforcing computer.

## Follow policy from phone to computer

The user writes Project policy on the phone. GrantTap sends an encrypted packet through the relay to every computer belonging to that Project. A sleeping computer may collect the packet when it returns. Each host applies the policy through the separately distributed GrantTap Engine and reports the revision it actually enforces. The phone should display that host receipt, not merely the fact that it sent a packet. If one host has an older revision, the Project is not uniformly updated, even though the editing screen on the phone looks complete.

A host can also reject an edit because its revision changed, its Engine is unavailable, or the proposed policy is invalid. The runtime reports the reason and the revision still held by the computer, allowing the phone to preserve the edit and offer a retry against current state. This is operationally important. A silent refusal would leave the user thinking a deny is active while the computer holds another rule. A stale policy revision is therefore not a cosmetic sync problem; it directly changes which actions may run.

## Read coverage, not just the chosen effect

GrantTap reports coverage per capability kind as enforced, observed only, unsupported, or unknown. Enforced means a supported route reached the local decision point. Observed only means the system saw some activity but did not deterministically block that path. Unsupported means the integration does not offer that control. Unknown means the product lacks enough evidence to make a stronger statement. A rule set to deny on the phone does not turn observed-only into enforced. That would confuse intent with mechanism.

The distinction also depends on provider. Claude Code and Codex are the primary local control and continuation paths. Cursor offers Task visibility and supported local controls with narrower coverage. Grok Build can be observable where its installed runtime exposes events, but it does not thereby gain a trusted hook for all agent-authored Mesh events or remote blocking. The [provider comparison](/blog/coding-agents-on-your-phone-2026) gives the scope behind each name. A single Project can therefore have different effective coverage across computers and providers.

## Test one rule safely

Before using Governance for a sensitive repository, create one dedicated GrantTap test Task in a disposable checkout. Configure a harmless named denial, such as a chosen shell command that cannot damage important files. Wait for the target computer to acknowledge the policy revision and show enforced coverage for that action. Then ask the supported agent to attempt it. Check for the refusal in the provider transcript and the host timeline. A denial should name the rule and reason, and the protected side effect should not have occurred.

Now try a harmless allowed action. Approval to run does not prove successful completion. Inspect the tool result and relevant repository state. Repeat after restarting the coding app, changing the policy, or updating the provider. If the denial disappears while the phone still shows it, the defect is in enforcement or status reporting. If the denial works but the phone presents a stale result, the defect is in presentation or delivery. Keeping those cases distinct accelerates debugging and prevents a status color from standing in for evidence.

## Keep requests and usage separate

A configured MCP server is not necessarily usable. A Project may allow a capability that no host has initialized. A host may initialize a capability that the Task never calls. A provider transcript can report an invocation while resource use remains unknown because no unique process tree was sampled. GrantTap derives usage from native provider transcripts and local operating-system samples rather than asking an agent to write its own resource report. It labels estimates separately from provider-reported tokens and leaves ambiguous measurements unknown.

The same caution applies to code changes. The runtime can record an edit-tool request as intent and a provider-reported outcome as a call result; it does not yet claim a verified filesystem-change event from those signals alone. A screenshot of Project Governance, like the real one in this story, demonstrates an interface, not an audit of your production repository. The [usage evidence article](/blog/what-agent-usage-metrics-can-prove) explains why action evidence, result evidence, and resource numbers need different labels.

## Decide what happens when devices disconnect

The phone is a convenient place to make a human decision, but the coding action runs on a computer. When the phone is offline, a request cannot simply assume approval. When the computer is asleep, the app may hold encrypted messages without proving enforcement. When a provider route lacks a deterministic hook, a GrantTap UI toggle cannot stop the native action. Check the effective fallback and the host's last applied revision while designing a workflow. The [approval boundary analysis](/blog/agent-approvals-at-the-execution-boundary) shows how to locate the real enforcement point.

Also distinguish policy from a device link. Pairing a phone grants it a trusted connection to a computer; inviting someone into a Project Mesh grants separately scoped collaboration access. A person may have a Task view without authority over every repository or device. The owner's phone checks member and Project grants before forwarding protected Project data or actions. A linked Project or shared label does not merge permissions. This separation makes “who may see,” “who may decide,” and “what the host will run” answerable questions.

## A practical governance review

For each Project, list the computers, primary providers, sensitive capabilities, and exact rule identities. Mark the selected allow, ask, or deny effect. Then record each host's policy revision and coverage. Run one allowed and one denied harmless call through each supported integration you rely on, preserving the host-side result. Where the answer is observed only or unknown, keep it visible and adjust the workflow. A phone can improve decisions only when its view stays faithful to the computers doing the work.

GrantTap's promise is therefore specific: make supported local agent work understandable and controllable where the runtime has a real hook, and make the gaps legible elsewhere. Start with the [Project Mesh overview](/project-mesh), then follow the [setup guide](/blog/control-claude-code-codex-iphone-granttap) to pair a computer and inspect a first Task. If you need a corporate tenant policy for all agents, evaluate that as a separate layer. If you need to protect one local repository today, begin with an exact capability, a host acknowledgment, and a reproducible denial.`,
  },
  ru: {
    title: "GrantTap Mesh Governance: allow, ask и deny для локальных coding-агентов",
    summary: "Как policy Project доходит до компьютеров, что означает coverage и как проверить правило до работы с реальной Task.",
    category: "Руководство GrantTap",
    screenshotCaption: "Настоящий интерфейс Project Governance GrantTap с детерминированными тестовыми правилами. Скриншот показывает продукт, но не живой отказ на вашем компьютере.",
    illustrationCaption: "Оригинальный сгенерированный образ маршрутов allow, ask и deny к локальному компьютеру; это не скриншот и не точная схема реализации.",
    additionalIllustrationCaption: "Оригинальный сгенерированный образ разделения обнаруженных, разрешённых и наблюдаемых инструментов; это не реальная телеметрия.",
    closing: "Полезный экран governance показывает желаемое правило, применённую ревизию host и фактический исход вызова.",
    sources,
    body: `Coding-агенты полезны тем, что читают код, вносят правки, запускают инструменты и продолжают работу, когда человек отошёл. Именно эти способности требуют ясных границ. GrantTap Mesh Governance даёт policy Project для поддерживаемых локальных агентов с решениями allow, ask или deny для capabilities. Правило создаётся на iPhone, доставляется компьютерам Project и возвращается с данными об enforcement coverage. Оно делает повседневную персональную coding-работу понятнее и не пытается подменить корпоративную identity platform.

Первое различие — Project и Task. Project связывает репозитории, компьютеры, людей, правила и работу. Task — стабильная видимая пользователю цель, которая может пройти через несколько provider-native Executions. Project Governance в GrantTap задаётся для всего Project, не отдельно для каждой Task. Персональные approval modes способны сузить поздние действия точной Task, если провайдер даёт детерминированный локальный hook. Разделение уровней не позволяет человеку думать, что временный выбор для задачи незаметно переписал policy всего Project.

## Назовите capability точно

Правила GrantTap покрывают такие типы, как skills, MCP servers, shell и scripts, file writes, deploy и network. Правило можно привязать к конкретной capability, а не ко всему типу. Для shell runtime определяет команду, например 'git', 'rm' или 'npm'; deploy и network action могут распознаваться по более точной фразе, например 'git push' или 'curl'. Так Project может спрашивать разрешение на одну команду и оставить обычную работу доступной. Именованное правило сильнее общего правила типа, а глобальный deny провайдера сильнее Project.

Точность нужна потому, что дружелюбной подписи мало для review. MCP server может иметь endpoint и credential, skill может запускать script, shell-команда — менять необратимую цель. Правило полезно, только если его identity совпадает с действием, которое будет оценивать host. При изменении команды или замене server bundle решение нужно пересмотреть. [Гид по жизненному циклу capability](/blog/mcp-skills-and-governance-status) разделяет обнаружение, запрос, одобрение, инициализацию и фактическое использование; здесь мы следим за доставкой policy Project до компьютера.

## Проследите путь правила с телефона на host

Пользователь создаёт Project policy на телефоне. GrantTap отправляет зашифрованный пакет через relay компьютерам этого Project. Спящий компьютер может получить пакет при возвращении. Каждый host применяет правило через отдельно распространяемый GrantTap Engine и сообщает ревизию, которую реально исполняет. Телефон должен показывать этот receipt, а не просто факт отправки. Если один host держит старую ревизию, Project обновлён неравномерно, даже когда экран редактирования кажется завершённым.

Host может отклонить правку, если его ревизия изменилась, Engine недоступен или policy некорректна. Runtime сообщает причину и ревизию, остающуюся на компьютере; телефон может сохранить изменение и предложить повторить его поверх текущего состояния. Это практический вопрос, а не косметика. Молчаливый отказ заставил бы пользователя считать deny активным, пока компьютер исполняет другое правило. Устаревшая ревизия прямо влияет на то, какие действия смогут выполняться.

## Читайте coverage, а не только выбранный эффект

GrantTap сообщает статус каждого типа capability: enforced, observed only, unsupported или unknown. Enforced означает, что поддерживаемый маршрут дошёл до локальной точки решения. Observed only означает, что система видела часть активности, но не могла детерминированно остановить путь. Unsupported — интеграция не предоставляет такой контроль. Unknown — доказательств для более сильного вывода нет. Настройка deny на телефоне не превращает observed-only в enforced. Иначе намерение пользователя путали бы с работающим механизмом.

Результат зависит и от провайдера. Claude Code и Codex — основные локальные пути контроля и продолжения. Cursor даёт видимость Task и часть локальных controls с более узким coverage. Grok Build наблюдаем там, где его установленный runtime раскрывает события, но это само по себе не даёт trusted hook для всех agent-authored Mesh events или удалённой блокировки. [Сравнение провайдеров](/blog/coding-agents-on-your-phone-2026) поясняет ограничения каждого имени. Поэтому даже один Project может иметь разное действующее покрытие на разных компьютерах и инструментах.

## Безопасно проверьте одно правило

Перед работой с чувствительным репозиторием создайте одну выделенную GrantTap test Task в экспериментальном checkout. Настройте безвредный именованный deny, например для выбранной shell-команды, которая не повредит важные файлы. Дождитесь, пока целевой компьютер подтвердит ревизию policy и покажет enforced coverage. Затем попросите поддерживаемого агента попытаться выполнить её. Найдите отказ в транскрипте провайдера и timeline host. Отказ должен назвать правило и причину, а защищённый побочный эффект не должен наступить.

Теперь попробуйте безвредное разрешённое действие. Право на запуск не доказывает успешное завершение. Проверьте ответ инструмента и состояние репозитория. Повторите после перезапуска coding app, изменения policy или обновления провайдера. Если deny перестал работать, хотя телефон его показывает, дефект в enforcement или статусе. Если запрет действует, но экран даёт устаревший ответ, дефект в представлении или доставке. Такое разделение ускоряет исправление и не позволяет цвету карточки подменить evidence.

## Не смешивайте запрос и usage

Настроенный MCP server не обязательно доступен к использованию. Project может разрешать capability, которую ни один host не инициализировал. Host может инициализировать инструмент, к которому Task ни разу не обратилась. Транскрипт провайдера способен сообщить Invocation, пока расход ресурсов остаётся неизвестным из-за отсутствия уникального замера процесса. GrantTap получает usage из native transcripts и локальных данных операционной системы, а не просит агента сочинить отчёт. Оценки помечаются отдельно от provider-reported tokens; неоднозначные измерения остаются unknown.

Та же осторожность относится к коду. Runtime записывает edit-tool request как намерение, а сообщённый провайдером итог как результат вызова; эти сигналы пока не объявляются verified filesystem-change event. Скриншот Project Governance, как настоящий экран в этой статье, показывает интерфейс, а не аудит вашего production-репозитория. [Разбор usage evidence](/blog/what-agent-usage-metrics-can-prove) объясняет, почему факты действия, результата и расхода требуют разных подписей.

## Продумайте потерю связи между устройствами

На телефоне удобно принять решение, но coding-действие выполняется на компьютере. При отключённом телефоне запрос не должен автоматически считаться одобренным. Если компьютер спит, приложение может держать зашифрованные сообщения, не доказав применение policy. Если у провайдера нет детерминированного hook для маршрута, переключатель GrantTap не остановит native action. При проектировании сценария проверьте fallback и последнюю применённую host ревизию. [Анализ границ approval](/blog/agent-approvals-at-the-execution-boundary) помогает найти настоящую точку исполнения.

Отличайте policy от связи устройств. Pairing телефона создаёт доверенное соединение с компьютером; приглашение человека в Project Mesh отдельно выдаёт ограниченный доступ к совместной работе. Участник может видеть Task, не получая права на каждый репозиторий или устройство. Телефон владельца проверяет grants участника и Project до пересылки защищённых данных либо действий. Связанный Project и одинаковая подпись не объединяют разрешения. Так на вопросы «кто видит», «кто решает» и «что запустит host» можно ответить независимо.

## Практический review Governance

Для каждого Project перечислите компьютеры, основных провайдеров, чувствительные capabilities и точные identities правил. Укажите выбранные allow, ask либо deny. Затем запишите ревизии policy и coverage каждого host. Пропустите одно разрешённое и одно запрещённое безвредное действие через каждую поддерживаемую интеграцию, которой собираетесь пользоваться, и сохраните ответ host. Если ответ observed only или unknown, оставьте это видимым и измените процесс. Телефон улучшает решение только тогда, когда его картина соответствует компьютерам, выполняющим работу.

Обещание GrantTap конкретно: сделать поддерживаемую локальную работу агентов понятной и управляемой там, где у runtime есть настоящий hook, а в остальных местах показать границу. Начните с [обзора Project Mesh](/project-mesh), затем по [инструкции подключения](/blog/control-claude-code-codex-iphone-granttap) привяжите компьютер и откройте первую Task. Если вам нужна tenant-wide policy для всей организации, оцените её отдельным уровнем. Если сегодня нужно защитить один локальный репозиторий, начните с точной capability, подтверждения host и воспроизводимого отказа.`,
  },
});
