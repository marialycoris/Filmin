interface Props {
  className?: string
  /** When true, the marquee bulbs get a gentle glow animation */
  lit?: boolean
}

/**
 * Hand-drawn vintage photobooth kiosk illustration, built entirely as SVG
 * shapes so it stays crisp at any size and matches the site's palette
 * exactly (no external image asset needed).
 */
export default function PhotoboothIllustration({ className, lit = true }: Props) {
  const bulbPositions = Array.from({ length: 14 }).map((_, i) => {
    const t = i / 13
    return { x: 40 + t * 420, y: 46 - Math.sin(t * Math.PI) * 18 }
  })

  return (
    <svg
      viewBox="0 0 500 620"
      className={className}
      role="img"
      aria-label="Illustration of a vintage curtained photobooth with a lit marquee sign"
    >
      {/* ground shadow */}
      <ellipse cx="250" cy="592" rx="190" ry="18" fill="#1C1712" opacity="0.18" />

      {/* booth side walls */}
      <rect x="55" y="120" width="390" height="430" rx="6" fill="#5A4432" />
      <rect x="55" y="120" width="30" height="430" fill="#3B2A20" />
      <rect x="415" y="120" width="30" height="430" fill="#3B2A20" />

      {/* marquee header board */}
      <path
        d="M30 60 Q250 -10 470 60 L470 110 Q250 50 30 110 Z"
        fill="#7C2D2D"
        stroke="#3B2A20"
        strokeWidth="4"
      />
      <path
        d="M60 72 Q250 20 440 72 L440 96 Q250 50 60 96 Z"
        fill="#F2E6D0"
      />
      <text
        x="250"
        y="86"
        textAnchor="middle"
        fontFamily="'Abril Fatface', serif"
        fontSize="34"
        fill="#7C2D2D"
        letterSpacing="2"
      >
      </text>

      {/* marquee bulbs */}
      {bulbPositions.map((b, i) => (
        <circle
          key={i}
          cx={b.x}
          cy={b.y}
          r="6"
          fill="#D9A441"
          stroke="#3B2A20"
          strokeWidth="1.5"
          className={lit ? 'animate-bulbGlow' : ''}
          style={{ animationDelay: `${(i % 5) * 220}ms` }}
        />
      ))}

      {/* coin box */}
      <rect x="75" y="480" width="46" height="60" rx="4" fill="#D9A441" stroke="#3B2A20" strokeWidth="3" />
      <rect x="88" y="498" width="20" height="6" rx="3" fill="#3B2A20" />
      <text x="98" y="530" textAnchor="middle" fontFamily="'Special Elite', monospace" fontSize="10" fill="#3B2A20">
        25¢
      </text>

      {/* camera lens on the side panel */}
      <circle cx="405" cy="200" r="26" fill="#1C1712" stroke="#D9A441" strokeWidth="4" />
      <circle cx="405" cy="200" r="13" fill="#4F7B74" opacity="0.85" />
      <circle cx="399" cy="194" r="4" fill="#F2E6D0" opacity="0.7" />

      {/* curtain rail */}
      <rect x="95" y="128" width="310" height="10" rx="4" fill="#3B2A20" />

      {/* curtains, tied open to reveal the booth interior */}
      <path
        d="M100 132 C90 260 96 400 118 486 C132 500 158 494 162 470 C144 360 140 240 148 134 Z"
        fill="#9B4444"
      />
      <path
        d="M100 132 C90 260 96 400 118 486"
        fill="none"
        stroke="#5B1F1F"
        strokeWidth="3"
        opacity="0.5"
      />
      <path
        d="M400 132 C410 260 404 400 382 486 C368 500 342 494 338 470 C356 360 360 240 352 134 Z"
        fill="#9B4444"
      />
      <path
        d="M400 132 C410 260 404 400 382 486"
        fill="none"
        stroke="#5B1F1F"
        strokeWidth="3"
        opacity="0.5"
      />
      {/* curtain tie-backs */}
      <rect x="108" y="330" width="20" height="34" rx="10" fill="#D9A441" stroke="#3B2A20" strokeWidth="2" />
      <rect x="372" y="330" width="20" height="34" rx="10" fill="#D9A441" stroke="#3B2A20" strokeWidth="2" />

      {/* interior booth shadow */}
      <rect x="162" y="140" width="176" height="360" fill="#1C1712" opacity="0.5" />

      {/* stool */}
      <rect x="228" y="420" width="44" height="10" rx="4" fill="#D9A441" />
      <line x1="236" y1="430" x2="230" y2="480" stroke="#3B2A20" strokeWidth="6" strokeLinecap="round" />
      <line x1="264" y1="430" x2="270" y2="480" stroke="#3B2A20" strokeWidth="6" strokeLinecap="round" />

      {/* film strip curtain-peek graphic hanging inside */}
      <g transform="translate(214,190)">
        <rect width="72" height="180" rx="6" fill="#F2E6D0" stroke="#3B2A20" strokeWidth="3" />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x="8"
            y={8 + i * 42}
            width="56"
            height="34"
            rx="2"
            fill="#5A4432"
            opacity={0.85}
          />
        ))}
      </g>

      {/* base step */}
      <rect x="40" y="548" width="420" height="26" rx="4" fill="#3B2A20" />
      <rect x="40" y="548" width="420" height="8" rx="4" fill="#5A4432" />
    </svg>
  )
}
