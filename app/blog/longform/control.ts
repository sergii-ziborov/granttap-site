import type { ArticleExtension } from "./types";

export const controlExtension: ArticleExtension = {
  images: { first: "/blog/why-granttap-is-a-control-center-a.webp", second: "/blog/why-granttap-is-a-control-center-b.webp" },
  en: {
    firstCaption: "Generated editorial scene of mobile control with coding work remaining on computers; it is not a GrantTap screen.",
    secondCaption: "Generated concept of a Task across executions and a decision point. It does not depict live telemetry.",
    sections: [
      { heading: "A phone should reduce uncertainty", paragraphs: [
        "The first useful question away from a desk is often simple: does this work need me now? A feed of every internal agent step would make that harder to answer. GrantTap's control-center idea begins with a stable Task and a concise status: the current execution, computer, recent meaningful event, pending decision, and delivery state. A person can then choose to inspect the full context on the computer when the decision demands it.",
        "This also sets a limit on notifications. An agent reading a file is not necessarily news. A permission request, failed delivery, blocked handoff, or completed verification may be. The product should not infer urgency from raw event volume. It needs to distinguish routine progress from a moment when human judgment changes what happens next. A useful glance is one that lets a person safely return to their day when no action is needed.",
      ] },
      { heading: "Keep the unit of work stable", paragraphs: [
        "A provider session can stop for ordinary reasons: an app restarts, a context window changes, or the work moves to another computer. The user's Task remains. GrantTap groups successive executions under that visible unit and keeps child agents nested where they ran. This avoids a common coordination error: treating a delegated investigation or a new native session as an unrelated request, then losing the decision trail that explains why the work exists.",
        "The stable identity does not mean every provider can be resumed identically. Provider support and remote-start paths differ. A Task can keep its objective and history while a particular route is unavailable. The interface must say which continuation was requested, which was accepted, and which remains only possible in principle. Continuity is valuable precisely when it survives those limitations honestly rather than pretending every execution is interchangeable.",
      ] },
      { heading: "Authority belongs to the real action", paragraphs: [
        "A person may choose an allow, ask, or deny rule for a capability, but the meaningful security question is where that rule is enforced. The local computer performs the coding action and must apply controls on the paths it owns. A policy displayed on a phone is not sufficient evidence that an unobserved provider-native route was blocked. GrantTap therefore treats selected policy, host application, and observed invocation as separate facts.",
        "This separation also improves everyday debugging. If a tool is listed but cannot initialize, the person needs the host's reported state, not another generic approval button. If an action was allowed but never invoked, usage should remain unknown or absent according to observation, not be counted as consumption. Honest boundaries let the control center be useful without implying broader policy coverage than the computer can enforce.",
      ] },
      { heading: "Local work still uses external services", paragraphs: [
        "The coding environment and provider credentials remain on the computer, while GrantTap's relay carries encrypted envelopes between authorized devices. That choice limits what the relay is asked to know. It does not change the data flow between a coding provider and its model service. When choosing a workflow, people should read the provider's own privacy and retention terms for model traffic. ‘Local control’ describes the authority and tool location, not a blanket promise that no data leaves the computer.",
        "It is equally important to distinguish a connection from a result. The relay can carry a message while the target provider is stopped. A computer can be online while an integration is not ready. A provider can accept a prompt without producing a verified code change. The control center should show these transitions as separate states so a remote user never has to infer success from connectivity alone.",
      ] },
      { heading: "A day in the intended workflow", paragraphs: [
        "Suppose you start a coding Task on a laptop and leave for a meeting. On the phone, you see that the agent needs permission for one specific command. The request names the Task, computer, capability, and proposed action. You can approve, deny, or wait until you can inspect more context. Later, a delivery receipt shows that the decision reached the host; a subsequent event may show an invocation and a tested result. Each line answers a different question.",
        "If the laptop becomes unreachable halfway through, the Task still exists and reports the interruption. When it returns, you can continue through a supported path or choose an explicit handoff to another execution. The product should not silently reroute to an arbitrary machine. The generated illustrations above depict this relationship conceptually; the Now screenshot below uses deterministic sample data. Your own evidence comes from the live Task, its host state, and the verified outcome.",
      ] },
      { heading: "What success would look like", paragraphs: [
        "Success is not a dashboard with the most counters. It is a person knowing what the agent is doing, what they are authorized to decide, and how to check the result. When the app says something is unknown, that should be actionable: perhaps the host is offline, the provider cannot report usage, or a tool has not been initialized. A clear unknown is preferable to an invented zero or a green completion badge unsupported by evidence.",
        "GrantTap is built for people running local coding agents. Claude Code and Codex are the deepest paths today; Cursor joins the shared view with a narrower set of controls. The control center becomes more useful when Task, execution, capability, and usage states are precise. Its design earns trust when a person can follow a decision to the computer that applied it and the work that followed.",
      ] },
    ],
  },
  ru: {
    firstCaption: "Сгенерированная сцена управления с телефона, пока coding-работа остаётся на компьютерах; это не экран GrantTap.",
    secondCaption: "Сгенерированная схема Task и точки решения. Она не показывает живую телеметрию.",
    sections: [
      { heading: "Телефон должен уменьшать неизвестность", paragraphs: [
        "Первый вопрос вдали от рабочего стола часто прост: нужна ли сейчас моя помощь? Лента всех внутренних шагов агента лишь усложнит ответ. Идея центра управления GrantTap начинается со стабильной Task и короткого статуса: текущее execution, компьютер, последнее значимое событие, ожидающее решение и состояние доставки. Когда вопрос требует деталей, человек может открыть широкий контекст на компьютере.",
        "Отсюда следует ограничение уведомлений. Чтение файла агентом не обязательно является новостью. Запрос разрешения, сбой доставки, остановленный handoff или подтверждённый результат — другое дело. Продукт не должен выводить срочность из количества событий. Он различает обычный прогресс и момент, когда решение человека меняет дальнейший путь. Хороший быстрый взгляд позволяет спокойно вернуться к своим делам, если действие не требуется.",
      ] },
      { heading: "Сохраните единицу работы", paragraphs: [
        "Сессия провайдера может завершиться по обычной причине: приложение перезапустилось, сменился context window или работа переехала на другой компьютер. Task человека остаётся. GrantTap группирует последовательные executions под этой видимой единицей и оставляет дочерних агентов внутри тех сессий, где они работали. Это предотвращает частую ошибку координации: считать делегированное исследование или новую native session посторонним запросом и потерять цепочку решений.",
        "Стабильная identity не означает одинакового возобновления у каждого провайдера. Поддержка и пути удалённого запуска различаются. Task сохраняет цель и историю, даже когда конкретный маршрут недоступен. Интерфейс сообщает, какое продолжение запрошено, какое принято и какое пока существует лишь как возможность. Преемственность ценна именно тогда, когда честно переживает ограничения, а не делает вид, будто все executions взаимозаменяемы.",
      ] },
      { heading: "Полномочие относится к действию", paragraphs: [
        "Человек может выбрать allow, ask или deny для capability, но главный вопрос безопасности — где правило применяется. Coding-действие выполняет локальный компьютер, и он должен проверять подконтрольные маршруты. Правило на телефоне не доказывает, что неизвестный native путь провайдера был заблокирован. GrantTap поэтому различает выбранную policy, применение на host и наблюдаемый вызов.",
        "Такое разделение помогает и обычной диагностике. Если инструмент есть в списке, но не инициализируется, человеку нужен ответ host, а не ещё одна общая кнопка одобрения. Если действие разрешено, но инструмент не вызывался, usage нельзя считать потраченным только по approval. Честные границы позволяют центру управления быть полезным без ложного обещания всеобъемлющего корпоративного policy layer.",
      ] },
      { heading: "Локальная работа использует внешние сервисы", paragraphs: [
        "Среда разработки и credentials провайдера остаются на компьютере, а relay GrantTap переносит зашифрованные сообщения между разрешёнными устройствами. Такое устройство ограничивает данные, которые нужен relay. Оно не меняет поток между coding-провайдером и его модельным сервисом. Выбирая процесс, следует читать правила приватности и хранения самого провайдера. Локальный контроль описывает расположение инструментов и полномочий, а не обещает, что никакие данные не покидают компьютер.",
        "Соединение также отличается от результата. Relay может передать сообщение, пока целевой провайдер остановлен. Компьютер бывает online, а интеграция — не готова. Провайдер может принять prompt, но не создать проверенное изменение кода. Центр управления показывает эти переходы по отдельности, чтобы удалённый пользователь не выводил успех только из доступности сети.",
      ] },
      { heading: "Один день такого процесса", paragraphs: [
        "Допустим, вы запустили coding Task на ноутбуке и ушли на встречу. На телефоне видно, что агент запрашивает разрешение на одну конкретную команду. Запрос называет Task, компьютер, capability и действие. Можно разрешить, отказать или дождаться возможности изучить больше контекста. Позже receipt показывает доставку решения на host; следующее событие может показать вызов и протестированный результат. Каждая строка отвечает на отдельный вопрос.",
        "Если ноутбук потеряет связь на середине работы, Task сохранится и покажет прерывание. После возвращения компьютера можно продолжить поддерживаемым способом или выбрать явный handoff в другое execution. Продукт не должен тайно менять цель на произвольную машину. Сгенерированные картинки выше иллюстрируют отношения концептуально; скриншот Now ниже сделан на детерминированных данных. Evidence вашей работы — живая Task, состояние host и проверенный итог.",
      ] },
      { heading: "Как выглядит успех", paragraphs: [
        "Успех — не панель с максимальным числом счётчиков. Он в том, что человек знает, чем занят агент, какое решение ему разрешено принять и как проверить результат. Сообщение «неизвестно» должно вести к действию: возможно, host offline, провайдер не сообщает usage или инструмент не инициализирован. Ясная неизвестность лучше придуманного нуля и зелёного бейджа завершения без доказательств.",
        "GrantTap создан для людей, запускающих локальных coding-агентов. Claude Code и Codex сегодня дают самые полные пути; Cursor входит в общий обзор с более узким набором способов управления. Центр становится полезнее, когда состояния Task, execution, capability и usage точны. Доверие появляется, когда решение можно проследить до компьютера, который его применил, и до работы, которая последовала.",
        "Проверить эту идею можно на обычном рабочем дне. Выберите две Task на разных компьютерах и одно действие, требующее решения. После короткого взгляда на телефон попробуйте без догадок назвать, где работает каждая Task, какое действие ждёт вас и какое событие уже подтверждено. Если для ответа приходится открывать несколько несвязанных логов, компактный экран ещё не выполнил свою задачу. Улучшать стоит не число карточек, а ясность существующих состояний.",
      ] },
    ],
  },
};
