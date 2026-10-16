// Generates the journal's diagram illustrations into public/blog/*.webp.
//
// Layout rules, enforced on every image before it is written:
// - The canvas is 16:9 (1600 × 900), the ratio of the journal card, feature and
//   article-cover slots and of the Open Graph image each article declares.
// - Nothing is drawn outside SAFE. The margin also survives a centred 1.91:1
//   social-card crop, so captions and dates are never cut.
// - Connectors are computed from node geometry: they start and end at a node's
//   edge (circle or rounded rectangle), are painted beneath every node, and may
//   not cross another node or any text.
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const out = new URL("../../public/blog/", import.meta.url);
const W = 1600, H = 900;
const SAFE = { left: 80, top: 60, right: 1520, bottom: 840 };
const BG = "#151a1b", PANEL = "#25292a", RULE = "#424849";
const ink = "#ece8e1", muted = "#aaa99f", orange = "#fa743c", green = "#b4cf8b", dark = "#151a1b";
const FONT = "Helvetica,Arial,sans-serif";
// Node outlines are stroked, so their geometry stays 2px inside SAFE.
const L = SAFE.left + 2, R = SAFE.right - 2;

const esc = s => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const unit = (x, y) => { const length = Math.hypot(x, y); return { x: x / length, y: y / length }; };

