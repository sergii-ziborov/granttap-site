import { composeStory } from "../compose";
import EN from "./access-en.md?raw";
import RU from "./access-ru.md?raw";

export const accessStory = composeStory({
  "slug": "granttap-macos-agent-file-permissions",
  "date": "2026-10-11",
  "reviewedOn": "2026-11-05",
  "publishedOn": "2026-11-05",
  "cover": "/blog/seo2026-guides/access-cover.webp",
  "inlineIllustration": "/blog/seo2026-guides/access-layers.webp",
  "additionalIllustration": "/blog/seo2026-guides/access-proof.webp",
  "en": {
    body: EN,
    "title": "Agent permission denied on macOS: find the actual boundary",
    "summary": "A focused file-access investigation: identify the path, process, owner, system permission and provider policy before changing access.",
    "closing": "Repair the narrow missing permission and repeat the original operation from the original process.",
    "category": "Practical agent workflows",
    "sources": [
      {
        "label": "Apple: control access to files and folders",
        "url": "https://support.apple.com/guide/mac-help/control-access-to-files-and-folders-on-mac-mchld5a35146/mac"
      },
      {
        "label": "Apple Platform Security: privacy controls",
        "url": "https://support.apple.com/en-ca/guide/security/secddd1d86a6/web"
      },
      {
        "label": "GrantTap: restrictions",
        "url": "/guide/restrictions"
      },
      {
        "label": "GrantTap: provider boundaries",
        "url": "/guide/providers"
      }
    ],
    "editorialNote": "Prepared and reviewed on November 5, 2026. The earlier date is an archive slot, not the original publication date or a news report from that day. Diagnostic scenarios are proposed checks, not claims about tests performed on your device.",
    "illustrationCaption": "Original AI-generated illustration of the article’s idea, not an application screen or a measured result.",
    "additionalIllustrationCaption": "A separate ImageGen illustration of the scenario. Actual observations and captures are identified separately.",
    "practice": {
      "title": "Try a focused check",
      "intro": "Use a dedicated test Task and the intended authorized working directory.",
      "steps": [
        {
          "title": "Observe without modifying permissions",
          "detail": "Run these read-only commands in the affected working directory. Review path names locally before sharing output.",
          "code": "pwd -P\nid\nls -ld ."
        },
        {
          "title": "Name the failing operation",
          "detail": "Distinguish reading, creating, replacing and deleting. A successful read does not prove a write is permitted."
        },
        {
          "title": "Verify the same process",
          "detail": "Retest the narrow harmless operation from the agent process, then confirm that unrelated folders remain outside the intended scope."
        }
      ]
    }
  },
  "ru": {
    body: RU,
    "title": "Агенту запрещён доступ на macOS: найдите настоящую границу",
    "summary": "Диагностика доступа к файлам: путь, процесс, владелец, системное разрешение и политика провайдера до изменения прав.",
    "closing": "Восстановите минимальное недостающее разрешение и повторите исходную операцию из исходного процесса.",
    "category": "Работа агента на практике",
    "sources": [
      {
        "label": "Apple: control access to files and folders",
        "url": "https://support.apple.com/guide/mac-help/control-access-to-files-and-folders-on-mac-mchld5a35146/mac"
      },
      {
        "label": "Apple Platform Security: privacy controls",
        "url": "https://support.apple.com/en-ca/guide/security/secddd1d86a6/web"
      },
      {
        "label": "GrantTap: restrictions",
        "url": "/guide/restrictions"
      },
      {
        "label": "GrantTap: provider boundaries",
        "url": "/guide/providers"
      }
    ],
    "editorialNote": "Подготовлено и проверено 5 ноября 2026 года. Более ранняя дата — слот архива, а не дата первоначальной публикации или новость того дня. Сценарии диагностики — предлагаемые проверки, а не утверждение об их выполнении на вашем устройстве.",
    "illustrationCaption": "Оригинальная AI-иллюстрация идеи статьи. Это не экран приложения и не результат измерения.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация сценария. Настоящие наблюдения и скриншоты обозначаются отдельно.",
    "practice": {
      "title": "Короткая проверка",
      "intro": "Используйте отдельную тестовую Task и только разрешённую рабочую папку.",
      "steps": [
        {
          "title": "Сначала наблюдайте без изменения прав",
          "detail": "Выполните команды чтения в затронутой папке. Перед публикацией вывода локально проверьте приватность имён путей.",
          "code": "pwd -P\nid\nls -ld ."
        },
        {
          "title": "Назовите отказавшую операцию",
          "detail": "Различайте чтение, создание, замену и удаление. Успешное чтение не доказывает право записи."
        },
        {
          "title": "Повторите из того же процесса",
          "detail": "Повторите ограниченную безопасную операцию из процесса агента и убедитесь, что посторонние папки остаются вне разрешённой области."
        }
      ]
    }
  }
});
