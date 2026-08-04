"use client";

import { useEffect, useState } from "react";
import { LanguageToggle, useLocale } from "./components/Locale";

/** Target submission date. Move this one constant when the plan changes. */
const RELEASE_AT = new Date("2026-08-14T09:00:00Z");

function releaseCountdown() {
  const remaining = Math.max(0, RELEASE_AT.getTime() - Date.now());
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1_000),
    reached: remaining === 0,
  };
}

const copy = {
  en: {
    nav: ["How it works", "Product", "Security", "Connect"],
    status: "App Store launch",
    eyebrow: "Codex + Claude Code stay within reach",
    heroTitle: "Step away from your Mac.",
    heroAccent: "The work keeps moving.",
    hero:
      "GrantTap turns your iPhone and Apple Watch into a secure remote for the coding-agent sessions already running on your computer. Approve, reply, inspect context, and keep the task moving.",
    see: "See the real app",
    securityModel: "How encryption works",
    highlights: ["Agents stay on your Mac", "Task-scoped E2EE", "Real Codex + Claude sessions"],
    builtFor: "A companion for the agents you already run locally",
    workflowKicker: "One interruption, handled",
    workflowTitle: "When an agent needs you, you do not need your laptop.",
    workflowText:
      "GrantTap does not replace Codex or Claude Code. It carries the small, important moments between their local session and your devices.",
    steps: [
      ["The agent asks", "A command, question, or finished turn appears from the real local session on your Mac."],
      ["You decide", "Read the task context and approve, deny, or answer from iPhone or Apple Watch."],
      ["The same task continues", "Your response returns to that session. No copied project, second agent, or cloud model proxy."],
    ],
    activityKicker: "More than approve or deny",
    activityTitle: "Open the task. See what matters. Send the next turn.",
    activityText:
      "The task view starts with the latest useful activity and keeps deeper controls nearby. You can move fast on Watch, then pick up the same task on iPhone when it needs more context.",
    activityItems: [
      ["A five-update glance", "The task opens on the latest visible activity; the full formatted chat stays one tap away."],
      ["Real context usage", "See tokens against the model window and start supported Codex compaction when the turn is idle."],
      ["Voice, photos, and files", "Reply naturally and attach up to five items to the next turn."],
      ["Controls for this task", "Inspect access, allowed MCP servers, and available project skills without changing unrelated sessions."],
      ["Recurring work by conversation", "Describe a schedule to local Codex or Claude Code, review the result, then save it."],
    ],
    controlsKicker: "Task-level control",
    controlsTitle: "The controls live where you need them: inside the task.",
    controls: [
      ["Agent access", "Inspect and change read-only, workspace, or full access for Codex turns sent from GrantTap."],
      ["MCP per task", "See the MCP servers configured for the task, then allow or deny one without changing unrelated sessions."],
      ["Codex context", "See the real context window and start supported compaction after the active turn finishes."],
    ],
    securityKicker: "Zero-knowledge relay",
    securityTitle: "The server can route your request. It cannot read it.",
    securityText:
      "Every route through the app is NaCl end-to-end encrypted. Pairing uses a relay-blind 256-bit transfer key, and each attached task gets an independent 256-bit key.",
    ciphertext: "ciphertext only",
    mac: ["Your Mac", "encrypts"],
    relay: ["Relay", "routes, cannot decrypt"],
    devices: ["Your devices", "decrypt"],
    facts: [
      ["Never touches", "Source repositories, model credentials, prompts to the model, or model traffic."],
      ["Can observe", "Opaque routes, timing, IP address, ciphertext size, expiry, and APNs routing data—not task content."],
      ["Keys live on", "Authorized endpoints only. A key from one task cannot decrypt another, and a device cannot open a task whose key it was never granted."],
    ],
    galleryKicker: "The actual product",
    galleryTitle: "Fast decisions on Watch. The full task on iPhone.",
    phoneCaption: "A live view of your local Codex and Claude Code tasks, with a clear agent switch and the next task routed to the agent you selected.",
    watchCaption: "Scan active and recent tasks, open the latest updates, reply by voice or text, and handle a pending approval immediately.",
    historyCaption: "The task detail leads with recent activity, then exposes tokens, context, access, MCP, and the full chat only when you need them.",
    usageCaption: "The local usage ledger records observed MCP and skill calls. Token figures are estimated context footprint, never separate MCP billing.",
    securityCaption: "Face ID, private notification details, authenticated approvals, independent task keys, and a local audit log are visible—not hidden behind a security slogan.",
    installKicker: "Public and auditable machine bridge",
    installTitle: "Connect the agents you already use.",
    installText:
      "The machine-side MCP bridge and relay are public, so you can inspect exactly what runs near your code before pairing a device.",
    codex: "Codex",
    claude: "Claude Code",
    hooks: "Approval hooks",
    source: "MCP source on GitHub",
    npm: "View on npm",
    relaySource: "Relay source on GitHub",
    releaseKicker: "Launch status",
    releaseTitle: "Preparing for App Store review.",
    releaseText:
      "GrantTap for iPhone and Apple Watch is not yet available on the App Store. A link to the listing will appear here once the app is approved.",
    appStore: "App Store — not yet available",
    countdownLabel: "Target submission",
    remaining: "to go",
    countdownReached: "Target date reached — submission in progress.",
    countdownUnits: ["days", "hours", "min", "sec"],
    tagline: "Keep your agents moving.",
    legal: ["Privacy", "Terms", "Support", "Security", "Data choices", "Accessibility", "Licenses"],
    rights:
      "© 2026 GrantTap. GrantTap is not affiliated with Anthropic, OpenAI, or Apple.",
  },
  ru: {
    nav: ["Как работает", "Приложение", "Безопасность", "Подключить"],
    status: "Запуск в App Store",
    eyebrow: "Codex и Claude Code остаются под рукой",
    heroTitle: "Отойдите от Mac.",
    heroAccent: "Работа не остановится.",
    hero:
      "GrantTap превращает iPhone и Apple Watch в защищённый пульт для сессий кодовых агентов, уже запущенных на компьютере. Подтверждайте, отвечайте, проверяйте контекст — и не останавливайте задачу.",
    see: "Посмотреть приложение",
    securityModel: "Как устроено шифрование",
    highlights: ["Агенты остаются на Mac", "E2EE для каждой задачи", "Настоящие сессии Codex и Claude"],
    builtFor: "Дополнение к агентам, которые уже работают локально",
    workflowKicker: "Одно прерывание — одно решение",
    workflowTitle: "Когда агенту нужен ответ, ноутбук не нужен.",
    workflowText:
      "GrantTap не заменяет Codex или Claude Code. Он переносит короткие, важные моменты между локальной сессией и вашими устройствами.",
    steps: [
      ["Агент спрашивает", "Команда, вопрос или завершённый ход приходят из настоящей локальной сессии на Mac."],
      ["Вы решаете", "Прочитайте контекст задачи и разрешите, отклоните или ответьте с iPhone либо Apple Watch."],
      ["Та же задача продолжается", "Ответ возвращается в исходную сессию — без копии проекта, второго агента и облачного прокси модели."],
    ],
    activityKicker: "Больше, чем разрешить или отклонить",
    activityTitle: "Откройте задачу. Поймите главное. Отправьте следующий ход.",
    activityText:
      "Экран задачи начинается с последних полезных событий, а более глубокое управление остаётся рядом. На Watch вы реагируете быстро, на iPhone продолжаете ту же задачу с полным контекстом.",
    activityItems: [
      ["Пять последних обновлений", "Задача открывается на свежей видимой активности; полный форматированный чат доступен одним касанием."],
      ["Реальный расход контекста", "Смотрите токены относительно окна модели и запускайте поддерживаемое сжатие Codex, когда ход свободен."],
      ["Голос, фото и файлы", "Отвечайте естественно и прикладывайте до пяти элементов к следующему ходу."],
      ["Управление одной задачей", "Проверяйте доступ, разрешённые MCP и скилы проекта, не затрагивая другие сессии."],
      ["Расписание через диалог", "Опишите серию локальному Codex или Claude Code, проверьте результат и только потом сохраните."],
    ],
    controlsKicker: "Управление на уровне задачи",
    controlsTitle: "Нужные настройки находятся внутри самой задачи.",
    controls: [
      ["Доступ агента", "Смотрите и меняйте read-only, workspace или full access для ходов Codex из GrantTap."],
      ["MCP для задачи", "Смотрите MCP-серверы, настроенные для задачи, и разрешайте либо запрещайте один из них, не затрагивая остальные сессии."],
      ["Контекст Codex", "Следите за реальным окном и запускайте поддерживаемое сжатие после завершения активного хода."],
    ],
    securityKicker: "Relay с нулевым знанием",
    securityTitle: "Сервер маршрутизирует запрос, но не может его прочитать.",
    securityText:
      "Весь маршрут через приложение защищён сквозным NaCl-шифрованием. Пейринг использует невидимый relay 256-битный ключ, а каждая подключённая задача — отдельный 256-битный ключ.",
    ciphertext: "только шифротекст",
    mac: ["Ваш Mac", "шифрует"],
    relay: ["Relay", "маршрутизирует без расшифровки"],
    devices: ["Ваши устройства", "расшифровывают"],
    facts: [
      ["Никогда не получает", "Репозитории, ключи моделей, промпты модели и трафик модели."],
      ["Может видеть", "Непрозрачный маршрут, время, IP, размер шифротекста, срок и данные APNs — но не содержимое задач."],
      ["Ключи хранятся", "Только на разрешённых конечных устройствах. Ключ одной задачи не расшифровывает другую, а устройство не откроет задачу, ключ которой ему не выдавался."],
    ],
    galleryKicker: "Настоящее приложение",
    galleryTitle: "Быстрые решения на Watch. Вся задача — на iPhone.",
    phoneCaption: "Живой список локальных задач Codex и Claude Code, понятное переключение агента и запуск новой задачи именно для выбранного агента.",
    watchCaption: "Просматривайте активные и недавние задачи, открывайте последние обновления, отвечайте голосом или текстом и сразу обрабатывайте подтверждения.",
    historyCaption: "Экран задачи начинается со свежих событий, а токены, контекст, доступ, MCP и полный чат открываются тогда, когда нужны.",
    usageCaption: "Локальная история хранит наблюдаемые вызовы MCP и скилов. Токены — оценка места в контексте, а не отдельный счёт MCP.",
    securityCaption: "Face ID, скрытие деталей уведомлений, подтверждение опасных действий, отдельные ключи задач и локальный журнал видны прямо в приложении.",
    installKicker: "Публичный и проверяемый мост",
    installTitle: "Подключите агентов, которыми уже пользуетесь.",
    installText:
      "MCP-мост на компьютере и relay открыты: до пейринга можно проверить весь код, который будет работать рядом с проектами.",
    codex: "Codex",
    claude: "Claude Code",
    hooks: "Approval hooks",
    source: "Исходники MCP на GitHub",
    npm: "Пакет на npm",
    relaySource: "Исходники relay на GitHub",
    releaseKicker: "Статус запуска",
    releaseTitle: "Готовим релиз к проверке App Store.",
    releaseText:
      "GrantTap для iPhone и Apple Watch пока недоступен в App Store. Ссылка на страницу приложения появится здесь после его одобрения.",
    appStore: "App Store — пока недоступно",
    countdownLabel: "Цель по отправке",
    remaining: "осталось",
    countdownReached: "Целевая дата наступила — идёт отправка.",
    countdownUnits: ["дней", "часов", "мин", "сек"],
    tagline: "Пусть агенты не простаивают.",
    legal: ["Конфиденциальность", "Условия", "Поддержка", "Безопасность", "Управление данными", "Доступность", "Лицензии"],
    rights:
      "© 2026 GrantTap. GrantTap не связан с Anthropic, OpenAI или Apple.",
  },
} as const;

