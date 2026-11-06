# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Mindful Tap is a breath-focus meditation game shipped as a static PWA on GitHub Pages (https://mufabo.github.io/mindful_tap/). The README explains the game rules (alternating Right/Left taps per breath, double tap on every DTN-th breath, focus window). Vanilla JS, Tailwind via CDN, Web Audio API, localStorage. There is no build step, package manager, linter, or test suite.

## Running locally

All paths are hardcoded to the `/mindful_tap/` prefix (service worker registration, manifest link, `sw.js` `GHPATH`, manifest `scope`/`start_url`). Serving the repo root as `/` loads the page, but the service worker and manifest won't resolve. To match production, serve the **parent** directory:

```bash
cd .. && python -m http.server 8000
# open http://localhost:8000/mindful_tap/
```

## Architecture

Nearly everything lives in `index.html`. The `<head>` holds several `<script>` blocks, in this order:

1. **State and persistence**: constants, the single global `state` object, and the localStorage helpers (`loadSettings`, `saveSettings`, `getSessionHistory`, `saveSessionToHistory`).
2. **Audio and vibration**: Web Audio tone generation (inactivity beeping, mistake tone, completion gong sequence) and `navigator.vibrate`.
3. **Game logic and UI**: `updateUI` (re-renders everything from `state`; called on every timer tick), session lifecycle (`stopMeditation`, `pauseMeditation`, `resumeMeditation`), `resetFocus`, `advanceBreath`, timers, and stats/heatmap rendering.
4. **Input and wiring**: `handleTap(side)` is the one entry point for screen clicks and F/J keys. `window.onload` attaches all listeners.

The `<body>` markup comes after these scripts. Elements are reached by `id`, so renaming an id means updating the JS too.

### Game state model

- `state.gameState`: `'idle' | 'running' | 'paused' | 'complete'`. `'paused'` covers two cases: a manual pause, and an inactivity timeout where `state.isBeeping` is true. While beeping, a tap on the correct side resumes the session. While manually paused, taps are ignored.
- Breath progression: `breathCount`, `expectedSide`, `expectedTapType` (`'single' | 'double'`), `cycleStartSide`, `isAwaitingSecondTap`. `advanceBreath()` runs only when a breath is complete (a single tap, or the second tap of a double). After a double tap, the next cycle starts on the side opposite `cycleStartSide`.
- `resetFocus(trigger)` with `'start' | 'mistake' | 'inactivity'` resets the streak and breath cycle to B1 on the right side. `'inactivity'` switches to the beeping pause; the other triggers keep the session running.
- Timers: two independent pairs of a timeout and a display interval. `tapTimer`/`countdownInterval` handle the focus window, and `sessionTimer`/`sessionCountdownInterval` handle total session length. Clear both members of a pair whenever you stop or replace it.

### Persistence

- `mindfulTapSettings`: settings plus `longestStreak`. `saveSettings` takes six **positional** arguments and also writes `state.longestStreak`. Every call site passes the full set, so adding a setting means updating every caller and `loadSettings`.
- `mindfulTapHistory`: an array of session records. `date` is a display-only `toLocaleString()` string. The heatmap uses the numeric `timestamp` and groups by local day (`localDateKey`). Older records have no `timestamp`, and the heatmap skips them when their `date` string won't parse. `longestStreak` is the session's best streak, and old records fall back to `finalStreak`. `hitRate` is stored as a preformatted string like `"93.3%"`. New code must handle both old and new record shapes. Sessions of 5 seconds or less are not saved.

## Service worker and deployment

`sw.js` is cache-first, with no network revalidation. **Bump `VERSION` in `sw.js` whenever any cached file changes.** Otherwise installed clients keep serving the old files. If you add an asset that must work offline, add it to `URLS`. Pushing to `main` deploys through GitHub Pages.
