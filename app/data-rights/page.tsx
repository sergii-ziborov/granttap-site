import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = { title: "Data choices and deletion", description: "How to manage or delete GrantTap Personal data.", alternates: { canonical: "/data-rights" } };

export default function DataRightsPage() {
  return <LegalPage
    title={{ en: "Data choices and deletion", ru: "Управление и удаление данных" }}
    updated={{ en: "August 23, 2026", ru: "23 августа 2026" }}
    updatedISO="2026-08-23"
    intro={{ en: "GrantTap Personal keeps most durable state on your devices. These actions cover each location.", ru: "GrantTap Personal хранит почти всё durable state на ваших устройствах. Эти действия охватывают каждое место." }}
    sections={{
      en: [
        { heading: "On iPhone and Apple Watch", bullets: ["Use Usage → … → Clear local usage history for the local capability ledger.", "Unlink a computer to remove its pairing and task keys from the app.", "Remove the app to delete its local container; remove the Watch app separately if needed.", "Change camera, photos, microphone, speech, notification, and biometric permissions in system Settings."] },
        { heading: "On the computer", bullets: ["Run granttap reset for a confirmed, recoverable pairing reset.", "Remove ~/.granttap only when you intentionally want to delete helper configuration and pairing state.", "Provider-owned chat history remains under that provider's own storage and controls."] },
        { heading: "Relay and Apple data", paragraphs: ["Pairing mailboxes and offline queues expire automatically. Unlinking unregisters background delivery where the device can reach the relay. GrantTap cannot decrypt or identity-search queued task payloads."], links: [{ label: "Apple Data and Privacy", href: "https://privacy.apple.com/" }, { label: "Privacy support", href: "mailto:sergii.ziborov@gmail.com" }] },
      ],
      ru: [
        { heading: "На iPhone и Apple Watch", bullets: ["Usage → … → Clear local usage history очищает локальную capability history.", "Unlink computer удаляет pairing и task keys этого компьютера из приложения.", "Удаление приложения очищает local container; при необходимости отдельно удалите Watch app.", "Camera, photos, microphone, speech, notifications и biometric permissions меняются в системных Settings."] },
        { heading: "На компьютере", bullets: ["granttap reset выполняет подтверждённый recoverable reset pairing.", "Удаляйте ~/.granttap только при намеренном удалении helper configuration и pairing state.", "Provider-owned chat history остаётся в storage и controls соответствующего provider."] },
        { heading: "Relay и данные Apple", paragraphs: ["Pairing mailboxes и offline queues истекают автоматически. Unlink отменяет background delivery, когда устройство может связаться с relay. GrantTap не может расшифровать или искать payloads задач по личности."], links: [{ label: "Apple Data and Privacy", href: "https://privacy.apple.com/" }, { label: "Поддержка по данным", href: "mailto:sergii.ziborov@gmail.com" }] },
      ],
    }}
  />;
}
