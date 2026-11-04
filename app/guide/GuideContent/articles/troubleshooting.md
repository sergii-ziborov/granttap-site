## Сначала определите, какой этап не работает {#first}

Зависший экран, непринятое сообщение и старый provider chat могут выглядеть похоже, но требуют разных проверок. Начните с исходной записи: какой Task, execution, computer, provider и время действия? Не создавайте новую отправку, чтобы проверить старую.

Ни Live, ни Working, ни Online на сайте не подтверждают завершение конкретной операции. Для отправки есть receipts, для policy — revision/coverage, для transfer — destination receipt. Сохранённый экран может оставаться доступным после потери связи.

:::tip Подготовьте минимум сведений
Запишите версии Apple app, helper и provider, нужный экран, текст очищенной ошибки и последовательность шагов. Если есть Technical details сообщения, сохраните Message ID. Не публикуйте pairing keys, QR, credentials или private transcript.
:::

## Компьютер не подключается или чатов нет {#connection}

Проверьте, что execution computer включён, не спит, имеет интернет и запущенный helper. На этом компьютере выполните read-only проверку:

```bash
granttap status
```

Убедитесь, что телефон вошёл в нужный passkey account либо выбрана правильная прямая пара. Account Online/Seen означает наблюдение компьютера, но каталог chats ещё должен прийти по защищённому маршруту.

При необходимости используйте Reconnect для конкретной связи. Добавление другого компьютера не должно переключить на него все старые Tasks. Для Mac local access отдельно проверьте [Authorize local Mac access](/guide/mac-app#access). Не начинайте с reset, удаления всех pairings и переустановки iPhone app.

## Saved on relay остаётся надолго {#delivery}

Откройте статус под исходным сообщением. Сверьте текст, chat, дату и время, затем нажмите Refresh status. Relay receipt подтверждает сохранение, но ещё не получение компьютером или начало ответа агента.

Проверьте нужный computer route, provider login, лимит модели, pause и pending permission. Computer receipt not confirmed означает нехватку подтверждения, а не доказанную потерю. Agent мог принять запрос раньше обновления карточки.

Периодический каталог, native transcript и открытое desktop окно обновляются разными путями. Иногда ожидание видно десятками секунд, но руководство не обещает обязательную паузу или измеренное среднее в 30 секунд. Разбор этапов находится в [доставке](/guide/message-delivery).

:::capture delivery

## Очередь, отмена и повтор {#queue}

Для pending queue entry откройте [очередь](/guide/message-queue). Send now снимает обычное ожидание idle и порядка, но сохраняет pause, уже идущую отправку GrantTap в тот же чат, нативные ограничения провайдера и deny. Cancel ждёт подтверждения отмены управляемой операции; не считайте исчезнувший локальный индикатор доказательством остановки агента.

Delete в деталях доставки удаляет соответствующую локальную запись на устройстве. Он не отменяет уже принятый native turn и не стирает provider history. Перед новой попыткой проверьте исходную conversation: повтор опасной команды после потерянной квитанции может выполнить работу второй раз.

Если неизвестность сохраняется, сохраните ID и ошибку. Подмена статуса более приятным названием не подтверждает доставку.

## Grok не открывается после переноса {#transfer}

Откройте Task и executions. Source Claude и destination Grok — разные native sessions одной работы. Banner Transferred предлагает Open destination; Continue anyway в source имеет смысл параллельной ветки, а не возвращения всей задачи назад.

Проверьте preparation status и каталог правильного компьютера. Сообщение, что chat не retained на iPhone, не доказывает отсутствия native history на Mac. Не запускайте второй transfer вслепую: status refresh должен проверять existing operation. Подробнее — [handoff](/guide/handoff) и [Grok Build](/guide/providers#grok).

## Working показывается, хотя работа остановилась {#working}

Сравните current execution, время последнего наблюдения и реальное состояние на source computer. Открытая execution может иметь старую summary; наличие лимита в тексте также не доказывает, что сейчас идёт новый turn.

Обновите список и откройте исходный разговор. Если label продолжает противоречить свежему native состоянию, это повод сообщить о баге с versions и timestamps. Не нужно отправлять «Го» ради перекрашивания карточки. Archive организует список, а не подтверждает завершение работы.

## Allow не помогает или модель недоступна {#permissions}

Проверьте [Governance coverage](/guide/governance#coverage), applied revision и native sandbox. Global Deny сильнее Allow, а выбранный MCP/Skill не устанавливает пакет и не даёт новые права. Codex hooks должны быть не только configured, но и trusted/enabled.

Model list относится к конкретному destination computer/provider и его account. Offline или устаревший каталог не позволяет честно обещать current availability. Не вводите придуманный model ID и не снимайте глобальные ограничения. Если provider ждёт native permission или уже занят ходом, решайте исходный запрос.

## Graph, Runtime или policy не приходят {#engine}

Убедитесь, что соответствующий компьютер публикует нужный Project/repository binding и Engine готов. Для Graph проверьте дату и revision отчёта, затем используйте предусмотренный Refresh/build. Старый или частичный report не означает свежий полный анализ.

Runtime unavailable не равен пустой истории. Governance Applying не равен применённой revision. Смотрите конкретные error и coverage; для Unknown нужны подтверждённые сведения, а не ещё одна декоративная галочка. Объяснения находятся в [Graph / Health](/guide/graph-health), [Runtime](/guide/audit-evidence#runtime) и [Governance](/guide/governance#delivery).

## Повторные вопросы и обращение в поддержку {#support}

Для отвеченного вопроса проверьте original request и delivery, а не только видимость карточки Needs You. Отдельные вопросы с одинаковыми словами могут иметь разные IDs; один и тот же request не должен размножаться из-за replay. Skip скрывает предусмотренный локальный вопрос и не является ответом агенту.

Проверьте [уведомления](/guide/notifications) и совместимость [версий](/guide/updates). Ошибки MCP/helper можно направить через [issues](https://github.com/sergii-ziborov/granttap-mcp/issues), уязвимости — только приватным [security advisory](https://github.com/sergii-ziborov/granttap-mcp/security/advisories/new). Пример воспроизведения лучше подготовить в [GrantTap Lab](/guide/demo-project#practice), сохранив реальные pending операции без повторной отправки.
