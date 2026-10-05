import { composeStory } from "./compose";

const sources = [
  { label: "Claude Code Remote Control: resume and connected devices", url: "https://code.claude.com/docs/en/remote-control" },
  { label: "OpenAI: Codex from anywhere", url: "https://openai.com/index/work-with-codex-from-anywhere/" },
  { label: "Cursor for iOS: move between devices", url: "https://cursor.com/docs/cloud-agent/mobile" },
  { label: "GrantTap task handoff", url: "https://github.com/sergii-ziborov/granttap-mcp#project-mesh-and-task-handoff" },
];

export const taskHandoffPaths = composeStory({
  slug: "task-continuity-beyond-an-agent-session",
  date: "2026-10-04",
  cover: "/blog/task-handoff-paths.webp",
  inlineIllustration: "/blog/task-continuity-beyond-an-agent-session-a.webp",
  additionalIllustration: "/blog/task-continuity-beyond-an-agent-session-b.webp",
  screenshot: "/product/iphone-handoff.png",
  en: {
    title: "A task can outlive an agent session. Here is what must travel with it",
    summary: "Session resume, cloud handoff, and a cross-provider Task solve different continuity problems.",
    category: "Continuity",
    screenshotCaption: "GrantTap handoff screen with deterministic sample data. It illustrates the product flow, not a guaranteed transfer of private provider state.",
    illustrationCaption: "AI-generated continuity thread across computers; it does not show a real session migration.",
    additionalIllustrationCaption: "AI-generated evidence packet for a handoff, with no real private conversation content.",
    closing: "A good handoff preserves the objective, relevant evidence, and open questions while stating plainly which session state cannot move.",
    sources,
    graphic: { title: "Handoff packet", caption: "Check these fields before another execution begins.", rows: [
      { label: "Goal", detail: "What is the human trying to finish?" },
      { label: "Repository", detail: "Which checkout and revision?" },
      { label: "Evidence", detail: "What changed, ran, and passed?" },
      { label: "Decision", detail: "Which approvals and constraints remain?" },
      { label: "Unknown", detail: "What must be rediscovered?" },
    ] },
    body: `“Continue this task” may mean several different things. It can reopen the same provider session, connect a phone to a local process, move a cloud agent between devices, or start a new agent with a summary of earlier work. These paths preserve different kinds of state. A transcript can survive while a process has stopped. A cloud worker can stay alive while the local checkout has moved. A new provider can read a concise handoff yet know nothing about hidden context inside the old provider's session. The user's goal is the only stable anchor across all of those changes.

Claude Code, Codex, and Cursor document substantial continuity features inside their respective products. Claude Remote Control explains how server sessions can be resumed and how connected devices see conversation changes. OpenAI describes live Codex state from connected machines. Cursor for iOS describes moving between desktop, web, mobile, cloud workers, and Remote Control. Those are valuable native routes. GrantTap instead models a Task as the durable user-visible unit and an Execution as one provider-native attempt at it. This article examines what a careful handoff should preserve and what it must admit is missing. We checked vendor documentation on October 3, 2026.

## Separate the objective from the conversation

The objective might be “make the failing payment test pass without changing the public API.” A provider conversation may contain many experiments, false starts, and tool outputs that matter only temporarily. If the conversation is the sole identity of the work, changing a provider or computer can make the user reconstruct the objective from hundreds of messages. A Task should instead hold a short human-readable goal, the project it belongs to, and the latest verified state. The transcript remains useful evidence, but it is not the identity of the work.

This distinction matters even when you stay with one vendor. Claude's Remote Control guide says connected devices can see the local conversation, with specific behavior for commands such as clearing or resuming a conversation. Cursor's mobile documentation says agents started on mobile appear on desktop and web; local IDE work can be moved or remotely directed through its supported paths. Codex exposes connected threads and project context through its mobile preview. These features make returning to a native session easier. They do not imply that a new, unrelated provider will automatically inherit private reasoning, permission mode, installed tools, or the exact state of a working tree.

## Identify the repository and revision

A file path is not enough to identify the work. Two computers may have folders with the same project name but different branches, dependencies, or uncommitted changes. A cloud agent may use a worker checkout while the developer's laptop remains on an earlier commit. Before a handoff, record the repository identity, branch or worktree, current revision, and whether changes are committed. If there are uncommitted edits, say where they live. Without those facts, a new execution could produce a plausible answer against the wrong code and still appear to “continue.”

GrantTap's project and Task boundaries help organize that record, but the destination provider still needs actual repository access and compatible tools. A linked project does not merge repository permissions or silently copy files. The person approving the transition should inspect the target computer and checkout. A handoff packet should avoid secrets and raw prompt archives unless they are specifically required and safe to transfer. It should instead carry concise file references, commands run, test outcomes, and unresolved questions. A destination that cannot access the named revision should stop and report that limitation before making a new change.

## Preserve decisions and constraints

Agent work accumulates human decisions: a rejected approach, a chosen API contract, a deadline, a prohibited command, or an approval limited to one action. These are easy to lose when a conversation is summarized as “continue implementation.” Put durable decisions in the handoff in plain language. Separate a decision that applies to the whole Task from a permission granted to a single execution. A one-time approval should not become a general authorization for a different provider. Likewise, a global capability deny on a computer should still govern any new execution there.

The receiving agent needs to know what is verified and what is only asserted. “Tests passed” is too vague; name the command, the revision, the time, and the environment where it ran. “Deployment complete” should include the destination and an independent check, if one exists. If the earlier provider reported a result but no host confirmation arrived, label it unconfirmed. This does not make the handoff verbose for its own sake. It prevents a new execution from treating a fluent summary as evidence and building on a false premise.

## Resume, migrate, or restart deliberately

If you want the same conversation and the same local tools, native session resume or Remote Control may be the shortest route. Claude's guide describes resuming server sessions after stopping the server under documented conditions. Cursor describes moving cloud work between mobile and desktop and a separate Remote Control route for a personal machine. Codex's connected mobile state serves a Codex-native workflow. Before using any of these, check current product prerequisites and which component stays online. Do not call a view on another device a cross-provider migration simply because the phone now displays it.

If the original environment is gone or the work should move to a different provider, start a new execution with the handoff packet. Expect that it will need to read code and perhaps rerun tests. GrantTap can keep the Task visible across supported executions and show the transition; it does not transplant opaque model state. The new execution should acknowledge the goal, verify repository access, and state what it learned from the packet versus what it discovered independently. That honest restart often produces a safer result than pretending that every hidden context token survived.

## Test continuity with a controlled interruption

Choose a harmless repository task with a small pending change. Start it in one supported provider, record the revision and a failed test, then interrupt the session. Try first to resume it natively from a phone. Note which conversation, diff, tool results, and approvals are visible. Next, hand the objective to a second execution or computer if your workflow calls for that. Compare its initial context with the handoff packet and ask it to identify missing information before it edits anything. Finally, rerun the test and inspect the checkout.

The GrantTap screenshot below is a deterministic demonstration of its handoff interface. It is not evidence that a particular provider copied a hidden transcript or passed a real test. An honest continuity claim is measurable: the next execution can name the right goal and repository, respect prior constraints, distinguish confirmed from unconfirmed work, and proceed from an explicit revision. If any item is missing, the UI should make the gap visible. Continuity is not the absence of interruption; it is the ability to recover without inventing state.`,
  },
  ru: {
    title: "Task живёт дольше сессии агента: что должно перейти вместе с ней",
    summary: "Возобновление сессии, облачный handoff и Task между провайдерами решают разные задачи преемственности.",
    category: "Преемственность",
    screenshotCaption: "Экран handoff в GrantTap с детерминированными тестовыми данными. Он показывает сценарий продукта, а не гарантированный перенос закрытого состояния провайдера.",
    illustrationCaption: "Сгенерированная нить преемственности между компьютерами; это не изображение реальной миграции сессии.",
    additionalIllustrationCaption: "Сгенерированный пакет evidence для handoff без содержимого частного разговора.",
    closing: "Хороший handoff сохраняет цель, значимые свидетельства и открытые вопросы, прямо называя состояние сессии, которое перенести нельзя.",
    sources,
    graphic: { title: "Пакет handoff", caption: "Проверьте эти поля перед новым execution.", rows: [
      { label: "Цель", detail: "Что человек хочет закончить?" },
      { label: "Репозиторий", detail: "Какой checkout и revision?" },
      { label: "Evidence", detail: "Что изменилось, запускалось и прошло?" },
      { label: "Решение", detail: "Какие ограничения и approvals остаются?" },
      { label: "Неизвестное", detail: "Что нужно выяснить заново?" },
    ] },
    body: `Фраза «продолжить эту задачу» может означать разное. Иногда нужно открыть ту же сессию провайдера, подключить телефон к локальному процессу, перенести облачного агента между устройствами или запустить нового агента с кратким описанием прежней работы. Каждый маршрут сохраняет разные виды состояния. Транскрипт может остаться после остановки процесса. Облачный работник может работать, пока локальный checkout уже изменился. Новый провайдер способен прочесть handoff, но не знает скрытого контекста старой сессии. Цель пользователя — единственный устойчивый ориентир при всех этих переходах.

Claude Code, Codex и Cursor документируют серьёзные механизмы преемственности внутри своих продуктов. Claude Remote Control объясняет возобновление серверных сессий и отображение изменений на подключённых устройствах. OpenAI описывает живое состояние Codex с подключённых компьютеров. Cursor для iOS описывает переходы между desktop, web, mobile, cloud workers и Remote Control. Эти нативные пути полезны. GrantTap рассматривает Task как устойчивую видимую единицу, а Execution — как одну попытку исполнения у провайдера. Ниже разберём, что аккуратный handoff обязан сохранить и чего он не может обещать. Документы провайдеров сверены 3 октября 2026 года.

## Отделите цель от разговора

Целью может быть «починить упавший тест платежей, не меняя публичный API». Разговор с провайдером содержит множество проб, тупиков и выводов инструментов, значимых лишь временно. Если личностью работы считать только разговор, после смены провайдера или компьютера человеку придётся искать цель среди сотен сообщений. Task должна хранить краткую понятную цель, проект и последнее проверенное состояние. Транскрипт остаётся ценным evidence, но не становится идентичностью работы. Такой подход позволяет понять, что именно следует продолжать, даже когда старую сессию технически открыть невозможно.

Разделение полезно и внутри одного вендора. Руководство Claude Remote Control говорит, что подключённые устройства видят локальный разговор, и отдельно описывает поведение при очистке или переключении разговора. Документация Cursor указывает, что агенты, начатые на телефоне, появляются на компьютере и вебе; локальную работу можно перенести или направлять удалённо через поддерживаемые маршруты. Codex показывает подключённые threads и контекст проекта в мобильной предварительной версии. Всё это облегчает возврат к нативной сессии. Но новый сторонний провайдер не получает автоматически закрытые рассуждения, режим разрешений, установленные инструменты или точное состояние рабочей копии.

## Укажите репозиторий и revision

Одного пути к папке недостаточно для идентификации работы. На двух компьютерах могут быть каталоги с одинаковым именем, но разными ветками, зависимостями и незакоммиченными правками. Облачный агент может работать в своей копии, пока ноутбук разработчика остаётся на предыдущем коммите. Перед handoff запишите идентичность репозитория, ветку или worktree, текущую revision и состояние коммитов. Если есть локальные правки, назовите место, где они находятся. Без таких фактов новый execution может убедительно отвечать по неправильному коду и всё равно выглядеть как «продолжение».

Границы Project и Task в GrantTap помогают организовать запись, но целевому провайдеру всё ещё нужны фактический доступ к репозиторию и совместимые инструменты. Привязанный проект не объединяет права на репозитории и незаметно не копирует файлы. Человеку, принимающему переход, следует проверить целевой компьютер и checkout. Пакет handoff не должен переносить секреты и полные архивы prompts без особой необходимости. Лучше включить краткие ссылки на файлы, выполненные команды, результаты тестов и нерешённые вопросы. Если целевая машина не видит нужную revision, она должна остановиться и сообщить об этом до новой правки.

## Сохраняйте решения и ограничения

По мере работы копятся решения человека: отвергнутый подход, выбранный контракт API, срок, запрещённая команда или approval на одно действие. Они легко теряются, если пересказать всё словами «продолжи реализацию». Запишите устойчивые решения в handoff простым языком. Различайте решение для всей Task и разрешение, выданное одному execution. Разовое approval не превращается в широкое полномочие для другого провайдера. Равным образом глобальный запрет возможности на компьютере должен действовать и при новом execution на нём, независимо от того, кто запустил агента.

Принимающему агенту нужно понимать, что проверено, а что только заявлено. «Тесты прошли» слишком расплывчато: укажите команду, revision, время и среду запуска. «Развёртывание завершено» должно содержать назначение и независимую проверку, если она есть. Если прежний провайдер сообщил результат, но подтверждения хоста не поступило, пометьте его неподтверждённым. Это не многословие ради многословия. Так новый execution не примет гладкий пересказ за evidence и не начнёт работу на ошибочном предположении.

## Осознанно возобновляйте, переносите или начинайте заново

Когда нужен тот же разговор и те же локальные инструменты, нативное возобновление или Remote Control может быть самым коротким путём. Руководство Claude описывает возобновление серверных сессий после остановки при оговорённых условиях. Cursor описывает перемещение облачной работы между телефоном и компьютером и отдельный Remote Control для личной машины. Подключённое мобильное состояние Codex обслуживает нативный процесс Codex. Перед использованием проверяйте актуальные требования продукта и компонент, который должен оставаться online. Не называйте просмотр той же сессии на другом устройстве миграцией между провайдерами только потому, что она теперь видна на телефоне.

Если исходная среда исчезла или работа должна перейти к другому провайдеру, запустите новый execution с пакетом handoff. Будьте готовы заново читать код и повторять тесты. GrantTap сохраняет Task видимой между поддерживаемыми executions и показывает переход; закрытое состояние модели он не пересаживает. Новый execution должен подтвердить цель, проверить доступ к репозиторию и назвать, какие факты взяты из пакета, а какие получены независимо. Такой честный новый старт часто безопаснее притворства, будто каждый скрытый токен контекста каким-то образом сохранился.

## Проверьте преемственность управляемым прерыванием

Выберите безвредную задачу в репозитории с небольшой ожидающей правкой. Начните у одного поддерживаемого провайдера, запишите revision и упавший тест, затем прервите сессию. Сначала попробуйте возобновить её нативно с телефона. Отметьте, какие разговоры, diff, результаты инструментов и approvals доступны. Затем, если ваш процесс требует, передайте цель другому execution или компьютеру. Сравните его исходный контекст с пакетом handoff и попросите перечислить неизвестное до редактирования файлов. В конце повторите тест и проверьте рабочую копию.

Скриншот GrantTap ниже — детерминированная демонстрация интерфейса handoff. Он не доказывает копирование закрытого транскрипта провайдера или прохождение реального теста. Честное заявление о преемственности можно проверить: следующий execution называет правильную цель и репозиторий, соблюдает прежние ограничения, отличает подтверждённое от неподтверждённого и работает от явно указанной revision. Если элемента нет, интерфейс должен показать пробел. Преемственность означает не отсутствие прерываний, а способность восстановиться без выдуманного состояния.

Особенно внимательно проверяйте момент, когда две сессии одновременно продолжают одну Task. У них могут разойтись ветки, решения и ожидания пользователя. Перед параллельной работой выделите разные checkout или worktree и назначьте, кто отвечает за итоговое объединение. Handoff не должен стирать историю предыдущего execution: человек должен видеть, какая попытка дала патч, какая только исследовала проблему, а какая завершилась ошибкой. Если новая сессия исправила старую правку, запишите эту связь явно. Тогда позднее ревью сможет восстановить последовательность решений, не приписывая все изменения одному агенту.`,
  },
});
