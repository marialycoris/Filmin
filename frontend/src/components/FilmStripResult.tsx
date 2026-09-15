import { useEffect, useState } from 'react'
import { composeStrip } from '../utils/imaging'
import type { FilterType } from '../utils/imaging'

interface Props {
  photos: string[]
  filter: FilterType
  onRetake: () => void
}

export default function FilmStripResult({ photos, filter, onRetake }: Props) {
  const [stripUrl, setStripUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    composeStrip(photos, filter).then((url) => {
      if (!cancelled) setStripUrl(url)
    })
    return () => {
      cancelled = true
    }
  }, [photos, filter])

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center text-center">
      <h2 className="font-display text-3xl text-curtain mb-1">your strip is ready</h2>
      <p className="font-type text-sm text-walnut/70 mb-8">
        pinned, printed, transparent behind — peel it off and stick it wherever you like.
      </p>

      <div className="relative">
        {/* clothespin */}
        <svg
          width="46"
          height="30"
          viewBox="0 0 46 30"
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
        >
          <rect x="4" y="8" width="38" height="10" rx="5" fill="#D9A441" stroke="#3B2A20" strokeWidth="2" />
          <circle cx="23" cy="13" r="4" fill="#3B2A20" />
        </svg>

        <div className="pt-4">
          {stripUrl ? (
            <img
              src={stripUrl}
              alt="Your four-frame vintage photo strip"
              className="w-56 drop-shadow-[0_18px_30px_rgba(28,23,18,0.35)] animate-popin"
            />
          ) : (
            <div className="w-56 h-[420px] flex items-center justify-center font-type text-sm text-walnut/60">
              developing your strip…
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
        <a
          href={stripUrl ?? undefined}
          download={`filmin-photo-strip-${filter}.png`}
          aria-disabled={!stripUrl}
          className="font-type text-paper bg-teal hover:bg-teal-dark border-2 border-walnut rounded-full px-8 py-3 shadow-ticket active:translate-y-1 active:shadow-none transition"
        >
          download sticker (.png)
        </a>
        <button
          onClick={onRetake}
          className="font-type text-walnut bg-transparent border-2 border-walnut/40 hover:border-walnut rounded-full px-8 py-3 transition"
        >
          retake the strip
        </button>
      </div>
    </div>
  )
}
