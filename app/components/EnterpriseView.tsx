"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageToggle, useLocale } from "./Locale";

const copy = {
  en: {
    personal: "Personal",
    account: "Open account",
    eyebrow: "GrantTap Enterprise",
    title: "Control stays with the organization.",
    accent: "Enforcement stays on the endpoint.",
    intro: "GrantTap adds a managed authorization layer to local Codex, Claude Code, Cursor, Copilot, and Grok workflows—without moving source code, prompts, or model traffic into a GrantTap control service.",
    primary: "Open QR sign-in",
    secondary: "Discuss Enterprise",
    proof: ["Signed organization policy", "Device-bound login receipt", "Deny wins at every layer"],
    liveKicker: "Implemented foundation",
    liveTitle: "The security boundary is real before the dashboard is pretty.",
    liveText: "A managed endpoint validates its enrollment, fresh login receipt, policy signature, tenant, subject, revision, and authorization epoch before local or agent approval can grant authority.",
    live: [
      ["Protected device login", "The endpoint creates its own Ed25519 identity and PKCE verifier. The QR contains only a one-time HTTPS verification URL and user code."],
      ["Signed policy", "Organization policy is pinned to tenant, subject, issuer key, revision, expiry, and authorization epoch."],
      ["Fail-closed decisions", "An invalid, expired, missing, or rolled-back managed policy denies managed capabilities before provider approval."],
      ["One machine install", "The same GrantTap installation serves all supported coding agents; adapters attach to that installation instead of creating separate helpers."],
    ],
    loginKicker: "Account and sign-in",
    loginTitle: "Two QR paths, two separate trust boundaries.",
    webTitle: "GrantTap Web — available now",
    webText: "Scan a one-time QR with GrantTap on iPhone. The encrypted browser workspace supports owner, admin, and approver roles plus one-time invitation links.",
    webAction: "Sign in with iPhone",
    orgTitle: "Managed endpoint login",
    orgText: "Enterprise machines use a device-bound login receipt issued by the organization's GrantTap Control deployment. Phone pairing and provider credentials remain separate.",
    orgNote: "The endpoint client and enforcement are implemented. Your organization still needs its private GrantTap Control issuer deployed before managed login can complete.",
    roadmapKicker: "Control plane status",
    roadmapTitle: "No roadmap feature is presented as shipped.",
    now: "Available in the current endpoint",
    later: "Next enterprise surface",
    nowItems: ["Signed endpoint policy", "Device identity + protected receipt storage", "Deny-wins provider enforcement", "QR-first browser approvals", "Browser owner/admin/approver roles + one-time invitations"],
    laterItems: ["Centralized organization directory and policy console", "SAML/OIDC SSO and SCIM", "Device inventory and remote revocation refresh", "Encrypted enterprise audit delivery and compliance exports"],
    closing: "Bring your identity provider, device fleet, and policy model. We will map the production control-plane rollout without weakening the endpoint boundary.",
    contact: "Contact Enterprise",
    rights: "© 2026 GrantTap. Enterprise control-plane services require a separate deployment agreement.",
  },
  ru: {
    personal: "Personal",
    account: "Войти",
    eyebrow: "GrantTap Enterprise",
    title: "Управление остаётся у организации.",
    accent: "Исполнение — на endpoint.",
    intro: "GrantTap добавляет управляемый слой авторизации к локальным Codex, Claude Code, Cursor, Copilot и Grok — не отправляя исходники, промпты или трафик модели в сервис управления GrantTap.",
    primary: "Открыть QR-вход",
    secondary: "Обсудить Enterprise",
    proof: ["Подписанная политика организации", "Login receipt с привязкой к устройству", "Запрет побеждает на каждом уровне"],
    liveKicker: "Реализованная основа",
    liveTitle: "Граница безопасности уже работает, даже пока админка ещё строится.",
    liveText: "Управляемый endpoint проверяет enrollment, свежий login receipt, подпись политики, tenant, subject, revision и authorization epoch до того, как локальное подтверждение или агент смогут выдать доступ.",
    live: [
      ["Защищённый вход устройства", "Endpoint создаёт собственную Ed25519 identity и PKCE verifier. В QR находятся только одноразовый HTTPS-адрес и пользовательский код."],
      ["Подписанная политика", "Политика привязана к tenant, subject, ключу issuer, revision, сроку и authorization epoch."],
      ["Fail-closed решения", "Неверная, просроченная, отсутствующая или откатившаяся политика запрещает управляемые возможности до provider approval."],
      ["Одна установка на компьютер", "Одна установка GrantTap обслуживает всех поддерживаемых агентов; адаптеры подключаются к ней без отдельных helper и пейрингов."],
    ],
    loginKicker: "Аккаунт и вход",
    loginTitle: "Два QR-сценария — две отдельные границы доверия.",
    webTitle: "GrantTap Web — доступен сейчас",
    webText: "Сканируйте одноразовый QR приложением GrantTap на iPhone. Зашифрованный browser workspace поддерживает роли owner, admin и approver, а также одноразовые ссылки-приглашения.",
    webAction: "Войти через iPhone",
    orgTitle: "Вход управляемого endpoint",
    orgText: "Enterprise-компьютер использует привязанный к устройству login receipt от развёрнутого в организации GrantTap Control. Пейринг телефона и provider credentials остаются отдельными.",
    orgNote: "Endpoint-клиент и enforcement реализованы. Для завершения управляемого входа организации ещё нужно развернуть приватный GrantTap Control issuer.",
    roadmapKicker: "Статус control plane",
    roadmapTitle: "Функции roadmap не выдаются за готовые.",
    now: "Доступно в текущем endpoint",
    later: "Следующая Enterprise-поверхность",
    nowItems: ["Подписанная endpoint policy", "Device identity и защищённое хранение receipt", "Deny-wins enforcement у providers", "QR-first approvals в браузере", "Browser-роли owner/admin/approver и одноразовые приглашения"],
    laterItems: ["Централизованный каталог организации и policy console", "SAML/OIDC SSO и SCIM", "Инвентарь устройств и онлайн-отзыв", "Зашифрованный Enterprise-аудит и compliance exports"],
    closing: "Подключим ваш identity provider, парк устройств и модель политик к production control plane — без ослабления endpoint-границы.",
    contact: "Связаться по Enterprise",
    rights: "© 2026 GrantTap. Сервисы Enterprise control plane требуют отдельного соглашения на развёртывание.",
  },
} as const;