// Conservative Helvetica advance estimate, used only for collision checks.
function textWidth(s, size, weight) {
  let em = 0;
  for (const ch of s) {
    if (ch === " ") em += 0.28;
    else if (/[A-Z]/.test(ch)) em += weight >= 700 ? 0.74 : 0.68;
    else if (/[ijlt.,:;'·|!]/.test(ch)) em += 0.3;
    else if (/[mw]/.test(ch)) em += 0.86;
    else if (/[a-z]/.test(ch)) em += weight >= 700 ? 0.6 : 0.55;
    else if (/[0-9]/.test(ch)) em += 0.57;
    else em += 0.62;
  }
  return em * size;
}

function textBox(t) {
  const width = textWidth(t.s, t.size, t.weight);
  const left = t.anchor === "middle" ? t.x - width / 2 : t.anchor === "end" ? t.x - width : t.x;
  return { left, right: left + width, top: t.y - t.size * 0.78, bottom: t.y + t.size * 0.24 };
}

function textSvg(t) {
  const anchor = t.anchor === "start" ? "" : ` text-anchor="${t.anchor}"`;
  return `<text x="${t.x}" y="${t.y}"${anchor} fill="${t.color}" font-family="${FONT}" font-size="${t.size}" font-weight="${t.weight}">${esc(t.s)}</text>`;
}

const center = n => n.shape === "circle" ? { x: n.cx, y: n.cy } : { x: n.x + n.w / 2, y: n.y + n.h / 2 };

function inside(n, p) {
  if (n.shape === "circle") return Math.hypot(p.x - n.cx, p.y - n.cy) < n.r;
  return p.x > n.x && p.x < n.x + n.w && p.y > n.y && p.y < n.y + n.h;
}

// Largest t where |o + t·d − c| = r (o inside the circle, d a unit vector).
function leaveCircle(o, d, c, r) {
  const ox = o.x - c.x, oy = o.y - c.y;
  const b = ox * d.x + oy * d.y;
  return -b + Math.sqrt(b * b - (ox * ox + oy * oy - r * r));
}

// Point where a ray from o (inside n) leaves n's outline, rounded corners included.
function exitPoint(n, o, d) {
  if (n.shape === "circle") { const t = leaveCircle(o, d, center(n), n.r); return { x: o.x + d.x * t, y: o.y + d.y * t }; }
  const tx = d.x > 0 ? (n.x + n.w - o.x) / d.x : d.x < 0 ? (n.x - o.x) / d.x : Infinity;
  const ty = d.y > 0 ? (n.y + n.h - o.y) / d.y : d.y < 0 ? (n.y - o.y) / d.y : Infinity;
  let t = Math.min(tx, ty);
  const p = { x: o.x + d.x * t, y: o.y + d.y * t };
  const r = Math.min(n.rx, n.w / 2, n.h / 2);
  const cx = p.x < n.x + r ? n.x + r : p.x > n.x + n.w - r ? n.x + n.w - r : null;
  const cy = p.y < n.y + r ? n.y + r : p.y > n.y + n.h - r ? n.y + n.h - r : null;
  if (cx !== null && cy !== null) t = leaveCircle(o, d, { x: cx, y: cy }, r);
  return { x: o.x + d.x * t, y: o.y + d.y * t };
}

function segmentHitsBox(a, b, box) {
  // Liang–Barsky clip of segment a→b against an axis-aligned box.
  let t0 = 0, t1 = 1;
  const dx = b.x - a.x, dy = b.y - a.y;
  for (const [p, q] of [[-dx, a.x - box.left], [dx, box.right - a.x], [-dy, a.y - box.top], [dy, box.bottom - a.y]]) {
    if (p === 0) { if (q < 0) return false; continue; }
    const r = q / p;
    if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; }
    else { if (r < t0) return false; if (r < t1) t1 = r; }
  }
  return true;
}

const outline = n => n.shape === "circle"
  ? { left: n.cx - n.r, right: n.cx + n.r, top: n.cy - n.r, bottom: n.cy + n.r }
  : { left: n.x, right: n.x + n.w, top: n.y, bottom: n.y + n.h };
const grow = (box, by) => ({ left: box.left - by, right: box.right + by, top: box.top - by, bottom: box.bottom + by });

function scene(name, { date, title, subtitle, caption }) {
  const nodes = [], edges = [], texts = [];
  const text = (x, y, s, size = 30, color = ink, weight = 400, anchor = "start") => {
    const t = { x, y, s, size, color, weight, anchor };
    texts.push(t);
    return t;
  };
  const node = (n) => { n.labels = []; n.decor = ""; nodes.push(n); return n; };
  const api = {
    text,
    box: (x, y, w, h, { fill = PANEL, stroke = RULE, rx = 22, dash } = {}) => node({ shape: "box", x, y, w, h, rx, fill, stroke, dash }),
    circle: (cx, cy, r, { fill = orange, stroke = "none" } = {}) => node({ shape: "circle", cx, cy, r, fill, stroke }),
    // Text that belongs to a node; it must fit inside that node.
    label: (n, x, y, s, size = 30, color = ink, weight = 400, anchor = "start") => { const t = { x, y, s, size, color, weight, anchor }; n.labels.push(t); return t; },
    // A connector from a to b. `x`/`y` pin a vertical/horizontal connector; otherwise it follows the centre line.
    edge: (a, b, { color = muted, arrow = true, dash = false, x, y, gap = 8 } = {}) => { edges.push({ a, b, color, arrow, dash, x, y, gap }); },
    // Numbered step card used by the flow diagrams.
    card: (x, y, n, heading, detail, color = orange, { w = 420, h = 150 } = {}) => {
      const c = api.box(x, y, w, h);
      c.decor = `<circle cx="${x + 38}" cy="${y + 38}" r="17" fill="${color}"/>`;
      api.label(c, x + 38, y + 45, n, 18, dark, 700, "middle");
      api.label(c, x + 30, y + 94, heading, 30, ink, 700);
      api.label(c, x + 30, y + 129, detail, 22, muted);
      return c;
    },
    // A row of equal step cards across the safe width, joined left to right.
    flow: (y, steps, { joined = true, h = 150 } = {}) => {
      const gap = 90, w = (R - L - gap * (steps.length - 1)) / steps.length;
      const cards = steps.map(([n, heading, detail, color], i) => api.card(L + i * (w + gap), y, n, heading, detail, color, { w, h }));
      if (joined) cards.slice(1).forEach((c, i) => api.edge(cards[i], c, { color: orange }));
      return cards;
    },
  };
  api.render = () => render(name, { date, title, subtitle, caption, nodes, edges, texts });
  return api;
}

function connector(e) {
  const ca = center(e.a), cb = center(e.b);
  const oa = e.x !== undefined ? { x: e.x, y: ca.y } : e.y !== undefined ? { x: ca.x, y: e.y } : ca;
  const ob = e.x !== undefined ? { x: e.x, y: cb.y } : e.y !== undefined ? { x: cb.x, y: e.y } : cb;
  if (!inside(e.a, oa) || !inside(e.b, ob)) throw new Error("connector anchor lies outside its node");
  const d = unit(ob.x - oa.x, ob.y - oa.y);
  const p1 = exitPoint(e.a, oa, d), p2 = exitPoint(e.b, ob, { x: -d.x, y: -d.y });
  const from = { x: p1.x + d.x * e.gap, y: p1.y + d.y * e.gap };
  const to = { x: p2.x - d.x * e.gap, y: p2.y - d.y * e.gap };
  if ((to.x - from.x) * d.x + (to.y - from.y) * d.y < 24) throw new Error("connected nodes overlap or touch");
  return { from, to, d };
}

function edgeSvg(e, { from, to, d }) {
  const head = 16, half = 8;
  const end = e.arrow ? { x: to.x - d.x * head, y: to.y - d.y * head } : to;
  const dash = e.dash ? ` stroke-dasharray="10 9"` : "";
  let svg = `<path d="M${from.x.toFixed(1)} ${from.y.toFixed(1)} L${end.x.toFixed(1)} ${end.y.toFixed(1)}" fill="none" stroke="${e.color}" stroke-width="3" stroke-linecap="round"${dash}/>`;
  if (e.arrow) {
    const n = { x: -d.y, y: d.x };
    const pts = [to, { x: end.x + n.x * half, y: end.y + n.y * half }, { x: end.x - n.x * half, y: end.y - n.y * half }];
    svg += `<polygon points="${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}" fill="${e.color}"/>`;
  }
  return svg;
}

function nodeSvg(n) {
  const dash = n.dash ? ` stroke-dasharray="9 8"` : "";
  const shape = n.shape === "circle"
    ? `<circle cx="${n.cx}" cy="${n.cy}" r="${n.r}" fill="${n.fill}" stroke="${n.stroke}"/>`
    : `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${n.rx}" fill="${n.fill}" stroke="${n.stroke}" stroke-width="2"${dash}/>`;
  return shape + n.decor + n.labels.map(textSvg).join("");
}

function validate(name, nodes, edges, texts) {
  const fail = message => { throw new Error(`${name}: ${message}`); };
  const overlaps = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  // Nodes paint in order, so a later node must not cover an earlier node's label.
  nodes.forEach((n, i) => n.labels.forEach(t => nodes.slice(i + 1).forEach(later => {
    if (overlaps(textBox(t), outline(later))) fail(`label "${t.s}" is hidden by a later node`);
  })));
  for (const n of nodes) for (const t of n.labels) {
    const b = textBox(t);
    const corners = [{ x: b.left, y: b.top }, { x: b.right, y: b.top }, { x: b.left, y: b.bottom }, { x: b.right, y: b.bottom }];
    const fits = n.shape === "circle"
      ? corners.every(p => Math.hypot(p.x - n.cx, p.y - n.cy) <= n.r - 4)
      : b.left >= n.x + 10 && b.right <= n.x + n.w - 10 && b.top >= n.y + 6 && b.bottom <= n.y + n.h - 6;
    if (!fits) fail(`label "${t.s}" does not fit inside its node`);
  }
  const allTexts = [...texts, ...nodes.flatMap(n => n.labels)];
  for (const e of edges) {
    const { from, to } = e.path;
    for (const n of nodes) if (n !== e.a && n !== e.b && segmentHitsBox(from, to, grow(outline(n), 6))) fail("a connector crosses another node");
    for (const t of allTexts) if (segmentHitsBox(from, to, grow(textBox(t), 4))) fail(`a connector crosses the text "${t.s}"`);
  }
  for (const t of texts) for (const n of nodes) if (overlaps(textBox(t), outline(n))) fail(`"${t.s}" overlaps a node`);
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
    if (overlaps(textBox(texts[i]), textBox(texts[j]))) fail(`"${texts[i].s}" overlaps "${texts[j].s}"`);
  }
}

