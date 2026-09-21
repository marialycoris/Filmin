export type FilterType = 'sepia' | 'bw' | 'kodachrome' | 'faded'

export const FRAME_W = 360
export const FRAME_H = 360

const FILTER_CSS: Record<FilterType, string> = {
  sepia: 'sepia(0.75) saturate(1.3) contrast(1.08) brightness(1.02) hue-rotate(-6deg)',
  bw: 'grayscale(1) contrast(1.25) brightness(1.03)',
  kodachrome: 'saturate(1.6) contrast(1.08) sepia(0.2) brightness(0.98) hue-rotate(-12deg)',
  faded: 'sepia(0.3) saturate(0.85) contrast(0.92) brightness(1.08)',
}

const FILTER_LABEL: Record<FilterType, string> = {
  sepia: 'SEPIA',
  bw: 'B&W',
  kodachrome: 'KODACHROME',
  faded: 'FADED',
}

/** CSS/canvas filter string for the chosen vintage look. */
export function filterCss(filter: FilterType): string {
  return FILTER_CSS[filter]
}

/**
 * Grabs the current video frame, mirrors it (so the capture matches what the
 * sitter saw in the mirrored live preview), crops it to the strip's frame
 * aspect ratio, and bakes in the chosen vintage filter.
 * Returns a PNG data URL of a single frame.
 */
export function capturePhoto(video: HTMLVideoElement, filter: FilterType): string {
  const vw = video.videoWidth
  const vh = video.videoHeight
  const targetRatio = FRAME_W / FRAME_H

  let sx = 0
  let sy = 0
  let sw = vw
  let sh = vh

  if (vw / vh > targetRatio) {
    sw = vh * targetRatio
    sx = (vw - sw) / 2
  } else {
    sh = vw / targetRatio
    sy = (vh - sh) / 2
  }

  const canvas = document.createElement('canvas')
  canvas.width = FRAME_W
  canvas.height = FRAME_H
  const ctx = canvas.getContext('2d')!
  ctx.filter = filterCss(filter)

  // mirror horizontally for a natural, mirror-like selfie capture
  ctx.translate(FRAME_W, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, FRAME_W, FRAME_H)

  if (filter === 'faded') {
    applyGrain(ctx, FRAME_W, FRAME_H, 22)
  }

  return canvas.toDataURL('image/png')
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Thin monochrome film grain, drawn only over existing opaque pixels. */
function applyGrain(ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number) {
  const grain = document.createElement('canvas')
  grain.width = w
  grain.height = h
  const gctx = grain.getContext('2d')!
  const image = gctx.createImageData(w, h)
  const data = image.data
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255
    data[i] = v
    data[i + 1] = v
    data[i + 2] = v
    data[i + 3] = alpha
  }
  gctx.putImageData(image, 0, 0)
  ctx.save()
  ctx.globalCompositeOperation = 'source-atop'
  ctx.drawImage(grain, 0, 0)
  ctx.restore()
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Punches a transparent rounded-rect "hole" out of whatever has been drawn so far. */
function punchRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  roundRectPath(ctx, x, y, w, h, r)
  ctx.fill()
  ctx.restore()
}

/**
 * Composes the 4 captured frames into an authentic 35mm-style filmstrip:
 * a dark film body, continuous sprocket-hole perforations running the full
 * length of both edges, square photo windows, and rotated frame numbers in
 * the gutters. The canvas background stays fully transparent outside the
 * film body — and the sprocket holes themselves are punched fully
 * transparent too — so the exported PNG can be dropped on any background.
 */
export async function composeStrip(photos: string[], filter: FilterType): Promise<string> {
  const images = await Promise.all(photos.map(loadImage))

  const FRAME_COUNT = images.length

  // layout constants (all in canvas px)
  const photoSize = 340 // square photo window
  const sideGutter = 92 // width of each side column (holes + number label)
  const holeEdgeInset = 30 // distance from strip edge to hole center
  const holeW = 34
  const holeH = 42
  const holeRadius = 9
  const holePitch = 58 // vertical spacing between hole centers
  const barTop = 26 // black bar above the first frame
  const barBetween = 22 // black bar between frames
  const barBottom = 58 // taller leader/tail bar at the bottom for the stamp
  const cornerRadius = 10

  const stripW = sideGutter * 2 + photoSize
  const framesTotalH = photoSize * FRAME_COUNT
  const betweenBarsH = barBetween * (FRAME_COUNT - 1)
  const stripH = barTop + framesTotalH + betweenBarsH + barBottom

  const canvas = document.createElement('canvas')
  canvas.width = stripW
  canvas.height = stripH
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, stripW, stripH)

  const filmColor = '#211812' // dark, near-black walnut — the physical "film" itself
  const numberColor = '#D9A441' // mustard, matching the site's marquee-bulb accent

  // film body
  roundRectPath(ctx, 0, 0, stripW, stripH, cornerRadius)
  ctx.fillStyle = filmColor
  ctx.fill()

  // photo windows + per-frame rotated number labels
  let cursorY = barTop
  const framePositions: { x: number; y: number; num: number }[] = []
  for (let i = 0; i < FRAME_COUNT; i++) {
    framePositions.push({ x: sideGutter, y: cursorY, num: i + 1 })
    cursorY += photoSize + barBetween
  }

  framePositions.forEach(({ x, y, num }, i) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(x, y, photoSize, photoSize)
    ctx.clip()
    // cover-fit the square capture into the square window (they already match,
    // but this keeps things correct if a capture ever isn't perfectly square)
    ctx.drawImage(images[i], x, y, photoSize, photoSize)
    ctx.restore()

    // thin inner seam so each frame reads as a distinct pane
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'
    ctx.lineWidth = 2
    ctx.strokeRect(x + 1, y + 1, photoSize - 2, photoSize - 2)

    // rotated frame number in each side gutter, centered on this frame
    const labelY = y + photoSize / 2
    ;[x - 24, x + photoSize + 24].forEach((labelX) => {
      ctx.save()
      ctx.translate(labelX, labelY)
      ctx.rotate(-Math.PI / 2)
      ctx.fillStyle = numberColor
      ctx.font = '22px "Special Elite", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(num), 0, 0)
      ctx.restore()
    })
  })

  // continuous sprocket-hole perforations down both edges, independent of frame lines
  for (let side = 0; side < 2; side++) {
    const cx = side === 0 ? holeEdgeInset : stripW - holeEdgeInset
    for (let y = holePitch / 2; y < stripH - 14; y += holePitch) {
      punchRoundRect(ctx, cx - holeW / 2, y - holeH / 2, holeW, holeH, holeRadius)
    }
  }

  // bottom leader stamp
  ctx.fillStyle = numberColor
  ctx.font = '18px "Abril Fatface", serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('Filmin', stripW / 2, stripH - 30)
  ctx.font = '10px "Special Elite", monospace'
  ctx.globalAlpha = 0.85
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  ctx.fillText(`${FILTER_LABEL[filter]} \u00b7 ${dateStr}`, stripW / 2, stripH - 14)
  ctx.globalAlpha = 1

  return canvas.toDataURL('image/png')
}