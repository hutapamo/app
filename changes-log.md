# Changes Log

---

## 2026-03-03 15:49 (SAST)
**Commit:** `chore: update app icon with cleaner design — separated clock and TIMER label`

**Summary**
- Redesigned app icon to remove visual clutter
- Preserved old icon as `app-icon-old.svg` for reference
- Clock and label no longer overlap

**Details**
- What changed:
  - `app-icon.svg`: Clock moved up to `cy=420`, radius reduced to `260`, tick marks added at 12/3/6/9 positions, drop shadow applied, `+00:00` text replaced with `TIMER` label below a divider line
  - `app-icon-old.svg`: Created as a backup of the original icon
- Why:
  - The original icon had the `+00:00` time digits overlapping with the clock face, making it look messy
- Impact / Notes:
  - Icon used by Electron Builder via `package.json` `build.icon` field — will take effect on next app build/package

**Files**
- `app-icon.svg`
- `app-icon-old.svg`