// Every pixel outside SAFE must still be the background colour.
async function assertSafeArea(name, svg) {
  const { data, info } = await sharp(Buffer.from(svg)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const bg = [0x15, 0x1a, 0x1b];
  for (let y = 0; y < info.height; y++) {
    const rowInside = y >= SAFE.top && y < SAFE.bottom;
    for (let x = 0; x < info.width; x++) {
      if (rowInside && x >= SAFE.left && x < SAFE.right) { x = SAFE.right - 1; continue; }
      const i = (y * info.width + x) * 3;
      if (Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]) > 12) {
        throw new Error(`${name}: ink at ${x},${y} lies outside the safe area`);
      }
    }
  }
}

async function render(name, { date, title, subtitle, caption, nodes, edges, texts }) {
  const chrome = [
    { x: SAFE.left, y: 112, s: "GRANTTAP / FIELD NOTES", size: 21, color: orange, weight: 700, anchor: "start" },
    { x: SAFE.left, y: 186, s: title, size: 52, color: ink, weight: 700, anchor: "start" },
    { x: SAFE.left, y: 236, s: subtitle, size: 26, color: muted, weight: 400, anchor: "start" },
    { x: SAFE.left, y: 818, s: caption, size: 21, color: muted, weight: 400, anchor: "start" },
    { x: SAFE.right, y: 818, s: date, size: 19, color: orange, weight: 400, anchor: "end" },
  ];
  const allTexts = [...chrome, ...texts];
  for (const e of edges) e.path = connector(e);
  validate(name, nodes, edges, allTexts);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
    + `<rect width="${W}" height="${H}" fill="${BG}"/>`
    + `<path d="M${SAFE.left} 772 L${SAFE.right} 772" stroke="${RULE}" stroke-width="2"/>`
    + edges.map(e => edgeSvg(e, e.path)).join("")
    + nodes.map(nodeSvg).join("")
    + allTexts.map(textSvg).join("")
    + `</svg>`;
  await assertSafeArea(name, svg);
  await writeFile(new URL(`${name}.webp`, out), await sharp(Buffer.from(svg)).webp({ quality: 90 }).toBuffer());
  return name;
}

