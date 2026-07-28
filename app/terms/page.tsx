import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using GrantTap and its open-source bridge.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title={{ en: "Terms of Use", ru: "Условия использования" }}
      updated={{ en: "July 27, 2026", ru: "27 июля 2026" }}
      intro={{
        en: "GrantTap is a developer tool that forwards your decisions to coding agents running on computers you control.",
        ru: "GrantTap — инструмент разработчика, который передаёт ваши решения кодовым агентам на контролируемых вами компьютерах.",
      }}
      sections={{
        en: [
          { heading: "Your responsibility", paragraphs: ["You remain responsible for reviewing commands, protecting paired devices, and deciding whether an agent action is appropriate. An approval can modify or delete files, publish code, or affect external systems."] },
          { heading: "Availability", paragraphs: ["The iPhone and Apple Watch app is not yet available on the App Store and is being prepared for submission. Features, relay availability, and launch timing may change; no launch date is promised. In version 1.0.0, live requests are delivered while the iPhone app is open, and notifications mirror to Apple Watch. Do not rely on GrantTap as the only approval or recovery mechanism."] },
          { heading: "No affiliation", paragraphs: ["GrantTap is an independent product and is not affiliated with, endorsed by, or sponsored by Apple, Anthropic, OpenAI, Cloudflare, or their products."] },
          { heading: "Open-source components", paragraphs: ["The GrantTap MCP bridge, relay, and website are licensed separately under the licenses in their public repositories. The iPhone and Apple Watch application is proprietary unless stated otherwise."] },
          { heading: "Warranty", paragraphs: ["To the maximum extent permitted by law, GrantTap is provided as available and without warranties. Nothing here excludes rights that cannot lawfully be excluded."] },
        ],
        ru: [
          { heading: "Ваша ответственность", paragraphs: ["Вы отвечаете за проверку команд, защиту спаренных устройств и решение о допустимости действия агента. Подтверждение может изменить или удалить файлы, опубликовать код либо затронуть внешние системы."] },
          { heading: "Доступность", paragraphs: ["Приложение для iPhone и Apple Watch пока недоступно в App Store и готовится к отправке на проверку. Возможности, доступность relay и сроки запуска могут измениться; конкретная дата запуска не обещается. В версии 1.0.0 живые запросы доставляются, пока приложение открыто на iPhone; уведомления дублируются на Apple Watch. GrantTap не должен быть единственным механизмом подтверждения или восстановления."] },
          { heading: "Независимый продукт", paragraphs: ["GrantTap не связан и не одобрен Apple, Anthropic, OpenAI, Cloudflare или их продуктами."] },
          { heading: "Открытые компоненты", paragraphs: ["MCP-мост, relay и сайт GrantTap имеют отдельные лицензии в публичных репозиториях. Приложение для iPhone и Apple Watch является проприетарным, если не указано иное."] },
          { heading: "Гарантии", paragraphs: ["В максимально допустимой законом степени GrantTap предоставляется «как доступно», без гарантий. Неотчуждаемые законом права сохраняются."] },
        ],
      }}
    />
  );
}
