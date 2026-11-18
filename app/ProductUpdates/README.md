# Published version history

Public entry: `versionHistory` in `index.ts`, embedded in customer Help on the
website and exported to the Apple clients. Record published builds, and an app version
on the day it is submitted to App Review, labelled as submitted; app
availability and MCP availability are independent. Verify app build/platform
status in App Store Connect before adding a TestFlight release. Tests exercise
the customer document entry point in both supported languages.

`whatsNew` in `whatsNew.ts` feeds the What's new section on the home page and
`/iphone`: the published App Store version, the published computer helper, and
the next iPhone update. Its App Store column lists only what the published
version contains; the next-update column names no version or date until Apple
publishes it. Tests: `tests/whatsNew.test.ts` and `tests/coverage/home.test.tsx`.
