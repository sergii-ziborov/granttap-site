"use client";

import { useState } from "react";

export function CodeBlock({ text, language }: { text: string; language: string }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try { await navigator.clipboard.writeText(text); setStatus("Скопировано"); }
    catch { setStatus("Выделите текст для копирования"); }
  }
  return <div className="guide-code">
    <div><span>{language || "Пример"}</span><button onClick={copy}>{status || "Копировать"}</button></div>
    <pre tabIndex={0}><code>{text.split("\n").map((line, index) => <span className={line.startsWith("#") ? "code-comment" : "code-line"} key={index}>
      {line}<br /></span>)}</code></pre>
    <span className="guide-sr" role="status">{status}</span>
  </div>;
}
