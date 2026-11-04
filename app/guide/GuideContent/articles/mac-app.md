## Два сценария на Mac {#modes}

GrantTap для Mac — native интерфейс просмотра и управления той же работой, которая доступна на телефоне. Большой экран удобен для длинных transcripts, Files, Mesh, Graph и Usage. Mac приложение не является второй реализацией coding runtime.

Различайте два сценария. **Controller Mac** управляет связанными компьютерами. **Execution Mac** сам запускает coding agents; для такой локальной работы ему нужен отдельно установленный `granttap-mcp`. На одном устройстве эти роли могут сочетаться.

Поэтому отсутствие локального helper не всегда означает, что невозможно пользоваться Mac как controller. Но чтение и управление native executions именно этого Mac требуют готового helper и local authorization.

:::capture mac-now

:::note Дата Mac иллюстраций
Mac screenshots в руководстве — настоящий подписанный интерфейс со встроенными учебными данными, сборка **181 от 13 октября 2026**. Это более ранняя версия; новые снимки iPhone в руководстве относятся к сборке 250. Подписи и расположение отдельных controls текущего Mac могут отличаться.
:::

## Установка и первый запуск {#setup}

Устанавливайте Mac app через фактически доступный вам Apple или иной подтверждённый путь распространения. Страница исходников и developer build script не являются consumer installer. Доступная TestFlight-сборка также не означает публичный App Store release или подтверждённую покупку.

Для исполнения на этом компьютере установите helper:

```bash
npm install --global granttap-mcp
granttap setup
granttap status
```

Подробности Node, providers и plugins находятся в [установке](/guide/installation). Helper и Mac app — разные обновляемые компоненты. Mac App Store sandbox не должен незаметно устанавливать глобальный runtime в домашнюю папку пользователя; соответствующий control открывает инструкции настройки.

При запуске app проверяет локальную готовность. Health probe сообщает о доступности сервиса и сам по себе не даёт права читать workspace. Если сервис не отвечает, приложение не может достоверно заключить, установлен ли пакет вообще: сначала проверьте status.

## Authorize local Mac access {#access}

Для работы с local helper приложение запрашивает **Authorize local Mac access**. Открывается ограниченный browser consent, после которого app получает scoped desktop grant. Процедура использует S256 PKCE; token хранится в device-only Keychain.

Этот путь не требует телефона для каждой локальной операции. Он также не является provider login и не даёт агенту Full access. Через bridge проходят только поддерживаемые desktop operations; machine runtime продолжает принадлежать отдельно установленному MCP.

Подписанные Mac builds, включая signed local test configuration, используют authenticated loopback bridge. Не нужно вручную переносить Unix socket или открывать локальный endpoint посторонним сетевым устройствам ради normal setup.

Если Mac app вошла в Account Mesh, она может запросить эквивалентный grant через проверенный account/machine link. Если account exchange не удался, предусмотрен local browser consent. Старая account session не должна становиться поводом удалять работающий provider account.

## Аккаунт и подключённые устройства {#devices}

В Devices можно войти в личный Account Mesh ещё до установки helper. Когда local MCP появится, app предлагает связать его с этим аккаунтом. Используйте тот же passkey, что на своём iPhone. Identity компьютера и его display name — разные вещи.

Для прямого pairing откройте **Connect iPhone or iPad** и отсканируйте одноразовый QR на телефоне. **Connect a computer by link** добавляет другой компьютер через его invitation. Existing connections не должны заменяться только из-за добавления ещё одного устройства.

Сохранение computer link не доказывает, что новый компьютер online. Enrollment завершён, когда устройство действительно обнаружено по защищённому пути. Account QR, direct computer QR и [Project invite](/guide/members#invite) предоставляют разную область доступа.

## Чат и работа с проектом {#workspace}

Открывая Task, проверяйте provider, computer и execution. Локальная Task идёт через local bridge; удалённая сохраняет свой explicit route. Одна свежая local запись не должна подменять одноимённую сессию другого компьютера.

В чате доступны поддерживаемые сообщения и вложения, Files и вложенные Agents. История показывает сообщённые provider facts, а не автоматически подтверждённый результат каждого edit. Для проверки используйте [Files](/guide/files-voice) и [Runtime](/guide/audit-evidence).

:::capture mac-chat

В Mesh можно работать с [Governance](/guide/governance), [Knowledge](/guide/knowledge-context), [участниками](/guide/members), repositories и reports. Graph отображает полученные сведения анализа. Отсутствующий report не заменяется красивым демонстрационным графом в live режиме.

## Хранение, помощь и обновления {#maintenance}

Полученные страницы истории и previews сохраняются локально. Settings → This Mac → Chat history & cache управляет этой копией; её очистка не является удалением provider-owned conversations. Проверьте подпись выбранного действия перед подтверждением.

Provider storage — отдельная возможность с optional SweepLoom. Она требует явного выбора и подтверждения для допустимых regenerable caches/logs; не предназначена для удаления credentials, conversations и databases. Не используйте её как первый шаг устранения зависшей отправки.

В **Help → GrantTap Help** находится встроенная справка, в **GrantTap → About GrantTap** — версия и документы. [Обновления](/guide/updates) поясняют разницу app, plugin и runtime. При проблеме начните с [диагностики](/guide/troubleshooting#connection), сохранив текущие pairings и исходные сообщения.
