import type { Metadata } from "next";
import Image from "next/image";
import { LocaleLinks, SiteFooter, SiteHeader } from "../components/SiteChrome";
import { installationAction, launchOffer, localizedProductPath, usdPrice } from "../ProductOffer";

type Params = { searchParams: Promise<{ lang?: string }> };

const screens = [
  { file: "mac-now.png", en: "Now", ru: "Сейчас" },
  { file: "mac-tasks.png", en: "Tasks", ru: "Задачи" },
  { file: "mac-task.png", en: "Task conversation", ru: "Чат задачи" },
  { file: "mac-mesh.png", en: "Project Mesh", ru: "Mesh проекта" },
  { file: "mac-usage.png", en: "Usage", ru: "Статистика" },
] as const;

const content = {
  en: {
    title: "GrantTap for Mac",
    intro: "Your coding-agent tasks, history and project rules on Mac, with linked iPhone and iPad clients.",
    availability: "Available in TestFlight by invitation. The first commercial release and its paid products are being prepared.",
    installTitle: "How the Mac app connects",
    steps: [
      "Install GrantTap for Mac. Sign in with the same GrantTap passkey to manage linked computers; a controller-only Mac needs no local MCP.",
      "To work with agents running on this Mac, install the separate GrantTap MCP helper here, run granttap setup, and authorize local Mac access.",
      "Use the same passkey to join your Account Mesh, or pair an iPhone or iPad directly with a one-time QR. A passkey alone does not transfer a device pairing key.",
    ],
    captureTitle: "The real Mac app",
    captureNote: "Screens captured from the signed Mac Catalyst SwiftUI app with deterministic sample work. They contain no customer tasks or private credentials.",
    more: "The iPhone, iPad and Mac apps share task, Mesh and Usage views. The Mac app can inspect local agent work only when its separate MCP helper is running and local access has been approved.",
    support: "Connection and testing help",
    source: "Mac source and build instructions",
  },
  ru: {
    title: "GrantTap для Mac",
    intro: "Задачи coding-агентов, история и правила проекта на Mac со связанными iPhone и iPad.",
    availability: "Доступно в TestFlight по приглашению. Первый коммерческий релиз и платные продукты готовятся.",
    installTitle: "Как подключается Mac-приложение",
    steps: [
      "Установите GrantTap для Mac. Войдите с тем же passkey GrantTap для управления связанными компьютерами: Mac только в роли контроллера не требует локального MCP.",
      "Для работы с агентами на этом Mac установите сюда отдельный GrantTap MCP, выполните granttap setup и подтвердите локальный доступ.",
      "Войдите с тем же passkey в Mesh аккаунта или напрямую подключите iPhone либо iPad одноразовым QR. Сам passkey не передаёт ключ пары устройств.",
    ],
    captureTitle: "Настоящее приложение Mac",
    captureNote: "Экраны сняты с подписанного SwiftUI-приложения Mac Catalyst с детерминированными примерами. Личных задач и ключей на них нет.",
    more: "iPhone, iPad и Mac используют общие экраны задач, Mesh и статистики. Mac показывает локальную работу агентов, когда отдельно установленный MCP запущен и локальный доступ подтверждён.",
    support: "Помощь с подключением и тестированием",
    source: "Исходный код и сборка Mac",
  },
};

export async function generateMetadata({ searchParams }: Params): Promise<Metadata> {
  const { lang } = await searchParams;
  const ru = lang === "ru";
  return {
    title: ru ? "GrantTap для Mac" : "GrantTap for Mac",
    description: content[ru ? "ru" : "en"].intro,
    alternates: { canonical: ru ? "/mac?lang=ru" : "/mac", languages: { en: "/mac", ru: "/mac?lang=ru" } },
    openGraph: { images: [{ url: ru ? "/product/mac-now-ru.png" : "/product/mac-now.png", width: 2880, height: 1780 }] },
  };
}

export default async function MacPage({ searchParams }: Params) {
  const { lang } = await searchParams;
  const locale = lang === "ru" ? "ru" : "en";
  const t = content[locale];
  const action = installationAction(locale, "mac");
  return <main lang={locale} className="mac-page">
    <SiteHeader locale={locale} active="mac" languageControl={<LocaleLinks locale={locale} path="/mac" />} />
    <section className="section-shell mac-page-intro">
      <p className="kicker">Mac · SwiftUI</p><h1>{t.title}</h1><p>{t.intro}</p>
      <p className="mac-availability">{t.availability}</p>
      <div className="mac-page-links"><a className="button button-primary" href={action.href}>{action.label}</a><a href={localizedProductPath("/support", locale)}>{t.support} →</a><a href="https://github.com/sergii-ziborov/granttap/tree/main/apps/macos">{t.source} ↗</a></div>
    </section>
    <section className="section-shell offer-included">
      <h2>{locale === "ru" ? "Два способа использовать GrantTap на Mac" : "Two ways to use GrantTap on Mac"}</h2>
      <div className="offer-plans offer-mac-modes">
        <article className="offer-card"><h3>{locale === "ru" ? "Managed-клиент" : "Managed client"}</h3>
          <p>{locale === "ru" ? "В составе активной Personal на вашем аккаунте. Отдельная Mac Local для managed-доступа не нужна. Mac только в роли контроллера не занимает место компьютера-исполнителя." : "Included in active Personal on your account. No separate Mac Local purchase is needed for managed access. A controller-only Mac does not use a publishing-computer seat."}</p></article>
        <article className="offer-card"><h3>Mac Local — {usdPrice(launchOffer.macLocal.usdCents, locale)}</h3>
          <p>{locale === "ru" ? "Разовая лицензия для локального управления и собственного relay. Personal для этого режима не нужна. Managed-хостинг не включён; вы обеспечиваете доступный TLS endpoint или VPN и собственную инфраструктуру." : "A one-time license for local control and your own relay. No Personal subscription is required for that mode. Managed hosting is not included; you provide a reachable TLS endpoint or VPN and your infrastructure."}</p></article>
      </div>
      <p className="offer-note">{locale === "ru" ? "Это планируемые цены первого релиза в США. Доступность и локальную цену показывает окно покупки Apple." : "These are planned US prices for the first release. Apple’s purchase sheet controls availability and local pricing."}</p>
      <a className="button button-secondary" href={localizedProductPath("/pricing", locale)}>{locale === "ru" ? "Сравнить планы и условия" : "Compare plans and terms"}</a>
    </section>
    <section className="section-shell mac-page-captures">
      <h2>{t.captureTitle}</h2><p>{t.captureNote}</p>
      <div className="mac-page-gallery">{screens.map((screen) =>
        <figure key={screen.file}><a href={`/product/${locale === "ru" ? screen.file.replace(".png", "-ru.png") : screen.file}`} target="_blank" rel="noopener noreferrer">
          <Image src={`/product/${locale === "ru" ? screen.file.replace(".png", "-ru.png") : screen.file}`} alt={`GrantTap for Mac: ${screen[locale]}`} width={2880} height={1780} loading="lazy" unoptimized />
        </a><figcaption>{screen[locale]}</figcaption></figure>)}</div>
    </section>
    <section className="section-shell mac-page-connect"><h2>{t.installTitle}</h2><ol>{t.steps.map(step => <li key={step}>{step}</li>)}</ol><p>{t.more}</p></section>
    <SiteFooter locale={locale} />
  </main>;
}
