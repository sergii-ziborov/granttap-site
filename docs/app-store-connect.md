# GrantTap App Store Connect release checklist

Internal release documentation. Items marked `[OWNER CONFIRMATION]` must be
resolved by the account holder before submission; they must never be copied as
placeholders into public metadata or the website.

Last reviewed: 2026-08-02

## Stable public URLs

Use the same canonical HTTPS URLs for every supported storefront localization:

| App Store Connect field | URL |
| --- | --- |
| Marketing URL | https://granttap.com/ |
| Support URL | https://granttap.com/support |
| Privacy Policy URL | https://granttap.com/privacy |
| User Privacy Choices URL | https://granttap.com/data-rights |
| Accessibility URL | https://granttap.com/accessibility |
| Terms | https://granttap.com/terms |
| Security architecture/reporting | https://granttap.com/security |

The Support page exposes a working email contact and troubleshooting. Apple
requires the Support URL to lead to actual contact information and requires a
Privacy Policy URL for iOS apps.

## License agreement

Use Apple's Standard Licensed Application End User License Agreement. Do not
select or upload a custom EULA unless the owner intentionally replaces this
decision after legal review.

- Apple Standard EULA: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/
- Apple custom-license guidance: https://developer.apple.com/help/app-store-connect/manage-app-information/provide-a-custom-license-agreement

The public Terms supplement the standard app license for the GrantTap relay,
bridge, website, and support without inventing a governing-law clause.

## Account deletion

GrantTap does not create a GrantTap account, username, password, or cloud user
profile. Apple's in-app account-deletion rule therefore does not apply to a
GrantTap account. The app must still keep the local controls documented at
https://granttap.com/data-rights working:

1. Clear local MCP/skill usage history.
2. Clear the local audit log.
3. Forget the paired computer.
4. Remove the app for remaining sandbox data.
5. Stop the helper and remove `~/.granttap` on the paired Mac if the user wants
   local machine state deleted.
6. Delete source Codex or Claude Code chat history in those products separately.

Apple guidance: https://developer.apple.com/support/offering-account-deletion-in-your-app/

## App Privacy working classification

The final App Store Connect answers must cover the release build on iPhone and
Apple Watch, all code paths, the Cloudflare relay/site, Apple services, and any
third-party SDK or partner. They must match `PrivacyInfo.xcprivacy` but are a
separate submission.

Current verified behavior:

- No advertising, third-party advertising, cross-app tracking, data brokerage,
  or product analytics.
- No readable cloud chat history and no GrantTap account.
- Task content is end-to-end encrypted before relay transport; the relay does
  not receive endpoint or per-task keys.
- The relay does process opaque routing/delivery metadata, IP/request security
  information, and an APNs device token linked to a pairing.
- Support email contains contact details and content deliberately supplied by a
  user.

Working disclosure recommendation—not a final legal conclusion:

- Declare **Device ID / App Functionality**, linked to the paired device and not
  used for tracking, for the APNs device token because it is a durable readable
  routing identifier available to the service.
- Apple's definition says data processed only on-device is not collected and
  describes off-device collection in readable form. Authenticated task
  ciphertext is not readable by GrantTap or the relay. On that basis it may not
  be a developer collection of Other User Content, Files, Photos, Audio, or
  Messages. This is an interpretation that must be checked against the final
  implementation and App Store Connect questionnaire rather than copied
  mechanically.
- User-initiated support correspondence may qualify for Apple's optional
  disclosure exception only if it remains infrequent, directly optional, not
  used for other purposes, and otherwise meets every Apple condition.
- Verify Cloudflare's production IP/request-log retention and access before the
  final disclosure. Ordinary security logs can affect whether identifiers or
  diagnostics are collected.

Official references:

- App privacy details: https://developer.apple.com/app-store/app-privacy-details/
- Manage app privacy: https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/
- App privacy reference: https://developer.apple.com/help/app-store-connect/reference/app-information/app-privacy

## Accessibility Nutrition Labels

The public Accessibility URL is ready, but App Store accessibility labels must
be selected only after every common task has been audited on each supported
device using the release build. Do not infer an iPhone label for Apple Watch or
claim full support from isolated screens.

Audit at least pairing, agent switching, creating/opening a task, reading
status and recent events, replying, attachments, approval/denial, settings,
deletion, and Watch task/approval/voice flows with relevant accessibility
features.

- Apple overview: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/overview-of-accessibility-nutrition-labels/
- Manage labels: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/manage-accessibility-nutrition-labels
- Evaluation criteria: https://developer.apple.com/help/app-store-connect/reference/accessibility-evaluation-criteria/

## Encryption export compliance

GrantTap uses non-Apple cryptography for end-to-end pairing and task transport.
The account holder must complete App Store encryption/export-compliance
questions and determine whether documentation or an exemption is applicable.
Do not guess the answer from marketing language.

- Apple determination flow: https://developer.apple.com/help/app-store-connect/manage-app-information/determine-and-upload-app-encryption-documentation
- Apple overview: https://developer.apple.com/help/app-store-connect/manage-app-information/overview-of-export-compliance

## App Review readiness

- Every link above returns a production 200 response over HTTPS.
- Privacy is reachable inside the iPhone app, not only in App Store metadata.
- Review notes describe how to pair a test computer and reach Watch features.
- Provide a live backend and a working test path for review.
- Background notification copy never promises guaranteed delivery timing.
- Screenshots and descriptions match the submitted build and do not imply a
  feature that is absent.
- App privacy answers include all platforms and third-party processing.
- Any reviewer credentials or test configuration are provided privately in App
  Review notes, never in public pages or source control.

Official review references:

- App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Preparing for review: https://developer.apple.com/app-store/review/
- Platform version information: https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information

## Owner confirmation before submission

- `[OWNER CONFIRMATION]` Exact legal developer/seller name and the spelling to
  use for copyright notices. Existing materials use both “Sergii” and “Serhii”;
  do not normalize without account-holder confirmation.
- `[OWNER CONFIRMATION]` Support email remains monitored and can answer in the
  published response window.
- `[OWNER CONFIRMATION]` Public legal mailing address and phone if required by
  the selected storefronts, trader status, or applicable local law.
- `[OWNER CONFIRMATION]` App Review contact name, direct email, and phone.
- `[OWNER CONFIRMATION]` Price, territories, tax category, age rating, and
  release mode.
- `[OWNER CONFIRMATION]` Final App Privacy answers after Cloudflare retention and
  all third-party SDKs are verified.
- `[OWNER CONFIRMATION]` Accessibility labels after the per-device common-task
  audit.
- `[OWNER CONFIRMATION]` Export-compliance determination and any required filing
  or documentation.
- `[OWNER CONFIRMATION]` Standard EULA remains the intended choice.
