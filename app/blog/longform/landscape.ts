import type { ArticleExtension } from "./types";

export const landscapeExtension: ArticleExtension = {
  images: { first: "/blog/coding-agents-on-your-phone-2026-a.webp", second: "/blog/coding-agents-on-your-phone-2026-b.webp" },
  en: {
    firstCaption: "Generated comparison of different mobile execution paths. It is conceptual and does not reproduce provider interfaces.",
    secondCaption: "Generated editorial illustration of workflow choices. The paths are not a feature ranking or live availability chart.",
    sections: [
      { heading: "Start with where work runs", paragraphs: [
        "‘Use an agent from a phone’ can describe very different systems. The phone might control a session on your computer, view a session hosted elsewhere, or start a cloud agent whose tools reach back to a local machine. Those differences affect what happens when your laptop sleeps, which service receives context, and where an approval must be enforced. A comparison based only on mobile screenshots misses the operating boundary that determines the user experience.",
        "The provider documentation linked below is the right place to check current eligibility, plan conditions, and setup details. This article was checked on October 3, 2026, so it should be read as a dated comparison rather than a permanent price or capability matrix. A native app can change quickly. The durable method is to ask the same execution, authority, and continuity questions of each option before moving real work.",
      ] },
      { heading: "Claude Code's remote session", paragraphs: [
        "Claude Code Remote Control connects a remote client to work associated with a local Claude Code process. The local environment remains relevant: its availability and session state affect what the person can do from the phone. This is attractive when the developer already works primarily in Claude Code and wants the provider's native presentation. The documentation describes the supported account and connection path; verify those requirements before relying on a commute-time workflow.",
        "The important question is not whether the client has a polished chat view. Ask what happens if the computer sleeps, which approvals can be handled remotely, and whether the session can continue when the local process disappears. Do not infer cross-provider Task identity from a Claude-native session. GrantTap can coordinate a broader human-visible Task, but it does not make Claude's own remote semantics disappear or expand them beyond documented behavior.",
      ] },
      { heading: "Codex's connected work", paragraphs: [
        "OpenAI describes Codex mobile access as a preview with live state from connected machines, threads, approvals, and project context. For someone already invested in Codex, that native route can be the most direct way to inspect work. Preview status matters: availability and exact behavior may evolve. Treat the provider announcement as a snapshot and check its current product documentation for the setup used by your account.",
        "A connected thread is still a provider-native concept. If the same human objective later moves to another coding provider, someone must preserve the decision trail and repository context explicitly. That is the coordination problem GrantTap addresses. It should complement the provider's native review and approval surfaces, not imply that those surfaces are missing or that a cross-provider handoff copies hidden session reasoning.",
      ] },
      { heading: "Cursor's cloud and local routes", paragraphs: [
        "Cursor for iOS offers cloud agents and a Remote Control route. Its documentation says the agent loop can run in Cursor's cloud while tools execute on a connected computer. That is a meaningful architectural difference from a simple screen-share or terminal mirror. It affects which component must stay online and where parts of the conversation or state are held. If local tools are required, inspect the computer's availability as well as the mobile app's connectivity.",
        "Cursor is a substantial native choice, especially for a workflow already centered on its editor and cloud agents. GrantTap marks its Cursor integration Beta because its implemented coverage differs from the primary Claude Code and Codex paths. A fair comparison must keep those caveats visible. A feature in Cursor's own iOS app is not automatically a feature in GrantTap's Cursor integration, and the reverse is also true.",
      ] },
      { heading: "Compare approvals and evidence", paragraphs: [
        "A mobile approval is meaningful only if it reaches the process that performs the action under a rule that process enforces. Ask each product where the tool action happens, which computer or cloud worker applies the decision, and what evidence remains afterward. A status saying ‘approved’ is not a record that a command ran successfully. A delivered message is not a tested code change. These distinctions matter more than the number of buttons shown on a phone.",
        "Also inspect the repository boundary. If an agent moves between a laptop and desktop, are the checkouts at the same revision? Can the client identify the intended project without guessing from similar folder names? Does it show unknowns when the destination is offline? Provider-native products solve some of these questions within their own systems. A cross-provider controller has to name the gaps between them rather than flatten every state into one generic session.",
      ] },
      { heading: "Choose from your actual workflow", paragraphs: [
        "Try a small representative Task rather than choosing from a checklist alone. Start it where you normally code, step away, and attempt to inspect, decide, and verify from the phone. Note when the computer needs to remain awake, where model context goes, whether an approval is enforced, and how you confirm the result. Repeat the trial for the second provider only if your work genuinely uses it. This yields a better comparison than a theoretical ranking.",
        "The generated images above deliberately avoid provider branding or fake screenshots. The GrantTap capture below shows deterministic example Tasks, not the Claude, Codex, or Cursor mobile apps. The source links let you inspect each provider's own description. For a single-provider workflow, its native app may be sufficient. For work spanning supported local executions, GrantTap's Task view can add continuity and policy context, subject to the stated limits of each integration.",
      ] },
    ],
  },
  ru: {
    firstCaption: "Сгенерированное сравнение мобильных путей исполнения. Это концепция, а не копия интерфейсов провайдеров.",
    secondCaption: "Сгенерированная иллюстрация вариантов процесса. Пути не являются рейтингом функций или живой таблицей доступности.",
    sections: [
      { heading: "Сначала выясните место исполнения", paragraphs: [
        "Фраза «работать с агентом через телефон» может описывать совершенно разные системы. Телефон управляет сессией на вашем компьютере, показывает работу на удалённом сервере или запускает облачного агента, чьи инструменты обращаются к локальной машине. От этого зависит, что случится при сне ноутбука, какой сервис получит контекст и где должен применяться approval. Сравнение только по мобильным скриншотам упускает границу исполнения, от которой зависит сценарий.",
        "Условия аккаунта, тарифов и настройки лучше проверять по документации самих провайдеров ниже. Этот разбор проверен 3 октября 2026 года и не претендует на вечную таблицу цен и возможностей. Нативное приложение может быстро измениться. Более устойчивый метод — задавать каждому варианту одинаковые вопросы об исполнении, полномочиях и преемственности перед переносом реальной работы.",
      ] },
      { heading: "Удалённая сессия Claude Code", paragraphs: [
        "Claude Code Remote Control связывает удалённый клиент с работой локального процесса Claude Code. Локальная среда остаётся важной: её доступность и состояние сессии влияют на то, что человек сделает с телефона. Это удобно разработчику, чья основная работа уже идёт в Claude Code и кому подходит native представление провайдера. Документация описывает поддерживаемый аккаунт и путь подключения; проверьте их до расчёта на работу в дороге.",
        "Вопрос не только в том, насколько красиво выглядит чат. Что произойдёт, если компьютер уснёт? Какие подтверждения доступны удалённо? Продолжится ли сессия при исчезновении локального процесса? Из Claude-native session нельзя автоматически выводить общую identity Task между провайдерами. GrantTap может координировать более широкую видимую работу, но не меняет нативную семантику Claude и не расширяет её сверх документации.",
      ] },
      { heading: "Подключённая работа Codex", paragraphs: [
        "OpenAI описывает мобильный доступ к Codex как preview с живым состоянием подключённых машин, threads, approvals и контекстом проекта. Для человека, который уже использует Codex, это может быть самым прямым способом проверить работу. Статус предварительной версии важен: доступность и точное поведение могут измениться. Считайте объявление провайдера снимком на определённую дату и проверяйте текущие инструкции для своего аккаунта.",
        "Подключённый thread остаётся native понятием одного провайдера. Если та же цель человека позже переходит к другому coding-провайдеру, цепочку решений и состояние репозитория нужно явно сохранить. Именно эту проблему координации решает GrantTap. Он дополняет native review и approval, а не говорит, будто их нет или будто cross-provider handoff переносит скрытые рассуждения исходной сессии.",
      ] },
      { heading: "Облачные и локальные маршруты Cursor", paragraphs: [
        "Cursor для iOS предлагает cloud agents и путь Remote Control. Его документация указывает, что цикл агента может работать в облаке Cursor, пока инструменты выполняются на подключённом компьютере. Это существенное отличие от простого зеркала экрана или терминала. Оно определяет, какой компонент остаётся online и где хранится часть состояния. Если нужны локальные инструменты, проверяйте доступность компьютера наряду с соединением мобильного приложения.",
        "Cursor — полноценный native выбор, особенно для процесса вокруг его редактора и cloud agents. Интеграция Cursor в GrantTap помечена Beta, потому что её реализованное покрытие отличается от основных путей Claude Code и Codex. Честное сравнение сохраняет оговорку. Возможность собственного iOS-приложения Cursor не становится автоматически возможностью GrantTap-интеграции, и наоборот.",
      ] },
      { heading: "Сравнивайте approvals и evidence", paragraphs: [
        "Мобильное подтверждение имеет смысл, только если доходит до процесса, выполняющего действие, и этот процесс применяет нужное правило. Спросите каждый продукт, где происходит вызов инструмента, какой компьютер или cloud worker применяет решение и какое evidence остаётся. Статус «одобрено» не означает успешный запуск команды. Доставленное сообщение не является проверенным изменением кода. Эти различия важнее числа кнопок на телефоне.",
        "Проверьте также границу репозитория. Если агент движется между laptop и desktop, одинаковы ли revisions checkout? Может ли клиент выбрать Project, не угадывая его по похожему имени папки? Показывает ли неизвестное, когда цель offline? Native продукты решают часть вопросов внутри своих систем. Контроллер между провайдерами должен называть пробелы между ними, а не сводить все состояния к одной условной сессии.",
      ] },
      { heading: "Выбирайте по своей работе", paragraphs: [
        "Проведите небольшую характерную Task вместо выбора только по списку функций. Запустите её там, где обычно пишете код, отойдите и попробуйте с телефона посмотреть статус, принять решение и проверить результат. Запишите, должен ли компьютер бодрствовать, куда уходит модельный контекст, применяется ли approval и как подтверждается итог. Повторите пробу для второго провайдера, только если действительно им пользуетесь. Это честнее теоретического рейтинга.",
        "Сгенерированные картинки выше намеренно не копируют бренды и экраны провайдеров. Снимок GrantTap ниже показывает детерминированные примерные Tasks, а не приложения Claude, Codex или Cursor. По ссылкам можно прочитать описание каждого производителя. Для работы у одного провайдера его native app часто достаточно. При работе через несколько поддерживаемых локальных executions Task в GrantTap добавляет преемственность и контекст политики в пределах заявленного покрытия интеграций.",
      ] },
    ],
  },
};
