import Image from "next/image";

export function EditorialArt({ src, caption, width, height }: { src: string; caption: string; width: number; height: number }) {
  return <figure className="editorial-art">
    <Image src={src} alt="" width={width} height={height} loading="lazy" unoptimized />
    <figcaption>{caption}</figcaption>
  </figure>;
}
