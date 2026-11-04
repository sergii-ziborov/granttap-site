import { composeStory } from "../compose";
import { body as briefEn } from "./brief-en";
import { body as briefRu } from "./brief-ru";
import { body as approvalsEn } from "./approvals-en";
import { body as approvalsRu } from "./approvals-ru";
import { body as privacyEn } from "./privacy-en";
import { body as privacyRu } from "./privacy-ru";
import { body as automationsEn } from "./automations-en";
import { body as automationsRu } from "./automations-ru";
import { body as devicesEn } from "./devices-en";
import { body as devicesRu } from "./devices-ru";
import { body as contextEn } from "./context-en";
import { body as contextRu } from "./context-ru";

type Text = { title: string; summary: string; body: string; closing: string; visuals: [string, string] };
type Draft = { key: string; date: string; slug: string; images: [string, string, string]; en: Text; ru: Text; sources: { label: string; url: string }[] };

export function novemberStory(draft: Draft) {
  const text = (locale: "en" | "ru") => {
    const { visuals, ...fields } = draft[locale];
    return { ...fields, category: locale === "en" ? "GrantTap field guide" : "Практика GrantTap",
      illustrationCaption: `${locale === "en" ? "AI-generated conceptual illustration. " : "Сгенерированная концептуальная иллюстрация. "}${visuals[0]}`,
      additionalIllustrationCaption: `${locale === "en" ? "AI-generated conceptual illustration. " : "Сгенерированная концептуальная иллюстрация. "}${visuals[1]}`,
      sources: draft.sources,
    };
  };
  const path = (name: string) => `/blog/november2026/${draft.key}-${name}.webp`;
  return composeStory({ slug: draft.slug, date: draft.date, cover: path(draft.images[0]),
    inlineIllustration: path(draft.images[1]), additionalIllustration: path(draft.images[2]), en: text("en"), ru: text("ru") });
}

