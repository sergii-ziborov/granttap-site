const CheckMark = () => <span aria-hidden="true">✓</span>;

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="GrantTap home">
          <img src="/app-icon.png" alt="" />
          <span>GrantTap</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#workflow">How it works</a>
          <a href="#activity">Activity</a>
          <a href="#security">Security</a>
        </nav>
        <a className="nav-cta" href="#availability">
          Private beta
        </a>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" />
            Claude Code + Codex, from your wrist
          </div>
          <h1>
            Approve the next move.
            <span> Keep yours.</span>
          </h1>
          <p className="hero-lede">
            Let your coding agents keep working on your computer while you step
            away. Review commands, answer questions, and see exactly what
            happened from Apple Watch or iPhone.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#workflow">
              See how it works <span aria-hidden="true">↓</span>
            </a>
            <a className="button button-secondary" href="#security">
              Read the security model
            </a>
          </div>
          <ul className="hero-notes" aria-label="Product highlights">
            <li>
              <CheckMark /> End-to-end encrypted
            </li>
            <li>
              <CheckMark /> No model traffic proxy
            </li>
            <li>
              <CheckMark /> Per-chat controls
            </li>
          </ul>
        </div>

        <div className="hero-product" aria-label="GrantTap on iPhone and Apple Watch">
          <div className="signal signal-one" />
          <div className="signal signal-two" />
          <div className="phone-shell">
            <div className="phone-speaker" />
            <img
              src="/product/phone-activity.png"
              alt="GrantTap iPhone activity view showing visible agent messages and a command"
            />
          </div>
          <div className="watch-shell">
            <div className="watch-crown" />
            <img
              src="/product/watch-approval.png"
              alt="GrantTap Apple Watch approval screen for a high-risk command"
            />
          </div>
          <div className="approval-toast">
            <span className="toast-icon">✓</span>
            <span>
              <strong>Allowed from Watch</strong>
              <small>Decision returned to the agent</small>
            </span>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Supported platforms">
        <p>Built for the tools already running on your machine</p>
        <div>
          <span className="tool-mark claude-mark">C</span>
          <strong>Claude Code</strong>
          <span className="divider" />
          <span className="tool-mark codex-mark">▚</span>
          <strong>Codex</strong>
          <span className="divider" />
          <span className="apple-mark"></span>
          <strong>iPhone + Apple Watch</strong>
        </div>
      </section>

      <section className="section-shell workflow" id="workflow">
        <div className="section-heading">
          <p className="kicker">A thin remote, not another agent</p>
          <h2>Your computer does the work. GrantTap keeps you in control.</h2>
          <p>
            The agent stays where your projects, credentials, and development
            tools already live. GrantTap adds a secure decision and messaging
            layer on top.
          </p>
        </div>

        <div className="workflow-grid">
          <article className="step-card">
            <span className="step-number">01</span>
            <div className="terminal-card" aria-label="Pairing command">
              <div className="terminal-dots">
                <i />
                <i />
                <i />
              </div>
              <code>
                <span>$</span> npx granttap connect
              </code>
            </div>
            <h3>Pair once</h3>
            <p>
              Scan a QR code or enter a short one-time code. Encryption keys are
              generated locally and stay with your devices.
            </p>
          </article>

          <article className="step-card">
            <span className="step-number">02</span>
            <div className="agent-lines" aria-hidden="true">
              <span className="agent-line active" />
              <span className="agent-line" />
              <span className="agent-line short" />
              <b>Agent working on your Mac</b>
            </div>
            <h3>Leave the keyboard</h3>
            <p>
              Claude Code or Codex continues in its normal session, using its
              own login, hooks, and local tools.
            </p>
          </article>

          <article className="step-card">
            <span className="step-number">03</span>
            <div className="decision-demo" aria-hidden="true">
              <button tabIndex={-1}>×</button>
              <button tabIndex={-1}>✓ Allow</button>
            </div>
            <h3>Grant with a tap</h3>
            <p>
              High-impact actions wait for you. Allow, deny, or answer from the
              watch; the result goes straight back into the running session.
            </p>
          </article>
        </div>
      </section>

      <section className="feature-section section-shell" id="activity">
        <div className="feature-copy">
          <p className="kicker">Open a chat when context matters</p>
          <h2>See the useful trail, not a wall of hidden reasoning.</h2>
          <p>
            While a chat is open, GrantTap streams visible assistant messages
            and compact action summaries. Thinking blocks are never forwarded.
            Once work is finished, you get the latest visible final answer.
          </p>
          <ul className="check-list">
            <li>
              <CheckMark />
              <span>
                <strong>Live only while open</strong>
                Close the chat and its activity subscription stops.
              </span>
            </li>
            <li>
              <CheckMark />
              <span>
                <strong>Readable action summaries</strong>
                Commands stay monospaced and clearly separated from messages.
              </span>
            </li>
            <li>
              <CheckMark />
              <span>
                <strong>Reply where you are</strong>
                Use text or voice to continue the same agent session.
              </span>
            </li>
          </ul>
        </div>
        <div className="activity-stage">
          <div className="activity-phone">
            <img
              src="/product/phone-activity.png"
              alt="Open GrantTap session on iPhone with messages, command, token usage, and per-chat approval control"
            />
          </div>
          <div className="activity-watch">
            <span>Same context on your wrist</span>
            <img
              src="/product/watch-activity.png"
              alt="GrantTap activity stream on Apple Watch"
            />
          </div>
        </div>
      </section>

      <section className="controls-section section-shell">
        <div className="section-heading compact">
          <p className="kicker">Choose where GrantTap steps in</p>
          <h2>Global control, with a precise escape hatch.</h2>
        </div>
        <div className="controls-grid">
          <article className="control-card">
            <div className="control-icon">⌁</div>
            <h3>Pause approvals globally</h3>
            <p>
              Turn remote gating off from the iPhone and every local session
              falls back to the agent&apos;s normal approval flow.
            </p>
          </article>
          <article className="control-card featured">
            <div className="mini-toggle">
              <span>
                <strong>Don&apos;t ask for this chat</strong>
                <small>Other sessions stay protected</small>
              </span>
              <i />
            </div>
            <h3>Exclude one session</h3>
            <p>
              Let a trusted test loop run freely without weakening the rest of
              your active work.
            </p>
          </article>
          <article className="control-card">
            <div className="control-icon">↺</div>
            <h3>Fail back to local</h3>
            <p>
              If the relay is unavailable, GrantTap gets out of the way and
              hands the decision back to the normal desktop prompt.
            </p>
          </article>
        </div>
      </section>

      <section className="security-section" id="security">
        <div className="section-shell security-inner">
          <div className="security-copy">
            <p className="kicker">Zero-knowledge relay</p>
            <h2>The server can route your request. It cannot read it.</h2>
            <p>
              Approval requests, commands, chat replies, and agent messages are
              sealed end-to-end with NaCl authenticated encryption before they
              leave your computer or phone.
            </p>
            <a href="#security-details">See what the relay can and cannot see ↓</a>
          </div>
          <div className="security-diagram" aria-label="End-to-end encrypted connection">
            <div className="security-node">
              <span>⌘</span>
              <strong>Your Mac</strong>
              <small>encrypts</small>
            </div>
            <div className="encrypted-line">
              <span>ciphertext only</span>
            </div>
            <div className="security-node relay-node">
              <span>◇</span>
              <strong>Relay</strong>
              <small>routes, cannot decrypt</small>
            </div>
            <div className="encrypted-line">
              <span>ciphertext only</span>
            </div>
            <div className="security-node">
              <span>⌚</span>
              <strong>Your devices</strong>
              <small>decrypt</small>
            </div>
          </div>
          <div className="security-facts" id="security-details">
            <article>
              <strong>Never touches</strong>
              <p>Source repositories, model credentials, prompts to the model, or model traffic.</p>
            </article>
            <article>
              <strong>Can observe</strong>
              <p>Connection metadata such as timing, room identifier, IP address, and payload size.</p>
            </article>
            <article>
              <strong>Keys live on</strong>
              <p>Your paired computer and phone. The QR or one-time code establishes the encrypted relationship.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="gallery-section section-shell">
        <div className="section-heading compact">
          <p className="kicker">One system, two speeds</p>
          <h2>Fast decisions on Watch. Full control on iPhone.</h2>
        </div>
        <div className="gallery-grid">
          <figure className="gallery-phone">
            <div className="gallery-device">
              <img
                src="/product/phone-sessions.png"
                alt="GrantTap iPhone dashboard with connected status and two agent sessions"
              />
            </div>
            <figcaption>
              <strong>iPhone</strong>
              Sessions, activity, token usage, replies, pairing, and approval settings.
            </figcaption>
          </figure>
          <figure className="gallery-watch">
            <div className="watch-pair">
              <img
                src="/product/watch-approval.png"
                alt="GrantTap command approval on Apple Watch"
              />
              <img
                src="/product/watch-activity.png"
                alt="GrantTap session activity on Apple Watch"
              />
            </div>
            <figcaption>
              <strong>Apple Watch</strong>
              Approve or deny immediately, then open the session when you need context.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="availability section-shell" id="availability">
        <div className="availability-card">
          <img src="/app-icon.png" alt="" />
          <div>
            <p className="kicker">Private beta</p>
            <h2>Your agent can wait for your wrist—not your return.</h2>
            <p>
              GrantTap for iPhone and Apple Watch is being prepared for its first
              external beta. The machine bridge supports Claude Code and Codex.
            </p>
          </div>
          <span className="availability-pill">Coming soon</span>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <img src="/app-icon.png" alt="" />
          <span>
            <strong>GrantTap</strong>
            <small>Keep your agents moving.</small>
          </span>
        </div>
        <div className="footer-links">
          <a href="#workflow">How it works</a>
          <a href="#security">Security</a>
          <a href="#activity">Activity</a>
        </div>
        <p>
          © 2026 GrantTap. Claude Code and Codex are trademarks of their
          respective owners. GrantTap is not affiliated with Anthropic or OpenAI.
        </p>
      </footer>
    </main>
  );
}