await mkdir(out, { recursive: true });
const written = [];
const research = "10 OCT 2026";

// --- Cortex Loom inside GrantTap (2026-10-10) ---
{
  const s = scene("granttap-research-cortex-cover", { date: research, title: "Evidence that travels once", subtitle: "Source → citations → a bounded model context", caption: "Concept illustration · repeated evidence retains a source trail" });
  let front;
  for (let i = 0; i < 3; i++) {
    const x = 110 + i * 38, y = 300 + i * 40;
    front = s.box(x, y, 420, 290);
    s.label(front, x + 28, y + 30, `source ${i + 1}`, 20, muted);
  }
  const fx = front.x + 28, fy = front.y;
  front.decor = [[86, 330, orange], [126, 270, muted], [166, 300, muted]].map(([dy, w, color]) => `<path d="M${fx} ${fy + dy} L${fx + w} ${fy + dy}" stroke="${color}" stroke-width="3"/>`).join("");
  const packet = s.box(1010, 330, 470, 350);
  s.label(packet, 1045, 400, "CITED PACKET", 32, ink, 700);
  s.label(packet, 1045, 466, "[source.0] exact evidence", 23, green);
  s.label(packet, 1045, 522, "[source.1] see source.0", 23, muted);
  s.label(packet, 1045, 578, "[source.2] see source.0", 23, muted);
  s.edge(front, packet, { color: orange, y: 515 });
  s.text(820, 492, "CORTEX", 24, orange, 700, "middle");
  written.push(await s.render());
}
{
  const s = scene("granttap-research-cortex-infographic", { date: research, title: "56.2% less repeated context", subtitle: "Controlled Engine experiment · compiler token estimates", caption: "Mechanism test on GrantTap source · not whole-session savings or provider billing" });
  s.text(SAFE.left, 304, "THREE REPEATED READINGS", 23, muted, 700);
  const full = R - L;
  const candidate = s.box(L, 326, full, 92, { fill: "#383c3d", stroke: "#383c3d" });
  s.label(candidate, L + 32, 386, "12,567 candidate tokens", 36, ink, 700);
  const delivered = s.box(L, 438, Math.round(full * 5506 / 12567), 92, { fill: orange, stroke: orange });
  s.label(delivered, L + 32, 498, "5,506 delivered", 36, dark, 700);
  s.flow(572, [["1", "9 / 9 items", "No evidence item omitted", green], ["2", "325 lines", "Repeated lines replaced"], ["3", "0.3% control", "One reading: 4,189 → 4,176"]], { joined: false });
  written.push(await s.render());
}
{
  const s = scene("granttap-research-cortex-flow", { date: research, title: "Budget the whole response", subtitle: "Coordination stays visible; packet delivery must earn its space", caption: "Algorithmic selection · no classifier model call required" });
  s.flow(300, [["1", "Scope", "Task, source, visibility"], ["2", "Compile", "Rank, cite, deduplicate"], ["3", "Compare", "Complete serialized answer"]]);
  const check = s.box(300, 556, 1000, 150);
  s.label(check, 340, 610, "SMALLER + ALL VISIBLE FACTS COVERED?", 30, green, 700);
  s.label(check, 340, 660, "Yes: cited representation   ·   Otherwise: compact facts + expand", 23, muted);
  written.push(await s.render());
}

