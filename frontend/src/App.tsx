import { useState } from 'react'
import PhotoboothIllustration from './components/PhotoboothIllustration'
import CameraStage from './components/CameraStage'
import FilmStripResult from './components/FilmStripResult'
import type { FilterType } from './utils/imaging'

type Stage = 'landing' | 'capture' | 'result'

export default function App() {
  const [stage, setStage] = useState<Stage>('landing')
  const [filter, setFilter] = useState<FilterType>('sepia')
  const [photos, setPhotos] = useState<string[]>([])

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 sm:py-16">
      <header className="w-full max-w-4xl flex items-center justify-between mb-8">
        <span className="font-type text-xs tracking-wide text-walnut/70">est. this afternoon</span>
        <span className="font-display text-lg text-curtain">Filmin</span>
      </header>

      <main className="w-full flex-1 flex flex-col items-center justify-center">
        {stage === 'landing' && (
          <LandingScreen
            filter={filter}
            onFilterChange={setFilter}
            onStart={() => setStage('capture')}
          />
        )}

        {stage === 'capture' && (
          <CameraStage
            filter={filter}
            onComplete={(shots) => {
              setPhotos(shots)
              setStage('result')
            }}
            onCancel={() => setStage('landing')}
          />
        )}

        {stage === 'result' && (
          <FilmStripResult
            photos={photos}
            filter={filter}
            onRetake={() => {
              setPhotos([])
              setStage('capture')
            }}
          />
        )}
      </main>

      <footer className="mt-16 font-type text-[11px] text-walnut/100 text-center max-w-sm">
        nothing you shoot here is saved anywhere — it lives in this tab only, until you download it or close the
        page.
      </footer>
    </div>
  )
}

function LandingScreen({
  filter,
  onFilterChange,
  onStart,
}: {
  filter: FilterType
  onFilterChange: (f: FilterType) => void
  onStart: () => void
}) {
  return (
    <div className="w-full max-w-lg flex flex-col items-center text-center">
      <PhotoboothIllustration className="w-64 sm:w-72 mb-6" />

      <h1 className="font-display text-4xl sm:text-5xl text-curtain leading-tight">
        step right up
      </h1>
      <p className="font-type text-walnut/80 mt-3 max-w-sm text-sm sm:text-base">
        pull the curtain, strike four poses, and walk away with a real film strip — printed as a sticker you can
        paste anywhere.
      </p>

      <div className="mt-8 w-full">
        <p className="font-type text-xs uppercase tracking-widest text-walnut/60 mb-3">choose your finish</p>
        <div className="flex flex-wrap gap-2 justify-center sm:gap-3">
          <FilterTicket
            label="sepia"
            active={filter === 'sepia'}
            onClick={() => onFilterChange('sepia')}
            swatchClass="bg-mustard"
          />
          <FilterTicket
            label="b&w"
            active={filter === 'bw'}
            onClick={() => onFilterChange('bw')}
            swatchClass="bg-walnut"
          />
          <FilterTicket
            label="kodachrome"
            active={filter === 'kodachrome'}
            onClick={() => onFilterChange('kodachrome')}
            swatchClass="bg-curtain"
          />
          <FilterTicket
            label="faded"
            active={filter === 'faded'}
            onClick={() => onFilterChange('faded')}
            swatchClass="bg-paper"
          />
        </div>
      </div>

      <button
        onClick={onStart}
        className="mt-10 font-type text-lg text-paper bg-curtain hover:bg-curtain-light border-2 border-walnut rounded-full px-10 py-4 shadow-ticket active:translate-y-1 active:shadow-none transition"
      >
        pull the curtain
      </button>

      <p className="font-type text-[11px] text-walnut/100 mt-4">
        uses your camera for this session only — nothing is uploaded or stored.
      </p>
    </div>
  )
}

function FilterTicket({
  label,
  active,
  onClick,
  swatchClass,
}: {
  label: string
  active: boolean
  onClick: () => void
  swatchClass: string
}) {
  return (
    <button
      onClick={onClick}
      className={`font-type text-sm flex items-center gap-2 border-2 rounded-full px-3 py-2 transition sm:px-5 ${
        active
          ? 'border-walnut bg-paper-light text-walnut shadow-ticket -translate-y-0.5'
          : 'border-walnut/30 text-walnut/60 hover:border-walnut/60'
      }`}
    >
      <span className={`inline-block w-3 h-3 rounded-full ${swatchClass}`} />
      {label}
    </button>
  )
}
