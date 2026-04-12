const BODY_PART_DEFS: Record<string, { svg: JSX.Element; bg: string }> = {
  HEAD: {
    bg: "linear-gradient(135deg, #fbbf24, #fde68a)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="50" cy="44" r="28" fill="#fde68a" stroke="#d97706" strokeWidth="3" />
        <circle cx="50" cy="80" r="14" fill="#fde68a" stroke="#d97706" strokeWidth="3" />
        <rect x="42" y="70" width="16" height="14" fill="#fde68a" />
        <circle cx="40" cy="40" r="3" fill="#92400e" />
        <circle cx="60" cy="40" r="3" fill="#92400e" />
        <path d="M42,52 Q50,60 58,52" fill="none" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  FACE: {
    bg: "linear-gradient(135deg, #f9a8d4, #fbcfe8)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="50" cy="50" r="36" fill="#fbcfe8" stroke="#ec4899" strokeWidth="3" />
        <circle cx="38" cy="42" r="4" fill="#1e293b" />
        <circle cx="62" cy="42" r="4" fill="#1e293b" />
        <circle cx="37" cy="43" r="1.5" fill="white" />
        <circle cx="61" cy="43" r="1.5" fill="white" />
        <path d="M40,60 Q50,70 60,60" fill="none" stroke="#be185d" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="30" cy="54" r="5" fill="#f9a8d4" opacity="0.6" />
        <circle cx="70" cy="54" r="5" fill="#f9a8d4" opacity="0.6" />
      </svg>
    ),
  },
  EYE: {
    bg: "linear-gradient(135deg, #60a5fa, #bfdbfe)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <ellipse cx="50" cy="50" rx="36" ry="22" fill="white" stroke="#2563eb" strokeWidth="3" />
        <circle cx="50" cy="50" r="14" fill="#3b82f6" />
        <circle cx="50" cy="50" r="8" fill="#1e293b" />
        <circle cx="46" cy="44" r="4" fill="white" />
        <circle cx="54" cy="48" r="2" fill="white" />
      </svg>
    ),
  },
  EAR: {
    bg: "linear-gradient(135deg, #fbbf24, #fef3c7)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M55,18 C75,18 82,35 82,52 C82,72 68,86 52,86 C46,86 42,82 42,76" fill="#fde68a" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
        <path d="M55,30 C65,30 70,40 70,50 C70,60 62,68 55,68" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="58" cy="52" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
      </svg>
    ),
  },
  NOSE: {
    bg: "linear-gradient(135deg, #fb923c, #fed7aa)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M50,18 C50,18 38,55 30,68 C34,78 44,82 50,82 C56,82 66,78 70,68 C62,55 50,18 50,18Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="3" />
        <circle cx="40" cy="68" r="4" fill="#fbbf24" opacity="0.4" />
        <circle cx="60" cy="68" r="4" fill="#fbbf24" opacity="0.4" />
      </svg>
    ),
  },
  MOUTH: {
    bg: "linear-gradient(135deg, #ef4444, #fca5a5)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M16,42 Q50,38 84,42 Q78,76 50,78 Q22,76 16,42Z" fill="#f87171" stroke="#dc2626" strokeWidth="3" />
        <path d="M16,42 Q50,52 84,42" fill="none" stroke="#dc2626" strokeWidth="2" />
        <rect x="28" y="42" width="10" height="10" rx="1" fill="white" />
        <rect x="40" y="42" width="10" height="10" rx="1" fill="white" />
        <rect x="52" y="42" width="10" height="10" rx="1" fill="white" />
        <rect x="64" y="42" width="10" height="10" rx="1" fill="white" />
      </svg>
    ),
  },
  TOOTH: {
    bg: "linear-gradient(135deg, #e0e7ff, #f0f9ff)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M50,14 C62,14 72,24 72,38 L68,78 C68,84 62,88 58,88 L54,72 L50,88 L46,72 L42,88 C38,88 32,84 32,78 L28,38 C28,24 38,14 50,14Z" fill="white" stroke="#94a3b8" strokeWidth="3" />
        <path d="M36,30 Q42,24 50,28" fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  TONGUE: {
    bg: "linear-gradient(135deg, #ec4899, #fda4af)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M30,20 L70,20 L70,56 C70,78 50,90 50,90 C50,90 30,78 30,56Z" fill="#fda4af" stroke="#e11d48" strokeWidth="3" strokeLinejoin="round" />
        <line x1="50" y1="30" x2="50" y2="72" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  HAND: {
    bg: "linear-gradient(135deg, #fbbf24, #fef3c7)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M50,88 C34,88 22,76 22,62 L22,42 C22,38 26,36 28,38 L28,52" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
        <rect x="32" y="20" width="8" height="46" rx="4" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
        <rect x="42" y="14" width="8" height="52" rx="4" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
        <rect x="52" y="18" width="8" height="48" rx="4" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
        <rect x="62" y="24" width="8" height="42" rx="4" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
        <rect x="22" y="52" width="50" height="28" rx="8" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
      </svg>
    ),
  },
  FOOT: {
    bg: "linear-gradient(135deg, #f59e0b, #fef3c7)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M30,18 C30,18 26,60 26,68 C26,82 40,88 56,88 C72,88 82,78 82,68 C82,62 78,58 72,58 L36,58 L36,18" fill="#fde68a" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="48" cy="76" r="3" fill="#fbbf24" />
        <circle cx="56" cy="74" r="3" fill="#fbbf24" />
        <circle cx="64" cy="74" r="3" fill="#fbbf24" />
        <circle cx="72" cy="72" r="2.5" fill="#fbbf24" />
        <circle cx="42" cy="78" r="2.5" fill="#fbbf24" />
      </svg>
    ),
  },
  ARM: {
    bg: "linear-gradient(135deg, #f97316, #fed7aa)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M20,72 Q24,44 42,28 Q52,20 60,28" fill="none" stroke="#fed7aa" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20,72 Q24,44 42,28 Q52,20 60,28" fill="none" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="60" cy="28" r="10" fill="#fed7aa" stroke="#ea580c" strokeWidth="2.5" />
        <path d="M55,24 Q60,18 66,22" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  LEG: {
    bg: "linear-gradient(135deg, #8b5cf6, #ddd6fe)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M44,12 L44,62 L38,76 L34,86 L60,86 L58,76 L52,62 L52,12" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="3" strokeLinejoin="round" />
        <rect x="30" y="82" width="36" height="10" rx="5" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="2" />
        <ellipse cx="48" cy="32" rx="4" ry="10" fill="rgba(124,58,237,0.1)" />
      </svg>
    ),
  },
  FINGER: {
    bg: "linear-gradient(135deg, #fbbf24, #fef3c7)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="38" y="10" width="24" height="68" rx="12" fill="#fde68a" stroke="#d97706" strokeWidth="3" />
        <path d="M38,52 L62,52" stroke="#d97706" strokeWidth="1.5" />
        <path d="M38,36 L62,36" stroke="#d97706" strokeWidth="1.5" />
        <ellipse cx="50" cy="15" rx="8" ry="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
      </svg>
    ),
  },
  KNEE: {
    bg: "linear-gradient(135deg, #06b6d4, #cffafe)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="32" y="8" width="36" height="36" rx="4" fill="#cffafe" stroke="#0891b2" strokeWidth="3" />
        <rect x="32" y="56" width="36" height="36" rx="4" fill="#cffafe" stroke="#0891b2" strokeWidth="3" />
        <circle cx="50" cy="50" r="14" fill="#67e8f9" stroke="#0891b2" strokeWidth="3" />
        <circle cx="46" cy="46" r="3" fill="rgba(255,255,255,0.5)" />
      </svg>
    ),
  },
  BONE: {
    bg: "linear-gradient(135deg, #e2e8f0, #f8fafc)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="24" cy="24" r="10" fill="white" stroke="#94a3b8" strokeWidth="3" />
        <circle cx="24" cy="40" r="10" fill="white" stroke="#94a3b8" strokeWidth="3" />
        <circle cx="76" cy="60" r="10" fill="white" stroke="#94a3b8" strokeWidth="3" />
        <circle cx="76" cy="76" r="10" fill="white" stroke="#94a3b8" strokeWidth="3" />
        <rect x="20" y="26" width="60" height="16" rx="8" fill="white" stroke="#94a3b8" strokeWidth="3" transform="rotate(35,50,50)" />
      </svg>
    ),
  },
  BRAIN: {
    bg: "linear-gradient(135deg, #ec4899, #fce7f3)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M50,82 C30,82 18,66 18,50 C18,38 24,28 34,24 C34,16 42,10 50,10 C58,10 66,16 66,24 C76,28 82,38 82,50 C82,66 70,82 50,82Z" fill="#fbcfe8" stroke="#db2777" strokeWidth="3" />
        <path d="M50,18 L50,78" stroke="#db2777" strokeWidth="2" opacity="0.4" />
        <path d="M30,40 Q40,36 50,42" fill="none" stroke="#db2777" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
        <path d="M50,42 Q60,36 70,40" fill="none" stroke="#db2777" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
        <path d="M32,58 Q42,52 50,58" fill="none" stroke="#db2777" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
        <path d="M50,58 Q58,52 68,58" fill="none" stroke="#db2777" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
      </svg>
    ),
  },
  HEART: {
    bg: "linear-gradient(135deg, #dc2626, #fca5a5)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M50,85 C20,65 5,45 15,30 C25,15 40,18 50,32 C60,18 75,15 85,30 C95,45 80,65 50,85Z" fill="#fca5a5" stroke="#dc2626" strokeWidth="3" />
        <path d="M50,38 L42,50 L50,48 L50,70" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M44,62 L56,62" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  MUSCLE: {
    bg: "linear-gradient(135deg, #ef4444, #fecaca)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M30,70 Q32,40 50,26 Q58,22 64,30 Q72,20 76,30 Q82,44 78,56 Q74,68 60,76 Q50,80 40,78 Q32,76 30,70Z" fill="#fecaca" stroke="#dc2626" strokeWidth="3" />
        <path d="M46,44 Q56,38 62,44" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        <path d="M44,54 Q54,48 64,54" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  NECK: {
    bg: "linear-gradient(135deg, #fbbf24, #fef3c7)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="34" y="30" width="32" height="50" rx="6" fill="#fde68a" stroke="#d97706" strokeWidth="3" />
        <circle cx="50" cy="22" r="18" fill="#fde68a" stroke="#d97706" strokeWidth="3" />
        <circle cx="44" cy="20" r="2" fill="#92400e" />
        <circle cx="56" cy="20" r="2" fill="#92400e" />
        <path d="M46,26 Q50,30 54,26" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="34" y1="50" x2="66" y2="50" stroke="#d97706" strokeWidth="1" opacity="0.3" />
        <line x1="34" y1="58" x2="66" y2="58" stroke="#d97706" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
  SHOULDER: {
    bg: "linear-gradient(135deg, #8b5cf6, #ede9fe)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="50" cy="24" r="14" fill="#ede9fe" stroke="#7c3aed" strokeWidth="3" />
        <path d="M36,36 Q20,44 16,64 L16,80 L84,80 L84,64 Q80,44 64,36" fill="#ede9fe" stroke="#7c3aed" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="46" cy="22" r="2" fill="#5b21b6" />
        <circle cx="54" cy="22" r="2" fill="#5b21b6" />
        <path d="M47,28 Q50,31 53,28" fill="none" stroke="#5b21b6" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="30" cy="50" r="6" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="2" />
        <circle cx="70" cy="50" r="6" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="2" />
      </svg>
    ),
  },
  BACK: {
    bg: "linear-gradient(135deg, #14b8a6, #ccfbf1)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M34,14 L66,14 L72,40 L72,82 L28,82 L28,40Z" fill="#ccfbf1" stroke="#0d9488" strokeWidth="3" strokeLinejoin="round" />
        <line x1="50" y1="20" x2="50" y2="76" stroke="#0d9488" strokeWidth="2" opacity="0.5" />
        <line x1="36" y1="32" x2="64" y2="32" stroke="#0d9488" strokeWidth="1.5" opacity="0.3" />
        <line x1="34" y1="44" x2="66" y2="44" stroke="#0d9488" strokeWidth="1.5" opacity="0.3" />
        <line x1="34" y1="56" x2="66" y2="56" stroke="#0d9488" strokeWidth="1.5" opacity="0.3" />
        <line x1="36" y1="68" x2="64" y2="68" stroke="#0d9488" strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
  },
  BELLY: {
    bg: "linear-gradient(135deg, #f97316, #ffedd5)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <ellipse cx="50" cy="54" rx="34" ry="32" fill="#ffedd5" stroke="#ea580c" strokeWidth="3" />
        <circle cx="50" cy="54" r="5" fill="#fdba74" stroke="#ea580c" strokeWidth="2" />
        <path d="M32,38 Q50,28 68,38" fill="none" stroke="#ea580c" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      </svg>
    ),
  },
  THUMB: {
    bg: "linear-gradient(135deg, #22c55e, #dcfce7)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="34" y="38" width="32" height="46" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="3" />
        <rect x="36" y="12" width="28" height="40" rx="14" fill="#dcfce7" stroke="#16a34a" strokeWidth="3" />
        <path d="M42,24 Q50,18 58,24" fill="none" stroke="rgba(22,163,74,0.3)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  NAIL: {
    bg: "linear-gradient(135deg, #ec4899, #fce7f3)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="28" y="30" width="44" height="56" rx="22" fill="#fce7f3" stroke="#be185d" strokeWidth="3" />
        <rect x="32" y="14" width="36" height="34" rx="18" fill="#f9a8d4" stroke="#be185d" strokeWidth="2" />
        <path d="M40,28 Q50,22 60,28" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="40" r="3" fill="#f472b6" />
      </svg>
    ),
  },
  HAIR: {
    bg: "linear-gradient(135deg, #92400e, #fbbf24)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="50" cy="56" r="24" fill="#fde68a" stroke="#92400e" strokeWidth="2" />
        <path d="M26,50 Q28,16 50,12 Q72,16 74,50" fill="#92400e" stroke="#78350f" strokeWidth="2" />
        <path d="M32,36 Q38,20 50,16 Q62,20 68,36" fill="#a16207" />
        <path d="M28,50 Q32,30 44,22" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
        <path d="M72,50 Q68,30 56,22" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
        <circle cx="42" cy="54" r="2.5" fill="#92400e" />
        <circle cx="58" cy="54" r="2.5" fill="#92400e" />
        <path d="M46,62 Q50,66 54,62" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
};

export function BodyPartImage({ name }: { name: string }) {
  const part = BODY_PART_DEFS[name];
  if (!part) {
    return <div className="shape-fallback">{name}</div>;
  }
  return (
    <div className="shape-image" style={{ background: part.bg }}>
      {part.svg}
    </div>
  );
}
