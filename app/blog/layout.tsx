/* eslint-disable @next/next/no-css-tags -- vinext bundles imported route CSS into the homepage asset. */
export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><link rel="stylesheet" href="/blog.css?v=20261010-layout" />{children}</>;
}
