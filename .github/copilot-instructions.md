# Copilot Instructions

## Project Guidelines
- User wants the listed CS2 repositories to be treated as ongoing implementation references for architecture, settings pages, UI patterns, resource visuals, and debugging features.
- User requires CS2-style default localization patterns, grouped production+tax resource view, tooltip tips, and movable/resizable windows with automatic persistence only. Raw window geometry fields (X/Y/Width/Height) should not be visible in options. Additionally, clearer setting names and a basic/advanced UI toggle are desired.
- User wants the Basic UI styled after CityForge and the Advanced UI styled after Parking Fee Control, labeled as B (Basic) and A (Advanced). The advanced window title text should be "Advanced Tax & Production Manager" and centered, with the close control as a visible boxed `X` (not `✕`).
- User wants ShowBothWindows removed, chain/resource-view options cleaned up, and no parking/basic naming in code while still delivering distinct CityForge-like basic and parking-style advanced UI behavior.
- User prefers the mod assembly DLL filename to be `AdvancedTPM`.
- User added two additional CS2 modding references to use during fixes: [Cities Skylines 2 Modding Guide](https://github.com/ps1ke/Cities-Skylines-2-Modding-Guide) and [CS2 Modding Instructions](https://github.com/rcav8tr/CS2-Modding-Instructions).

## UI Formatting Preferences
- User prefers unit text like `t` to stay on the same line as the value in footer/metrics (no line break).
- User wants a larger toolbar icon.
- User wants the economy icon larger and vertically aligned on the same line as income values in the Advanced UI.
- User wants income formatted with the in-game currency symbol `C`-style, matching the in-game symbol, with comma grouping and thousands separators.