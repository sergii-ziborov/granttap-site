import type { GuideBlock, GuideSection } from "../../app/guide/GuideReader/markdown";
import type { Capture, Chapter } from "./index";

type Link = (href: string) => string | undefined;
const escape = (value: string) => value.replace(/[&<>"']/g, char =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

function inline(text: string, link: Link): string {
  const tokens = /(\*\*[^*]+\*\*|`[^`]+`|==[^=]+==|\[[^\]]+\]\([^\s)]+\))/g;
  let html = ""; let from = 0;
  for (const match of text.matchAll(tokens)) {
    html += escape(text.slice(from, match.index));
    const value = match[0];
    if (value.startsWith("**")) html += `<strong>${escape(value.slice(2, -2))}</strong>`;
    else if (value.startsWith("`")) html += `<code>${escape(value.slice(1, -1))}</code>`;
    else if (value.startsWith("==")) html += `<mark>${escape(value.slice(2, -2))}</mark>`;
    else {
      const parts = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!;
      const href = link(parts[2]);
      html += href ? `<a href="${escape(href)}">${escape(parts[1])}</a>` : escape(value);
    }
    from = match.index + value.length;
  }
  return html + escape(text.slice(from));
}

const diagrams: Record<string, string[]> = {
  delivery: ["Телефон сохраняет отправку.", "Реле подтверждает зашифрованный пакет.",
    "Компьютер принимает операцию.", "Провайдер принимает запрос, когда готов.", "Ответ возвращается в историю."],
  task: ["Project объединяет работу.", "Task сохраняет цель и историю.",
    "Execution обозначает конкретный сеанс провайдера на компьютере.", "Вложенный агент принадлежит исполнению."],
  governance: ["Компьютер проверяет глобальные ограничения.", "Deny блокирует действие.",
    "Ask требует решения для конкретного запроса.", "Allow разрешает доступ в пределах действующих правил."],
};

function blockHTML(block: GuideBlock, captures: Map<string, Capture>, link: Link): string {
  const text = (value: string) => inline(value, link);
  switch (block.kind) {
    case "paragraph": return `<p>${text(block.text)}</p>`;
    case "code": return `<pre><code>${escape(block.text)}</code></pre>`;
    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      return `<${tag}>${block.items.map(item => `<li>${text(item)}</li>`).join("")}</${tag}>`;
    }
    case "table": return `<div class="table"><table>${block.rows.map((row, i) => {
      const tag = i === 0 ? "th" : "td";
      return `<tr>${row.map(cell => `<${tag}>${text(cell)}</${tag}>`).join("")}</tr>`;
    }).join("")}</table></div>`;
    case "callout": return `<aside><h3>${escape(block.title)}</h3><p>${text(block.text).replace(/\n/g, "<br>")}</p></aside>`;
    case "capture": {
      const capture = captures.get(block.id);
      if (!capture) throw Error(`Unknown capture: ${block.id}`);
      return `<figure><img src="${escape(capture.file)}" alt="${escape(capture.title)}"><figcaption>${escape(capture.caption)} — build ${escape(capture.build)}, ${escape(capture.date)}</figcaption></figure>`;
    }
    case "diagram": {
      const steps = diagrams[block.id];
      if (!steps) throw Error(`Unknown diagram: ${block.id}`);
      return `<aside><ol>${steps.map(step => `<li>${escape(step)}</li>`).join("")}</ol></aside>`;
    }
  }
}

const style = `:root{color-scheme:light dark}body{font:17px -apple-system,BlinkMacSystemFont,sans-serif;line-height:1.55;margin:0;padding:22px;color:#202124;background:#fff}h1{font-size:30px;line-height:1.2}h2{font-size:24px;line-height:1.3;margin-top:36px}h3{font-size:20px}a{color:#087cf0}p,li{overflow-wrap:anywhere}li{margin:12px 0}aside{padding:18px;border-radius:18px;background:#f0f2f7;margin:24px 0}pre{overflow:auto;padding:15px;background:#f0f2f7;border-radius:12px}code{font:0.9em ui-monospace,monospace}.table{overflow:auto}table{border-collapse:collapse;font-size:15px}td,th{padding:10px;border:1px solid #ccd0da;text-align:left;min-width:140px}figure{margin:28px 0}img{max-width:100%;height:auto;border-radius:18px}figcaption,footer{font-size:13px;color:#696b76}mark{background:#ffe9a3;color:#111}@media(prefers-color-scheme:dark){body{background:#111114;color:#efeff3}aside,pre{background:#24242c}a{color:#65b3ff}td,th{border-color:#484855}figcaption,footer{color:#aaaab4}}`;

export function renderChapter(page: Chapter, sections: GuideSection[], captures: Map<string, Capture>, link: Link): string {
  const body = sections.map(section => `<section id="${escape(section.id)}">${section.title ? `<h2>${escape(section.title)}</h2>` : ""}${section.blocks.map(block => blockHTML(block, captures, link)).join("")}</section>`).join("");
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'"><style>${style}</style><title>${escape(page.title)}</title></head><body><h1>${escape(page.title)}</h1><p>${escape(page.summary)}</p>${body}<footer>Офлайн-издание GrantTap Guide. Внешние ссылки и загрузка учебного проекта требуют интернета. Даты и сборки снимков указаны под изображениями.</footer></body></html>\n`;
}
