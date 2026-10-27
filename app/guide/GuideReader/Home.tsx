import Image from "next/image";
import Link from "next/link";
import { guideCatalog, guideGroups } from "../GuideContent/catalog";
import { Diagram } from "./Diagram";
import { ScreenshotGallery } from "./ScreenshotGallery";
import captures from "../GuideContent/screenshots.json";

export function GuideHome() {
  return <div className="guide-home">
    <section className="guide-home-hero">
      <div className="guide-hero-copy"><span className="guide-eyebrow">Руководство пользователя / 2026</span>
        <h1>GrantTap,<br /><em>шаг за шагом.</em></h1>
        <p>Ваши агенты, задачи и решения — под рукой. Научитесь управлять работой с телефона и понимать, что происходит на компьютере.</p>
        <div className="guide-hero-actions"><Link className="guide-primary" href="/guide/quick-start">Начать с первого подключения <span>↗</span></Link>
          <Link href="/guide/demo-project">Сначала попробовать демо →</Link></div>
        <div className="guide-home-facts"><span><strong>{guideCatalog.length}</strong> глав</span><span><strong>{captures.length}</strong> настоящих экранов</span><span><strong>01</strong> учебный проект</span></div>
      </div>
      <div className="guide-hero-art"><Image unoptimized src="/guide/illustrations/workspace.webp" alt="" width="1672" height="941" fetchPriority="high" /></div>
      <span className="guide-hero-art-credit">Иллюстрация · ImageGen</span>
    </section>
    <div className="guide-start-strip"><span>Не знаете, с чего начать?</span><Link href="/guide/walkthrough">Пройдите практикум с готовым проектом ↗</Link><a href="#guide-screens">Посмотрите реальные экраны ↓</a></div>
    <section className="guide-paths" aria-label="Выберите свой маршрут">
      <Link href="/guide/installation"><Image unoptimized src="/guide/illustrations/workspace.webp" alt="" width="1672" height="941" loading="lazy" /><small>01 / Первое подключение</small><strong>Всё начинается<br />с вашего компьютера.</strong><p>iPhone, MCP, приложение Mac, passkey и QR — с понятным порядком действий.</p><span>Установить и подключить ↗</span></Link>
      <Link href="/guide/message-delivery"><Image unoptimized src="/guide/illustrations/delivery.webp" alt="" width="1672" height="941" loading="lazy" /><small>02 / Сообщения</small><strong>Куда отправился<br />ваш запрос?</strong><p>Путь от телефона до агента. Квитанции, задержки, очередь, Cancel и Delete.</p><span>Разобраться с доставкой ↗</span></Link>
      <Link href="/guide/governance"><Image unoptimized src="/guide/illustrations/governance.webp" alt="" width="1672" height="941" loading="lazy" /><small>03 / Контроль</small><strong>Понятные правила.<br />Осознанные решения.</strong><p>Allow, Ask, Deny, покрытие компьютеров и подтверждение применения.</p><span>Настроить Governance ↗</span></Link>
    </section>
    <ScreenshotGallery />
    <section className="guide-home-section"><div className="guide-section-heading"><span className="guide-eyebrow">Картина целиком</span><h2>От нажатия Send до ответа агента</h2><p>Статусы показывают подтверждения. Реле, компьютер, агент и экран провайдера не обязаны обновиться одновременно.</p></div>
      <Diagram id="delivery" /></section>
    <section className="guide-home-section" id="all-chapters"><div className="guide-section-heading"><span className="guide-eyebrow">Оглавление</span><h2>Найдите нужный раздел</h2><p>Слева — всё руководство. В каждой главе — своё содержание, примеры и ссылки на следующий шаг.</p></div>
      <div className="guide-chapter-groups">{guideGroups.map(group => <section key={group.id}><h3><span>{group.icon}</span>{group.title}</h3>
        {guideCatalog.filter(page => page.group === group.id).map(page => <Link href={`/guide/${page.slug}`} key={page.slug}><strong>{page.title}</strong><span>{page.summary}</span><b aria-hidden="true">↗</b></Link>)}
      </section>)}</div></section>
    <section className="guide-lab-feature"><Image unoptimized src="/guide/illustrations/mesh.webp" alt="Скульптурная иллюстрация отдельных проектов, связанных мостами" width="1672" height="941" loading="lazy" /><div><span className="guide-eyebrow">Попробуйте на практике</span><h2>Маленький проект.<br /><em>Настоящий опыт.</em></h2><p>Скачайте GrantTap Lab: без ключей, сети и сторонних зависимостей. Поставьте задачу, проверьте доставку, изучите правки и запустите тесты.</p><Link className="guide-primary" href="/guide/walkthrough">Открыть практикум ↗</Link><small>Иллюстрация · ImageGen</small></div></section>
    <aside className="guide-beta-note"><strong>Проверяйте версии, а не только внешний вид.</strong><p>Гайд описывает iPhone 230 и модуль Mac 0.8.105. Для старых Mac-скриншотов указаны их собственные сборки. Возможности конкретного провайдера и наличие Engine могут различаться.</p><Link href="/guide/updates">Как устроены обновления ↗</Link></aside>
    <footer className="guide-home-footer"><span>GrantTap · Руководство пользователя</span><Link href="/support?lang=ru">Нужна помощь?</Link><Link href="/privacy?lang=ru">Приватность</Link></footer>
  </div>;
}
