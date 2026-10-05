import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = { title: "Data choices and deletion", description: "How to manage or delete GrantTap Personal data.", alternates: { canonical: "/data-rights" } };

export default function DataRightsPage() {
  return <LegalPage
    title={{ en: "Data choices and deletion", ru: "Управление и удаление данных" }}
    updated={{ en: "September 30, 2026", ru: "30 сентября 2026" }}
    updatedISO="2026-09-30"
    intro={{ en: "GrantTap Personal keeps most durable state on your devices. These actions cover each location.", ru: "GrantTap Personal хранит почти всё durable state на ваших устройствах. Эти действия охватывают каждое место." }}
    sections={{
      en: [
        { heading: "On iPhone and Apple Watch", bullets: ["Use Usage → … → Clear local usage history for the local capability ledger.", "Unlink a computer to remove its pairing and task keys from the app.", "Remove the app to delete its local container; remove the Watch app separately if needed.", "Change camera, photos, microphone, speech, notification, and biometric permissions in system Settings."] },
        { heading: "On the computer", bullets: ["Run granttap reset for a confirmed, recoverable pairing reset.", "Remove ~/.granttap only when you intentionally want to delete helper configuration and pairing state.", "Provider-owned chat history remains under that provider's own storage and controls."] },
        { heading: "Account, relay, and Apple data", paragraphs: ["On the account page you can revoke a linked Mac, sign out, or delete the account and passkey record. The Apple app also offers Delete account on its passkey connection screen. Deleting an account does not erase QR pairing keys already held on your own devices or cancel an Apple subscription; unlink pairings and manage subscriptions separately. Recovery offers expire within five minutes. Pairing mailboxes and offline queues expire automatically. GrantTap cannot decrypt or identity-search queued task payloads."], links: [{ label: "Manage account", href: "/account" }, { label: "Apple Data and Privacy", href: "https://privacy.apple.com/" }, { label: "Privacy support", href: "mailto:sergii.ziborov@gmail.com" }] },
      ],
      ru: [
        { heading: "На iPhone и Apple Watch", bullets: ["Usage → … → Clear local usage history очищает локальную capability history.", "Unlink computer удаляет pairing и task keys этого компьютера из приложения.", "Удаление приложения очищает local container; при необходимости отдельно удалите Watch app.", "Camera, photos, microphone, speech, notifications и biometric permissions меняются в системных Settings."] },
        { heading: "На компьютере", bullets: ["granttap reset выполняет подтверждённый recoverable reset pairing.", "Удаляйте ~/.granttap только при намеренном удалении helper configuration и pairing state.", "Provider-owned chat history остаётся в storage и controls соответствующего provider."] },
        { heading: "Аккаунт, relay и данные Apple", paragraphs: ["На странице аккаунта можно отозвать Mac, выйти или удалить аккаунт и запись passkey. В приложении Apple также есть «Удалить аккаунт» на экране подключения через passkey. Удаление аккаунта не удаляет QR-ключи, уже сохранённые на ваших устройствах, и не отменяет подписку Apple; отключайте устройства и управляйте подпиской отдельно. Предложения восстановления истекают за пять минут. Pairing mailboxes и offline queues также истекают. GrantTap не расшифровывает и не ищет содержимое задач по личности."], links: [{ label: "Управление аккаунтом", href: "/account" }, { label: "Apple Data and Privacy", href: "https://privacy.apple.com/" }, { label: "Поддержка по данным", href: "mailto:sergii.ziborov@gmail.com" }] },
      ],
    }}
  />;
}
