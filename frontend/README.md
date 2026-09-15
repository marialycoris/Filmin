# Four Bits Photo Co. — Vintage Photobooth

A browser-based vintage photobooth: pull the curtain, pose for a 3-2-1 countdown four times,
and walk away with a classic 4-frame film strip rendered as a transparent-background PNG
(sticker-ready). No backend, no database — everything lives in memory for the current tab.

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
**pull the curtain**.

Build for production with:

```bash
npm run build
npm run preview
```

## How it works
- `src/components/PhotoboothIllustration.tsx` — the hero artwork, a hand-built SVG of a
  curtained photobooth kiosk (no external image files).
- `src/hooks/useCamera.ts` — requests and tears down the webcam stream.
- `src/components/CameraStage.tsx` — the live viewfinder, countdown, shutter flash, and the
  4-shot capture loop.
- `src/utils/imaging.ts` — canvas logic: captures each frame with the chosen sepia/B&W filter
  baked in, then composes the four frames into a die-cut film-strip PNG with sprocket holes.
  The canvas background stays fully transparent outside the strip shape, so the exported PNG
  can be used as a sticker on any background.
- `src/components/FilmStripResult.tsx` — preview + download screen.

## Notes
- Camera access requires HTTPS (or `localhost`) in most browsers.
- No photos are ever sent over the network — capture, filtering, and compositing all happen
  on-device with the Canvas API.
