import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Support",
  description: "Install GrantTap, troubleshoot pairing and delivery, and contact support.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <LegalPage
      title={{ en: "Support", ru: "Поддержка" }}
      updated={{ en: "August 20, 2026", ru: "20 августа 2026" }}
      updatedISO="2026-08-20"
      intro={{
        en: "Start with the checks below. If the problem remains, email support with versions and reproducible steps—but never with pairing secrets, encryption keys, or real task content.",
        ru: "Начните с проверок ниже. Если проблема остаётся, напишите в поддержку и укажите версии и шаги воспроизведения, но никогда не отправляйте секреты пейринга, ключи шифрования или реальные данные задачи.",
      }}
      sections={{
        en: [
          {
            heading: "Contact support",
            paragraphs: [
              "Email sergii.ziborov@gmail.com. Include the GrantTap app version, iPhone model and iOS version, Apple Watch model and watchOS version when relevant, Node.js version, granttap-mcp version, selected agent, and exact steps to reproduce. Screenshots are useful after sensitive paths, prompts, repository names, and secrets are removed.",
            ],
            links: [
              { label: "Email GrantTap support", href: "mailto:sergii.ziborov@gmail.com" },
              { label: "MCP issue tracker", href: "https://github.com/sergii-ziborov/granttap-mcp/issues" },
              { label: "Relay issue tracker", href: "https://github.com/sergii-ziborov/granttap-relay/issues" },
            ],
          },
          {
            heading: "Install GrantTap once, then add agents",
            bullets: [
              "Requirement: Node.js 20 or newer.",
              "Install one machine helper: npm install -g granttap-mcp. Then run granttap connect and granttap setup.",
              "A healthy existing phone pairing is reused. Reconnect does not rotate keys; use granttap connect --replace only when you explicitly want to unlink and pair this computer again.",
              "granttap setup adds or repairs every supported agent adapter it detects. Run it again after installing another agent; do not create a second helper or phone pairing.",
              "Codex plugin: codex plugin marketplace add sergii-ziborov/granttap, then codex plugin add granttap@personal. Open its prompts to Connect or reconnect, Add this agent, or Repair all agent connections.",
              "GrantTap pairing is not a provider login. Codex, Claude Code, Cursor, Copilot, and Grok Build keep their own authentication and model credentials.",
              "granttap status reads readiness without changing settings.",
              "Setup is designed to preserve unrelated agent settings. In Codex, review and trust the exact GrantTap hooks in /hooks, then restart Codex. Installation alone is not a trusted connection.",
            ],
            links: [
              { label: "granttap-mcp on npm", href: "https://www.npmjs.com/package/granttap-mcp" },
              { label: "Machine bridge source", href: "https://github.com/sergii-ziborov/granttap-mcp" },
            ],
          },
          {
            heading: "Cursor Settings → Authorize",
            paragraphs: [
              "Cursor shows an Authorize button only for an HTTP/SSE MCP server that supports OAuth; its normal command-and-arguments (stdio) entry is manual and has no Authorize button. This is a Cursor UI distinction, not a replacement for GrantTap encryption.",
              "To use Cursor's web console, run granttap authorize. It installs and checks a loopback-only service, then configures only the GrantTap Cursor entry. Open Cursor Settings → MCP → GrantTap → Authorize and complete the local consent screen. The local OAuth token is separate from, and does not replace, the one-time end-to-end encrypted pairing keys.",
            ],
          },
          {
            heading: "Pairing does not complete",
            bullets: [
              "Confirm the iPhone and computer can reach the internet and the cloud relay address uses wss://.",
              "Generate a fresh QR code: a pairing mailbox is single-use and expires after 15 minutes.",
              "If camera permission was denied, enable Camera in iOS Settings → GrantTap or use the manual pairing token.",
              "Update granttap-mcp, restart the local helper, and retry with a fresh pairing code.",
              "Do not paste the QR contents or manual token into an issue, email, chat, or screenshot.",
            ],
          },
          {
            heading: "Tasks or approvals do not appear",
            bullets: [
              "Open GrantTap and confirm it reports a live connection to the expected computer.",
              "Confirm the intended coding-agent integration is configured and the local helper is running on the computer shown by the task.",
              "Check iOS Settings → Notifications → GrantTap and Background App Refresh. Notifications are optional, but disabled system settings can prevent prompt background alerts.",
              "Open the app after a long offline period so it can reconnect and reconcile delivery state.",
              "APNs and background execution are scheduled by Apple; an alert cannot be guaranteed to arrive by a particular time. Use the original agent session as the fallback.",
            ],
          },
          {
            heading: "Apple Watch",
            bullets: [
              "Install GrantTap from the Watch app on iPhone if automatic app installation is disabled.",
              "Confirm the Watch is paired to the same iPhone, unlocked, and reachable by Bluetooth, Wi-Fi, or cellular as supported by the system.",
              "Open GrantTap on iPhone first after pairing or updating so the latest encrypted state can be made available to the Watch experience.",
              "For notification mirroring problems, verify Apple Watch notification settings on iPhone and the Focus state on both devices.",
            ],
          },
          {
            heading: "Voice, photos, and files",
            bullets: [
              "Microphone and speech permissions are required only for voice input. Re-enable them in iOS Settings → Privacy & Security if recording never starts.",
              "Photo-library access uses the system picker for items you select. If it does not open, check Photos permission and retry after reopening the app.",
              "A device, agent, or task may impose attachment count, size, or format limits. Remove sensitive metadata and confirm the selected agent supports the file type.",
            ],
          },
          {
            heading: "Privacy, deletion, and accessibility",
            paragraphs: [
              "The pages below explain the encryption boundary, local and relay data, exact deletion steps, and how to report an accessibility barrier. A private security vulnerability should be reported through GitHub Security Advisories rather than a public issue.",
            ],
            links: [
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Security", href: "/security" },
              { label: "Delete or manage data", href: "/data-rights" },
              { label: "Accessibility support", href: "/accessibility" },
              { label: "Private security report", href: "https://github.com/sergii-ziborov/granttap-relay/security/advisories/new" },
            ],
          },
          {
            heading: "App Store purchase help",
            paragraphs: [
              "Apple handles App Store purchases, receipts, billing, and refund decisions. Use Apple's Report a Problem service for a refund request or Apple's purchase support for an Apple Account billing problem.",
            ],
            links: [
              { label: "Apple Report a Problem", href: "https://reportaproblem.apple.com/" },
              { label: "Apple billing support", href: "https://support.apple.com/billing" },
            ],
          },
        ],
        ru: [
          {
            heading: "Связаться с поддержкой",
            paragraphs: [
              "Email: sergii.ziborov@gmail.com. Укажите версию GrantTap, модель iPhone и iOS, при необходимости модель Apple Watch и watchOS, версии Node.js и granttap-mcp, выбранного агента и точные шаги. Скриншоты полезны после удаления секретов, путей, промптов и названий репозиториев.",
            ],
            links: [
              { label: "Написать в поддержку GrantTap", href: "mailto:sergii.ziborov@gmail.com" },
              { label: "Проблемы MCP", href: "https://github.com/sergii-ziborov/granttap-mcp/issues" },
              { label: "Проблемы relay", href: "https://github.com/sergii-ziborov/granttap-relay/issues" },
            ],
          },
          {
            heading: "Установить GrantTap один раз и добавлять агентов",
            bullets: [
              "Требуется Node.js 20 или новее.",
              "Установите один помощник на компьютере: npm install -g granttap-mcp. Затем выполните granttap connect и granttap setup.",
              "Рабочий пейринг телефона переиспользуется. Reconnect не меняет ключи; granttap connect --replace нужен только по явному желанию отвязать и заново спарить этот компьютер.",
              "granttap setup добавляет или исправляет все найденные поддерживаемые адаптеры агентов. Повторите команду после установки нового агента — вторая установка GrantTap или пейринг телефона не нужны.",
              "Плагин Codex: codex plugin marketplace add sergii-ziborov/granttap, затем codex plugin add granttap@personal. В карточке доступны действия подключения, добавления этого агента и исправления всех связей.",
              "Пейринг GrantTap не является логином провайдера. Codex, Claude Code, Cursor, Copilot и Grok Build сохраняют собственную авторизацию и ключи моделей.",
              "granttap status только читает готовность и не меняет настройки.",
              "Setup должен сохранять не относящиеся к GrantTap настройки агентов. В Codex проверьте и подтвердите точные GrantTap hooks в /hooks, затем перезапустите Codex. Установка сама по себе не является доверенным подключением.",
            ],
            links: [
              { label: "granttap-mcp на npm", href: "https://www.npmjs.com/package/granttap-mcp" },
              { label: "Исходники моста", href: "https://github.com/sergii-ziborov/granttap-mcp" },
            ],
          },
          {
            heading: "Cursor Settings → Authorize",
            paragraphs: [
              "Cursor показывает кнопку Authorize только для HTTP/SSE MCP-сервера с OAuth; в обычной записи command-and-arguments (stdio) авторизация выполняется вручную и такой кнопки нет. Это различие интерфейса Cursor, а не замена шифрования GrantTap.",
              "Для веб-консоли Cursor выполните granttap authorize. Команда устанавливает и проверяет сервис только на loopback, затем настраивает только запись GrantTap в Cursor. Откройте Cursor Settings → MCP → GrantTap → Authorize и завершите локальное согласие. Локальный OAuth-токен отделён от одноразовых ключей сквозного пейринга и не заменяет их.",
            ],
          },
          {
            heading: "Пейринг не завершается",
            bullets: [
              "Проверьте интернет на iPhone и компьютере; облачный relay должен использовать адрес wss://.",
              "Создайте новый QR-код: pairing mailbox одноразовый и истекает через 15 минут.",
              "Если камера запрещена, включите её в Настройки iOS → GrantTap или используйте ручной токен.",
              "Обновите granttap-mcp, перезапустите локальный помощник и повторите с новым кодом.",
              "Не публикуйте содержимое QR и ручной токен в issue, письме, чате или скриншоте.",
            ],
          },
          {
            heading: "Задачи или подтверждения не появляются",
            bullets: [
              "Откройте GrantTap и проверьте живое соединение с нужным компьютером.",
              "Убедитесь, что нужная интеграция кодового агента настроена, а локальный помощник работает на компьютере, указанном в задаче.",
              "Проверьте Настройки iOS → Уведомления → GrantTap и Обновление контента. Уведомления необязательны, но запрет системных функций может мешать быстрым фоновым сигналам.",
              "После долгого офлайна откройте приложение для переподключения и сверки статусов доставки.",
              "APNs и фоновое выполнение планирует Apple; точное время уведомления не гарантируется. Исходная сессия агента остаётся резервным способом.",
            ],
          },
          {
            heading: "Apple Watch",
            bullets: [
              "Если автоустановка выключена, установите GrantTap через приложение Watch на iPhone.",
              "Проверьте, что часы спарены с тем же iPhone, разблокированы и доступны по Bluetooth, Wi‑Fi или сотовой сети в пределах возможностей системы.",
              "После пейринга или обновления сначала откройте GrantTap на iPhone, чтобы свежий зашифрованный статус стал доступен часам.",
              "Если не зеркалятся уведомления, проверьте настройки Apple Watch на iPhone и режим Фокусирования на обоих устройствах.",
            ],
          },
          {
            heading: "Голос, фото и файлы",
            bullets: [
              "Микрофон и распознавание речи нужны только для голосового ввода. Если запись не запускается, верните разрешения в Настройки iOS → Конфиденциальность и безопасность.",
              "Фотографии выбираются через системный picker. Если он не открывается, проверьте доступ к Фото и перезапустите приложение.",
              "Устройство, агент или задача могут ограничивать число, размер и формат вложений. Удаляйте чувствительные метаданные и проверяйте поддержку формата агентом.",
            ],
          },
          {
            heading: "Данные, удаление и доступность",
            paragraphs: [
              "Страницы ниже описывают границы шифрования, локальные и relay-данные, точные шаги удаления и отправку сообщения о барьере доступности. Уязвимость сообщайте закрыто через GitHub Security Advisories, а не в публичном issue.",
            ],
            links: [
              { label: "Политика конфиденциальности", href: "/privacy" },
              { label: "Безопасность", href: "/security" },
              { label: "Удалить или управлять данными", href: "/data-rights" },
              { label: "Поддержка доступности", href: "/accessibility" },
              { label: "Закрытое сообщение об уязвимости", href: "https://github.com/sergii-ziborov/granttap-relay/security/advisories/new" },
            ],
          },
          {
            heading: "Помощь с покупкой в App Store",
            paragraphs: [
              "Покупки, чеки, оплату и решение о возврате обрабатывает Apple. Для возврата используйте Report a Problem, а для проблем оплаты Apple Account — поддержку Apple.",
            ],
            links: [
              { label: "Apple Report a Problem", href: "https://reportaproblem.apple.com/" },
              { label: "Поддержка платежей Apple", href: "https://support.apple.com/billing" },
            ],
          },
        ],
      }}
    />
  );
}
