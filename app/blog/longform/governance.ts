import type { ArticleExtension } from "./types";

export const governanceExtension: ArticleExtension = {
  images: { first: "/blog/governance-that-reaches-the-computer-a.webp", second: "/blog/governance-that-reaches-the-computer-b.webp" },
  en: {
    firstCaption: "Generated concept of a policy decision reaching a host. It does not prove enforcement in a live session.",
    secondCaption: "Generated view of policy, host action, invocation, and outcome as separate checkpoints, not recorded telemetry.",
    sections: [
      { heading: "A decision must have a destination", paragraphs: [
        "A governance setting is useful only if its scope is clear. Which Project, Task, capability identity, member, computer, and provider execution does it concern? A broad label such as ‘tools allowed’ hides too much. The target host performs the local action, so a decision made on a phone needs a route to that host and a way to learn whether it was applied. A policy selected in a UI is an intention until the enforcement path confirms it.",
        "This is especially important when a Task can move. A policy approved for one MCP configuration on a laptop does not necessarily authorize a different configuration on a desktop. The same display name can cover different commands or bundled files. New identity or new host state calls for a fresh readiness check. The owner should see the gap before pressing a continue button, rather than discover after the agent has depended on an unavailable tool.",
      ] },
      { heading: "The host is the enforcement boundary", paragraphs: [
        "The computer that runs a command must enforce the decisions it owns. A phone can help a person choose, but cannot by itself stop a shell command on an unobserved provider-native path. A global deny should win where the host control applies, and auto-accept should happen only after the effective rule is checked. If a route bypasses that control, the product must describe the coverage limit rather than report a universal block.",
        "A host receipt can report which rule and capability configuration it applied. It is more informative than a generic success toast, but still narrower than a verified outcome. A receipt cannot guarantee that a future process restart keeps the same state. It also cannot prove that no action occurred outside its observation boundary. Good governance shows where computer-enforced decisions are real and where the evidence ends.",
      ] },
      { heading: "Separate four questions", paragraphs: [
        "First, what rule did a person choose? Second, did the target host accept and apply that rule? Third, did the agent actually invoke the capability? Fourth, what result can be verified? These questions form a chain, not a single status. A denied request may never reach a tool; an allowed request may never be used; a successful invocation may still produce a failing test. Each stage needs its own timestamp, source, and uncertainty.",
        "The second illustration presents those checkpoints as separate objects. It is not live telemetry. In the real product, an unknown stage should remain unknown. For example, if the provider integration cannot observe a native tool call, the absence of a usage event is not evidence of zero use. If a host was offline, a selected rule may be pending rather than applied. This discipline prevents a reassuring dashboard from overstating protection.",
      ] },
      { heading: "Credentials and budgets need stronger controls", paragraphs: [
        "A permission to use a tool is different from permission to read its raw credential. Putting a secret in a masked setting does not shield it from a process that receives that environment value. A use-only design would require a trusted broker performing a narrow operation without handing the secret to a general-purpose agent shell. That is a separate implementation and threat model, not a benefit that follows automatically from an approval screen.",
        "The same caution applies to money. An observed token count is useful for understanding past work, but it does not reserve funds before the next model call. A strict budget requires control at the point of expenditure, including concurrent work and uncertain outcomes. Until a route has that mechanism, the product should say it reports usage where confirmed rather than promising a spending cap. Distinguishing current evidence from future control is part of governance itself.",
      ] },
      { heading: "A practical policy review", paragraphs: [
        "For a new capability, inspect the exact configuration or bundle digest, choose the Task and host that need it, and ask what actions it can perform. Decide whether allow, ask, or deny fits that scope. Then inspect the target host's observed configuration and initialization result. Try a harmless call if the path supports it, and review the invocation evidence. If any stage is missing, stop at that stage instead of treating the next one as implied.",
        "For shared work, also check the member's Project grant. Linking repositories does not expand a member's access by itself. The owner's phone may guard protected Project forwarding, while a local host still enforces the action it runs. A named Project is the coordination scope, not a universal authority token. This matters when one contributor can review a Task but should not execute a release command on someone else's computer.",
      ] },
      { heading: "A useful governance screen", paragraphs: [
        "The screen should lead from a decision to its evidence. Show the rule, its exact scope, the computer that reported applying it, observed use, and the result that can actually be verified. Let a person inspect why a capability is unavailable without guessing. Unknown values are not errors to paint over; they identify the next diagnostic step. A product is safer when its interface makes it hard to confuse intention, enforcement, and outcome.",
        "GrantTap's current cross-host bundle transfer and some durable apply receipts remain incomplete, as described in the capability guide and runtime documentation. The generated images above explain the intended chain, and the product screenshot below uses deterministic demonstration data. They should not be read as evidence that every provider route is already covered. The practical standard is modest but demanding: can a person tell which computer applied which rule to which action, and what remains unobserved?",
      ] },
    ],
  },
  ru: {
    firstCaption: "Сгенерированная схема доставки policy на host. Она не доказывает применение правила в живой сессии.",
    secondCaption: "Сгенерированные отдельные этапы policy, действия host, вызова и исхода. Это не записанная телеметрия.",
    sections: [
      { heading: "У решения должна быть цель", paragraphs: [
        "Настройка governance полезна, когда её область понятна. Какой Project, Task, identity capability, участник, компьютер и execution провайдера ей соответствуют? Широкая метка «инструменты разрешены» скрывает слишком многое. Локальное действие выполняет целевой host, поэтому решение с телефона должно дойти до него и получить проверяемый ответ. Policy, выбранная в интерфейсе, остаётся намерением, пока путь enforcement не подтвердит применение.",
        "Это особенно важно при перемещении Task. Правило для одной конфигурации MCP на ноутбуке не обязательно разрешает другую конфигурацию на desktop. За одинаковым именем могут стоять разные команды и файлы bundle. Новая identity или состояние host требуют новой проверки готовности. Владелец должен видеть разрыв до нажатия «продолжить», а не узнавать об отсутствии инструмента после того, как агент начал на него рассчитывать.",
      ] },
      { heading: "Граница enforcement — компьютер", paragraphs: [
        "Компьютер, запускающий команду, должен применять подконтрольные ему решения. Телефон помогает человеку выбрать правило, но сам не может остановить shell-команду на неизвестном native маршруте провайдера. Глобальный deny побеждает там, где действует контроль host, а auto-accept допустим только после проверки эффективного правила. Если маршрут обходит контроль, продукт обязан назвать предел покрытия, а не сообщать о всеобщей блокировке.",
        "Receipt host сообщает, какое правило и какую конфигурацию возможности он применил. Это информативнее общего уведомления об успехе, но уже, чем проверенный исход. Receipt не гарантирует, что будущий перезапуск процесса сохранит то же состояние. Он также не доказывает отсутствие действий вне наблюдаемой границы. Хороший governance показывает, где решение действительно применено компьютером и где заканчивается evidence.",
      ] },
      { heading: "Четыре разных вопроса", paragraphs: [
        "Сначала: какое правило выбрал человек? Затем: принял и применил ли его целевой host? После: вызвал ли агент capability? Наконец: какой результат можно проверить? Это цепочка, а не один статус. Запрещённый запрос может не дойти до инструмента; разрешённый может не использоваться; успешный вызов способен закончиться падающим тестом. Каждому этапу нужны время, источник и честное обозначение неизвестности.",
        "На второй иллюстрации этапы показаны отдельными предметами. Это не живая телеметрия. В реальном продукте неизвестный этап остаётся неизвестным. Например, если интеграция провайдера не видит native вызов, отсутствие события usage не означает нулевое использование. Если host был offline, выбранное правило могло остаться ожидающим. Такая дисциплина не даёт успокаивающей панели преувеличивать уровень защиты.",
      ] },
      { heading: "Credentials и бюджеты требуют отдельных мер", paragraphs: [
        "Право использовать инструмент не равняется праву прочитать его сырой credential. Маскировка поля в Settings не скрывает секрет от процесса, который получил значение environment. Для use-only нужен доверенный broker, выполняющий узкую операцию без передачи ключа агенту с общим shell-доступом. Это отдельная реализация и модель угроз, а не автоматическое следствие экрана подтверждения.",
        "С деньгами нужна такая же осторожность. Наблюдаемое число токенов помогает понимать прошлую работу, но не резервирует средства перед следующим вызовом модели. Строгий бюджет требует контроля в точке расхода с учётом параллельной работы и неизвестных исходов. Пока маршрут не имеет такого механизма, следует говорить о подтверждённом usage, а не обещать spending cap. Различать текущее evidence и будущий контроль — часть самого governance.",
      ] },
      { heading: "Проверка нового правила на практике", paragraphs: [
        "Для новой capability изучите точную конфигурацию или digest bundle, выберите Task и host, которым она нужна, и выясните доступные действия. Решите, подходит ли узкое allow, ask или deny. Затем проверьте наблюдаемые результаты настройки и инициализации на целевом host. Если путь позволяет, выполните безвредный вызов и изучите evidence invocation. Если этап отсутствует, остановитесь на нём, а не считайте следующий автоматически выполненным.",
        "При общей работе отдельно проверьте разрешения участника в Project. Связь репозиториев сама по себе не расширяет его доступ. Телефон владельца может контролировать передачу защищённых данных Project, а локальный host применяет правило к запускаемому действию. Название Project — область координации, не универсальный ключ. Это важно, когда участник вправе просматривать Task, но не запускать команду выпуска на чужом компьютере.",
      ] },
      { heading: "Полезный экран управления", paragraphs: [
        "Экран ведёт от решения к evidence: показывает правило и точную область, компьютер, сообщивший о применении, наблюдаемый вызов и проверяемый результат. Человек может узнать, почему capability недоступна, не строя догадок. Unknown — не дефект, который надо закрасить, а указатель следующей диагностики. Продукт безопаснее, когда в нём сложно перепутать намерение, enforcement и итог.",
        "Полный перенос bundle между hosts и часть устойчивых receipts применения в GrantTap ещё не завершены, о чём сказано в руководстве по capability и runtime документации. Сгенерированные изображения выше объясняют желаемую цепочку, а снимок продукта ниже использует демоданные. Они не доказывают, что все маршруты провайдеров уже покрыты. Практический критерий прост и строг: видно ли, какой компьютер применил какое правило к какому действию и что осталось ненаблюдаемым?",
        "При разборе спорного случая сохраните исходное правило, identity инструмента и наблюдение host до изменения настроек. Иначе новая попытка может скрыть причину старого сбоя. После исправления повторите тот же безопасный сценарий и сравните stages по порядку. Если теперь действие проходит, это подтверждает данный маршрут в данной конфигурации, но не все будущие вызовы на остальных компьютерах. Граница вывода должна быть столь же точной, как и граница самой политики.",
      ] },
    ],
  },
};
