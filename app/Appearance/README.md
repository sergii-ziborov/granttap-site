# Site appearance

`ThemeSelector` offers Auto, Light and Dark throughout the public site.
Auto follows the system and reacts while the page is open. Explicit choices
persist across pages and tabs. Existing guide choices are respected until the
user selects a global preference. Blocked storage leaves the controls usable.

`appearanceBootstrap` applies the preference before first paint;
`AppearanceController` synchronizes later system and storage changes.
Shared tokens and component treatments live in `appearance.css`.
