import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "GrantTap accessibility approach, website support, known verification limits, and barrier reporting.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <LegalPage
      title={{ en: "Accessibility", ru: "Доступность" }}
      updated={{ en: "August 2, 2026", ru: "2 августа 2026" }}
      updatedISO="2026-08-02"
      intro={{
        en: "GrantTap aims to keep common approval and reply tasks usable with system accessibility features on iPhone, Apple Watch, and the web. Please report any barrier so it can be reproduced and fixed.",
        ru: "GrantTap стремится поддерживать системные функции доступности для основных подтверждений и ответов на iPhone, Apple Watch и сайте. Сообщите о любом барьере, чтобы его можно было воспроизвести и исправить.",
      }}
      sections={{
        en: [
          {
            heading: "App approach",
            bullets: [
              "Use native controls and system text, authentication, notification, camera, photo, file, speech, and haptic mechanisms where practical.",
              "Keep labels and status available without relying only on color, and maintain touch targets suited to the device.",
              "Design and test common tasks for system text sizing, VoiceOver labels, reduced motion, increased contrast, and Voice Control where the platform and layout allow.",
              "Keep Apple Watch flows short, with clear status and a focused action rather than duplicating the full iPhone interface.",
            ],
          },
          {
            heading: "Website support",
            bullets: [
              "Semantic headings, landmarks, lists, link names, and a keyboard skip link organize the pages.",
              "Keyboard focus is visible, controls have accessible names, and content does not require hover.",
              "English and Russian can be selected explicitly, and the document language updates with the selection.",
              "Motion is reduced when the operating system requests reduced motion; the legal and support content remains usable on narrow screens.",
            ],
          },
          {
            heading: "App Store accessibility disclosures",
            paragraphs: [
              "Apple's Accessibility Nutrition Labels are feature claims for every common task on each supported device. GrantTap will publish only labels verified against the release build on iPhone and Apple Watch. This page describes the design approach; it is not a claim that every Apple accessibility criterion has already been independently audited.",
            ],
            links: [
              { label: "Apple accessibility criteria", href: "https://developer.apple.com/help/app-store-connect/reference/accessibility-evaluation-criteria/" },
            ],
          },
          {
            heading: "Report an accessibility barrier",
            paragraphs: [
              "Email support with the device and model, iOS or watchOS version, GrantTap version, accessibility feature in use, expected result, and the shortest sequence that reproduces the barrier. A screen recording or screenshot can help after all private task content and paths are removed.",
              "Never send a pairing token, encryption key, real approval payload, repository secret, or confidential prompt. Accessibility reports are handled as support correspondence under the Privacy Policy.",
            ],
            links: [
              { label: "Email accessibility support", href: "mailto:sergii.ziborov@gmail.com?subject=GrantTap%20accessibility" },
              { label: "Support", href: "/support" },
              { label: "Privacy Policy", href: "/privacy" },
            ],
          },
        ],
        ru: [
          {
            heading: "Подход в приложении",
            bullets: [
              "По возможности используются нативные элементы и системные механизмы текста, аутентификации, уведомлений, камеры, фото, файлов, речи и тактильных сигналов.",
              "Подписи и статусы не должны зависеть только от цвета, а области нажатия должны подходить устройству.",
              "Основные задачи проектируются и проверяются с системным размером текста, VoiceOver, уменьшением движения, повышенным контрастом и Voice Control там, где это допускают платформа и компоновка.",
              "Сценарии Apple Watch остаются короткими: ясный статус и целевое действие вместо копии всего интерфейса iPhone.",
            ],
          },
          {
            heading: "Поддержка на сайте",
            bullets: [
              "Страницы организованы семантическими заголовками, landmarks, списками, понятными названиями ссылок и переходом к содержимому с клавиатуры.",
              "Фокус клавиатуры видим, элементы имеют доступные имена, а содержимое не требует hover.",
              "Английский и русский выбираются явно, а язык документа меняется вместе с выбором.",
              "Анимации сокращаются по системной настройке, юридические страницы и поддержка работают на узких экранах.",
            ],
          },
          {
            heading: "Сведения о доступности в App Store",
            paragraphs: [
              "Accessibility Nutrition Labels Apple — это заявления о каждой распространённой задаче на каждом поддерживаемом устройстве. GrantTap опубликует только метки, проверенные на релизной сборке iPhone и Apple Watch. Эта страница описывает подход, но не утверждает, что все критерии Apple уже прошли независимый аудит.",
            ],
            links: [
              { label: "Критерии доступности Apple", href: "https://developer.apple.com/help/app-store-connect/reference/accessibility-evaluation-criteria/" },
            ],
          },
          {
            heading: "Сообщить о барьере",
            paragraphs: [
              "Укажите устройство и модель, версию iOS или watchOS, версию GrantTap, используемую функцию доступности, ожидаемый результат и короткие шаги. Скриншот или запись полезны после удаления приватных задач и путей.",
              "Никогда не отправляйте токен пейринга, ключ, реальный approval payload, секрет репозитория или закрытый промпт. Такие сообщения обрабатываются как поддержка по Политике конфиденциальности.",
            ],
            links: [
              { label: "Написать о доступности", href: "mailto:sergii.ziborov@gmail.com?subject=GrantTap%20accessibility" },
              { label: "Поддержка", href: "/support" },
              { label: "Политика конфиденциальности", href: "/privacy" },
            ],
          },
        ],
      }}
    />
  );
}
