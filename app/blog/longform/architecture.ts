import type { ArticleExtension } from "./types";

export const architectureExtension: ArticleExtension = {
  images: { first: "/blog/architecture-graph-with-evidence-a.webp", second: "/blog/architecture-graph-with-evidence-b.webp" },
  en: {
    firstCaption: "Generated editorial image of evidence-backed code relations. It is not a scan or a GrantTap screen.",
    secondCaption: "Generated illustration of tracing a relation to source. The pictured code and graph are fictional.",
    sections: [
      { heading: "Ask a question before opening the graph", paragraphs: [
        "A large graph is tempting because it makes a repository feel comprehensible at a glance. It can also hide the question that brought you there. Start with a concrete concern: which callers depend on this contract, what might an API rename affect, or who owns the failing behavior? Then select the smallest relevant neighborhood. A graph that leads to inspectable code can help; a wall of colored nodes that cannot justify its edges mostly creates false confidence.",
        "The answer should include a scope label. Was the entire repository analyzed, only a package, or a checked-out subset? Was generated code omitted? Did the scanner see dynamic imports or runtime configuration? Different analyses observe different relationships. A missing edge means only that this report did not show one in its covered scope. It does not prove that a dependency cannot exist through a route the analysis did not inspect.",
      ] },
      { heading: "Revision is part of every claim", paragraphs: [
        "Source evidence is time-bound. A report for yesterday's commit can be an excellent navigation aid, yet it cannot establish the state after today's refactor. Record the repository identity, checkout revision, engine version, report time, and completeness together. If an agent uses a relation while editing a newer checkout, it should state the mismatch and inspect current source before making a strong impact claim. This is not ceremony; it prevents an old map from becoming a new fact.",
        "The same principle applies when several computers hold copies of a repository. A familiar branch name can point at different commits or uncommitted changes. A Project link tells you where a repository is bound, while a report tells you what one analysis observed. The receiving execution should compare its own checkout to the report's revision. If they differ, the interface should make the gap visible instead of silently painting every edge as current.",
      ] },
      { heading: "Trace the edge to something reviewable", paragraphs: [
        "A useful architecture relation is a path back to source: a file, symbol, declaration, or reproducible observation. Consider a diagram saying that a mobile view depends on a relay event. A reviewer needs to find the event contract and the consuming code, not simply trust the arrow. Declared relationships are valuable for design intent, but their label should remain distinct from a relationship discovered from source. Each kind answers a different question.",
        "When evidence is incomplete, show that status at the edge. An unresolved symbol, excluded package, or unavailable checkout should not be smoothed away by visual polish. The darker parts of the generated illustration represent precisely that uncertainty; they are not a metric. For an actual Task, inspect the underlying report and source location. The goal is to shorten the route to verification, not to replace it with an attractive picture.",
      ] },
      { heading: "From orientation to impact", paragraphs: [
        "Once an edge is grounded, use it to plan a bounded check. If a contract changes, inspect direct consumers, then run targeted tests or build steps for the affected modules. A code map can suggest the relevant area, but it cannot decide whether a behavior is correct after the edit. A passing test also has limits: it covers the tested scenario and revision, not every possible runtime path. Keep the map, change, and verification linked to the same source state.",
        "A future impact packet can summarize changed files, related components, source windows, and unresolved questions for a coding agent. Such a packet needs a revision and evidence trail. It should not become a claim that every dependency is known or that a model can safely skip review. GrantTap's Engine and Weavatrix path are conditional on installation and available reports; the architecture article describes how to read their output, not a universal automatic scan.",
      ] },
      { heading: "What the product screenshot actually shows", paragraphs: [
        "The Health code-towers capture in this article is a deterministic fixture. It demonstrates the spatial navigation interface: select an area, inspect a file or symbol, and move from broad orientation to detail. It does not represent a customer's repository or prove that the depicted relations were discovered live. The generated pictures above are even more abstract: they explain evidence-backed edges and traceability. Their captions keep these roles separate.",
        "When using your own installation, look for the report label rather than assuming the visual shape is a quality score. A tall structure may simply represent a grouping or visual encoding; it is not a verdict on code health. If the Engine is unavailable on the target computer, the right next step is to check the binding and report status. A missing report is a state to surface, not a reason to invent one.",
      ] },
      { heading: "A practical reading sequence", paragraphs: [
        "Begin with the Task question and the current checkout. Open the architecture report only if its revision and scope are relevant. Select one suspected component and follow a small number of relations to their source. Compare declared links with observed ones, then run the narrowest verification that could disprove your working hypothesis. Write down what remained outside the report. This sequence is slower than trusting the whole graph instantly, but usually faster than debugging an unsupported assumption.",
        "Finally, explain the result in ordinary language: which source supports the relation, what test or observation checked the proposed change, and what remains uncertain. That explanation is useful to another agent, a reviewer, and the person returning to the Task on a phone. The graph earns its place when it helps answer a code question with evidence that survives the next session, not when it merely looks complete.",
      ] },
    ],
  },
  ru: {
    firstCaption: "Сгенерированная иллюстрация связей кода с evidence. Это не результат сканирования и не экран GrantTap.",
    secondCaption: "Сгенерированная схема проверки связи по исходнику. Изображённый код и граф вымышлены.",
    sections: [
      { heading: "Сначала вопрос, потом граф", paragraphs: [
        "Большой граф соблазняет ощущением, будто весь репозиторий понятен с одного взгляда. При этом легко потерять исходный вопрос. Начните с конкретной проблемы: кто вызывает этот контракт, что затронет переименование API или какой компонент отвечает за падающее поведение? Затем выберите небольшой подходящий участок. Граф, который ведёт к проверяемому коду, полезен; стена цветных узлов без объяснения рёбер скорее создаёт ложную уверенность.",
        "Ответу нужна метка области анализа. Изучен весь репозиторий, один пакет или часть checkout? Исключался ли сгенерированный код? Видел ли анализатор динамические imports и настройки времени выполнения? Разные методы наблюдают разные отношения. Отсутствующее ребро говорит лишь о том, что данный отчёт не показал его в покрытой области. Оно не доказывает, что зависимость невозможна вне проанализированного маршрута.",
      ] },
      { heading: "Revision входит в утверждение", paragraphs: [
        "Evidence исходников привязано ко времени. Отчёт для вчерашнего commit может отлично помогать навигации, но не устанавливает состояние после сегодняшнего refactor. Храните вместе identity репозитория, revision checkout, версию Engine, время отчёта и полноту. Если агент использует связь при правке более нового кода, ему нужно назвать расхождение и проверить актуальный исходник до сильного вывода. Так старая карта не превращается незаметно в новый факт.",
        "Это относится и к нескольким компьютерам с копиями репозитория. Знакомое имя ветки может указывать на разные commit или незакоммиченные изменения. Привязка Project сообщает, где доступен репозиторий, а отчёт — что увидел конкретный анализ. Принимающее execution сравнивает собственный checkout с revision отчёта. Если они различаются, интерфейс показывает разрыв вместо одинаково уверенного цвета каждого ребра.",
      ] },
      { heading: "Ведите ребро к проверяемому источнику", paragraphs: [
        "Хорошая архитектурная связь ведёт к исходнику: файлу, символу, декларации или воспроизводимому наблюдению. Если схема говорит, что мобильный экран зависит от события relay, reviewer должен найти контракт события и код-потребитель, а не просто поверить стрелке. Объявленные связи полезны для отражения проектного замысла, но их метка должна отличаться от связей, найденных анализом кода. Эти типы отвечают на разные вопросы.",
        "При неполном evidence покажите это непосредственно на связи. Неразрешённый символ, исключённый пакет или недоступный checkout нельзя скрывать визуальной полировкой. Тёмные части сгенерированной картинки передают именно неизвестность; они не являются метрикой. Для реальной Task откройте лежащий под схемой отчёт и место в исходнике. Цель — сократить путь к проверке, а не заменить её красивым рисунком.",
      ] },
      { heading: "От ориентации к проверке влияния", paragraphs: [
        "Когда ребро обосновано, используйте его для ограниченной проверки. Если меняется контракт, изучите прямых потребителей, затем выполните прицельные тесты или сборку затронутых модулей. Карта кода предлагает область, но не решает, осталось ли поведение правильным после правки. Успешный тест тоже имеет предел: он покрывает проверенный сценарий и revision, а не все возможные пути выполнения. Связывайте карту, изменение и проверку с одним состоянием исходников.",
        "Будущий impact packet может собрать изменённые файлы, связанные компоненты, окна исходника и открытые вопросы для coding-агента. Ему нужны revision и цепочка evidence. Пакет не должен обещать знание всех зависимостей или право пропустить review. Путь GrantTap через Engine и Weavatrix зависит от установки и доступных отчётов; статья объясняет чтение результата, а не заявляет о всеобщем автоматическом сканировании.",
      ] },
      { heading: "Что показывает снимок приложения", paragraphs: [
        "Экран Health с башнями кода в этой статье создан на детерминированных fixture. Он демонстрирует пространственную навигацию: выбрать участок, изучить файл или символ, перейти от общей ориентации к подробности. Он не представляет клиентский репозиторий и не доказывает живое обнаружение изображённых связей. Сгенерированные иллюстрации выше ещё абстрактнее: они объясняют подтверждённые связи и прослеживаемость. Подписи разводят эти роли.",
        "В собственной установке смотрите прежде всего на метку отчёта, а не на форму фигуры как оценку качества. Высокая башня может быть способом группировки или визуального кодирования; это не вердикт о здоровье кода. Если Engine недоступен на целевом компьютере, проверьте привязку и статус отчёта. Отсутствующий отчёт — состояние, которое надо показать, а не повод его придумать.",
      ] },
      { heading: "Порядок работы с графом", paragraphs: [
        "Начните с вопроса Task и текущего checkout. Откройте архитектурный отчёт, только если его revision и область подходят. Выберите подозреваемый компонент и проследите несколько связей до исходников. Сравните объявленные ребра с наблюдаемыми, затем проведите самую узкую проверку, способную опровергнуть гипотезу. Запишите, что осталось за пределами отчёта. Такой путь медленнее слепой веры всему графу, но обычно быстрее исправления ошибки, возникшей из неподтверждённой догадки.",
        "В конце объясните результат обычными словами: какой исходник поддерживает связь, какой тест или наблюдение проверили изменение и что осталось неизвестным. Такое объяснение полезно следующему агенту, reviewer и человеку, который вернётся к Task с телефона. Граф заслуживает места в продукте, когда помогает отвечать на вопрос о коде с evidence, переживающим смену сессии, а не когда просто выглядит полным.",
        "Если перед вами несколько отчётов, не объединяйте их ребра без проверки исходных условий. Один анализ мог исключить тестовые файлы, другой — учитывать их; один построен для основной ветки, другой — для незакоммиченной рабочей копии. Сначала приведите область и revision к сопоставимому виду. Если это невозможно, сохраните два результата как разные наблюдения. Так граф не создаст вымышленную единую архитектуру из несовместимых снимков. Даже ручная декларация зависимости должна показывать автора и причину, чтобы её можно было пересмотреть после изменения кода.",
      ] },
    ],
  },
};
