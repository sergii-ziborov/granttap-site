import { illustrations, type IllustrationId } from "../GuideContent/illustrations";

export function Artwork({ id }: { id: IllustrationId }) {
  const art = illustrations[id];
  return <figure className="guide-chapter-art">
    <img src={art.file} alt={art.alt} width="1672" height="941" />
    <figcaption><span>{art.title}</span><small>Иллюстрация · ImageGen</small></figcaption>
  </figure>;
}
