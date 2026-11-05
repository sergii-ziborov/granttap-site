import { publishedArticles, articlePublicationDate } from "../publication";
const escape = (value: string) => value.replace(/[<>&"']/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]!);
export async function GET(request: Request) {
  const ru = new URL(request.url).searchParams.get("lang") === "ru";
  const locale = ru ? "ru" : "en";
  const suffix = ru ? "?lang=ru" : "";
  const items = publishedArticles().map(article => {
    const url = `https://granttap.com/blog/${article.slug}${suffix}`;
    return `<item><title>${escape(article[locale].title)}</title><link>${escape(url)}</link><guid isPermaLink="true">${escape(url)}</guid><description>${escape(article[locale].summary)}</description><dc:date>${articlePublicationDate(article)}</dc:date></item>`;
  }).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>GrantTap Journal</title><link>https://granttap.com/blog${suffix}</link><description>${ru ? "Практические статьи об ИИ и coding-агентах" : "Practical AI and coding-agent guides"}</description><language>${locale}</language>${items}</channel></rss>`, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=300" } });
}
