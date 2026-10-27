import { guideCatalog, guideGroups } from "../GuideContent/catalog";
import { Diagram } from "./Diagram";
import { Capture } from "./Capture";

export function GuideHome() {
  return <div className="guide-home">
    <section className="guide-home-hero">
      <div><span className="guide-eyebrow">Знакомство → практика → уверенная работа</span>
        <h1>GrantTap,<br /><em>шаг за шагом.</em></h1>
        <p>Подключите компьютер. Следите за задачами. Отвечайте с телефона. Управляйте возможностями агентов — понимая, что уже подтверждено.</p>
        <div className="guide-hero-actions"><a className="guide-primary" href="/guide/quick-start">Начать с первого подключения <span>↗</span></a>
          <a href="/guide/demo-project">Сначала попробовать демо →</a></div>
        <div className="guide-home-facts"><span><strong>{guideCatalog.length}</strong> подробных глав</span><span><strong>11</strong> реальных экранов</span><span><strong>RU</strong> с названиями кнопок</span></div>
      </div>
      <div className="guide-hero-capture"><div className="hero-capture-note"><span className="guide-version-dot" />Настоящий GrantTap · учебный проект</div>
        <a href="/guide/now-tasks" aria-label="Посмотреть раздел Now"><img src="/guide/screens/now.png" alt="Настоящий экран Сейчас в GrantTap с учебными задачами" width="1206" height="2622" /></a>
        <span className="hero-capture-caption">Сборка 230 · iPhone Simulator</span></div>
    </section>
    <section className="guide-paths" aria-label="Выберите свой маршрут">
      <a href="/guide/installation"><span className="path-icon orange">↗</span><small>Впервые в GrantTap</small><strong>Установить и подключить</strong><p>iPhone, MCP, приложение Mac, passkey и QR — с понятным порядком действий.</p><span>Открыть маршрут →</span></a>
      <a href="/guide/message-delivery"><span className="path-icon teal">↔</span><small>Сообщение ещё ждёт</small><strong>Понять доставку</strong><p>Где находится сообщение, откуда берётся задержка и когда использовать Cancel или Delete.</p><span>Разобрать путь сообщения →</span></a>
      <a href="/guide/governance"><span className="path-icon purple">◇</span><small>Хочу больше контроля</small><strong>Настроить Governance</strong><p>Allow, Ask, Deny, покрытие компьютеров и доказательства реального применения.</p><span>Перейти к правилам →</span></a>
    </section>
    <section className="guide-home-section"><div className="guide-section-heading"><span className="guide-eyebrow">Картина целиком</span><h2>От нажатия Send до ответа агента</h2><p>Статусы показывают подтверждения. Реле, компьютер, агент и экран провайдера не обязаны обновиться одновременно.</p></div>
      <Diagram id="delivery" /></section>
    <section className="guide-home-section" id="all-chapters"><div className="guide-section-heading"><span className="guide-eyebrow">Оглавление</span><h2>Найдите нужный раздел</h2><p>Слева — всё руководство. В каждой главе — своё содержание, примеры и ссылки на следующий шаг.</p></div>
      <div className="guide-chapter-groups">{guideGroups.map(group => <section key={group.id}><h3><span>{group.icon}</span>{group.title}</h3>
        {guideCatalog.filter(page => page.group === group.id).map(page => <a href={`/guide/${page.slug}`} key={page.slug}><strong>{page.title}</strong><span>{page.summary}</span><b aria-hidden="true">↗</b></a>)}
      </section>)}</div></section>
    <section className="guide-home-section"><div className="guide-section-heading"><span className="guide-eyebrow">Интерфейс, который вы увидите</span><h2>Настоящие экраны, безопасные примеры</h2><p>Скриншоты сняты в GrantTap на учебных данных. Схемы объясняют устройство продукта; они не заменяют реальные квитанции.</p></div>
      <div className="guide-home-gallery"><Capture id="chat" /><Capture id="delivery" /><Capture id="question-attachments" /></div>
    </section>
    <aside className="guide-beta-note"><strong>Проверяйте версии, а не только внешний вид.</strong><p>Гайд описывает iPhone 230 и модуль Mac 0.8.105. Для старых Mac-скриншотов указаны их собственные сборки. Возможности конкретного провайдера и наличие Engine могут различаться.</p><a href="/guide/updates">Как устроены обновления ↗</a></aside>
    <footer className="guide-home-footer"><span>GrantTap · Руководство пользователя</span><a href="/support?lang=ru">Нужна помощь?</a><a href="/privacy?lang=ru">Приватность</a></footer>
  </div>;
}