// --- Project Mesh: preserve work instead of doing it twice (2026-10-10) ---
{
  const s = scene("granttap-research-mesh-cover", { date: research, title: "One Task. Several Executions.", subtitle: "Preserve the work when the conversation changes", caption: "Concept illustration · provider sessions stay distinct; Task identity persists" });
  const task = s.circle(800, 520, 104);
  s.label(task, 800, 534, "TASK", 39, dark, 700, "middle");
  for (const [cx, cy, label] of [[300, 382, "CODEX"], [1300, 382, "CLAUDE"], [400, 662, "MAC A"], [1200, 662, "MAC B"]]) {
    const n = s.box(cx - 125, cy - 46, 250, 92);
    s.label(n, cx, cy + 11, label, 29, ink, 700, "middle");
    s.edge(n, task, { arrow: false });
  }
  written.push(await s.render());
}
{
  const s = scene("granttap-research-mesh-infographic", { date: research, title: "Make previous work reusable", subtitle: "Claims, memory and handoff carry relevant facts forward", caption: "Implemented mechanisms · actual avoided work depends on the Task" });
  s.flow(290, [["1", "Observe", "Supported native activity"], ["2", "Attribute", "Task + repository + source"], ["3", "Reuse", "Compact context + capsule"]]);
  const claims = s.box(L, 486, 690, 226);
  s.label(claims, SAFE.left + 36, 540, "CLAIMS", 28, orange, 700);
  s.label(claims, SAFE.left + 36, 590, "Who owns this path?", 30, ink, 700);
  s.label(claims, SAFE.left + 36, 640, "Checkout, owner, expiry", 24, muted);
  const memory = s.box(R - 690, 486, 690, 226);
  s.label(memory, SAFE.right - 654, 540, "MEMORY", 28, green, 700);
  s.label(memory, SAFE.right - 654, 590, "What was already tried?", 30, ink, 700);
  s.label(memory, SAFE.right - 654, 640, "Attempts, decisions, visibility", 24, muted);
  written.push(await s.render());
}
{
  const s = scene("granttap-research-mesh-flow", { date: research, title: "Continue without losing the trail", subtitle: "Handoff preserves the objective and checks the destination", caption: "A capsule supplies context · it does not transfer an arbitrary filesystem" });
  const [, , target] = s.flow(300, [["1", "Execution A", "Observed work + remaining goal"], ["2", "Task capsule", "Revision + claims + decisions"], ["3", "Execution B", "Another model or computer"]]);
  const ready = s.box(330, 568, 940, 140);
  s.label(ready, 370, 620, "DESTINATION READINESS", 29, green, 700);
  s.label(ready, 370, 668, "Online · access · repository · conflict checks · policy", 24, muted);
  s.edge(target, ready, { x: 1250, color: green });
  written.push(await s.render());
}

