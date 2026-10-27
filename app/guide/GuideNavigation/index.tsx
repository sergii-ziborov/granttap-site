"use client";

import { useEffect, useState, type ReactNode } from "react";
import { guideCatalog, guideGroups } from "../GuideContent/catalog";
import { SearchDialog } from "./SearchDialog";
import type { SearchEntry } from "./search";

function Sidebar({ current, close }: { current?: string; close: () => void }) {
  return <>
    <a className={`guide-overview-link ${!current ? "current" : ""}`} href="/guide" onClick={close}>⌂ Обзор руководства</a>
    <nav aria-label="Разделы руководства">{guideGroups.map(group => <details className="guide-nav-group" key={group.id} open>
      <summary><span aria-hidden="true">{group.icon}</span>{group.title}<span className="nav-chevron" aria-hidden="true">⌄</span></summary>
      {guideCatalog.filter(page => page.group === group.id).map(page => <a key={page.slug} href={`/guide/${page.slug}`}
        aria-current={current === page.slug ? "page" : undefined} onClick={close}>{page.title}</a>)}
    </details>)}</nav>
    <div className="guide-sidebar-bottom"><span className="guide-version-dot" />Руководство · 27 октября 2026
      <small>iPhone 230 · модуль Mac 0.8.105</small><a href="/support?lang=ru">Помощь и связь ↗</a></div>
  </>;
}

export function GuideShell({ current, searchIndex, children }: {
  current?: string; searchIndex: SearchEntry[]; children: ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const previous = document.documentElement.lang; document.documentElement.lang = "ru";
    try { if (localStorage.getItem("granttap.guide.theme") === "dark") setTheme("dark"); } catch { /* Reading works without storage. */ }
    function key(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setSearchOpen(value => !value); setMenuOpen(false);
      }
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", key);
    return () => { document.documentElement.lang = previous; window.removeEventListener("keydown", key); };
  }, []);
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"; setTheme(next);
    try { localStorage.setItem("granttap.guide.theme", next); } catch { /* Optional preference. */ }
  }
  return <main className="guide-app" data-theme={theme} lang="ru">
    <a className="guide-skip" href="#guide-main">Перейти к содержанию</a>
    <header className="guide-topbar">
      <a className="guide-brand" href="/guide"><img src="/app-icon.png" alt="" width="32" height="32" /><strong>GrantTap</strong><span>Руководство</span></a>
      <button className="guide-search-trigger" onClick={() => { setSearchOpen(true); setMenuOpen(false); }}>
        <span aria-hidden="true">⌕</span> Поиск по руководству <kbd>⌘ K</kbd>
      </button>
      <nav className="guide-top-links" aria-label="Сайт GrantTap"><a href="/?lang=ru">О продукте ↗</a>
        <button onClick={toggleTheme} aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}>{theme === "light" ? "☾" : "☀"}</button>
      </nav>
      <button className="guide-menu-button" aria-expanded={menuOpen} aria-controls="guide-sidebar" onClick={() => setMenuOpen(value => !value)}>
        {menuOpen ? "Закрыть" : "Разделы"}<span aria-hidden="true">☰</span></button>
    </header>
    <div className="guide-workspace">
      {menuOpen && <button className="guide-menu-scrim" aria-label="Закрыть навигацию" onClick={() => setMenuOpen(false)} />}
      <aside id="guide-sidebar" className={`guide-sidebar ${menuOpen ? "is-open" : ""}`}>
        <Sidebar current={current} close={() => setMenuOpen(false)} />
      </aside>
      <div className="guide-main" id="guide-main" tabIndex={-1}>{children}</div>
    </div>
    {searchOpen && <SearchDialog index={searchIndex} onClose={() => setSearchOpen(false)} />}
  </main>;
}
