import Image from "next/image";

const capture = (name: string) => `/product/${name}.png?v=20260828-1`;

export function ProductImage({
  name,
  alt,
  priority = false,
}: {
  name: string;
  alt: string;
  priority?: boolean;
}) {
  const size = name.startsWith("iphone")
    ? { width: 1320, height: 2868 }
    : { width: 416, height: 496 };
  return <Image src={capture(name)} alt={alt} {...size} priority={priority} unoptimized />;
}
