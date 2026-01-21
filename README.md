# Mindful Tap

A web-based meditation game that helps you maintain focus on your breath through gamification.

## How It Works

Mindful Tap anchors your attention to your breathing cycle. After each complete breath (inhale + exhale), tap the indicated side of the screen or press the corresponding key.

### Basic Mechanics

- **Alternating taps**: Start with Right, then Left, then Right, etc.
- **Controls**: Click/tap the screen areas, or use keyboard (F = Left, J = Right)
- **Streak tracking**: Build consecutive correct taps to increase your streak
- **Focus window**: Tap within the time limit or the focus resets

### Double Tap Number (DTN)

Every DTN-th breath requires a **double tap** on the same side. For example, with DTN=5:

1. Breath 1: Right (single)
2. Breath 2: Left (single)
3. Breath 3: Right (single)
4. Breath 4: Left (single)
5. Breath 5: Right (double tap)
6. Breath 1: Left (single) — cycle restarts on opposite side

## Features

- **Configurable settings**: Session duration, focus window, DTN
- **Audio feedback**: Beeping for inactivity, tones for mistakes, gong on completion
- **Vibration support**: Haptic feedback on compatible devices
- **Statistics**: Session history with hit rate, streaks, and activity heatmap
- **Offline support**: Works without internet once loaded (PWA)
- **Installable**: Add to home screen on mobile devices

## Settings

| Setting | Range | Description |
|---------|-------|-------------|
| Session Duration | 1-180 min | Total meditation time |
| Focus Window | 5-180 sec | Time allowed between taps |
| DTN | 2+ | Breath count before double tap |
| Hide Status | On/Off | Cleaner view during meditation |
| Vibration | On/Off | Haptic feedback toggle |

## Tech Stack

- Vanilla JavaScript (no frameworks)
- Tailwind CSS (via CDN)
- Web Audio API for sounds
- Service Worker for offline caching
- localStorage for persistence

## Local Development

No build process required. Simply serve the files with any static server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

Then open `http://localhost:8000` in your browser.

## Deployment

The app is deployed on GitHub Pages at:
https://mufabo.github.io/mindful_tap/

## License

MIT