export const additionalNovemberStories = [
  novemberStory({ key: "brief", date: "2026-10-30", slug: "granttap-better-coding-agent-task-briefs", images: ["cover", "scenario", "criteria"],
    en: { title: "A better task brief before your coding agent starts", summary: "Turn a vague request into an observable result: the failing moment, environment, authority, useful evidence and a completion scenario you can review from your phone.", body: briefEn,
      closing: "Give the agent a concrete objective and a way to prove the result; keep the task understandable after the next handoff.", visuals: ["A user action, an operation boundary and a result form a reproducible scenario; this is not a captured test.", "A proposed outcome is compared with concrete acceptance criteria; no benchmark result is depicted."] },
    ru: { title: "Как поставить задачу coding-агенту до первого запуска", summary: "От неопределённой просьбы к проверяемому результату: момент ошибки, окружение, полномочия, исходные свидетельства и приёмка, которую удобно оценить с телефона.", body: briefRu,
      closing: "Дайте агенту конкретную цель и способ доказать результат, сохранив понятную задачу для следующего исполнения.", visuals: ["Действие пользователя, граница операции и результат образуют воспроизводимый сценарий. Это образ, а не запись выполненного теста.", "Предполагаемый результат сопоставляется с критериями приёмки. Иллюстрация не изображает результаты измерений."] },
    sources: [{ label: "GrantTap Help", url: "/support" }, { label: "Task continuity", url: "/blog/task-continuity-beyond-an-agent-session" }, { label: "Task transfer guide", url: "/blog/move-a-task-without-losing-work" }] }),
  novemberStory({ key: "approvals", date: "2026-10-31", slug: "granttap-agent-approval-request-lifecycle", images: ["cover", "identity", "receipt"],
    en: { title: "An approval has a lifecycle beyond the Allow button", summary: "Follow a decision from the phone to the execution boundary: request identity, stale answers, effective policy, host acknowledgment and verified continuation.", body: approvalsEn,
      closing: "One decision belongs to one request. Verify application and continuation at the computer that owns the operation.", visuals: ["Different fitted keys represent separate request identities. The scene is conceptual, not a real permission screen.", "An applied decision returns its own acknowledgment to the controller. This does not depict a measured or completed live request."] },
    ru: { title: "Жизненный цикл разрешения: что происходит после Allow", summary: "Путь решения от телефона до исполнения: идентичность запроса, старые ответы, эффективная политика, подтверждение компьютера и проверка продолжения работы.", body: approvalsRu,
      closing: "Одно решение относится к одному запросу. Проверяйте применение и продолжение у компьютера, который владеет операцией.", visuals: ["Разные ключи обозначают отдельные идентичности запросов. Это концептуальный образ, а не настоящий экран разрешения.", "Применённое решение получает отдельное подтверждение для контроллера. Это не измерение и не запись завершённого реального запроса."] },
    sources: [{ label: "GrantTap Help", url: "/support" }, { label: "Approval execution boundaries", url: "/blog/agent-approvals-at-the-execution-boundary" }, { label: "GrantTap governance", url: "/project-mesh" }] }),
  novemberStory({ key: "privacy", date: "2026-11-01", slug: "granttap-agent-privacy-devices-tools-data", images: ["cover", "endpoints", "diagnostics"],
    en: { title: "Which device can read this? A privacy map for agent work", summary: "Trace source, model context, decisions and diagnostics across the computer, phone, browser, provider and relay. Encryption and endpoint trust answer different questions.", body: privacyEn,
      closing: "Follow the actual data route and keep access as narrow as the task requires.", visuals: ["Native and browser controllers have separate trust boundaries. These objects are conceptual, not product captures.", "Selected diagnostic evidence stays separate from credentials and unrelated retained work. The illustration makes no claim about a specific security audit."] },
    ru: { title: "Кто может это прочитать: карта приватности работы агента", summary: "Проследите исходники, контекст модели, решения и диагностику между компьютером, телефоном, браузером, провайдером и relay. Шифрование и доверие к устройствам решают разные вопросы.", body: privacyRu,
      closing: "Следуйте реальному пути данных и ограничивайте доступ тем, что необходимо задаче.", visuals: ["Native-контроллер и браузер имеют разные границы доверия. Это концептуальные объекты, а не снимки продукта.", "Отобранные свидетельства диагностики отделены от credentials и посторонней истории. Иллюстрация не является результатом конкретного аудита безопасности."] },
    sources: [{ label: "GrantTap security", url: "/security" }, { label: "GrantTap privacy", url: "/privacy" }, { label: "Local and cloud agent boundaries", url: "/blog/local-cloud-hybrid-agent-boundaries" }, { label: "Browser control and endpoint storage", url: "https://github.com/sergii-ziborov/granttap-site#browser-control-beta" }] }),
  novemberStory({ key: "automations", date: "2026-11-02", slug: "granttap-useful-agent-automations-stop-controls", images: ["cover", "overlap", "stop"],
    en: { title: "Useful agent automations need a real stop control", summary: "Design recurring work around one question, an explicit destination and authority, a timezone, an overlap policy, useful results and a verified end to future runs.", body: automationsEn,
      closing: "A recurrence should reduce unnecessary attention and remain understandable, bounded and genuinely stoppable.", visuals: ["An active operation and a waiting occurrence stay separate at a shared resource. This is not a live scheduler view.", "Future recurrence is disconnected while retained results remain available. This conceptual image does not claim that a real automation was disabled."] },
    ru: { title: "Полезной автоматизации агента нужна настоящая остановка", summary: "Повторяющаяся работа вокруг одного вопроса: назначение и полномочия, часовой пояс, правило наложения, полезный отчёт и подтверждённое прекращение будущих запусков.", body: automationsRu,
      closing: "Повторение должно уменьшать лишнее внимание, оставаясь понятным, ограниченным и действительно отключаемым.", visuals: ["Активная операция и ожидающий запуск разделены на общем ресурсе. Это не экран действующего scheduler.", "Будущие повторы отключены, а прежние результаты сохранены. Концептуальный образ не сообщает об отключении реальной автоматизации."] },
    sources: [{ label: "GrantTap Help: queues and recurring work", url: "/support" }, { label: "Messages and deferred work", url: "/blog/messages-that-wait-for-the-computer" }, { label: "Task and execution continuity", url: "/blog/task-continuity-across-agents" }] }),
  novemberStory({ key: "devices", date: "2026-11-04", slug: "granttap-devices-runtime-login-cache-maintenance", images: ["cover", "identity", "cache"],
    en: { title: "Devices that are ready: runtime versions, login and cache", summary: "A computer can be online while a provider is unavailable. Inspect installed and running versions, authentication, owned processes and clearable storage before choosing a repair.", body: devicesEn,
      closing: "Repair the observed component, then verify the same Task route and the process that is actually running.", visuals: ["A connected computer and separate provider credentials represent different readiness facts. This is not an authentication screen.", "Replaceable derived cache is separated from retained work and credentials. The image does not report measured storage sizes."] },
    ru: { title: "Готовые Devices: версии runtime, вход и очистка кэша", summary: "Компьютер может быть онлайн при недоступном провайдере. Проверьте установленную и работающую версии, вход, процессы и категории хранения до выбора ремонта.", body: devicesRu,
      closing: "Исправляйте наблюдаемый компонент, затем проверяйте тот же маршрут Task и реально запущенный процесс.", visuals: ["Подключённый компьютер и credentials провайдера обозначают разные факты готовности. Это не экран авторизации.", "Восстанавливаемый кэш отделён от истории работы и credentials. Изображение не сообщает измеренные размеры хранилища."] },
    sources: [{ label: "GrantTap Help", url: "/support" }, { label: "GrantTap runtime and management", url: "https://github.com/sergii-ziborov/granttap-mcp" }, { label: "MCP security practices", url: "https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices" }] }),
  novemberStory({ key: "context", date: "2026-11-05", slug: "granttap-agent-context-fresh-evidence", images: ["cover", "citations", "refresh"],
    en: { title: "Context an agent can use: fresh evidence beyond a long chat", summary: "Select context for the next decision, bind claims to revisions, keep sources expandable and preserve constraints through compaction. Measure completeness before celebrating fewer tokens.", body: contextEn,
      closing: "Carry the next decision and its evidence, with a path back to source and an honest account of what remains unknown.", visuals: ["Selected evidence cards retain traceable connections to source. This illustrates a method, not a measured token-saving result.", "A changed source snapshot prompts a targeted evidence refresh. The image is conceptual and contains no real repository data."] },
    ru: { title: "Контекст, с которым агент может работать: свежие основания вместо длинного чата", summary: "Отбирайте контекст под решение, привязывайте выводы к revision, раскрывайте источники и сохраняйте ограничения после compaction. Проверяйте полноту до оценки экономии токенов.", body: contextRu,
      closing: "Передавайте следующее решение и его основания, сохраняя путь к исходнику и честное описание неизвестного.", visuals: ["Отобранные свидетельства сохраняют прослеживаемую связь с источником. Это образ метода, а не измеренный результат экономии токенов.", "Изменённый снимок исходников вызывает адресное обновление контекста. Иллюстрация не содержит данных реального репозитория."] },
    sources: [{ label: "Cortex Loom inside GrantTap", url: "/blog/cortex-loom-inside-granttap-token-economy" }, { label: "Anthropic: effective context engineering", url: "https://www.anthropic.com/research/effective-context-engineering-for-ai-agents" }, { label: "Task continuity", url: "/blog/task-continuity-beyond-an-agent-session" }] }),
];
