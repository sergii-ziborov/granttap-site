import { composeStory } from "../compose";
import EN from "./sleep-en.md?raw";
import RU from "./sleep-ru.md?raw";

export const sleepStory = composeStory({
  "slug": "granttap-sleeping-mac-agent-delivery",
  "date": "2026-10-09",
  "reviewedOn": "2026-11-05",
  "publishedOn": "2026-11-05",
  "cover": "/blog/seo2026-guides/sleep-cover.webp",
  "inlineIllustration": "/blog/seo2026-guides/sleep-states.webp",
  "additionalIllustration": "/blog/seo2026-guides/sleep-return.webp",
  "en": {
    body: EN,
    "title": "Why a sleeping Mac does not answer your coding-agent message",
    "summary": "Distinguish display sleep, system sleep, relay storage, computer receipt and agent activity before retrying the original message.",
    "closing": "Recover the original operation from its last confirmed boundary before creating another one.",
    "category": "Practical agent workflows",
    "sources": [
      {
        "label": "Apple: battery settings",
        "url": "https://support.apple.com/guide/mac-help/change-battery-settings-mchlfc3b7879/mac"
      },
      {
        "label": "GrantTap: message delivery",
        "url": "/guide/message-delivery"
      },
      {
        "label": "GrantTap: device management",
        "url": "/guide/device-management"
      },
      {
        "label": "GrantTap: provider sign-in",
        "url": "/guide/provider-sign-in"
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
          "title": "Keep the original correlation",
          "detail": "Record the task, message ID, send time and last confirmed step. Do not copy a real private prompt into a diagnostic log.",
          "code": "Task: dedicated delivery test\nMessage: original ID\nRelay stored: yes / no / unknown\nComputer received: yes / no / unknown\nAgent activity: yes / no / unknown"
        },
        {
          "title": "Compare two states",
          "detail": "Try one harmless message with the computer awake, then inspect the same boundaries after a controlled sleep and wake."
        },
        {
          "title": "Resume before resending",
          "detail": "Inspect whether the provider already received or started the work. Recovery must not create an unintentional second turn."
        }
      ]
    }
  },
  "ru": {
    body: RU,
    "title": "Почему спящий Mac не отвечает агентом: проверяем всю доставку",
    "summary": "Отделяем выключенный экран, сон системы, сохранение на relay, приём компьютером и начало работы агента до повторной отправки.",
    "closing": "Восстанавливайте исходную операцию от последнего подтверждённого этапа, прежде чем создавать новую.",
    "category": "Работа агента на практике",
    "sources": [
      {
        "label": "Apple: battery settings",
        "url": "https://support.apple.com/guide/mac-help/change-battery-settings-mchlfc3b7879/mac"
      },
      {
        "label": "GrantTap: message delivery",
        "url": "/guide/message-delivery"
      },
      {
        "label": "GrantTap: device management",
        "url": "/guide/device-management"
      },
      {
        "label": "GrantTap: provider sign-in",
        "url": "/guide/provider-sign-in"
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
          "title": "Сохраните исходную связь",
          "detail": "Запишите Task, ID сообщения, время и последний подтверждённый этап. Не копируйте приватный prompt в диагностический лог.",
          "code": "Task: dedicated delivery test\nMessage: original ID\nRelay stored: yes / no / unknown\nComputer received: yes / no / unknown\nAgent activity: yes / no / unknown"
        },
        {
          "title": "Сравните два состояния",
          "detail": "Проверьте одно безопасное сообщение на бодрствующем компьютере, затем те же границы после управляемого сна и пробуждения."
        },
        {
          "title": "Сначала восстановите исходную операцию",
          "detail": "Выясните, получил ли провайдер работу и начал ли её. Восстановление не должно создавать случайный второй turn."
        }
      ]
    }
  }
});
