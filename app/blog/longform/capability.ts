import type { ArticleExtension } from "./types";

export const capabilityExtension: ArticleExtension = {
  images: { second: "/blog/mcp-skills-and-governance-status-b.webp" },
  en: {
    secondCaption: "Generated illustration of capability states. It does not assert that a tool was installed, initialized, or invoked.",
    sections: [
      { heading: "The name is not the capability", paragraphs: [
        "Two MCP servers can advertise the same friendly name while using different endpoints, commands, permissions, or environment. Two skills can share a title while their scripts and references differ. Approval by display name would therefore be ambiguous. The identity that matters includes the concrete configuration or bundle digest. A person should be able to inspect that identity before allowing it for a Task, and a changed identity needs its own decision.",
        "This is why a catalog is only the beginning. Discovery says a host reported something. A request says someone wants it. Approval records a policy decision about a specific identity. Installation and initialization describe what a target host actually did. Invocation is yet another event. Compressing these steps into a single green badge makes a system look simpler while making it harder to trust.",
      ] },
      { heading: "Follow the selected computer", paragraphs: [
        "A Task runs on a particular computer through a particular provider execution. It is not enough for an MCP server to work somewhere in the Project. The target computer may have a different operating system, a missing executable, a disabled provider integration, or an absent credential. The UI should name the host whose state it is reporting. If the target changes, the readiness question must be asked again for the new environment.",
        "A host receipt should say what configuration it accepted and what it could initialize. An unavailable host cannot honestly report success. A receipt also has a time and scope: it is not proof that a tool remains usable forever. If the process restarts or its configuration changes, new observation may be needed. This is operational evidence, not a promise that every route is currently covered by durable apply receipts.",
      ] },
      { heading: "Policy is not an invocation log", paragraphs: [
        "An allow decision permits an action within its specified scope. It does not show that an agent called the tool. An ask decision means the person may need to decide later; it does not mean the request was answered. A deny decision is meaningful only where the computer enforces it on the relevant path. An action outside the observed provider or host path cannot be counted as blocked merely because a policy row exists.",
        "Usage requires evidence of an actual invocation: which Task, capability identity, computer, execution, time, and observed result. A missing event is unknown when the observation path is incomplete. It should not be plotted as zero use. For the same reason, an accepted approval cannot be used as a usage metric. Keeping policy and observation separate makes both useful: one describes what may happen, the other describes what was seen.",
      ] },
      { heading: "Credentials are an additional boundary", paragraphs: [
        "A masked field helps prevent casual viewing in a settings screen, but masking does not make a secret unavailable to a process that receives it. If a coding agent can run shell commands in that process, it may be able to read environment variables. A true use-only secret needs a trusted broker that performs a narrow operation while withholding the raw value from the model and its tools. That capability must be evaluated on its actual execution path.",
        "A spending limit is similarly stronger than a chart of tokens already spent. To prevent an action from exceeding a budget, a controlled route needs an atomic reservation before the external call and a way to reconcile delayed or unknown outcomes. GrantTap does not present observation as a strict cap. The current article distinguishes these future controls from available status, so a reader does not mistake an attractive governance screen for complete financial or credential enforcement.",
      ] },
      { heading: "A useful review before enabling a tool", paragraphs: [
        "Begin with the exact MCP configuration or skill bundle, not its short label. Read what process it starts, what files or network destinations it can reach, and which Task and computer need it. Choose the narrowest sensible policy. Then inspect the host's observed configured and initialized states. If the capability was edited or moved to another host, repeat the identity and readiness check. This workflow is less convenient than approving a name forever, but it preserves the meaning of approval.",
        "After approval, make one harmless real call where supported and inspect its result. That call tests a different layer from installation. If it fails, the status should identify whether policy, initialization, transport, provider integration, or execution blocked it. The generated lifecycle image above shows an intentional gap before the final state; the product screenshot below uses demo values. Neither image is proof that a capability on your own computer was used.",
      ] },
      { heading: "How to read an honest status", paragraphs: [
        "Treat ‘requested’, ‘approved’, ‘configured’, ‘initialized’, and ‘used’ as separate observations with dates and source hosts. If the interface knows only one of them, it should say only that one. ‘Unknown’ can be the most accurate status when the target is offline or an integration cannot report native state. It invites a specific next check instead of hiding a gap behind a confident color.",
        "The benefit is practical. A person can decide whether to wait, repair a host setup, revoke a changed bundle, or continue a Task with another supported route. An engineer can locate the failed boundary without treating every error as a pairing problem. Governance is strongest when its screen leads to a verified computer action and leaves uncertainty visible. The moment a catalog entry is mistaken for working execution, both security and usability suffer.",
      ] },
    ],
  },
  ru: {
    secondCaption: "Сгенерированная схема статусов capability. Она не утверждает, что инструмент установлен, инициализирован или вызван.",
    sections: [
      { heading: "Имя не определяет возможность", paragraphs: [
        "Два MCP-сервера могут показываться под одним удобным именем, но использовать разные команды, endpoints, permissions или environment. Два skills могут одинаково называться, хотя их scripts и references различаются. Одобрение только по подписи тогда неоднозначно. Значимая identity включает конкретную конфигурацию или digest bundle. Перед разрешением для Task человек должен иметь возможность её изучить, а изменённая identity требует нового решения.",
        "Каталог поэтому лишь начало пути. Обнаружение сообщает, что host о чём-то доложил. Запрос сообщает о намерении использовать. Одобрение фиксирует решение политики для точной identity. Установка и инициализация описывают реальные действия целевого host. Вызов — ещё одно отдельное событие. Если сжать всё до одного зелёного бейджа, система станет на вид проще, но понять её и доверять ей будет сложнее.",
      ] },
      { heading: "Следите за выбранным компьютером", paragraphs: [
        "Task выполняется на определённом компьютере в определённом execution провайдера. Недостаточно, что MCP-сервер работает где-то в Project. На целевом компьютере может быть другая система, отсутствовать исполняемый файл, быть отключена интеграция или не задан credential. Интерфейс должен назвать host, состояние которого показывает. При смене цели вопрос готовности задаётся заново для новой среды.",
        "Receipt host сообщает, какую конфигурацию он принял и что смог инициализировать. Недоступная машина не может честно подтвердить успех. У ответа есть время и область действия: он не доказывает вечную доступность инструмента. После перезапуска процесса или изменения конфигурации может понадобиться новое наблюдение. Это операционное evidence, а не обещание, что каждый маршрут уже покрыт устойчивыми receipts применения.",
      ] },
      { heading: "Policy не является журналом вызовов", paragraphs: [
        "Решение allow разрешает действие в указанной области; оно не доказывает, что агент вызвал инструмент. Ask означает возможность будущего решения человека, а не факт ответа. Deny имеет смысл только там, где компьютер действительно применяет его на нужном маршруте. Действие вне наблюдаемого пути провайдера или host нельзя считать заблокированным лишь потому, что где-то существует строка политики.",
        "Usage требует evidence реального вызова: какая Task, точная identity capability, компьютер, execution, время и наблюдаемый результат. Если путь наблюдения неполон, отсутствие события означает неизвестность. Его нельзя рисовать как нулевое использование. По той же причине принятое подтверждение не становится метрикой usage. Разделение делает оба понятия полезными: одно описывает, что может случиться, другое — что было замечено.",
      ] },
      { heading: "Credentials образуют ещё одну границу", paragraphs: [
        "Скрытое поле защищает от случайного взгляда на экране Settings, но не делает секрет недоступным процессу, который его получил. Если coding-агент может выполнять shell-команды в этом процессе, он потенциально прочитает переменные окружения. Настоящий use-only secret требует доверенного broker: он выполняет узкую операцию, не отдавая сырое значение модели и её инструментам. Такую возможность нужно оценивать по реальному пути исполнения.",
        "Ограничение расходов тоже сильнее графика уже потраченных токенов. Чтобы не превысить бюджет, управляемый маршрут резервирует сумму атомарно перед внешним вызовом и умеет учитывать поздние или неизвестные исходы. GrantTap не должен выдавать наблюдение за строгий cap. Статья разделяет будущие меры и доступный статус, чтобы красивый governance-экран не выглядел завершённой финансовой или credential-защитой.",
      ] },
      { heading: "Проверка перед включением инструмента", paragraphs: [
        "Начните с точной конфигурации MCP или bundle skill, а не с короткого названия. Узнайте, какой процесс запускается, к каким файлам и адресам он обращается, каким Task и компьютеру нужен. Выберите самое узкое разумное правило. Затем посмотрите наблюдаемые host статусы configured и initialized. Если capability изменили или перенесли на другой host, повторите проверку identity и готовности. Это менее удобно, чем навсегда одобрить имя, зато решение сохраняет смысл.",
        "После подтверждения, где это поддерживается, выполните один безвредный реальный вызов и проверьте ответ. Такой вызов тестирует другой слой, чем установка. При ошибке статус должен указать, что помешало: policy, инициализация, transport, интеграция провайдера или само выполнение. На сгенерированной схеме выше намеренно оставлен разрыв перед финальным состоянием; скриншот продукта ниже показывает демозначения. Ни одна картинка не доказывает usage инструмента на вашем компьютере.",
      ] },
      { heading: "Как читать честный статус", paragraphs: [
        "Считайте requested, approved, configured, initialized и used отдельными наблюдениями со временем и источником. Если интерфейс знает только одно, он должен сообщать только его. Unknown бывает самым точным состоянием, когда цель offline или интеграция не умеет сообщить native status. Оно подсказывает следующую проверку вместо маскировки пробела уверенным цветом.",
        "Польза вполне практическая. Человек решает, подождать ли, починить настройку host, отозвать изменённый bundle или продолжить Task другим поддерживаемым маршрутом. Разработчик находит сломанную границу, не списывая каждую ошибку на привязку телефона. Governance сильнее всего, когда экран ведёт к проверенному действию компьютера и оставляет неизвестное видимым. Как только запись каталога принимают за работающее исполнение, страдают и безопасность, и удобство.",
        "При повторной проверке зафиксируйте дату и точную identity capability. Иначе можно сравнить вызов новой конфигурации с approval старой и решить, что система противоречит сама себе. Если host сообщает о недоступности, оставьте Task на безопасном шаге и исправьте причину на этом компьютере. Перенос на другую машину требует отдельной проверки её среды. Такой порядок даёт пользователю понятный путь восстановления и не расширяет policy ради того, чтобы загорелся зелёный индикатор.",
      ] },
    ],
  },
};
