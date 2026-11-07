"use client";

import Link from "next/link";
import { SiteHeader, SiteFooter } from "../../components/SiteChrome";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { guideCatalog, guideGroups } from "../GuideContent/catalog";
import { SearchDialog } from "./SearchDialog";
import type { SearchEntry } from "./search";

function Sidebar({ current, close }: { current?: string; close: () => void }) {
  return <>
    <Link className={`guide-overview-link ${!current ? "current" : ""}`} href="/guide" onClick={close}>⌂ Обзор руководства</Link>
    <nav aria-label="Разделы руководства">{guideGroups.map(group => <details className="guide-nav-group" key={group.id} open>
      <summary><span aria-hidden="true">{group.icon}</span>{group.title}<span className="nav-chevron" aria-hidden="true">⌄</span></summary>
      {guideCatalog.filter(page => page.group === group.id).map(page => <Link key={page.slug} href={`/guide/${page.slug}`}
        aria-current={current === page.slug ? "page" : undefined} onClick={close}>{page.title}</Link>)}
    </details>)}</nav>
    <div className="guide-sidebar-bottom"><span className="guide-version-dot" />Обновлено 7 ноября 2026
      <small>Сборки снимков — в подписях</small><Link href="/guide/coverage">Что описано и проверено ↗</Link><Link href="/support?lang=ru">Помощь и связь ↗</Link></div>
  </>;
}

export function GuideShell({ current, searchIndex, children }: {
  current?: string; searchIndex?: SearchEntry[]; children: ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [index, setIndex] = useState(searchIndex);
  const [searchError, setSearchError] = useState(false);
  const drawer = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!searchOpen || index || searchError) return;
    const controller = new AbortController();
    fetch("/guide/search-index.json", { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("Search unavailable"); return response.json(); })
      .then((entries: SearchEntry[]) => { if (!controller.signal.aborted) setIndex(entries); })
      .catch(() => { if (!controller.signal.aborted) setSearchError(true); });
    return () => controller.abort();
  }, [searchOpen, index, searchError]);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    const opener = menuButton.current;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector<HTMLElement>("button, a")?.focus();
    return () => { document.body.style.overflow = previous; opener?.focus(); };
  }, [menuOpen]);
  useEffect(() => {
    const previous = document.documentElement.lang; document.documentElement.lang = "ru";
    function key(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setSearchOpen(value => !value); setMenuOpen(false);
      }
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", key);
    return () => { document.documentElement.lang = previous; window.removeEventListener("keydown", key); };
  }, []);
  return <main className="guide-app" lang="ru">
    <a className="guide-skip" href="#guide-main">Перейти к содержанию</a>
    <SiteHeader locale="ru" active="how" />
    <header className="guide-topbar">
      <Link className="guide-brand" href="/guide"><span className="guide-eyebrow">Документация</span><strong>Руководство</strong></Link>
      <button className="guide-search-trigger" onClick={() => { setSearchOpen(true); setMenuOpen(false); }}>
        <span aria-hidden="true">⌕</span> Поиск по руководству <kbd>⌘ K</kbd>
      </button>
      <nav className="guide-top-links" aria-label="Сайт GrantTap"><Link href="/?lang=ru">О продукте ↗</Link>
      </nav>
      <button ref={menuButton} className="guide-menu-button" aria-expanded={menuOpen} aria-controls="guide-sidebar" onClick={() => setMenuOpen(value => !value)}>
        {menuOpen ? "Закрыть" : "Разделы"}<span aria-hidden="true">☰</span></button>
    </header>
    <div className="guide-workspace">
      {menuOpen && <button className="guide-menu-scrim" aria-label="Закрыть навигацию" onClick={() => setMenuOpen(false)} />}
      <aside ref={drawer} id="guide-sidebar" className={`guide-sidebar ${menuOpen ? "is-open" : ""}`}
        role={menuOpen ? "dialog" : undefined} aria-modal={menuOpen ? true : undefined} aria-label={menuOpen ? "Разделы руководства" : undefined}
        onKeyDown={event => {
          if (!menuOpen || event.key !== "Tab") return;
          const elements = Array.from(drawer.current?.querySelectorAll<HTMLElement>("a, button, summary") || []);
          const first = elements[0], last = elements[elements.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }}>
        {menuOpen && <button className="guide-drawer-close" onClick={() => setMenuOpen(false)}>Закрыть разделы ×</button>}
        <Sidebar current={current} close={() => setMenuOpen(false)} />
      </aside>
      <div className="guide-main" id="guide-main" tabIndex={-1}>{children}</div>
    </div>
    <SiteFooter locale="ru" />
    {searchOpen && <SearchDialog index={index || []} loading={!index && !searchError}
      failed={searchError} onRetry={() => setSearchError(false)} onClose={() => setSearchOpen(false)} />}
  </main>;
}
