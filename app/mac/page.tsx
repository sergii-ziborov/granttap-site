import type { Metadata } from "next";
import Image from "next/image";
import { LocaleLinks, SiteFooter, SiteHeader } from "../components/SiteChrome";

type Params = { searchParams: Promise<{ lang?: string }> };

const screens = [
  { file: "mac-now.jpg", en: "Now", ru: "Сейчас" },
  { file: "mac-tasks.jpg", en: "Tasks", ru: "Задачи" },
  { file: "mac-task.jpg", en: "Task conversation", ru: "Чат задачи" },
  { file: "mac-mesh.jpg", en: "Project Mesh", ru: "Mesh проекта" },
  { file: "mac-usage.jpg", en: "Usage", ru: "Статистика" },
] as const;

const content = {
  en: {
    title: "GrantTap for Mac",
    intro: "The SwiftUI control center for coding agents running on your Mac.",
    availability: "GrantTap for Mac is available to invited internal testers through TestFlight. The public Mac App Store release and its one-time license are not yet available for purchase.",
    installTitle: "How the Mac app connects",
    steps: [
      "Install GrantTap for Mac and the separate GrantTap MCP helper on the same computer.",
      "Authorize local Mac access. The app reads local tasks through an authenticated loopback connection.",
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
    intro: "SwiftUI-центр управления coding-агентами на вашем Mac.",
    availability: "GrantTap для Mac доступен приглашённым внутренним тестировщикам через TestFlight. Публичный выпуск в Mac App Store и разовая покупка лицензии пока недоступны.",
    installTitle: "Как подключается Mac-приложение",
    steps: [
      "Установите GrantTap для Mac и отдельный помощник GrantTap MCP на тот же компьютер.",
      "Подтвердите локальный доступ Mac. Приложение получает задачи через защищённое соединение с локальным помощником.",
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
    openGraph: { images: [{ url: "/product/mac-now.jpg", width: 2880, height: 1800 }] },
  };
}

export default async function MacPage({ searchParams }: Params) {
  const { lang } = await searchParams;
  const locale = lang === "ru" ? "ru" : "en";
  const t = content[locale];
  return <main lang={locale} className="mac-page">
    <SiteHeader locale={locale} active="mac" languageControl={<LocaleLinks locale={locale} path="/mac" />} />
    <section className="section-shell mac-page-intro">
      <p className="kicker">Mac · SwiftUI</p><h1>{t.title}</h1><p>{t.intro}</p>
      <p className="mac-availability">{t.availability}</p>
      <div className="mac-page-links"><a href="/support">{t.support} →</a><a href="https://github.com/sergii-ziborov/granttap/tree/main/apps/macos">{t.source} ↗</a></div>
    </section>
    <section className="section-shell mac-page-captures">
      <h2>{t.captureTitle}</h2><p>{t.captureNote}</p>
      <div className="mac-page-gallery">{screens.map((screen) =>
        <figure key={screen.file}><a href={`/product/${screen.file}`} target="_blank" rel="noopener noreferrer">
          <Image src={`/product/${screen.file}`} alt={`GrantTap for Mac: ${screen[locale]}`} width={2880} height={1800} loading="lazy" unoptimized />
        </a><figcaption>{screen[locale]}</figcaption></figure>)}</div>
    </section>
    <section className="section-shell mac-page-connect"><h2>{t.installTitle}</h2><ol>{t.steps.map(step => <li key={step}>{step}</li>)}</ol><p>{t.more}</p></section>
    <SiteFooter locale={locale} />
  </main>;
}
