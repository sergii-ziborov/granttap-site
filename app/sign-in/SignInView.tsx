"use client";

import { useEffect, useRef, useState } from "react";
import { LanguageToggle, useLocale } from "../components/Locale";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { nativeHandoff, type NativeHandoff } from "./tokenLink";

const copy = {
  en: {
    title: "Sign in to GrantTap", open: "Open GrantTap", missing: "This link is incomplete or invalid.",
    lead: "Continue in the app to review and confirm this account sign-in.",
    trust: "Only continue if you trust the person who sent this link. Anyone with it can access the account until it expires or is revoked.",
    fallback: "If the app does not open, choose Devices → Sign in with token in GrantTap and paste the original link.",
    create: "Create links in GrantTap: Devices → Sign-in tokens. Choose a name, expiry and number of uses; revoke them there at any time.",
    qrTitle: "Approve this sign-in in GrantTap",
    qrLead: "You scanned a sign-in code from granttap.com. GrantTap shows which browser asked, so you can approve or decline it.",
    qrTrust: "Approve only if you opened granttap.com yourself on a computer in front of you. Never approve a code someone sent you or a code shown on another website.",
    qrFallback: "If the app doesn't open, open GrantTap and tap Devices → Account → Sign in on the web, then scan the code again.",
  },
  ru: {
    title: "Вход в GrantTap", open: "Открыть GrantTap", missing: "Эта ссылка неполная или недействительна.",
    lead: "Продолжите в приложении, чтобы проверить и подтвердить вход в аккаунт.",
    trust: "Продолжайте, только если доверяете отправителю. Любой обладатель ссылки получает доступ к аккаунту до истечения срока или отзыва.",
    fallback: "Если приложение не открылось, выберите Устройства → Войти по токену в GrantTap и вставьте исходную ссылку.",
    create: "Создайте ссылку в GrantTap: Устройства → Токены входа. Укажите имя, срок и число входов. Там же можно отозвать её.",
    qrTitle: "Подтвердите вход в GrantTap",
    qrLead: "Вы отсканировали код входа с granttap.com. GrantTap покажет, какой браузер его запросил, и вы подтвердите или отклоните вход.",
    qrTrust: "Подтверждайте, только если вы сами открыли granttap.com на компьютере перед вами. Никогда не подтверждайте код, который вам прислали или показали на другом сайте.",
    qrFallback: "Если приложение не открылось, откройте GrantTap, нажмите Устройства → Аккаунт → Войти на сайте и отсканируйте код снова.",
  },
};

export function SignInView() {
  const { locale, setLocale } = useLocale();
  const [handoff, setHandoff] = useState<NativeHandoff | null>(null);
  const [ready, setReady] = useState(false);
  const captured = useRef<{ handoff: NativeHandoff | null } | null>(null);
  useEffect(() => {
    if (!captured.current) {
      captured.current = { handoff: nativeHandoff(window.location.hash) };
      // Drop the credential from this history entry. Never send it to an API or storage.
      window.history.replaceState(null, "", window.location.pathname);
    }
    const value = captured.current.handoff;
    const timer = window.setTimeout(() => { setHandoff(value); setReady(true); }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const t = copy[locale];
  return <div className="site-wrap account-page">
    <SiteHeader locale={locale} languageControl={<LanguageToggle locale={locale} setLocale={setLocale} />} />
    <main className="account-main signed-out"><section className="account-card account-handoff">
      <p className="account-kicker">GrantTap</p><h1>{handoff?.kind === "qr" ? t.qrTitle : t.title}</h1>
      <p className="account-lead">{handoff?.kind === "qr" ? t.qrLead : t.lead}</p>
      {handoff ? <><div className="account-warning" role="note"><p>{handoff.kind === "qr" ? t.qrTrust : t.trust}</p></div>
        <a className="account-link-button primary" href={handoff.link}>{t.open}</a>
        <p className="account-note">{handoff.kind === "qr" ? t.qrFallback : t.fallback}</p></>
        : ready ? <p role="alert" className="account-error">{t.missing}</p> : <p role="status">…</p>}
      {handoff?.kind !== "qr" && <p className="account-note">{t.create}</p>}
    </section></main>
    <SiteFooter locale={locale} />
  </div>;
}
