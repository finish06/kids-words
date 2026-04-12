import type { ReactNode } from "react";

const SHAPE_DEFS: Record<string, { svg: ReactNode; bg: string }> = {
  CIRCLE: {
    bg: "linear-gradient(135deg, #3b82f6, #60a5fa)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="50" cy="50" r="38" fill="#60a5fa" stroke="#2563eb" strokeWidth="4" />
        <circle cx="38" cy="38" r="8" fill="rgba(255,255,255,0.4)" />
      </svg>
    ),
  },
  SQUARE: {
    bg: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="18" y="18" width="64" height="64" rx="6" fill="#fbbf24" stroke="#d97706" strokeWidth="4" />
        <rect x="26" y="26" width="14" height="14" rx="2" fill="rgba(255,255,255,0.35)" />
      </svg>
    ),
  },
  TRIANGLE: {
    bg: "linear-gradient(135deg, #22c55e, #4ade80)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <polygon points="50,14 88,82 12,82" fill="#4ade80" stroke="#16a34a" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="42" cy="50" r="5" fill="rgba(255,255,255,0.35)" />
      </svg>
    ),
  },
  STAR: {
    bg: "linear-gradient(135deg, #eab308, #facc15)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <polygon
          points="50,10 61,38 92,38 67,56 76,86 50,68 24,86 33,56 8,38 39,38"
          fill="#facc15" stroke="#ca8a04" strokeWidth="3" strokeLinejoin="round"
        />
        <circle cx="44" cy="40" r="5" fill="rgba(255,255,255,0.4)" />
      </svg>
    ),
  },
  HEART: {
    bg: "linear-gradient(135deg, #ef4444, #f87171)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path
          d="M50,85 C20,65 5,45 15,30 C25,15 40,18 50,32 C60,18 75,15 85,30 C95,45 80,65 50,85Z"
          fill="#f87171" stroke="#dc2626" strokeWidth="3"
        />
        <ellipse cx="35" cy="36" rx="6" ry="5" fill="rgba(255,255,255,0.35)" transform="rotate(-20,35,36)" />
      </svg>
    ),
  },
  DIAMOND: {
    bg: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <polygon points="50,10 85,50 50,90 15,50" fill="#a78bfa" stroke="#7c3aed" strokeWidth="4" strokeLinejoin="round" />
        <polygon points="50,22 55,50 50,32 45,50" fill="rgba(255,255,255,0.25)" />
      </svg>
    ),
  },
  RECTANGLE: {
    bg: "linear-gradient(135deg, #06b6d4, #22d3ee)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="12" y="26" width="76" height="48" rx="6" fill="#22d3ee" stroke="#0891b2" strokeWidth="4" />
        <rect x="20" y="32" width="16" height="10" rx="2" fill="rgba(255,255,255,0.35)" />
      </svg>
    ),
  },
  OVAL: {
    bg: "linear-gradient(135deg, #ec4899, #f472b6)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <ellipse cx="50" cy="50" rx="40" ry="28" fill="#f472b6" stroke="#db2777" strokeWidth="4" />
        <ellipse cx="38" cy="42" rx="8" ry="5" fill="rgba(255,255,255,0.35)" transform="rotate(-15,38,42)" />
      </svg>
    ),
  },
  PENTAGON: {
    bg: "linear-gradient(135deg, #14b8a6, #2dd4bf)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <polygon
          points="50,12 88,40 73,82 27,82 12,40"
          fill="#2dd4bf" stroke="#0d9488" strokeWidth="4" strokeLinejoin="round"
        />
        <circle cx="40" cy="44" r="5" fill="rgba(255,255,255,0.35)" />
      </svg>
    ),
  },
  HEXAGON: {
    bg: "linear-gradient(135deg, #f97316, #fb923c)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <polygon
          points="50,10 87,30 87,70 50,90 13,70 13,30"
          fill="#fb923c" stroke="#ea580c" strokeWidth="4" strokeLinejoin="round"
        />
        <circle cx="38" cy="38" r="6" fill="rgba(255,255,255,0.3)" />
      </svg>
    ),
  },
  ARROW: {
    bg: "linear-gradient(135deg, #6366f1, #818cf8)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <polygon
          points="85,50 55,20 55,38 15,38 15,62 55,62 55,80"
          fill="#818cf8" stroke="#4f46e5" strokeWidth="3" strokeLinejoin="round"
        />
      </svg>
    ),
  },
  CRESCENT: {
    bg: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path
          d="M60,12 A38,38 0 1,1 60,88 A28,28 0 1,0 60,12Z"
          fill="#fbbf24" stroke="#d97706" strokeWidth="3"
        />
        <circle cx="42" cy="36" r="3" fill="rgba(255,255,255,0.4)" />
      </svg>
    ),
  },
  CROSS: {
    bg: "linear-gradient(135deg, #ef4444, #f87171)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <polygon
          points="38,12 62,12 62,38 88,38 88,62 62,62 62,88 38,88 38,62 12,62 12,38 38,38"
          fill="#f87171" stroke="#dc2626" strokeWidth="3" strokeLinejoin="round"
        />
      </svg>
    ),
  },
  RING: {
    bg: "linear-gradient(135deg, #eab308, #fde047)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="50" cy="50" r="36" fill="none" stroke="#fbbf24" strokeWidth="14" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#fde047" strokeWidth="8" />
        <path d="M30,32 Q36,26 44,30" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  CUBE: {
    bg: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <polygon points="50,16 84,34 84,68 50,86 16,68 16,34" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="50,16 84,34 50,52 16,34" fill="#7dd3fc" stroke="#0284c7" strokeWidth="2" strokeLinejoin="round" />
        <line x1="50" y1="52" x2="50" y2="86" stroke="#0284c7" strokeWidth="2" />
      </svg>
    ),
  },
  SPHERE: {
    bg: "linear-gradient(135deg, #a855f7, #c084fc)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <defs>
          <radialGradient id="sphereGrad">
            <stop offset="20%" stopColor="#d8b4fe" />
            <stop offset="90%" stopColor="#7c3aed" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="38" fill="url(#sphereGrad)" stroke="#6d28d9" strokeWidth="3" />
        <ellipse cx="38" cy="36" rx="10" ry="8" fill="rgba(255,255,255,0.3)" transform="rotate(-30,38,36)" />
      </svg>
    ),
  },
  CONE: {
    bg: "linear-gradient(135deg, #f97316, #fdba74)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <polygon points="50,14 82,80 18,80" fill="#fdba74" stroke="#ea580c" strokeWidth="3" strokeLinejoin="round" />
        <ellipse cx="50" cy="80" rx="32" ry="8" fill="#fb923c" stroke="#ea580c" strokeWidth="2" />
        <line x1="50" y1="14" x2="50" y2="80" stroke="rgba(234,88,12,0.2)" strokeWidth="1" strokeDasharray="4 3" />
      </svg>
    ),
  },
  CYLINDER: {
    bg: "linear-gradient(135deg, #10b981, #34d399)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="22" y="28" width="56" height="48" rx="2" fill="#34d399" stroke="#059669" strokeWidth="3" />
        <ellipse cx="50" cy="28" rx="28" ry="10" fill="#6ee7b7" stroke="#059669" strokeWidth="2" />
        <ellipse cx="50" cy="76" rx="28" ry="10" fill="#34d399" stroke="#059669" strokeWidth="2" />
        <path d="M28,34 Q34,28 44,32" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  SPIRAL: {
    bg: "linear-gradient(135deg, #ec4899, #f9a8d4)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path
          d="M50,50 C50,42 58,36 64,40 C70,44 68,54 62,58 C54,64 42,60 38,52 C34,42 40,30 52,28 C66,26 76,38 76,52 C76,68 62,80 46,78"
          fill="none" stroke="#ec4899" strokeWidth="5" strokeLinecap="round"
        />
      </svg>
    ),
  },
  INFINITY: {
    bg: "linear-gradient(135deg, #6366f1, #a5b4fc)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path
          d="M50,50 C50,36 62,24 74,32 C86,40 80,58 68,58 C56,58 50,50 50,50 C50,50 44,42 32,42 C20,42 14,60 26,68 C38,76 50,64 50,50Z"
          fill="none" stroke="#818cf8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

export function ShapeImage({ name }: { name: string }) {
  const shape = SHAPE_DEFS[name];
  if (!shape) {
    return <div className="shape-fallback">{name}</div>;
  }
  return (
    <div className="shape-image" style={{ background: shape.bg }}>
      {shape.svg}
    </div>
  );
}
