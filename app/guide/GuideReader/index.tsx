import type { GuideBlock, GuideSection } from "./markdown";
import { Inline } from "./Inline";
import { Capture } from "./Capture";
import { Diagram } from "./Diagram";
import { CodeBlock } from "./CodeBlock";

function Block({ block }: { block: GuideBlock }) {
  if (block.kind === "paragraph") return <p><Inline text={block.text} /></p>;
  if (block.kind === "code") return <CodeBlock {...block} />;
  if (block.kind === "capture") return <Capture id={block.id} />;
  if (block.kind === "diagram") return <Diagram id={block.id} />;
  if (block.kind === "callout") return <aside className={`guide-callout ${block.tone}`}>
    <span className="callout-symbol" aria-hidden="true">{block.tone === "warning" ? "!" : block.tone === "exercise" ? "↗" : "i"}</span>
    <div><strong>{block.title}</strong>{block.text.split("\n\n").map((text, i) => <p key={i}><Inline text={text} /></p>)}</div>
  </aside>;
  if (block.kind === "list") {
    const Tag = block.ordered ? "ol" : "ul";
    return <Tag>{block.items.map((text, index) => <li key={index}><Inline text={text} /></li>)}</Tag>;
  }
  return <div className="guide-table" tabIndex={0} aria-label="Таблица, при необходимости прокрутите вправо"><table>
    <thead><tr>{block.rows[0]?.map((text, index) => <th key={index} scope="col"><Inline text={text} /></th>)}</tr></thead>
    <tbody>{block.rows.slice(1).map((row, index) => <tr key={index}>
      {row.map((text, cell) => <td key={cell}><Inline text={text} /></td>)}</tr>)}</tbody>
  </table></div>;
}

export function GuideReader({ sections }: { sections: GuideSection[] }) {
  return <div className="guide-prose">{sections.map(section => <section key={section.id} id={section.id}>
    {section.title && <h2>{section.title}<a className="guide-anchor" href={`#${section.id}`} aria-label={`Ссылка на раздел ${section.title}`}>#</a></h2>}
    {section.blocks.map((block, index) => <Block block={block} key={index} />)}
  </section>)}</div>;
}
