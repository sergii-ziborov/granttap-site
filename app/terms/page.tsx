import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for the GrantTap app, encrypted relay, and public machine bridge.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title={{ en: "Terms of Use", ru: "Условия использования" }}
      updated={{ en: "August 13, 2026", ru: "13 августа 2026" }}
      updatedISO="2026-08-13"
      intro={{
        en: "These terms cover the GrantTap app, encrypted relay, and related support services. GrantTap extends coding-agent sessions on computers you control; it does not replace the agent or move your project into a GrantTap cloud.",
        ru: "Эти условия относятся к приложению GrantTap, зашифрованному relay и поддержке. GrantTap дополняет сессии кодовых агентов на контролируемых вами компьютерах, а не заменяет агента и не переносит проект в облако GrantTap.",
      }}
      sections={{
        en: [
          {
            heading: "Agreement and license",
            paragraphs: [
              "By downloading or using GrantTap, you agree to these terms and any non-waivable rules that apply where you live. If you obtained the app through Apple's App Store, Apple's Standard Licensed Application End User License Agreement applies to the app license; these terms supplement it for the GrantTap relay, bridge, website, and support.",
              "GrantTap grants you a personal, limited, non-transferable license to use the app on Apple-branded products you own or control as allowed by the App Store rules and the Apple Standard EULA. No source-code license is granted for the iPhone or Apple Watch app.",
            ],
            links: [
              { label: "Apple Standard EULA", href: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" },
            ],
          },
          {
            heading: "Personal pairing",
            paragraphs: [
              "GrantTap pairing authorizes devices using locally held cryptographic credentials. Your Apple billing identity and third-party provider sign-ins remain separate and are governed by those services.",
            ],
          },
          {
            heading: "Your devices, agents, and approvals",
            bullets: [
              "You are responsible for the computers, agents, repositories, MCP servers, credentials, and devices you pair, and for complying with their terms and applicable law.",
              "Review each request before approving it. An agent action may edit or delete files, run commands, publish code, spend paid resources, or affect external systems.",
              "Protect paired devices and backups, enable suitable device authentication, and forget a pairing you no longer control.",
              "Keep an independent recovery path. GrantTap must not be the only approval, backup, safety, or emergency mechanism for important work.",
            ],
          },
          {
            heading: "Third-party agents and services",
            paragraphs: [
              "Cursor, Claude Code, Codex, Grok Build, Apple services, Cloudflare, MCP servers, repositories, and any external tool you select are independent services with their own terms and privacy practices. GrantTap does not control their outputs, availability, pricing, or data practices and does not proxy model traffic.",
              "References to third-party names describe compatibility only. GrantTap is an independent product and is not affiliated with, endorsed by, or sponsored by Apple, Anthropic, OpenAI, Anysphere, xAI, or Cloudflare.",
            ],
          },
          {
            heading: "Purchases and refunds",
            paragraphs: [
              "GrantTap is planned as an auto-renewable subscription with a 7-day free trial for eligible new subscribers. Personal is priced by linked computers: $1.99 per month for one, $3.99 for up to five, $5.99 for up to ten, with unlimited agents on each. The exact price and trial eligibility shown by Apple before confirmation control if they differ from this page.",
              "The subscription renews automatically unless cancelled at least 24 hours before the current period ends. App Store purchases, payment processing, taxes, family sharing, and refunds are handled by Apple. GrantTap does not receive your payment-card details.",
            ],
            links: [
              { label: "Pricing and subscription details", href: "/pricing" },
              { label: "Apple Report a Problem", href: "https://reportaproblem.apple.com/" },
            ],
          },
          {
            heading: "Acceptable use",
            bullets: [
              "Do not access a computer, project, account, or task without authorization.",
              "Do not interfere with, overload, probe, reverse engineer except where law permits, or bypass limits or security of the relay or app.",
              "Do not use GrantTap to distribute malware, violate rights, evade security controls, or break applicable law.",
              "Do not share pairing codes, room credentials, or encryption keys with someone you do not intend to authorize.",
            ],
          },
          {
            heading: "Availability and changes",
            paragraphs: [
              "The app, background delivery, APNs, relay, bridge integrations, speech recognition, and third-party agents may be delayed, interrupted, changed, or unavailable. Apple does not guarantee notification delivery, and GrantTap does not promise that a remote request will arrive by a particular time.",
              "We may update features or these terms to improve security, comply with law, or reflect service changes. Material terms changes will be posted with a new date and, when appropriate, surfaced in the app or release notes.",
            ],
          },
          {
            heading: "Ownership and open source",
            paragraphs: [
              "GrantTap branding, app design, and proprietary app code remain the property of their owner. The public MCP bridge, relay, website, and third-party components are governed by the licenses identified on the Licenses page and in their repositories.",
            ],
            links: [{ label: "Licenses and notices", href: "/licenses" }],
          },
          {
            heading: "Disclaimers and liability",
            paragraphs: [
              "To the maximum extent permitted by law, GrantTap is provided as available and without warranties of uninterrupted operation, error-free delivery, fitness for a particular purpose, or agent-output accuracy. You remain responsible for reviewing changes and maintaining backups.",
              "To the maximum extent permitted by law, the developer is not liable for indirect, incidental, special, consequential, or punitive loss, loss of data, source code, profits, or business caused by use or inability to use GrantTap. Nothing here limits liability or consumer rights that applicable law does not allow to be limited.",
            ],
          },
          {
            heading: "Stopping use and contact",
            paragraphs: [
              "You may stop using GrantTap at any time, forget the paired computer, and remove local data. Access may be limited to protect users or the service from abuse or a security threat. Sections that by their nature should survive—such as ownership, disclaimers, and lawful limits—continue after use ends.",
              "Questions about these terms can be sent to the support email below. Do not include pairing secrets, keys, or real task content.",
            ],
            links: [
              { label: "Deletion and data choices", href: "/data-rights" },
              { label: "Email support", href: "mailto:sergii.ziborov@gmail.com" },
            ],
          },
        ],
        ru: [
          {
            heading: "Согласие и лицензия",
            paragraphs: [
              "Скачивая или используя GrantTap, вы соглашаетесь с этими условиями и неотчуждаемыми правилами вашей юрисдикции. Если приложение получено через App Store, к лицензии применяется стандартное лицензионное соглашение Apple; эти условия дополняют его для relay, моста, сайта и поддержки GrantTap.",
              "GrantTap предоставляет личную, ограниченную и непередаваемую лицензию на использование приложения на принадлежащих или контролируемых вами устройствах Apple в пределах правил App Store и стандартного EULA Apple. Лицензия на исходный код приложения для iPhone и Apple Watch не предоставляется.",
            ],
            links: [{ label: "Стандартное EULA Apple", href: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" }],
          },
          {
            heading: "Personal-пейринг",
            paragraphs: [
              "GrantTap разрешает устройства с помощью локальных криптографических данных. Платёжный профиль Apple и sign-in сторонних providers остаются отдельными и регулируются соответствующими сервисами.",
            ],
          },
          {
            heading: "Ваши устройства, агенты и подтверждения",
            bullets: [
              "Вы отвечаете за компьютеры, агентов, репозитории, MCP-серверы, учётные данные и спаренные устройства, а также за соблюдение их условий и закона.",
              "Проверяйте каждый запрос. Действие агента может изменить или удалить файлы, запустить команды, опубликовать код, потратить платные ресурсы или затронуть внешние системы.",
              "Защищайте устройства и резервные копии, включите подходящую проверку личности и удалите пейринг, который больше не контролируете.",
              "Сохраняйте независимый путь восстановления. GrantTap не должен быть единственным механизмом подтверждения, резервного копирования, безопасности или аварийного доступа.",
            ],
          },
          {
            heading: "Сторонние агенты и сервисы",
            paragraphs: [
              "Cursor, Claude Code, Codex, Grok Build, сервисы Apple, Cloudflare, MCP-серверы, репозитории и другие выбранные инструменты независимы и имеют собственные условия и правила данных. GrantTap не контролирует их ответы, доступность, цены или обработку данных и не проксирует трафик модели.",
              "Упоминание сторонних названий означает только совместимость. GrantTap — независимый продукт и не связан, не одобрен и не спонсируется Apple, Anthropic, OpenAI, Anysphere, xAI или Cloudflare.",
            ],
          },
          {
            heading: "Покупки и возвраты",
            paragraphs: [
              "GrantTap планируется как автопродлеваемая подписка с 7-дневным бесплатным пробным периодом для подходящих новых подписчиков. Personal тарифицируется по числу компьютеров: $1,99 в месяц за один, $3,99 — до пяти, $5,99 — до десяти, агентов на каждом — без ограничений. Если экран Apple перед подтверждением показывает другие цену или доступность trial, действуют данные Apple.",
              "Подписка продлевается автоматически, если не отменить её минимум за 24 часа до конца периода. Покупки, платежи, налоги, семейный доступ и возвраты обрабатывает Apple. GrantTap не получает данные платёжной карты.",
            ],
            links: [
              { label: "Тарифы и подписка", href: "/pricing" },
              { label: "Apple Report a Problem", href: "https://reportaproblem.apple.com/" },
            ],
          },
          {
            heading: "Допустимое использование",
            bullets: [
              "Не подключайтесь без разрешения к компьютеру, проекту, аккаунту или задаче.",
              "Не мешайте работе relay или приложения, не перегружайте и не исследуйте их, не обходите лимиты и защиту; обратная разработка допустима только в пределах закона.",
              "Не используйте GrantTap для вредоносного ПО, нарушения чужих прав, обхода защитных мер или закона.",
              "Не передавайте коды пейринга, данные комнаты и ключи тем, кого не хотите авторизовать.",
            ],
          },
          {
            heading: "Доступность и изменения",
            paragraphs: [
              "Приложение, фоновая доставка, APNs, relay, интеграции моста, распознавание речи и сторонние агенты могут задерживаться, прерываться, меняться или быть недоступны. Apple не гарантирует доставку уведомлений, а GrantTap не обещает прибытие удалённого запроса к определённому времени.",
              "Функции и условия могут обновляться для безопасности, выполнения закона или отражения изменений сервисов. Существенные изменения публикуются с новой датой и, когда уместно, показываются в приложении или release notes.",
            ],
          },
          {
            heading: "Права и открытый код",
            paragraphs: [
              "Бренд GrantTap, дизайн и закрытый код приложения остаются собственностью правообладателя. Публичные MCP-мост, relay, сайт и сторонние компоненты регулируются лицензиями на странице лицензий и в их репозиториях.",
            ],
            links: [{ label: "Лицензии и уведомления", href: "/licenses" }],
          },
          {
            heading: "Отказ от гарантий и ответственность",
            paragraphs: [
              "В максимально допустимой законом степени GrantTap предоставляется «как доступно», без гарантий непрерывной работы, безошибочной доставки, пригодности для цели или точности ответов агента. Вы отвечаете за проверку изменений и резервные копии.",
              "В максимально допустимой законом степени разработчик не отвечает за косвенные, случайные, специальные, последующие или штрафные убытки, потерю данных, кода, прибыли или бизнеса из-за использования или недоступности GrantTap. Это не ограничивает ответственность и потребительские права, которые закон запрещает ограничивать.",
            ],
          },
          {
            heading: "Прекращение использования и контакт",
            paragraphs: [
              "Можно прекратить использование в любое время, удалить пейринг и локальные данные. Доступ может быть ограничен для защиты пользователей или сервиса от злоупотребления и угроз. Положения, которые по смыслу должны сохраняться, включая права и законные ограничения, продолжают действовать.",
              "Вопросы по условиям направляйте в поддержку. Не прикладывайте секреты пейринга, ключи или реальные данные задачи.",
            ],
            links: [
              { label: "Удаление и управление данными", href: "/data-rights" },
              { label: "Написать в поддержку", href: "mailto:sergii.ziborov@gmail.com" },
            ],
          },
        ],
      }}
    />
  );
}
