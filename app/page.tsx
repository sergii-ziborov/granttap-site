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
    reached: remaining === 0,
  };
}

const copy = {
  en: {
    nav: ["How it works", "Activity", "Security", "Install"],
    status: "App Store launch",
    eyebrow: "Claude Code + Codex, from your wrist",
    heroTitle: "Approve the next move.",
    heroAccent: "Keep yours.",
    hero:
      "Let your coding agents keep working on your computer while you step away. Review commands, answer questions, and see visible activity from Apple Watch or iPhone.",
    see: "See how it works",
    securityModel: "Read the security model",
    highlights: ["End-to-end encrypted", "No model traffic proxy", "Context + MCP per task"],
    builtFor: "Built for the tools already running on your machine",
    workflowKicker: "A thin remote, not another agent",
    workflowTitle: "Your computer does the work. GrantTap keeps you in control.",
    workflowText:
      "The agent stays where your projects, credentials, and development tools already live. GrantTap adds a secure decision and messaging layer on top.",
    steps: [
      ["Install the bridge", "Add the public MCP package, then run setup once to register the local approval hooks."],
      ["Leave the keyboard", "Claude Code or Codex continues in its normal session, using its own login, hooks, and local tools."],
      ["Grant with a tap", "High-impact actions wait for you. Allow, deny, or answer from the watch or phone."],
    ],
    activityKicker: "Open a chat when context matters",
    activityTitle: "See the useful trail, not a wall of hidden reasoning.",
    activityText:
      "While a chat is open, GrantTap streams the last five visible updates, with the full trail one tap away. See the actual context window, compact an idle Codex task, and decide which configured MCP servers are allowed for the next turn.",
    activityItems: [
      ["Useful, readable activity", "Messages render with formatting; actions stay clearly separated from the agent summary."],
      ["Real context controls", "Track used tokens and the model window. Codex compaction uses its supported app-server API."],
      ["Route the next turn", "Choose an allowed MCP or a project skill, then attach up to five photos or files."],
    ],
    controlsKicker: "Control the task, not a mock setting",
    controlsTitle: "The switches change the next real agent turn.",
    controls: [
      ["Agent access", "Inspect and change read-only, workspace, or full access for Codex turns sent from GrantTap."],
      ["MCP per task", "Allow or deny configured MCP servers for one task without changing unrelated sessions."],
      ["Codex context", "See the real context window and start supported compaction after the active turn finishes."],
    ],
    securityKicker: "Zero-knowledge relay",
    securityTitle: "The server can route your request. It cannot read it.",
    securityText:
      "Approval requests, commands, chat replies, and visible agent messages are sealed end-to-end with NaCl authenticated encryption before they leave your computer or phone.",
    ciphertext: "ciphertext only",
    mac: ["Your Mac", "encrypts"],
    relay: ["Relay", "routes, cannot decrypt"],
    devices: ["Your devices", "decrypt"],
    facts: [
      ["Never touches", "Source repositories, model credentials, prompts to the model, or model traffic."],
      ["Can observe", "Connection metadata such as timing, room identifier, IP address, and payload size."],
      ["Keys live on", "Your paired computer and phone. Pairing establishes the encrypted relationship."],
    ],
    galleryKicker: "One system, two speeds",
    galleryTitle: "Fast decisions on Watch. Full control on iPhone.",
    phoneCaption: "Tasks, formatted activity, five-file attachment selection, context usage, skills, and per-task MCP controls.",
    watchCaption: "Approve or deny immediately, then open the session when you need context.",
    installKicker: "Public and auditable machine bridge",
    installTitle: "Install the GrantTap MCP in one command.",
    installText:
      "The app is private, while the machine-side MCP bridge and relay are public so teams can inspect exactly what runs near their code.",
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
    unitDays: "d",
    unitHours: "h",
    toastTitle: "Allowed from Watch",
    toastText: "Decision returned to the agent",
    agentWorking: "Agent working on your Mac",
    allowShort: "Allow",
    watchCaptionInline: "Same context on your wrist",
    tagline: "Keep your agents moving.",
    legal: ["Privacy", "Terms", "Support", "Licenses"],
    rights:
      "© 2026 GrantTap. GrantTap is not affiliated with Anthropic, OpenAI, or Apple.",
  },
  ru: {
    nav: ["Как работает", "Активность", "Безопасность", "Установка"],
    status: "Запуск в App Store",
    eyebrow: "Claude Code + Codex — прямо с запястья",
    heroTitle: "Подтвердите следующий шаг.",
    heroAccent: "Сохраните контроль.",
    hero:
      "Пусть кодовые агенты продолжают работу на компьютере, пока вы отошли. Проверяйте команды, отвечайте на вопросы и смотрите видимую активность с Apple Watch или iPhone.",
    see: "Как это работает",
    securityModel: "Модель безопасности",
    highlights: ["Сквозное шифрование", "Без проксирования модели", "Контекст и MCP для каждой задачи"],
    builtFor: "Работает с инструментами, уже запущенными на вашем компьютере",
    workflowKicker: "Тонкий пульт, а не ещё один агент",
    workflowTitle: "Компьютер выполняет работу. GrantTap оставляет контроль вам.",
    workflowText:
      "Агент остаётся рядом с проектами, учётными данными и инструментами разработки. GrantTap добавляет защищённый слой решений и сообщений.",
    steps: [
      ["Установите мост", "Добавьте публичный MCP-пакет и один раз запустите setup для локальных approval hooks."],
      ["Отойдите от клавиатуры", "Claude Code или Codex продолжает обычную сессию со своим входом, hooks и локальными инструментами."],
      ["Подтвердите касанием", "Важные действия ждут вас. Разрешите, отклоните или ответьте с часов либо телефона."],
    ],
    activityKicker: "Откройте чат, когда нужен контекст",
    activityTitle: "Полезная история без скрытых рассуждений.",
    activityText:
      "Пока чат открыт, GrantTap показывает пять последних видимых обновлений, а полная история доступна одним касанием. Здесь же видны реальный контекст, сжатие свободной задачи Codex и MCP-серверы, разрешённые для следующего хода.",
    activityItems: [
      ["Понятная активность", "Сообщения сохраняют форматирование, а действия отделены от итога агента."],
      ["Настоящий контекст", "Смотрите использованные токены и размер окна. Сжатие Codex использует поддерживаемый app-server API."],
      ["Маршрут следующего хода", "Выберите разрешённый MCP или скил проекта и приложите до пяти фото либо файлов."],
    ],
    controlsKicker: "Реальное управление задачей",
    controlsTitle: "Переключатели меняют следующий ход агента.",
    controls: [
      ["Доступ агента", "Смотрите и меняйте read-only, workspace или full access для ходов Codex из GrantTap."],
      ["MCP для задачи", "Разрешайте или запрещайте настроенные MCP-серверы в одной задаче, не затрагивая остальные."],
      ["Контекст Codex", "Следите за реальным окном и запускайте поддерживаемое сжатие после завершения активного хода."],
    ],
    securityKicker: "Relay с нулевым знанием",
    securityTitle: "Сервер маршрутизирует запрос, но не может его прочитать.",
    securityText:
      "Запросы подтверждений, команды, ответы и видимые сообщения агента защищены аутентифицированным NaCl-шифрованием до выхода с компьютера или телефона.",
    ciphertext: "только шифротекст",
    mac: ["Ваш Mac", "шифрует"],
    relay: ["Relay", "маршрутизирует без расшифровки"],
    devices: ["Ваши устройства", "расшифровывают"],
    facts: [
      ["Никогда не получает", "Репозитории, ключи моделей, промпты модели и трафик модели."],
      ["Может видеть", "Метаданные соединения: время, идентификатор комнаты, IP-адрес и размер сообщения."],
      ["Ключи хранятся", "На спаренных компьютере и телефоне. Пейринг создаёт зашифрованную связь."],
    ],
    galleryKicker: "Одна система, две скорости",
    galleryTitle: "Быстрые решения на Watch. Полный контроль на iPhone.",
    phoneCaption: "Задачи, форматированная активность, до пяти вложений, контекст, скилы и MCP-настройки для каждой задачи.",
    watchCaption: "Сразу разрешите или отклоните, а при необходимости откройте контекст сессии.",
    installKicker: "Публичный и проверяемый мост",
    installTitle: "Установите GrantTap MCP одной командой.",
    installText:
      "Приложение приватное, а машинный MCP-мост и relay открыты, чтобы команды могли проверить код, работающий рядом с их проектами.",
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
    unitDays: "д",
    unitHours: "ч",
    toastTitle: "Разрешено с часов",
    toastText: "Решение вернулось агенту",
    agentWorking: "Агент работает на вашем Mac",
    allowShort: "Разрешить",
    watchCaptionInline: "Тот же контекст на запястье",
    tagline: "Пусть агенты не простаивают.",
    legal: ["Конфиденциальность", "Условия", "Поддержка", "Лицензии"],
    rights:
      "© 2026 GrantTap. GrantTap не связан с Anthropic, OpenAI или Apple.",
  },
} as const;

