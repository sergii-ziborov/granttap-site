import { describe, expect, it } from "vitest";
import { buildSearchIndex, searchGuide } from "../search";

const pages = [{ slug: "message-delivery", title: "Доставка сообщений", summary: "Три подтверждения",
  group: "messages", keywords: ["Го", "доставка"],
  content: "## Получено компьютером {#computer}\nSaved on relay ещё не подтверждает получение Mac.\n\n## Когда чат обновится {#desktop}\nНативный чат может обновиться позднее." },
{ slug: "governance", title: "Governance: правила", summary: "Allow, ask, deny", group: "rules",
  keywords: ["говерненс", "правила"], content: "## Запрет {#deny}\nГлобальный deny сохраняет приоритет." }];

describe("whole-guide search", () => {
  it("finds body text and opens the precise section rather than only matching titles", () => {
    const results = searchGuide(buildSearchIndex(pages), "получение Mac");
    expect(results[0].href).toBe("/guide/message-delivery#computer");
    expect(results[0].excerpt).toContain("Saved on relay");
  });
  it("finds Russian UI synonyms and prioritizes an exact title", () => {
    const index = buildSearchIndex(pages);
    expect(searchGuide(index, "говерненс")[0].slug).toBe("governance");
    expect(searchGuide(index, "Го")[0].slug).toBe("message-delivery");
    expect(searchGuide(index, "Governance")[0].title).toContain("Governance");
  });
  it("returns bounded useful results and handles whitespace, punctuation and unknown terms", () => {
    const index = buildSearchIndex(pages);
    expect(searchGuide(index, "  ")).toEqual([]);
    expect(searchGuide(index, "!!!")).toEqual([]);
    expect(searchGuide(index, "несуществующийтермин")).toEqual([]);
    expect(searchGuide(index, "компьютером", 1)).toHaveLength(1);
  });
  it("matches short terms as whole words, without unrelated Russian word fragments", () => {
    const unrelated = { ...pages[1], keywords: [],
      content: "## Подготовить проект {#prepare}\nЗаголовок другого проекта и голос." };
    const index = buildSearchIndex([...pages, unrelated]);
    expect(searchGuide(index, "Го").map(result => result.slug)).toEqual(["message-delivery", "message-delivery"]);
    expect(searchGuide(index, "Mac")[0].href).toBe("/guide/message-delivery#computer");
  });
});
