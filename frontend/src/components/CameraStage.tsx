import { useEffect, useRef, useState } from 'react'
import { useCamera } from '../hooks/useCamera'
import { capturePhoto, FilterType } from '../utils/imaging'

interface Props {
  filter: FilterType
  onComplete: (photos: string[]) => void
  onCancel: () => void
}

const SHOTS_NEEDED = 4
const COUNT_FROM = 3

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function CameraStage({ filter, onComplete, onCancel }: Props) {
  const { videoRef, status } = useCamera(true)
  const [running, setRunning] = useState(false)
  const [count, setCount] = useState<number | null>(null)
  const [flash, setFlash] = useState(false)
  const [shots, setShots] = useState<string[]>([])
  const runGuard = useRef(false)

  const runSession = async () => {
    if (runGuard.current) return
    runGuard.current = true
    setRunning(true)
    const taken: string[] = []

    for (let i = 0; i < SHOTS_NEEDED; i++) {
      for (let c = COUNT_FROM; c >= 1; c--) {
        setCount(c)
        await wait(800)
      }
      setCount(null)
      if (videoRef.current) {
        const photo = capturePhoto(videoRef.current, filter)
        taken.push(photo)
        setShots([...taken])
      }
      setFlash(true)
      await wait(180)
      setFlash(false)
      await wait(600)
    }

    await wait(300)
    onComplete(taken)
  }

  useEffect(() => {
    return () => {
      runGuard.current = false
    }
  }, [])

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <div className="relative w-full rounded-[28px] border-[6px] border-walnut bg-filmblack shadow-booth overflow-hidden">
        {/* viewfinder bezel corners */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t-4 border-l-4 border-mustard rounded-tl-md z-20" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t-4 border-r-4 border-mustard rounded-tr-md z-20" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-4 border-l-4 border-mustard rounded-bl-md z-20" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-4 border-r-4 border-mustard rounded-br-md z-20" />

        <div className="relative aspect-square w-full bg-black">
          {status === 'ready' && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                transform: 'scaleX(-1)',
                filter:
                  filter === 'sepia'
                    ? 'sepia(0.75) saturate(1.3) contrast(1.08) brightness(1.02) hue-rotate(-6deg)'
                    : 'grayscale(1) contrast(1.25) brightness(1.03)',
              }}
            />
          )}

          {status === 'requesting' && (
            <p className="absolute inset-0 flex items-center justify-center font-type text-paper-light text-sm px-8 text-center">
              Asking for a peek through the lens — allow camera access to continue…
            </p>
          )}

          {(status === 'denied' || status === 'unsupported') && (
            <p className="absolute inset-0 flex items-center justify-center font-type text-paper-light text-sm px-8 text-center">
              {status === 'denied'
                ? "Camera access was declined. You'll need to allow it in your browser settings to take a strip."
                : 'This browser can\u2019t reach a camera. Try a recent Chrome, Firefox, or Safari.'}
            </p>
          )}

          {/* countdown overlay */}
          {count !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <span
                key={count}
                className="font-display text-mustard text-[9rem] leading-none drop-shadow-[0_4px_0_rgba(28,23,18,0.9)] animate-popin"
              >
                {count}
              </span>
            </div>
          )}

          {/* flash */}
          {flash && <div className="absolute inset-0 bg-white animate-flash" />}

          {/* shot counter ticket */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-paper/90 border-2 border-walnut rounded-full px-4 py-1 font-type text-xs text-walnut tracking-wide">
            frame {Math.min(shots.length + (running ? 1 : 0), SHOTS_NEEDED)} of {SHOTS_NEEDED}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        {!running && (
          <button
            onClick={runSession}
            disabled={status !== 'ready'}
            className="font-type text-paper bg-curtain hover:bg-curtain-light disabled:opacity-40 disabled:cursor-not-allowed border-2 border-walnut rounded-full px-8 py-3 shadow-ticket active:translate-y-1 active:shadow-none transition"
          >
            start the strip — 4 shots
          </button>
        )}
        {running && (
          <p className="font-type text-walnut/80 text-sm">hold still, sugar… strike a pose four times</p>
        )}
        <button
          onClick={onCancel}
          disabled={running}
          className="font-type text-paper bg-walnut hover:bg-teal-dark border-2 border-teal rounded-full px-8 py-3 shadow-ticket active:translate-y-1 active:shadow-none transition"
        >
          go back out
        </button>
      </div>
    </div>
  )
}
