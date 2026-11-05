import { composeStory } from "../compose";
import EN from "./themes-en.md?raw";
import RU from "./themes-ru.md?raw";

export const themesStory = composeStory({
  "slug": "granttap-light-dark-auto-theme-testing",
  "date": "2026-10-13",
  "reviewedOn": "2026-11-05",
  "publishedOn": "2026-11-05",
  "screenshot": "/blog/seo2026-guides/site-theme-light.png",
  "cover": "/blog/seo2026-guides/themes-cover.webp",
  "inlineIllustration": "/blog/seo2026-guides/themes-auto.webp",
  "additionalIllustration": "/blog/seo2026-guides/themes-verify.webp",
  "en": {
    body: EN,
    screenshotCaption: "Actual Chromium capture of the GrantTap website release candidate on November 5, 2026, at 390 × 844 CSS pixels in Light. This is the website, not a native-app theme preview.",
    "title": "Light, Dark and Auto: a website theme that keeps its promise",
    "summary": "GrantTap’s website as a practical case study: system changes, explicit overrides, storage failures, first paint, cross-tab updates and readable technical pages.",
    "closing": "Verify the preference transitions and the reading experience, not only the background color.",
    "category": "Practical agent workflows",
    "sources": [
      {
        "label": "web.dev: prefers-color-scheme",
        "url": "https://web.dev/articles/prefers-color-scheme"
      },
      {
        "label": "MDN: storage event",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event"
      },
      {
        "label": "MDN: prefers-color-scheme",
        "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme"
      },
      {
        "label": "GrantTap Journal",
        "url": "/blog"
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
          "title": "Check Auto and explicit choice",
          "detail": "Choose Auto and switch system appearance. Then choose Light, switch the system again and verify that the explicit choice wins."
        },
        {
          "title": "Open another tab",
          "detail": "Change the preference in one tab, inspect the other, reload it and verify the saved selection."
        },
        {
          "title": "Read a long page on mobile",
          "detail": "Check headings, muted captions, code blocks, focus and navigation in both modes. A screenshot taken after loading does not prove there was no initial flash."
        }
      ]
    }
  },
  "ru": {
    body: RU,
    screenshotCaption: "Настоящий снимок сайта GrantTap из Chromium, кандидат выпуска 5 ноября 2026 года, 390 × 844 CSS-пикселя, светлая тема. Это сайт, а не настройка темы нативного приложения.",
    "title": "Светлая, тёмная и авто: тема сайта с понятным поведением",
    "summary": "Практический разбор сайта GrantTap: система, ручной выбор, отказ хранилища, первый рендеринг, соседние вкладки и читаемые технические страницы.",
    "closing": "Проверяйте переходы предпочтения и удобство чтения, а не только цвет фона.",
    "category": "Работа агента на практике",
    "sources": [
      {
        "label": "web.dev: prefers-color-scheme",
        "url": "https://web.dev/articles/prefers-color-scheme"
      },
      {
        "label": "MDN: storage event",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event"
      },
      {
        "label": "MDN: prefers-color-scheme",
        "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme"
      },
      {
        "label": "GrantTap Journal",
        "url": "/blog"
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
          "title": "Проверьте Auto и ручной режим",
          "detail": "Выберите Auto и смените системный режим. Затем выберите Light, снова смените систему и проверьте приоритет ручного выбора."
        },
        {
          "title": "Откройте соседнюю вкладку",
          "detail": "Измените тему в одной вкладке, проверьте вторую, перезагрузите её и проверьте сохранённый режим."
        },
        {
          "title": "Прочитайте длинную страницу на телефоне",
          "detail": "Проверьте заголовки, подписи, код, фокус и навигацию в обоих режимах. Поздний скриншот не доказывает отсутствие начальной вспышки."
        }
      ]
    }
  }
});
