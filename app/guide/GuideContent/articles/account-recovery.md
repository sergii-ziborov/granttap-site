## Восстанавливать связь, а не начинать всё заново {#principle}

Если новый iPhone не видит чаты или два Mac отображаются под похожими именами, не удаляйте все ключи. Сначала определите, какой слой не работает: личный GrantTap account, конкретная computer pairing, права Project или сам coding provider.

В Account Mesh может быть несколько компьютеров. Каждый публикует собственные Tasks и сохраняет свой маршрут. Выбор другого активного устройства в Devices не переносит существующую conversation. Для изменения исполнителя предназначен [handoff](/guide/handoff), а не Reconnect.

Эта глава дополняет [первичное подключение](/guide/pairing). Все операции удаления и отзыва имеют свою область; локальное исчезновение строки не доказывает, что потерянное устройство утратило все ранее выданные credentials.

## Четыре аккаунта и разрешения {#accounts}

| Что восстанавливаете | Чем оно подтверждается |
| --- | --- |
| GrantTap Account Mesh | Тем же passkey или предусмотренным account sign-in |
| Apple purchase | Apple Account покупателя и Restore purchases |
| Coding provider | Его собственным входом и подпиской |
| Доступ к Project | Выбранными membership, repository grants и computer permissions |

Passkey GrantTap не является Sign in with Apple. Apple Passwords может синхронизировать его через iCloud, но успешный Apple purchase не выбирает нужный GrantTap account. Вход в OpenAI или Claude также не возвращает автоматически device pairing.

В Devices → Account Mesh есть **Sign in with passkey** и отдельное **Create a GrantTap account**. Для восстановления существующей работы выбирайте вход, а не намеренное создание другого аккаунта. Если вошли не туда, предусмотрен **Use a different passkey**. Проверьте выбранный credential provider на обоих устройствах.

## Сначала read-only проверки {#check-first}

На нужном компьютере выполните:

```bash
granttap status
```

Проверьте helper, интернет и provider readiness. На телефоне откройте Devices, обновите список и посмотрите Account devices. Статусы **Offline**, **Online** и **Chats available** не взаимозаменяемы: account registration ещё не доказывает защищённый доступ к conversations.

Если показан **Retry secure chat link**, используйте его для этого компьютера. **Verify app relay access** относится к проверке подходящего app/managed access, когда именно она нужна. Не лечите её созданием нового provider account.

Для отдельной прямой connection предусмотрен **Reconnect** либо **Scan QR / Pair**, если состояние требует repair. Сначала прочитайте причину. Для native Mac отдельно проверьте [Authorize local Mac access](/guide/mac-app#access): эта авторизация не заменяет account pairing.

## Добавить или вернуть телефон {#new-phone}

Если passkey доступен на новом iPhone, войдите им в GrantTap. Account sync обнаруживает online компьютеры и запрашивает защищённые pairing offers. Старые Tasks сохраняют source computer route. Offline Mac может потребовать возвращения в сеть, прежде чем его связь восстановится.

Если рядом есть доверенный controller со входом, откройте Devices → **Add another iPhone or iPad (Show QR)**. Account invitation одноразовое и действует пять минут. Новый телефон получает собственную account session; действующий код нельзя публиковать или отправлять постороннему.

Для прямого pairing одного компьютера используйте его connection card **Add a device**. Для уже подключённого телефона — предусмотренный Reconnect. На Mac путь называется **Connect iPhone or iPad**, на получателе — **Add a device (Scan QR)**.

| Код | Что он даёт |
| --- | --- |
| Account QR, пять минут | Новую session вашего Account Mesh |
| Computer QR | Связь с указанным компьютером; срок указан в текущем приглашении |
| Project invite, пятнадцать минут | Выбранный Mesh, роль и права участника |

Project invite не открывает весь личный аккаунт, а новый account controller не отменяет [repository grants](/guide/members#repository-grants).

## Одинаковые названия компьютеров {#identity}

Два Mac могут называться одинаково. Название — display label, не право доступа и не stable machine identity. И наоборот, переименование того же Mac не должно намеренно создавать новую execution route.

Сравните доступность, свежесть chat list, сведения нужной Task и реальный компьютер. В direct connection details могут быть технические признаки маршрута; не публикуйте их вместе с секретами. Один старый QR link и account record также не обязательно означают два физических Mac.

Если видите **Unverified QR connection**, сначала завершите подтверждённое восстановление соответствующей machine identity. Не объединяйте записи наугад и не удаляйте ту, в которой остаётся неопределённая отправка. Перед удалением запишите, какие Tasks и pending messages относятся к маршруту.

## Потерянный телефон: что именно отозвать {#lost-phone}

Используйте другой доверенный controller или доступный аккаунт. Для device, получившего Project membership, владелец открывает его member detail и удаляет соответствующий link. Это прекращает новое forwarding в этой области; уже полученные данные не возвращаются назад.

Если доступ был выдан через **Sign-in token**, войдите с passkey, откройте Devices → Account Mesh → **Sign-in tokens**, выберите нужную запись и **Revoke token** с подтверждением. Отзыв завершает созданные этим token account sessions. Независимые encrypted computer pairings от этого не исчезают.

На [странице аккаунта](https://granttap.com/account) можно отключить выбранный account-linked computer. Это отзыв computer link, а не универсальная кнопка удаления всех credentials потерянного iPhone. Не подменяйте эти операции одинаковым словом «отключил».

:::warning Прямой pairing требует отдельного разбора
Текущий интерфейс не обещает одной универсальной кнопки отзыва любого личного телефона со всеми независимыми QR-связями. Удаление connection на оставшемся iPhone не является доказательством remote revocation потерянного. Для такого случая используйте поддержку и точечную процедуру именно выданного доступа, сохраняя остальные связи.
:::

## Что не следует нажимать ради обычного repair {#destructive}

**Unlink** удаляет локальные ключи выбранного компьютера с этого устройства. Подтверждение сообщает, что остальные links остаются. **Unlink all computers** имеет другой масштаб и убирает все связанные компьютеры и local session state с этого iPhone. Это не диагностический refresh.

**Delete account** удаляет account recovery и account-linked records, но независимые QR pairings не следует считать автоматически отозванными. Apple subscriptions отменяются отдельно. Не используйте account deletion или `granttap reset` как обычную установку новой версии.

Скачанная история, рабочее дерево Mac и native provider conversations также разные данные. Восстановление pairing не является резервной копией потерянного компьютера. Подробности — [офлайн и хранение](/guide/offline-storage) и [безопасность](/guide/security#endpoints).

## Проверить результат восстановления {#finish}

Откройте прежнюю Task и сверяйте тот же provider/computer. Проверьте старые pending записи без повторной отправки. Для новой связи используйте безопасный запрос в своём Lab по [walkthrough](/guide/walkthrough), а не копию неопределённого production prompt.

Если чаты появились, но действие запрещено, переходите к [Governance](/guide/governance), [Engine](/guide/engine) и [лимитам](/guide/limits). Состояние account не снимает native deny и provider limits. Для очистки неоднозначности сначала нужна точная причина; новую работу можно оформить через [New Task](/guide/new-task), сохраняя предыдущую историю.