export function EnterpriseView() {
  const { locale, setLocale } = useLocale();
  const t = copy[locale];
  return <main className="enterprise-shell">
    <header className="enterprise-header"><Link className="brand" href="/"><Image src="/app-icon.png" alt="" width={1024} height={1024} priority /><span>GrantTap</span></Link><nav><Link href="/">{t.personal}</Link><a href="#status">Status</a></nav><LanguageToggle locale={locale} setLocale={setLocale} /><a className="nav-cta" href="/account">{t.account}</a></header>
    <section className="enterprise-hero section-shell"><div><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}<span>{t.accent}</span></h1><p className="enterprise-lede">{t.intro}</p><div className="hero-actions"><a className="button button-primary" href="/account">{t.primary}</a><a className="button button-secondary" href="mailto:sergii.ziborov@gmail.com?subject=GrantTap%20Enterprise">{t.secondary}</a></div><ul className="hero-notes">{t.proof.map(item => <li key={item}><b>✓</b>{item}</li>)}</ul></div><EndpointCard /></section>
    <section className="enterprise-section section-shell"><SectionHeading kicker={t.liveKicker} title={t.liveTitle} text={t.liveText} /><div className="enterprise-grid">{t.live.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="enterprise-login"><div className="section-shell"><SectionHeading kicker={t.loginKicker} title={t.loginTitle} /><div className="login-paths"><article className="live-path"><span className="status-label">LIVE</span><h3>{t.webTitle}</h3><p>{t.webText}</p><a className="button button-primary" href="/account">{t.webAction} →</a></article><article><span className="status-label protected">PROTECTED</span><h3>{t.orgTitle}</h3><p>{t.orgText}</p><aside>{t.orgNote}</aside></article></div></div></section>
    <section className="enterprise-section section-shell" id="status"><SectionHeading kicker={t.roadmapKicker} title={t.roadmapTitle} /><div className="status-columns"><StatusList title={t.now} items={t.nowItems} ready /><StatusList title={t.later} items={t.laterItems} /></div></section>
    <section className="enterprise-closing section-shell"><p>{t.closing}</p><a className="button button-primary" href="mailto:sergii.ziborov@gmail.com?subject=GrantTap%20Enterprise">{t.contact} →</a></section>
    <footer className="enterprise-footer"><Link className="brand" href="/"><Image src="/app-icon.png" alt="" width={1024} height={1024} /><span>GrantTap</span></Link><p>{t.rights}</p></footer>
  </main>;
}

function EndpointCard() {
  return <div className="endpoint-card"><div className="endpoint-top"><span>MANAGED ENDPOINT</span><b>policy verified</b></div><div className="endpoint-rule"><small>ORGANIZATION</small><strong>maximum authority</strong></div><i>AND</i><div className="endpoint-rule"><small>COMPUTER + TASK</small><strong>local boundary</strong></div><i>AND</i><div className="endpoint-rule"><small>PROVIDER</small><strong>native approval</strong></div><div className="endpoint-result"><span>✓</span><strong>Effective authority</strong><small>any denial wins</small></div></div>;
}

function SectionHeading({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return <div className="section-heading"><p className="kicker">{kicker}</p><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

function StatusList({ title, items, ready = false }: { title: string; items: readonly string[]; ready?: boolean }) {
  return <article className={ready ? "status-ready" : "status-next"}><h3>{title}</h3><ul>{items.map(item => <li key={item}><span>{ready ? "✓" : "→"}</span>{item}</li>)}</ul></article>;
}
