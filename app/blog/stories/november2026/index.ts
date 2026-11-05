import { composeStory } from "../compose";
import { body as deliveryEn } from "./delivery-en";
import { body as deliveryRu } from "./delivery-ru";
import { additionalNovemberStories } from "./more";

export const novemberStories = [composeStory({
  slug: "granttap-message-delivery-working-status", date: "2026-11-03", publishedOn: "2026-11-04",
  cover: "/blog/november2026/delivery-cover.webp",
  inlineIllustration: "/blog/november2026/delivery-stages.webp",
  additionalIllustration: "/blog/november2026/delivery-recovery.webp",
  en: {
    title: "From Send to Started: understand an agent message's journey",
    summary: "A visible message, a relay receipt and agent activity establish different facts. A practical GrantTap guide to delayed requests, fresh Working status, safe retries and meaningful latency measurements.",
    category: "GrantTap guide", body: deliveryEn,
    illustrationCaption: "AI-generated conceptual illustration: a stored envelope, a receipt and active work are separate stages. The illustration is not a product screenshot or measured delivery timeline.",
    additionalIllustrationCaption: "AI-generated illustration of inspecting the same delayed instruction and recovering its route. It illustrates a diagnostic method, not a completed real-world delivery.",
    closing: "Keep one instruction, inspect its acknowledgments, and let observed execution determine the task state.",
    sources: [{ label: "GrantTap: waiting messages", url: "/blog/messages-that-wait-for-the-computer" }, { label: "GrantTap Help", url: "/support" }, { label: "GrantTap security boundary", url: "/security" }, { label: "GrantTap runtime source", url: "https://github.com/sergii-ziborov/granttap-mcp" }],
  },
  ru: {
    title: "От отправки до запуска: как проходит сообщение агенту",
    summary: "Сообщение в чате, подтверждение relay и активность агента доказывают разные события. Руководство GrantTap по задержкам, свежему Working, безопасным повторам и измерению скорости.",
    category: "Руководство GrantTap", body: deliveryRu,
    illustrationCaption: "Сгенерированная концептуальная иллюстрация: сохранённый пакет, подтверждение получения и работа являются разными стадиями. Это не скриншот и не измеренная временная шкала.",
    additionalIllustrationCaption: "Сгенерированный образ проверки исходной задержанной инструкции и восстановления её маршрута. Он объясняет метод диагностики, а не изображает завершённую реальную доставку.",
    closing: "Сохраняйте одну инструкцию, проверяйте подтверждения её пути и определяйте статус задачи по наблюдаемому исполнению.",
    sources: [{ label: "GrantTap: ожидающие сообщения", url: "/blog/messages-that-wait-for-the-computer" }, { label: "Справка GrantTap", url: "/support" }, { label: "Граница безопасности GrantTap", url: "/security" }, { label: "Исходники runtime GrantTap", url: "https://github.com/sergii-ziborov/granttap-mcp" }],
  },
}), ...additionalNovemberStories];
