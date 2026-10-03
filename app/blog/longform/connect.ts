import type { ArticleExtension } from "./types";

export const connectExtension: ArticleExtension = {
  images: { second: "/blog/connect-iphone-with-qr-a.webp" },
  en: {
    secondCaption: "Generated editorial illustration of device pairing. The pictured symbols are decorative, not a working QR code or GrantTap screen.",
    sections: [
      { heading: "Pairing is a trust decision", paragraphs: [
        "The QR step is deliberately short lived because it authorizes a new controller for a particular computer. Before scanning, confirm that the code appears in the GrantTap panel on the computer you meant to add. A code forwarded through a chat, copied into a ticket, or photographed by someone else has lost the physical context that makes pairing understandable. If anything feels ambiguous, close that attempt and start a fresh one on the intended machine.",
        "A successful scan is not a general invitation into every Project. Device trust answers whether this phone may communicate with this computer. Project membership answers which people may see or act within a shared scope. Keeping the two decisions apart reduces accidental access: adding a second personal computer does not silently add coworkers, and accepting a Project invitation does not secretly enroll a new controller for your laptop.",
      ] },
      { heading: "What to verify on both screens", paragraphs: [
        "Read the computer name and the pending action before confirming on the phone. Afterward, look for that computer in Connections and compare its status with the panel on the desktop. A familiar name is useful for recognition, but it is not a cryptographic proof by itself; names can be reused. The pairing flow must tie the confirmation to the active one-time exchange, while the interface helps you recognize which machine you are dealing with.",
        "For a practical smoke test, keep the coding application open and trigger one ordinary Task event. Confirm that the phone shows that Task under the expected computer and provider. This checks more than whether the relay has a connection. It checks that a provider integration observed work, the local helper forwarded it, and the phone could display it. If any link is missing, diagnose that link rather than repeating pairing indefinitely.",
      ] },
      { heading: "When the connection appears incomplete", paragraphs: [
        "A common source of confusion is the difference between installed, running, and integrated. A package may exist on disk while its helper is stopped. The helper may be online while a coding app has not loaded a newly installed plugin. A task may be visible locally but not yet delivered to the phone. Those are separate observations. Check the helper and integration status on the computer, then repeat the small live-event test before treating the setup as complete.",
        "If the phone is offline, an absent update does not establish that the Task disappeared. Return to the computer, confirm the Task in the provider, and let the connection recover. Likewise, a message marked queued is not the same as a message accepted by the provider. The status should preserve that distinction. This is especially important for approvals: a delayed notification must not be mistaken for an action that was already allowed or denied.",
      ] },
      { heading: "Adding more than one device", paragraphs: [
        "People often use a desktop at home and a laptop while traveling. Pair each computer explicitly, then give each a name that helps you choose the correct target when continuing a Task. Do not rely on a folder name to identify the machine; several computers can have a checkout called the same thing. A route should refer to a particular host and provider session, and the phone should show enough context to prevent an accidental command on the wrong computer.",
        "A second controller phone is another trust relationship. Add it through the supported Connections flow, then inspect the resulting device list. If a device is lost or sold, revoke its connection on the remaining trusted device or computer before pairing a replacement. Revocation and replacement are independent actions: a new phone does not make an old trust link disappear. Project member access may need separate review if that person or device also participated in shared work.",
      ] },
      { heading: "A small checklist after setup", paragraphs: [
        "The useful end state is not a pretty QR animation. You should be able to identify the paired computer, see whether it is currently reachable, find a Task from the intended provider, and tell whether a recent event was delivered. If an approval is requested, check its exact Task and action before responding. If you cannot explain what you are approving, leave it unanswered and inspect the computer. That pause is a feature of responsible remote control.",
        "The illustration above is intentionally conceptual and the product capture below uses deterministic demonstration data. Neither is proof that your own pairing succeeded. The proof is the pair of confirmed devices and a real event on your own installation. The setup documentation and support page give the current installation steps; follow their version-specific instructions when labels or integrations change. This article explains what each step means so a successful connection is also an understood one.",
      ] },
    ],
  },
  ru: {
    secondCaption: "Сгенерированная иллюстрация привязки устройств. Символы декоративные: это не рабочий QR-код и не экран GrantTap.",
    sections: [
      { heading: "Привязка — решение о доверии", paragraphs: [
        "QR живёт недолго, потому что разрешает новому телефону управлять конкретным компьютером. Перед сканированием убедитесь, что код появился именно в панели GrantTap на том компьютере, который вы собирались добавить. У кода, пересланного в чат, вставленного в заявку поддержки или снятого посторонним человеком, исчезает понятный физический контекст. Если происхождение вызывает сомнение, закройте попытку и создайте новую на нужной машине.",
        "Успешное сканирование не приглашает вас автоматически во все Projects. Доверие устройству отвечает на вопрос, может ли этот телефон общаться с компьютером. Участие в Project отвечает на другой вопрос: какие люди видят общий контекст и могут в нём действовать. Разделение снижает риск случайного доступа: добавление второго личного Mac не приглашает коллег, а приглашение в Project не превращает чужой телефон в контроллер вашего ноутбука.",
      ] },
      { heading: "Что проверить на двух экранах", paragraphs: [
        "Перед подтверждением прочитайте имя компьютера и описание действия на телефоне. Затем найдите компьютер в Connections и сравните его статус с панелью на рабочем столе. Знакомое имя помогает ориентироваться, но само по себе не служит криптографическим доказательством: одинаковые имена могут повторяться. Подтверждение должно относиться к текущему одноразовому обмену, а интерфейс — позволять человеку понять, с какой машиной он работает.",
        "Для практической проверки оставьте coding app открытым и вызовите одно обычное событие Task. Убедитесь, что телефон показывает эту Task с ожидаемым компьютером и провайдером. Такая проба проверяет больше, чем соединение relay: интеграция заметила работу, локальный helper передал событие, а телефон смог его отобразить. Если цепочка обрывается, ищите конкретное звено, а не повторяйте привязку без конца.",
      ] },
      { heading: "Если соединение кажется неполным", paragraphs: [
        "Частая путаница — считать установку, запуск и интеграцию одним состоянием. Пакет может лежать на диске, пока helper не запущен. Helper может быть online, пока coding app не загрузил новый plugin. Task может быть видна локально, но ещё не доставлена на телефон. Это разные наблюдения. Проверьте состояние helper и интеграции на компьютере, после чего повторите небольшую живую пробу, прежде чем считать настройку завершённой.",
        "Если телефон временно offline, отсутствие обновления не означает, что Task исчезла. Вернитесь к компьютеру, проверьте задачу у провайдера и дождитесь восстановления связи. Сообщение в очереди также не равно сообщению, принятому провайдером. Статус должен сохранять это различие. Особенно важно не спутать запоздавшее уведомление о подтверждении с уже разрешённым или запрещённым действием.",
      ] },
      { heading: "Когда устройств несколько", paragraphs: [
        "У многих есть домашний desktop и рабочий ноутбук. Привяжите каждый компьютер отдельно и назовите так, чтобы потом выбрать правильную цель при продолжении Task. Название папки для этого не подходит: на разных машинах checkout может называться одинаково. Маршрут должен ссылаться на конкретный host и сессию провайдера, а телефон — показывать достаточно контекста, чтобы команда не ушла не на тот компьютер.",
        "Второй телефон-контроллер создаёт ещё одну доверенную связь. Добавьте его поддерживаемым сценарием Connections и проверьте список устройств. Если телефон потерян или продан, отзовите его связь с оставшегося доверенного устройства или компьютера до привязки замены. Замена и отзыв независимы: новый телефон не удаляет старое доверие. Если устройство участвовало в общей работе, отдельно проверьте доступ человека к Project.",
      ] },
      { heading: "Проверка после настройки", paragraphs: [
        "Итог настройки — не красивая анимация QR. Вы должны узнавать подключённый компьютер, видеть его текущую доступность, находить Task нужного провайдера и понимать, доставлено ли последнее событие. При запросе подтверждения проверьте конкретную Task и действие. Если непонятно, что именно разрешается, оставьте запрос без ответа и изучите ситуацию на компьютере. Такая пауза — нормальная часть ответственного удалённого управления.",
        "Иллюстрация выше намеренно концептуальна, а скриншот приложения ниже сделан на детерминированных демонстрационных данных. Ни один из них не доказывает успешную привязку лично у вас. Доказательство — подтверждённая пара устройств и реальное событие в вашей установке. В документации установки и на странице поддержки находятся актуальные шаги для конкретной версии. Эта статья объясняет смысл каждого шага, чтобы соединение было не только успешным, но и понятным.",
      ] },
      { heading: "Если нужно начать заново", paragraphs: [
        "Не пытайтесь чинить ошибочную привязку многократной отправкой одного и того же снимка QR. Одноразовый код связан с конкретной попыткой и временем. Вернитесь к панели на нужном компьютере, завершите прежний шаг и создайте новый код. Затем сравните отображаемый компьютер с тем, который физически перед вами. Если сессия coding app была запущена до установки plugin, перезапустите приложение отдельно: новая привязка телефона сама по себе не загружает integration в уже работающий процесс.",
        "Если сомневаетесь, какое устройство сейчас доверенное, откройте список Connections на обоих концах и сверяйте связь по контексту, а не по одному похожему имени. Удаление старой связи — отдельное действие с последствиями для этого устройства; выполняйте его осознанно. После исправления снова проверьте живое событие Task. Такая последовательность отделяет проблему доверия устройств от проблемы наблюдения за провайдером и помогает не ослаблять права доступа ради удобства настройки.",
        "Запишите для себя, какой компьютер был добавлен и зачем он нужен. Когда появится ещё одно устройство, эта простая запись поможет отличить ожидаемую связь от забытой. Периодически проверяйте список доверенных компьютеров и телефонов, особенно после смены работы или продажи техники. Никакой цвет индикатора не заменяет понимания того, кому и куда вы выдали право управления.",
      ] },
    ],
  },
};
