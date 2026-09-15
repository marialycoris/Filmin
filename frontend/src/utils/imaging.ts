export type FilterType = 'sepia' | 'bw'

export const FRAME_W = 420
export const FRAME_H = 320

/** CSS/canvas filter string for the chosen vintage look. */
export function filterCss(filter: FilterType): string {
  return filter === 'sepia'
    ? 'sepia(0.75) saturate(1.3) contrast(1.08) brightness(1.02) hue-rotate(-6deg)'
    : 'grayscale(1) contrast(1.25) brightness(1.03)'
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

/**
 * Composes the 4 captured frames into a classic hanging film-strip.
 * Output is a fixed 1080x1920 (9:16) PNG. The canvas background stays
 * fully transparent; only the strip body (paper + photos + sprocket
 * holes) is opaque, so the exported PNG can be dropped anywhere and
 * used as a sticker.
 */
export async function composeStrip(photos: string[], filter: FilterType): Promise<string> {
  const images = await Promise.all(photos.map(loadImage))

  const W = 1080
  const H = 1920

  const padX = 44
  const padY = 40
  const gap = 24
  const photoW = 525
  const photoH = 400
  const holeCol = 104
  const footerH = 168

  const bodyW = padX * 2 + holeCol * 2 + photoW
  const bodyH = padY * 2 + photoH * 4 + gap * 3 + footerH
  const bodyX = Math.round((W - bodyW) / 2)

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, W, H)

  // strip body (paper or near-black, depending on filter mood)
  const paper = filter === 'sepia' ? '#F0E2C4' : '#EDEDED'
  const ink = filter === 'sepia' ? '#3B2A20' : '#1C1712'
  roundRectPath(ctx, bodyX, 0, bodyW, bodyH, 48)
  ctx.fillStyle = paper
  ctx.fill()
  ctx.lineWidth = 8
  ctx.strokeStyle = ink
  ctx.stroke()

  // sprocket holes down both sides
  const holeR = 12
  const holeSpacing = 44
  const leftCx = bodyX + padX + holeCol / 2
  const rightCx = bodyX + padX + holeCol + photoW + holeCol / 2
  for (let side = 0; side < 2; side++) {
    const cx = side === 0 ? leftCx : rightCx
    for (let y = 56; y < bodyH - footerH + 20; y += holeSpacing) {
      ctx.beginPath()
      ctx.arc(cx, y, holeR, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,0,0,0)'
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
    }
  }

  // photos
  images.forEach((img, i) => {
    const x = bodyX + padX + holeCol
    const y = padY + i * (photoH + gap)
    ctx.save()
    roundRectPath(ctx, x, y, photoW, photoH, 14)
    ctx.clip()
    ctx.drawImage(img, x, y, photoW, photoH)
    ctx.restore()
    ctx.lineWidth = 5
    ctx.strokeStyle = ink
    roundRectPath(ctx, x, y, photoW, photoH, 14)
    ctx.stroke()
  })

  // footer caption
  ctx.fillStyle = ink
  ctx.font = '56px "Abril Fatface", serif'
  ctx.textAlign = 'center'
  ctx.fillText('Filmin', W / 2, bodyH - footerH + 62)
  ctx.font = '28px "Special Elite", monospace'
  ctx.fillStyle = ink
  ctx.globalAlpha = 0.75
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  ctx.fillText(`${filter === 'sepia' ? 'SEPIA STRIP' : 'B&W STRIP'} · ${dateStr}`, W / 2, bodyH - footerH + 112)
  ctx.globalAlpha = 1

  return canvas.toDataURL('image/png')
}
