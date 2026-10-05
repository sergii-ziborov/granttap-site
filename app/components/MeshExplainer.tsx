import Image from "next/image";
import Link from "next/link";
import type { HomeCopy } from "../homeCopy";

export function MeshExplainer({ t }: { t: HomeCopy }) {
  return <div className="mesh-explainer">
    <figure className="mesh-art">
      <Image src="/visuals/mesh-network.jpg" alt="" width={1774} height={887} loading="lazy" unoptimized />
      <figcaption>{t.meshImageCaption}</figcaption>
    </figure>
    <div className="mesh-explainer-copy">
      <div><p className="kicker">{t.meshKicker}</p>
      <h2>{t.meshTitle}</h2>
      <p>{t.meshText}</p>
      <Link href="/project-mesh">{t.meshLink} <span aria-hidden="true">↗</span></Link></div>
      <ol>{t.meshSteps.map(([title, detail], index) => <li key={title}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div><strong>{title}</strong><p>{detail}</p></div>
      </li>)}</ol>
    </div>
  </div>;
}
