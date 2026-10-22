"use client";

import { useEffect, useRef, useState } from "react";
import { LanguageToggle, useLocale } from "../components/Locale";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { nativeSignInLink } from "./tokenLink";

const copy = {
  en: {
    title: "Sign in to GrantTap", open: "Open GrantTap", missing: "This link is incomplete or invalid.",
    lead: "Continue in the app to review and confirm this account sign-in.",
    trust: "Only continue if you trust the person who sent this link. Anyone with it can access the account until it expires or is revoked.",
    fallback: "If the app does not open, choose Devices → Sign in with token in GrantTap and paste the original link.",
    create: "Create links in GrantTap: Devices → Sign-in tokens. Choose a name, expiry and number of uses; revoke them there at any time.",
  },
  ru: {
    title: "Вход в GrantTap", open: "Открыть GrantTap", missing: "Эта ссылка неполная или недействительна.",
    lead: "Продолжите в приложении, чтобы проверить и подтвердить вход в аккаунт.",
    trust: "Продолжайте, только если доверяете отправителю. Любой обладатель ссылки получает доступ к аккаунту до истечения срока или отзыва.",
    fallback: "Если приложение не открылось, выберите Устройства → Войти по токену в GrantTap и вставьте исходную ссылку.",
    create: "Создайте ссылку в GrantTap: Устройства → Токены входа. Укажите имя, срок и число входов. Там же можно отозвать её.",
  },
};

export function SignInView() {
  const { locale, setLocale } = useLocale();
  const [link, setLink] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const captured = useRef<{ link: string | null } | null>(null);
  useEffect(() => {
    if (!captured.current) {
      captured.current = { link: nativeSignInLink(window.location.hash) };
      // Drop the credential from this history entry. Never send it to an API or storage.
      window.history.replaceState(null, "", window.location.pathname);
    }
    const value = captured.current.link;
    const timer = window.setTimeout(() => { setLink(value); setReady(true); }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const t = copy[locale];
  return <div className="site-wrap">
    <SiteHeader locale={locale} languageControl={<LanguageToggle locale={locale} setLocale={setLocale} />} />
    <main className="connect-main"><section className="connect-card">
      <p className="eyebrow">GrantTap</p><h1>{t.title}</h1><p className="lead">{t.lead}</p>
      {link ? <><p>{t.trust}</p><div className="connect-actions"><a className="button primary" href={link}>{t.open}</a></div>
        <p>{t.fallback}</p></> : ready ? <p role="alert">{t.missing}</p> : <p role="status">…</p>}
      <p>{t.create}</p>
    </section></main>
    <SiteFooter locale={locale} />
  </div>;
}
