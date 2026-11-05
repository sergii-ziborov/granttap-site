import type { ArticleText } from "./articleTypes";
export function QuickChecks({ practice }: { practice: NonNullable<ArticleText["practice"]> }) {
  return <section className="blog-practice" id="quick-check">
    <h2>{practice.title}</h2><p>{practice.intro}</p>
    <ol>{practice.steps.map(step => <li key={step.title}>
      <h3>{step.title}</h3><p>{step.detail}</p>
      {step.code && <pre><code>{step.code}</code></pre>}
    </li>)}</ol>
  </section>;
}