// --- GrantTap governance: a decision that reaches the tool (2026-10-10) ---
{
  const s = scene("granttap-research-governance-cover", { date: research, title: "A decision before the tool runs", subtitle: "Policy on the computer; a decision point on the phone", caption: "Concept illustration · supported native hooks enforce the action boundary" });
  const tool = s.box(SAFE.left + 40, 400, 400, 240);
  s.label(tool, SAFE.left + 76, 458, "PROPOSED TOOL", 28, muted, 700);
  s.label(tool, SAFE.left + 76, 516, "Write / Shell / MCP", 30, ink, 700);
  s.label(tool, SAFE.left + 76, 580, "Identified invocation", 23, muted);
  const policy = s.circle(800, 520, 124);
  s.label(policy, 800, 510, "LOCAL", 34, dark, 700, "middle");
  s.label(policy, 800, 556, "POLICY", 34, dark, 700, "middle");
  const result = s.box(SAFE.right - 380, 400, 340, 240);
  s.label(result, SAFE.right - 344, 464, "ALLOW", 30, green, 700);
  s.label(result, SAFE.right - 344, 529, "ASK", 30, orange, 700);
  s.label(result, SAFE.right - 344, 594, "DENY", 30, ink, 700);
  s.edge(tool, policy, { color: orange });
  s.edge(policy, result, { color: orange });
  written.push(await s.render());
}
{
  const s = scene("granttap-research-governance-infographic", { date: research, title: "Restrictions survive a model change", subtitle: "Account deny retains priority; enforcement is local", caption: "Isolated test runtime · no user repository write or global approval change" });
  s.flow(290, [["1", "Identify", "Provider + invocation + scope"], ["2", "Evaluate", "Account / Project / Task"], ["3", "Enforce", "Supported native hook"]]);
  const verified = s.box(L, 482, R - L, 236);
  s.label(verified, SAFE.left + 40, 534, "VERIFIED WITH THE ACTUAL ENGINE", 27, green, 700);
  s.label(verified, SAFE.left + 40, 582, "Account deny + Project allow + Task allow → DENY", 29, ink, 700);
  s.label(verified, SAFE.left + 40, 630, "Claude + Codex writes refused before execution", 26, muted);
  s.label(verified, SAFE.left + 40, 676, "Stored policy still applied after daemon restart", 26, muted);
  written.push(await s.render());
}
{
  const s = scene("granttap-research-governance-flow", { date: research, title: "Three facts. Three different questions.", subtitle: "Presence, permission and observed use have separate evidence", caption: "Unknown stays unknown · a selected tool does not count as usage" });
  s.flow(330, [["1", "Available", "Is this capability installed?"], ["2", "Governed", "May this action run here?"], ["3", "Observed", "Did the invocation occur?", green]], { joined: false });
  s.text(800, 636, "AVAILABLE ≠ ALLOWED ≠ USED", 46, orange, 700, "middle");
  written.push(await s.render());
}

console.log(`Wrote ${written.length} illustrations: ${written.join(", ")}`);
