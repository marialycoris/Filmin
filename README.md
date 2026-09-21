# Filmin — Vintage Photobooth

A browser-based vintage photobooth: pull the curtain, pose for a 3-2-1 countdown four times, and
walk away with a classic 4-frame film strip. No backend, no database — everything
lives in memory for the current tab, and nothing is ever uploaded anywhere.

## Stack
- React 18 + TypeScript
- Tailwind CSS (custom vintage palette + Abril Fatface / Special Elite type pairing)
- Vite

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed local URL. Your browser will ask for camera permission when you click
**pull the curtain**. Camera access requires `localhost` or HTTPS — it won't work if you open
`index.html` directly as a `file://` URL.

Build for production with:

```bash
npm run build
npm run preview
```

## How it works

- **Landing** (`src/App.tsx`) — the hero illustration, filter toggle, and the
  start button.
- **Hero art** (`src/components/PhotoboothIllustration.tsx`) — a hand-built SVG of a curtained
  photobooth kiosk. No external image files.
- **Camera** (`src/hooks/useCamera.ts`) — requests and tears down the webcam stream.
- **Capture** (`src/components/CameraStage.tsx`) — the live mirrored viewfinder (with the chosen
  filter already applied live), the 3-2-1 countdown, shutter flash, and the 4-shot capture loop.
- **Compositing** (`src/utils/imaging.ts`) — all canvas logic:
  - `capturePhoto` grabs each frame, mirrors and crops it square, and bakes in the filter.
  - `composeStrip` arranges the four frames into an authentic film-strip PNG: a dark film body,
    continuous sprocket-hole perforations down both edges, square photo windows, and rotated
    frame numbers in the gutters. Both the outer background *and* the sprocket holes are true
    transparency, so it can be used as a die-cut sticker on any background.
  - `composeStoryImage` places that strip onto a full-bleed 1080×1920 vintage backdrop —
    Instagram's exact Story canvas size — with a marquee heading and caption, ready to post
    directly.
- **Result screen** (`src/components/FilmStripResult.tsx`) — previews the strip and offers two
  downloads: the transparent sticker PNG and the 1080×1920 Story PNG.

## Notes
- Camera access requires HTTPS (or `localhost`) in most browsers.
- No photos are ever sent over the network — capture, filtering, and compositing all happen
  on-device with the Canvas API.
- Nothing is saved between sessions; refreshing or closing the tab clears everything.
