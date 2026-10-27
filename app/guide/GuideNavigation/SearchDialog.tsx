"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { matchesSearchTerm, normalizeSearch, searchGuide, type SearchEntry } from "./search";

function Highlight({ text, query }: { text: string; query: string }) {
  const terms = normalizeSearch(query).split(" ").filter(Boolean);
  return <>{text.split(/(\s+)/).map((word, index) =>
    terms.some(term => matchesSearchTerm(normalizeSearch(word), term)) ? <mark key={index}>{word}</mark> : word)}</>;
}

export function SearchDialog({ index, onClose }: { index: SearchEntry[]; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null); const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(""); const [selected, setSelected] = useState(0);
  const results = useMemo(() => searchGuide(index, query), [index, query]);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal(); input.current?.focus();
    return () => element?.close();
  }, []);
  function keyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setSelected(previous => results.length ? (previous + (event.key === "ArrowDown" ? 1 : results.length - 1)) % results.length : 0);
    }
    if (event.key === "Enter" && results[selected]) {
      event.preventDefault(); window.location.assign(results[selected].href);
    }
  }
  return <dialog ref={dialog} className="guide-search-dialog" aria-label="Поиск по руководству"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="guide-search-top"><span aria-hidden="true">⌕</span>
      <input ref={input} value={query} placeholder="Например: Го, очередь, Governance…" aria-label="Найти в руководстве"
        onChange={event => { setQuery(event.target.value); setSelected(0); }} onKeyDown={keyDown}
        aria-controls="guide-search-results" aria-activedescendant={results[selected] ? `guide-result-${selected}` : undefined} />
      <button onClick={onClose} aria-label="Закрыть поиск"><kbd>Esc</kbd></button>
    </div>
    {!query && <div className="guide-popular"><p>Часто ищут</p>{["Подключение", "Го", "Cancel", "Governance", "Файлы"].map(value =>
      <button key={value} onClick={() => { setQuery(value); input.current?.focus(); }}>{value} ↗</button>)}</div>}
    {query && <p className="guide-search-count" role="status">{results.length ? `Найдено разделов: ${results.length}` : "Ничего не найдено. Попробуйте короткое слово или английское название кнопки."}</p>}
    <div id="guide-search-results" className="guide-search-results" role="listbox" aria-label="Результаты поиска">
      {results.map((result, position) => <a key={result.href} id={`guide-result-${position}`} role="option"
        aria-selected={selected === position} href={result.href} onClick={onClose}
        onMouseEnter={() => setSelected(position)}><small>{result.title}</small>
        <strong><Highlight text={result.heading || result.title} query={query} /></strong>
        <span><Highlight text={result.excerpt} query={query} /></span><b aria-hidden="true">↗</b></a>)}
    </div>
    <footer><span>↑ ↓ Выбор</span><span>↵ Открыть</span><span>Поиск работает в браузере, без отправки запроса на сервер</span></footer>
  </dialog>;
}