const CheckMark = () => <span aria-hidden="true">✓</span>;

export default function Home() {
  const { locale, setLocale } = useLocale();
  const t = copy[locale];

  // Starts null so server and first client render agree; the real figure lands
  // after hydration and then ticks hourly.
  const [countdown, setCountdown] = useState<ReturnType<typeof releaseCountdown> | null>(null);
  useEffect(() => {
    const update = () => setCountdown(releaseCountdown());
    update();
    const id = setInterval(update, 60_000);
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
          <a href="#activity">{t.nav[1]}</a>
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
            <a className="button button-primary" href="#workflow">{t.see} <span aria-hidden="true">↓</span></a>
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
              <img src="/product/phone-home-v030.png" alt="GrantTap tasks and approvals on iPhone" />
              <img src="/product/phone-context-v030.png" alt="GrantTap context usage on iPhone" />
              <img src="/product/phone-controls-v030.png" alt="GrantTap MCP controls on iPhone" />
            </div>
            <span className="phone-gesture" aria-hidden="true" />
          </div>
          <div className="watch-shell">
            <span className="watch-strap watch-strap-top" aria-hidden="true" />
            <span className="watch-strap watch-strap-bottom" aria-hidden="true" />
            <div className="watch-crown" />
            <div className="watch-screen-stack">
              <img src="/product/watch-approval.png" alt="GrantTap command approval on Apple Watch" />
              <img src="/product/watch-activity.png" alt="GrantTap agent activity on Apple Watch" />
            </div>
          </div>
          <div className="approval-toast"><span className="toast-icon">✓</span><span><strong>{t.toastTitle}</strong><small>{t.toastText}</small></span></div>
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
              {index === 0 && <div className="terminal-card"><div className="terminal-dots"><i /><i /><i /></div><code><span>$</span> granttap-mcp setup</code></div>}
              {index === 1 && <div className="agent-lines" aria-hidden="true"><span className="agent-line active" /><span className="agent-line" /><span className="agent-line short" /><b>{t.agentWorking}</b></div>}
              {index === 2 && <div className="decision-demo" aria-hidden="true"><button tabIndex={-1}>×</button><button tabIndex={-1}>✓ {t.allowShort}</button></div>}
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
        <div className="activity-stage"><div className="activity-phone"><div className="activity-screen-stack"><img src="/product/phone-context-v030.png" alt="Open GrantTap context controls on iPhone" /><img src="/product/phone-controls-v030.png" alt="GrantTap MCP controls on iPhone" /></div></div><div className="activity-watch"><span>{t.watchCaptionInline}</span><img src="/product/watch-activity.png" alt="GrantTap activity stream on Apple Watch" /></div></div>
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

      <section className="gallery-section section-shell">
        <div className="section-heading compact"><p className="kicker">{t.galleryKicker}</p><h2>{t.galleryTitle}</h2></div>
        <div className="gallery-grid">
          <figure className="gallery-phone"><div className="gallery-device"><div className="gallery-screen-stack"><img src="/product/phone-home-v030.png" alt="GrantTap tasks on iPhone" /><img src="/product/phone-context-v030.png" alt="GrantTap context usage on iPhone" /><img src="/product/phone-controls-v030.png" alt="GrantTap task controls on iPhone" /></div></div><figcaption><strong>iPhone</strong>{t.phoneCaption}</figcaption></figure>
          <figure className="gallery-watch"><div className="watch-pair"><img src="/product/watch-approval.png" alt="Approval on Apple Watch" /><img src="/product/watch-activity.png" alt="Activity on Apple Watch" /></div><figcaption><strong>Apple Watch</strong>{t.watchCaption}</figcaption></figure>
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
            <p className="kicker">{t.releaseKicker}</p><h2>{t.releaseTitle}</h2><p>{t.releaseText}</p>
            {countdown && (
              <p className="release-countdown" role="status">
                {countdown.reached
                  ? t.countdownReached
                  : <>{t.countdownLabel}: <strong>{countdown.days}{t.unitDays} {countdown.hours}{t.unitHours}</strong> {t.remaining}</>}
              </p>
            )}
          </div>
          <span className="availability-pill">{t.appStore}</span>
        </div>
      </section>

      <footer>
        <div className="footer-brand"><img src="/app-icon.png" alt="" /><span><strong>GrantTap</strong><small>{t.tagline}</small></span></div>
        <div className="footer-links">
          <a href="/privacy">{t.legal[0]}</a><a href="/terms">{t.legal[1]}</a><a href="/support">{t.legal[2]}</a><a href="/licenses">{t.legal[3]}</a>
          <a href="https://github.com/sergii-ziborov/granttap-mcp">GitHub</a><a href="https://www.npmjs.com/package/granttap-mcp">npm</a>
        </div>
        <p>{t.rights}</p>
      </footer>
    </main>
  );
}
