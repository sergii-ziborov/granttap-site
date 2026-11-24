import Image from "next/image";
import Link from "next/link";
import { guideCatalog, guideGroups } from "../GuideContent/catalog";
import { Diagram } from "./Diagram";
import { ScreenshotGallery } from "./ScreenshotGallery";
import captures from "../GuideContent/screenshots.json";

const paths = [
  ["01", "Первое подключение", "От установки до первого ответа", "Приложение, MCP, passkey, компьютер и проверка связи.", "quick-start"],
  ["02", "Ежедневная работа", "Задачи под вашим контролем", "Чат, карта работы, вопросы, подчаты, автоматизации и перенос работы.", "chat"],
  ["03", "Устройства и доступ", "Обновить, войти, разобраться", "Версии MCP и провайдеров, перезапуск и очистка кэша.", "device-management"],
];

export function GuideHome() {
  return <div className="guide-home">
    <section className="guide-home-hero">
      <div className="guide-hero-copy"><span className="guide-eyebrow">Руководство GrantTap · 24 ноября 2026</span>
        <h1>Ваши агенты.<br />Ваша работа.<br /><em>Шаг за шагом.</em></h1>
        <p>Подключите компьютер, продолжите задачу с телефона и проверьте результат. С настоящими экранами, подробными инструкциями и объяснением каждого статуса.</p>
        <div className="guide-hero-actions"><Link className="guide-primary" href="/guide/quick-start">Начать с первого подключения <span>↗</span></Link>
          <a href="#all-chapters">Все главы ↓</a></div>
        <div className="guide-home-facts"><span><strong>{guideCatalog.length}</strong> глав</span><span><strong>{captures.length}</strong> скриншотов</span><span><strong>01</strong> учебный проект</span></div>
      </div>
      <div className="guide-hero-screens" aria-label="Интерфейс GrantTap">
        <Image className="hero-screen-back" unoptimized src="/guide/screens/live-map.png" alt="Карта работы чата" width={1206} height={2622} priority />
        <Image className="hero-screen-front" unoptimized src="/guide/screens/chat-316.png" alt="Чат GrantTap: модель с усилием и панель работы" width={1206} height={2622} priority />
        <span className="hero-screen-caption">Наше приложение · учебные данные · Simulator</span>
      </div>
    </section>
    <div className="guide-start-strip"><strong>Выберите свою задачу</strong><Link href="/guide/message-delivery">Не пришло сообщение ↗</Link><Link href="/guide/provider-sign-in">Нужно войти в агента ↗</Link><Link href="/guide/automations">Настроить автоматизации ↗</Link><a href="#guide-screens">Посмотреть экраны ↓</a></div>
    <section className="guide-paths" aria-label="Выберите свой маршрут">{paths.map(([number, label, title, description, slug]) =>
      <Link href={`/guide/${slug}`} key={slug}><small>{number} / {label}</small><strong>{title}</strong><p>{description}</p><span>Открыть маршрут ↗</span></Link>)}</section>
    <section className="guide-home-section"><div className="guide-section-heading"><span className="guide-eyebrow">Сначала самое полезное</span><h2>Что изменилось в руководстве</h2><p>Новые главы о версиях 1.0.2–1.0.5: карта работы, подчаты и ранние запуски, свайпы в «Требует внимания», цитаты, сжатие контекста, «Изменения» с worktree и подписка с бесплатной неделей. Автоматизации теперь отправляют сообщения по расписанию в чат любого агента. Все новые экраны — на русском.</p></div>
      <div className="guide-quick-links">{["live-map", "chat-tree", "needs-you-actions", "automations", "changes-worktrees", "quotes"].map(slug => { const page = guideCatalog.find(item => item.slug === slug)!; return <Link href={`/guide/${slug}`} key={slug}><strong>{page.title}</strong><span>{page.summary}</span><b aria-hidden="true">↗</b></Link>; })}</div>
    </section>
    <ScreenshotGallery />
    <section className="guide-home-section"><div className="guide-section-heading"><span className="guide-eyebrow">Как это работает</span><h2>От Send до ответа агента</h2><p>Нажмите на этап схемы. Сохранение на реле, получение компьютером, начало работы и ответ подтверждаются отдельно.</p></div><Diagram id="delivery" /></section>
    <section className="guide-home-section" id="all-chapters"><div className="guide-section-heading"><span className="guide-eyebrow">Полное оглавление</span><h2>Одна глава — понятный следующий шаг</h2><p>Можно читать подряд или искать по названию кнопки, статусу и тексту проблемы. Поиск работает по содержимому всех глав.</p></div>
      <div className="guide-chapter-groups">{guideGroups.map(group => <section key={group.id}><h3><span>{group.icon}</span>{group.title}</h3>
        {guideCatalog.filter(page => page.group === group.id).map(page => <Link href={`/guide/${page.slug}`} key={page.slug}><strong>{page.title}</strong><span>{page.summary}</span><b aria-hidden="true">↗</b></Link>)}
      </section>)}</div></section>
    <section className="guide-lab-feature"><Image unoptimized src="/guide/illustrations/mesh.webp" alt="Художественная иллюстрация: части проекта соединены мостами" width={1672} height={941} loading="lazy" /><div><span className="guide-eyebrow">Практика без ваших секретов</span><h2>Попробуйте на<br /><em>GrantTap Lab.</em></h2><p>Скачайте небольшой учебный проект. Поставьте задачу, изучите правки и проверьте результат тестами. Демо в приложении отдельно показывает интерфейс без подключения компьютера.</p><Link className="guide-primary" href="/guide/walkthrough">Открыть практикум ↗</Link><small>Художественная иллюстрация · ImageGen</small></div></section>
    <aside className="guide-beta-note"><strong>Версии и границы проверки</strong><p>Источники инструкций и ограничения перечислены в главе «Покрытие». Новые снимки получены в Simulator; у сохранённых ранних экранов указана их сборка. Демо показывает интерфейс, а не подтверждает реальную доставку или авторизацию.</p><Link href="/guide/coverage">Покрытие, источники и скриншоты ↗</Link></aside>
  </div>;
}
