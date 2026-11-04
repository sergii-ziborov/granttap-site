:::capture pairing-options

## Какие компоненты нужны {#components}

GrantTap состоит из нескольких связанных частей. Приложение на iPhone показывает работу и отправляет ваши решения. Компьютерный helper общается с coding providers и обслуживает доставку. Plugin открывает GrantTap внутри coding app. Mac приложение даёт отдельный native интерфейс управления.

| Компонент | Где установить | Для чего нужен |
| --- | --- | --- |
| GrantTap для iPhone / iPad | Доступный Apple-путь, например приглашение TestFlight | Чаты, решения, очередь, просмотр работы |
| `granttap-mcp` | На каждом компьютере, где выполняются coding agents | Фоновые службы, hooks, каталог, доставка |
| GrantTap plugin | В используемой coding app | Connection card и поддерживаемые MCP-инструменты |
| GrantTap для Mac | Через доступный путь распространения Mac app | Контроль с компьютера и локальный доступ |

Mac, используемый только как controller других компьютеров, не обязан иметь локальный MCP. Для управления агентами именно на этом Mac нужен его отдельно установленный runtime и подтверждённый local access.

## Перед установкой {#requirements}

Подготовьте поддерживаемый Node.js LTS **не ниже 22.13.0**, доступ в интернет и установленный coding provider. Node 18 и 20 не поддерживаются. Подписка модели, токены и provider login не входят автоматически в GrantTap.

Не устанавливайте неизвестный provider только потому, что он отображается в списке. Claude Code и Codex поддерживают основные сценарии; Cursor отмечен Beta, Grok Build имеет более узкий контроль. Нужные различия перечислены в [провайдерах](/guide/providers).

Apple-сборка доступна только через фактически предоставленный вам канал. Отправленный разработчиком архив ещё может проходить обработку Apple. Наличие исходников Mac app не означает, что consumer App Store release уже доступен. Не заменяйте обычную установку инструкцией самостоятельной сборки из Xcode.

## Установить компьютерный helper {#helper}

Откройте свой обычный терминал на компьютере, где будут работать агенты:

```bash
npm install --global granttap-mcp
granttap setup
granttap status
```

Первая команда устанавливает пакет и CLI. `granttap setup` обнаруживает локальные providers, устанавливает или исправляет принадлежащие GrantTap hooks, подготавливает background helper и соответствующий MCP service. Команда меняет локальную настройку, поэтому запускайте её на нужном компьютере.

`granttap status` показывает read-only summary: pairing, helper и готовность интеграций. Прочитайте строку **Next** после setup: она указывает следующий необходимый шаг, например подключение телефона или review Codex hooks. Provider Not installed может быть нормальным состоянием.

Для Governance и части Project reports нужен отдельно распространяемый GrantTap Engine. Setup и paired monitor подготавливают поддерживаемый Engine по своему контракту; отсутствие готовности отображается отдельно. Не считайте строку установки доказательством, что policy уже применяется на каждом execution.

## Plugin для Codex {#codex}

Используйте текущую first-party инструкцию marketplace:

```bash
codex plugin marketplace add sergii-ziborov/granttap-mcp
codex plugin add granttap@granttap
```

На странице plugin откройте **Try now → Connect GrantTap to this computer** либо доступную connection card. Внутри неё находятся status, Add a device и Connect with passkey. GrantTap phones не обязаны отображаться в списке Codex Connected accounts: это разные подключения.

Codex может потребовать доверить точные GrantTap hooks. Откройте предусмотренный review в GrantTap Settings → This Mac → Codex hooks либо native `/hooks`, изучите definitions и следуйте подтверждённому next action. Установка определения не равна native trust. Не включайте глобальное разрешение всех hooks ради быстрого прохождения настройки.

## Plugin для Claude Code {#claude}

После установки того же helper выполните:

```bash
claude plugin marketplace add sergii-ziborov/granttap-mcp
claude plugin install granttap@granttap
```

В Claude Code откройте `/mcp`, выберите GrantTap и пройдите Authenticate, если coding app его требует. Затем используйте `/granttap:granttap-connect` или connection status. Это разрешение данной coding app пользоваться MCP; привязка iPhone выполняется отдельно через [passkey или QR](/guide/pairing).

Не передавайте agent токены для входа вручную. Provider authentication остаётся его собственной процедурой, которую выполняете вы.

## Cursor и Grok Build {#other-providers}

Для Cursor используйте reviewed GrantTap Marketplace listing, если он доступен вашему аккаунту, затем reload Cursor и `granttap setup`. Не добавляйте дублирующий GrantTap HTTP endpoint в Customize → MCPs. Старая запись на localhost может объяснять Cloud fetch failed; это не доказательство потери phone pairing.

Для Grok Build опубликованы команды:

```bash
grok plugin marketplace add sergii-ziborov/granttap-mcp
grok plugin install granttap --trust
```

Далее откройте `/mcps`, авторизуйте GrantTap и используйте `/granttap-connect`. Если provider или версия coding app не поддерживает указанный путь, сначала проверьте её доступный интерфейс. Не создавайте наугад новую MCP конфигурацию и не переустанавливайте телефон.

## Завершить и проверить {#verification}

Подключите телефон по [отдельной инструкции](/guide/pairing). Проверьте нужный компьютер в Devices и выполните один безопасный сценарий в своём [GrantTap Lab](/guide/demo-project#practice). Для знакомства без реального исполнения существует встроенное Demo.

Нормальное обновление helper не требует `granttap reset`, удаления истории или старых pairings. Plugin, runtime и Apple app обновляются отдельно; подробности — [версии и обновления](/guide/updates). Если связь не появилась, начните с [диагностики подключения](/guide/troubleshooting#connection).