const CheckMark = () => <span aria-hidden="true">✓</span>;

const captures = {
  codexTasks: "/product/iphone-command-center.png",
  claudeTasks: "/product/iphone-claude-tasks.png",
  taskDetail: "/product/iphone-task-detail.png",
  mcpUsage: "/product/iphone-mcp-usage.png",
  securitySettings: "/product/iphone-security-settings.png",
  watchInbox: "/product/apple-watch-inbox.png",
  watchTask: "/product/apple-watch-task.png",
  watchApproval: "/product/apple-watch-approval.png",
} as const;

export default function Home() {
  const { locale, setLocale } = useLocale();
  const t = copy[locale];

  // Starts null so server and first client render agree; the real figure lands
  // after hydration and then becomes the visible one-second launch clock.
  const [countdown, setCountdown] = useState<ReturnType<typeof releaseCountdown> | null>(null);
  useEffect(() => {
    const update = () => setCountdown(releaseCountdown());
    update();
    const id = setInterval(update, 1_000);
    return () => clearInterval(id);
  }, []);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="GrantTap home">
          <img src="/app-icon.png" alt="" />
          <span>GrantTap</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#workflow">{t.nav[0]}</a>
          <a href="#product">{t.nav[1]}</a>
          <a href="#security">{t.nav[2]}</a>
          <a href="#install">{t.nav[3]}</a>
        </nav>
        <LanguageToggle locale={locale} setLocale={setLocale} />
        <a className="nav-cta" href="#availability">{t.status}</a>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" />{t.eyebrow}</div>
          <h1>{t.heroTitle}<span>{t.heroAccent}</span></h1>
          <p className="hero-lede">{t.hero}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#product">{t.see} <span aria-hidden="true">↓</span></a>
            <a className="button button-secondary" href="#security">{t.securityModel}</a>
          </div>
          <ul className="hero-notes" aria-label="Product highlights">
            {t.highlights.map((item) => <li key={item}><CheckMark /> {item}</li>)}
          </ul>
        </div>
        <div className="hero-product" aria-label="GrantTap on iPhone and Apple Watch">
          <div className="signal signal-one" /><div className="signal signal-two" />
          <div className="phone-shell">
            <div className="phone-speaker" />
            <div className="phone-screen-stack">
              <img src={captures.codexTasks} alt="GrantTap Codex task list on iPhone" />
              <img src={captures.claudeTasks} alt="GrantTap Claude Code task list on iPhone" />
            </div>
            <span className="phone-gesture" aria-hidden="true" />
          </div>
          <div className="watch-shell">
            <span className="watch-strap watch-strap-top" aria-hidden="true" />
            <span className="watch-strap watch-strap-bottom" aria-hidden="true" />
            <div className="watch-crown" />
            <div className="watch-screen-stack">
              <img src={captures.watchApproval} alt="GrantTap command approval on Apple Watch" />
              <img src={captures.watchInbox} alt="GrantTap task inbox on Apple Watch" />
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Supported platforms">
        <p>{t.builtFor}</p>
        <div><span className="tool-mark claude-mark">C</span><strong>Claude Code</strong><span className="divider" /><span className="tool-mark codex-mark">▚</span><strong>Codex</strong><span className="divider" /><span className="apple-mark"></span><strong>iPhone + Apple Watch</strong></div>
      </section>

      <section className="section-shell workflow" id="workflow">
        <div className="section-heading"><p className="kicker">{t.workflowKicker}</p><h2>{t.workflowTitle}</h2><p>{t.workflowText}</p></div>
        <div className="workflow-grid">
          {t.steps.map(([title, text], index) => (
            <article className="step-card" key={title}>
              <span className="step-number">0{index + 1}</span>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-section section-shell" id="activity">
        <div className="feature-copy">
          <p className="kicker">{t.activityKicker}</p><h2>{t.activityTitle}</h2><p>{t.activityText}</p>
          <ul className="check-list">{t.activityItems.map(([title, text]) => <li key={title}><CheckMark /><span><strong>{title}</strong>{text}</span></li>)}</ul>
        </div>
        <div className="activity-stage"><div className="activity-phone"><img src={captures.taskDetail} alt="GrantTap task detail with recent activity and context usage on iPhone" /></div><div className="activity-watch"><span>{locale === "ru" ? "Та же задача на запястье" : "The same task on your wrist"}</span><img src={captures.watchTask} alt="GrantTap task detail on Apple Watch" /></div></div>
      </section>

      <section className="controls-section section-shell">
        <div className="section-heading compact"><p className="kicker">{t.controlsKicker}</p><h2>{t.controlsTitle}</h2></div>
        <div className="controls-grid">{t.controls.map(([title, text], index) => <article className={`control-card${index === 1 ? " featured" : ""}`} key={title}><div className="control-icon">{["⌁", "◉", "↺"][index]}</div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="security-section" id="security">
        <div className="section-shell security-inner">
          <div className="security-copy"><p className="kicker">{t.securityKicker}</p><h2>{t.securityTitle}</h2><p>{t.securityText}</p></div>
          <div className="security-diagram" aria-label="End-to-end encrypted connection">
            {[t.mac, t.relay, t.devices].map(([title, text], index) => (
              <div className="diagram-group" key={title}>
                {index > 0 && <div className="encrypted-line"><span>{t.ciphertext}</span></div>}
                <div className={`security-node${index === 1 ? " relay-node" : ""}`}><span>{["⌘", "◇", "⌚"][index]}</span><strong>{title}</strong><small>{text}</small></div>
              </div>
            ))}
          </div>
          <div className="security-facts">{t.facts.map(([title, text]) => <article key={title}><strong>{title}</strong><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="gallery-section section-shell" id="product">
        <div className="section-heading compact"><p className="kicker">{t.galleryKicker}</p><h2>{t.galleryTitle}</h2></div>
        <div className="gallery-grid">
          <figure className="gallery-phone"><div className="phone-pair"><div className="gallery-device"><img src={captures.codexTasks} alt="GrantTap Codex task list on iPhone" /></div><div className="gallery-device"><img src={captures.claudeTasks} alt="GrantTap Claude Code task list on iPhone" /></div></div><figcaption><strong>iPhone · Codex + Claude Code</strong>{t.phoneCaption}</figcaption></figure>
          <figure className="gallery-watch"><div className="watch-pair"><img src={captures.watchInbox} alt="GrantTap task inbox on Apple Watch" /><img src={captures.watchApproval} alt="GrantTap command approval on Apple Watch" /></div><figcaption><strong>Apple Watch</strong>{t.watchCaption}</figcaption></figure>
        </div>
        <div className="history-gallery">
          <figure><div className="history-shot"><img src={captures.taskDetail} alt="GrantTap task detail and context usage on iPhone" /></div><figcaption><strong>{locale === "ru" ? "Контекст задачи" : "Task context"}</strong>{t.historyCaption}</figcaption></figure>
          <figure><div className="history-shot"><img src={captures.mcpUsage} alt="GrantTap observed MCP usage and estimated context tokens on iPhone" /></div><figcaption><strong>{locale === "ru" ? "Использование MCP и скилов" : "MCP and skill usage"}</strong>{t.usageCaption}</figcaption></figure>
          <figure className="history-security"><div className="history-shot"><img src={captures.securitySettings} alt="GrantTap security settings on iPhone" /></div><figcaption><strong>{locale === "ru" ? "Безопасность на устройстве" : "On-device security"}</strong>{t.securityCaption}</figcaption></figure>
        </div>
      </section>

      <section className="install-section section-shell" id="install">
        <div className="section-heading"><p className="kicker">{t.installKicker}</p><h2>{t.installTitle}</h2><p>{t.installText}</p></div>
        <div className="install-grid">
          {[
            [t.codex, "codex mcp add granttap -- npx -y granttap-mcp"],
            [t.claude, "claude mcp add granttap -- npx -y granttap-mcp"],
            [t.hooks, "npm install -g granttap-mcp\n granttap-mcp connect"],
          ].map(([title, command]) => <article className="install-card" key={title}><strong>{title}</strong><pre><code>{command}</code></pre></article>)}
        </div>
        <div className="trust-links">
          <a href="https://github.com/sergii-ziborov/granttap-mcp" target="_blank" rel="noreferrer">{t.source} ↗</a>
          <a href="https://www.npmjs.com/package/granttap-mcp" target="_blank" rel="noreferrer">{t.npm} ↗</a>
          <a href="https://github.com/sergii-ziborov/granttap-relay" target="_blank" rel="noreferrer">{t.relaySource} ↗</a>
        </div>
      </section>

      <section className="availability section-shell" id="availability">
        <div className="availability-card release-card">
          <img src="/app-icon.png" alt="" />
          <div>
            <p className="kicker">{t.releaseKicker}</p><h2>{t.releaseTitle}</h2><p className="release-copy">{t.releaseText}</p>
            {countdown && (countdown.reached
              ? <p className="release-countdown reached" role="status">{t.countdownReached}</p>
              : <div className="release-countdown" role="timer" aria-label={`${t.countdownLabel}: ${countdown.days} ${t.countdownUnits[0]}, ${countdown.hours} ${t.countdownUnits[1]}, ${countdown.minutes} ${t.countdownUnits[2]}, ${countdown.seconds} ${t.countdownUnits[3]} ${t.remaining}`}>
                  <span className="countdown-caption"><i aria-hidden="true" />{t.countdownLabel} · {t.remaining}</span>
                  <div className="countdown-clock" aria-hidden="true">
                    {[countdown.days, countdown.hours, countdown.minutes, countdown.seconds].map((value, index) => (
                      <span className="countdown-unit" key={t.countdownUnits[index]}>
                        <strong>{String(value).padStart(2, "0")}</strong>
                        <small>{t.countdownUnits[index]}</small>
                      </span>
                    ))}
                  </div>
                </div>)}
          </div>
          <span className="availability-pill">{t.appStore}</span>
        </div>
      </section>

      <footer>
        <div className="footer-brand"><img src="/app-icon.png" alt="" /><span><strong>GrantTap</strong><small>{t.tagline}</small></span></div>
        <div className="footer-links">
          <a href="/privacy">{t.legal[0]}</a><a href="/terms">{t.legal[1]}</a><a href="/support">{t.legal[2]}</a><a href="/security">{t.legal[3]}</a><a href="/data-rights">{t.legal[4]}</a><a href="/accessibility">{t.legal[5]}</a><a href="/licenses">{t.legal[6]}</a>
          <a href="https://github.com/sergii-ziborov/granttap-mcp">GitHub</a><a href="https://www.npmjs.com/package/granttap-mcp">npm</a>
        </div>
        <p>{t.rights}</p>
      </footer>
    </main>
  );
}
