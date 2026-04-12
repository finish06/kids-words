import type { ReactNode } from "react";

/*
 * Body Part illustrations for kids aged 4-6.
 *
 * Design rule: every image must pass the "would a 4-year-old recognise this?" test.
 * That means showing body parts IN CONTEXT (on a face, on a body, with neighbours)
 * rather than as abstract symbols. A nose needs a face around it. A leg needs a foot
 * at the bottom and a hip at the top. A tooth needs a mouth.
 */

const S = "#fde68a"; // skin fill
const SO = "#d97706"; // skin outline
const D = "#1e293b"; // dark (eyes/pupils)

const BODY_PART_DEFS: Record<string, { svg: ReactNode; bg: string }> = {
  HEAD: {
    bg: "linear-gradient(135deg, #a78bfa, #ede9fe)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Head silhouette with hair — clearly "head", not just "face" */}
        <circle cx="50" cy="48" r="32" fill={S} stroke={SO} strokeWidth="3" />
        {/* Hair on top */}
        <path d="M22,38 Q24,12 50,8 Q76,12 78,38" fill="#92400e" stroke="#78350f" strokeWidth="2" />
        <path d="M28,30 Q34,14 50,10 Q66,14 72,30" fill="#a16207" />
        {/* Eyes */}
        <circle cx="38" cy="46" r="3.5" fill={D} />
        <circle cx="62" cy="46" r="3.5" fill={D} />
        <circle cx="39" cy="45" r="1.2" fill="white" />
        <circle cx="63" cy="45" r="1.2" fill="white" />
        {/* Smile */}
        <path d="M40,58 Q50,66 60,58" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
        {/* Neck stub to show "this is HEAD, not face" */}
        <rect x="42" y="78" width="16" height="14" rx="4" fill={S} stroke={SO} strokeWidth="2" />
      </svg>
    ),
  },
  FACE: {
    bg: "linear-gradient(135deg, #f9a8d4, #fbcfe8)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="50" cy="50" r="36" fill="#fbcfe8" stroke="#ec4899" strokeWidth="3" />
        {/* Big expressive eyes */}
        <ellipse cx="36" cy="42" rx="7" ry="8" fill="white" />
        <ellipse cx="64" cy="42" rx="7" ry="8" fill="white" />
        <circle cx="38" cy="43" r="4.5" fill={D} />
        <circle cx="66" cy="43" r="4.5" fill={D} />
        <circle cx="39" cy="42" r="1.5" fill="white" />
        <circle cx="67" cy="42" r="1.5" fill="white" />
        {/* Nose dot */}
        <circle cx="50" cy="54" r="2" fill="#ec4899" />
        {/* Wide smile */}
        <path d="M36,62 Q50,74 64,62" fill="none" stroke="#be185d" strokeWidth="2.5" strokeLinecap="round" />
        {/* Blush */}
        <circle cx="28" cy="56" r="5" fill="#f9a8d4" opacity="0.5" />
        <circle cx="72" cy="56" r="5" fill="#f9a8d4" opacity="0.5" />
      </svg>
    ),
  },
  EYE: {
    bg: "linear-gradient(135deg, #60a5fa, #bfdbfe)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Large eye with detailed iris */}
        <ellipse cx="50" cy="50" rx="38" ry="24" fill="white" stroke="#2563eb" strokeWidth="3" />
        <circle cx="50" cy="50" r="16" fill="#3b82f6" />
        <circle cx="50" cy="50" r="9" fill={D} />
        <circle cx="44" cy="43" r="5" fill="white" />
        <circle cx="54" cy="47" r="2.5" fill="white" />
        {/* Eyelashes on top */}
        <path d="M18,34 L22,28" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M30,28 L32,22" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M44,25 L44,19" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M56,25 L56,19" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M68,28 L70,22" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M80,34 L82,28" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  EAR: {
    bg: "linear-gradient(135deg, #fbbf24, #fef3c7)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Ear shown on side of face for context */}
        {/* Partial face circle on left */}
        <path d="M40,20 A30,30 0 0,0 40,80" fill={S} stroke={SO} strokeWidth="2" />
        {/* Eye on face */}
        <circle cx="30" cy="46" r="3" fill={D} />
        <circle cx="31" cy="45" r="1" fill="white" />
        {/* The ear — big and prominent on right side */}
        <path d="M48,24 C72,22 80,38 80,52 C80,70 66,82 52,82 C48,82 44,78 44,74" fill={S} stroke={SO} strokeWidth="3" strokeLinecap="round" />
        <path d="M52,34 C64,34 68,44 68,52 C68,62 60,68 52,68" fill="none" stroke={SO} strokeWidth="2.5" strokeLinecap="round" />
        {/* Inner ear detail */}
        <circle cx="58" cy="52" r="5" fill="#fbbf24" stroke={SO} strokeWidth="1.5" />
        {/* Arrow pointing at ear */}
        <path d="M82,40 L90,40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M87,36 L91,40 L87,44" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  NOSE: {
    bg: "linear-gradient(135deg, #fb923c, #fed7aa)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* A face with a BIG highlighted nose */}
        <circle cx="50" cy="50" r="36" fill={S} stroke={SO} strokeWidth="2.5" />
        {/* Eyes */}
        <circle cx="36" cy="38" r="3" fill={D} />
        <circle cx="64" cy="38" r="3" fill={D} />
        <circle cx="37" cy="37" r="1" fill="white" />
        <circle cx="65" cy="37" r="1" fill="white" />
        {/* THE NOSE — big, round, highlighted */}
        <ellipse cx="50" cy="54" rx="10" ry="8" fill="#fb923c" stroke="#ea580c" strokeWidth="2.5" />
        <circle cx="44" cy="56" r="2.5" fill="#ea580c" opacity="0.3" />
        <circle cx="56" cy="56" r="2.5" fill="#ea580c" opacity="0.3" />
        {/* Highlight on nose */}
        <ellipse cx="48" cy="50" rx="3" ry="2" fill="white" opacity="0.35" />
        {/* Little smile */}
        <path d="M42,68 Q50,74 58,68" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  MOUTH: {
    bg: "linear-gradient(135deg, #ef4444, #fca5a5)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Big open smiling mouth */}
        <path d="M12,36 Q50,30 88,36 Q82,80 50,84 Q18,80 12,36Z" fill="#f87171" stroke="#dc2626" strokeWidth="3" />
        {/* Upper lip line */}
        <path d="M12,36 Q50,48 88,36" fill="none" stroke="#dc2626" strokeWidth="2" />
        {/* Teeth row */}
        <rect x="22" y="36" width="12" height="12" rx="2" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
        <rect x="36" y="36" width="12" height="12" rx="2" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
        <rect x="50" y="36" width="12" height="12" rx="2" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
        <rect x="64" y="36" width="12" height="12" rx="2" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
        {/* Tongue at bottom */}
        <ellipse cx="50" cy="70" rx="14" ry="10" fill="#f9a8d4" />
      </svg>
    ),
  },
  TOOTH: {
    bg: "linear-gradient(135deg, #e0e7ff, #f0f9ff)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Happy tooth character with face */}
        <path d="M50,8 C66,8 78,22 78,38 L74,72 C72,80 66,86 60,86 L56,70 L50,86 L44,70 L40,86 C34,86 28,80 26,72 L22,38 C22,22 34,8 50,8Z" fill="white" stroke="#94a3b8" strokeWidth="3" />
        {/* Sparkle/shine */}
        <path d="M32,26 Q40,18 50,22" fill="none" stroke="rgba(148,163,184,0.25)" strokeWidth="4" strokeLinecap="round" />
        {/* Happy face on the tooth */}
        <circle cx="38" cy="38" r="3" fill="#64748b" />
        <circle cx="58" cy="38" r="3" fill="#64748b" />
        <circle cx="39" cy="37" r="1" fill="white" />
        <circle cx="59" cy="37" r="1" fill="white" />
        <path d="M40,50 Q50,58 60,50" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        {/* Blush */}
        <circle cx="30" cy="46" r="4" fill="#bfdbfe" opacity="0.5" />
        <circle cx="66" cy="46" r="4" fill="#bfdbfe" opacity="0.5" />
      </svg>
    ),
  },
  TONGUE: {
    bg: "linear-gradient(135deg, #ec4899, #fda4af)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Face sticking tongue out */}
        <circle cx="50" cy="40" r="30" fill={S} stroke={SO} strokeWidth="2.5" />
        {/* Cheeky eyes */}
        <path d="M34,34 Q38,28 42,34" fill="none" stroke={D} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M58,34 Q62,28 66,34" fill="none" stroke={D} strokeWidth="2.5" strokeLinecap="round" />
        {/* Open mouth */}
        <ellipse cx="50" cy="52" rx="12" ry="8" fill="#1e293b" />
        {/* THE TONGUE — sticking out */}
        <path d="M40,54 L40,76 Q40,88 50,88 Q60,88 60,76 L60,54" fill="#fda4af" stroke="#e11d48" strokeWidth="2.5" />
        <line x1="50" y1="58" x2="50" y2="80" stroke="#e11d48" strokeWidth="1.5" opacity="0.4" />
        {/* Blush */}
        <circle cx="28" cy="48" r="4" fill="#fda4af" opacity="0.4" />
        <circle cx="72" cy="48" r="4" fill="#fda4af" opacity="0.4" />
      </svg>
    ),
  },
  HAND: {
    bg: "linear-gradient(135deg, #fbbf24, #fef3c7)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Open hand, fingers spread, palm facing viewer */}
        <rect x="30" y="50" width="40" height="34" rx="10" fill={S} stroke={SO} strokeWidth="2.5" />
        {/* Fingers */}
        <rect x="18" y="14" width="11" height="42" rx="5.5" fill={S} stroke={SO} strokeWidth="2" />
        <rect x="31" y="6" width="11" height="50" rx="5.5" fill={S} stroke={SO} strokeWidth="2" />
        <rect x="44" y="10" width="11" height="46" rx="5.5" fill={S} stroke={SO} strokeWidth="2" />
        <rect x="57" y="16" width="11" height="40" rx="5.5" fill={S} stroke={SO} strokeWidth="2" />
        {/* Thumb */}
        <rect x="70" y="46" width="10" height="22" rx="5" fill={S} stroke={SO} strokeWidth="2" transform="rotate(20, 75, 57)" />
        {/* Palm lines */}
        <path d="M36,60 Q50,54 62,60" fill="none" stroke={SO} strokeWidth="1" opacity="0.3" />
        <path d="M36,68 Q44,64 54,68" fill="none" stroke={SO} strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
  FOOT: {
    bg: "linear-gradient(135deg, #f59e0b, #fef3c7)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Footprint / bottom of foot with toes — instantly recognizable */}
        {/* Heel */}
        <ellipse cx="50" cy="76" rx="18" ry="16" fill={S} stroke={SO} strokeWidth="2.5" />
        {/* Ball of foot */}
        <ellipse cx="50" cy="40" rx="24" ry="14" fill={S} stroke={SO} strokeWidth="2.5" />
        {/* Arch (connects heel to ball) */}
        <rect x="40" y="44" width="20" height="24" rx="4" fill={S} />
        {/* Toes — five round bumps */}
        <circle cx="28" cy="30" r="7" fill={S} stroke={SO} strokeWidth="2" />
        <circle cx="40" cy="24" r="7.5" fill={S} stroke={SO} strokeWidth="2" />
        <circle cx="52" cy="22" r="8" fill={S} stroke={SO} strokeWidth="2" />
        <circle cx="64" cy="24" r="7" fill={S} stroke={SO} strokeWidth="2" />
        <circle cx="74" cy="30" r="6" fill={S} stroke={SO} strokeWidth="2" />
      </svg>
    ),
  },
  ARM: {
    bg: "linear-gradient(135deg, #f97316, #fed7aa)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Flexed arm — bicep curl, classic "arm" pose */}
        {/* Upper arm */}
        <path d="M26,82 L26,50" stroke={S} strokeWidth="20" strokeLinecap="round" />
        <path d="M26,82 L26,50" stroke={SO} strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Forearm going up */}
        <path d="M26,50 Q26,30 46,20" stroke={S} strokeWidth="18" strokeLinecap="round" />
        <path d="M26,50 Q26,30 46,20" stroke={SO} strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Fist */}
        <circle cx="50" cy="18" r="12" fill={S} stroke={SO} strokeWidth="2.5" />
        {/* Bicep bump */}
        <ellipse cx="38" cy="42" rx="10" ry="6" fill="#fbbf24" opacity="0.3" />
        {/* Muscle lines */}
        <path d="M32,44 Q38,38 42,44" fill="none" stroke={SO} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      </svg>
    ),
  },
  LEG: {
    bg: "linear-gradient(135deg, #8b5cf6, #ede9fe)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Full leg from hip to shoe — clearly a leg */}
        {/* Thigh */}
        <rect x="34" y="6" width="24" height="38" rx="12" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2.5" />
        {/* Knee circle */}
        <circle cx="46" cy="44" r="8" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="2" />
        {/* Shin */}
        <rect x="36" y="44" width="20" height="32" rx="10" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2.5" />
        {/* Foot/shoe */}
        <path d="M34,74 L34,82 Q34,90 44,90 L72,90 Q78,90 78,84 Q78,78 70,76 L56,74" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  FINGER: {
    bg: "linear-gradient(135deg, #fbbf24, #fef3c7)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Pointing hand — index finger extended, others curled */}
        {/* Fist base */}
        <rect x="20" y="50" width="44" height="34" rx="12" fill={S} stroke={SO} strokeWidth="2.5" />
        {/* Curled fingers */}
        <path d="M24,50 Q24,42 32,42 Q40,42 40,50" fill={S} stroke={SO} strokeWidth="2" />
        <path d="M36,50 Q36,44 44,44 Q52,44 52,50" fill={S} stroke={SO} strokeWidth="2" />
        <path d="M48,50 Q48,46 54,46 Q60,46 60,50" fill={S} stroke={SO} strokeWidth="2" />
        {/* THE pointing finger — tall and prominent */}
        <rect x="56" y="8" width="14" height="50" rx="7" fill={S} stroke={SO} strokeWidth="2.5" />
        {/* Fingernail */}
        <rect x="58" y="8" width="10" height="10" rx="5" fill="#fbbf24" stroke={SO} strokeWidth="1.5" />
        {/* Knuckle lines */}
        <path d="M56,36 L70,36" stroke={SO} strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
  KNEE: {
    bg: "linear-gradient(135deg, #06b6d4, #cffafe)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Bent leg showing clearly where the knee is */}
        {/* Upper leg */}
        <rect x="16" y="4" width="20" height="44" rx="10" fill="#cffafe" stroke="#0891b2" strokeWidth="2.5" />
        {/* Lower leg going right */}
        <rect x="30" y="54" width="50" height="18" rx="9" fill="#cffafe" stroke="#0891b2" strokeWidth="2.5" />
        {/* THE KNEE — highlighted circle at the bend */}
        <circle cx="32" cy="50" r="14" fill="#67e8f9" stroke="#0891b2" strokeWidth="3" />
        <circle cx="32" cy="50" r="6" fill="#a5f3fc" stroke="#0891b2" strokeWidth="1.5" />
        {/* Kneecap shine */}
        <circle cx="28" cy="46" r="3" fill="white" opacity="0.4" />
        {/* Foot at end */}
        <ellipse cx="82" cy="68" rx="10" ry="8" fill="#cffafe" stroke="#0891b2" strokeWidth="2" />
      </svg>
    ),
  },
  BONE: {
    bg: "linear-gradient(135deg, #e2e8f0, #f8fafc)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Classic dog-bone shape — every kid knows this */}
        {/* Shaft */}
        <rect x="18" y="40" width="64" height="20" rx="10" fill="white" stroke="#94a3b8" strokeWidth="3" />
        {/* Left knobs */}
        <circle cx="20" cy="34" r="12" fill="white" stroke="#94a3b8" strokeWidth="3" />
        <circle cx="20" cy="66" r="12" fill="white" stroke="#94a3b8" strokeWidth="3" />
        {/* Right knobs */}
        <circle cx="80" cy="34" r="12" fill="white" stroke="#94a3b8" strokeWidth="3" />
        <circle cx="80" cy="66" r="12" fill="white" stroke="#94a3b8" strokeWidth="3" />
        {/* Shine */}
        <path d="M34,42 Q50,38 66,42" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  BRAIN: {
    bg: "linear-gradient(135deg, #ec4899, #fce7f3)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Brain inside a head silhouette */}
        <circle cx="50" cy="50" r="38" fill={S} stroke={SO} strokeWidth="2" opacity="0.3" />
        {/* Brain shape */}
        <path d="M50,82 C28,82 16,66 16,48 C16,36 22,26 32,22 C32,14 40,8 50,8 C60,8 68,14 68,22 C78,26 84,36 84,48 C84,66 72,82 50,82Z" fill="#fbcfe8" stroke="#db2777" strokeWidth="3" />
        {/* Brain folds — left hemisphere */}
        <path d="M50,14 L50,78" stroke="#db2777" strokeWidth="2" opacity="0.35" />
        <path d="M28,36 Q38,30 50,38" fill="none" stroke="#db2777" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
        <path d="M50,38 Q62,30 72,36" fill="none" stroke="#db2777" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
        <path d="M30,54 Q40,46 50,54" fill="none" stroke="#db2777" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
        <path d="M50,54 Q60,46 70,54" fill="none" stroke="#db2777" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
        <path d="M32,68 Q42,62 50,68" fill="none" stroke="#db2777" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
        <path d="M50,68 Q58,62 68,68" fill="none" stroke="#db2777" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      </svg>
    ),
  },
  HEART: {
    bg: "linear-gradient(135deg, #dc2626, #fca5a5)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Anatomical heart — with tubes and chambers */}
        <path d="M50,88 C18,68 4,46 16,28 C26,12 42,16 50,30 C58,16 74,12 84,28 C96,46 82,68 50,88Z" fill="#fca5a5" stroke="#dc2626" strokeWidth="3" />
        {/* Aorta tubes on top */}
        <path d="M42,20 Q38,6 44,4" stroke="#dc2626" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M50,16 Q50,2 56,2" stroke="#dc2626" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M58,20 Q62,8 58,4" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Heartbeat line across */}
        <path d="M20,52 L38,52 L42,40 L48,62 L54,44 L58,52 L80,52" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      </svg>
    ),
  },
  MUSCLE: {
    bg: "linear-gradient(135deg, #ef4444, #fecaca)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Flexed arm with BIG bicep — classic muscle pose */}
        {/* Upper arm */}
        <path d="M24,86 L24,52" stroke="#fecaca" strokeWidth="22" strokeLinecap="round" />
        <path d="M24,86 L24,52" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Forearm up */}
        <path d="M24,52 Q22,30 44,20" stroke="#fecaca" strokeWidth="20" strokeLinecap="round" />
        <path d="M24,52 Q22,30 44,20" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Fist */}
        <circle cx="48" cy="18" r="13" fill="#fecaca" stroke="#dc2626" strokeWidth="2.5" />
        {/* BIG bicep bulge */}
        <ellipse cx="36" cy="44" rx="14" ry="8" fill="#fca5a5" stroke="#dc2626" strokeWidth="2" />
        {/* Action lines */}
        <path d="M62,14 L70,10" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M64,24 L74,22" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        <path d="M60,34 L68,34" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  NECK: {
    bg: "linear-gradient(135deg, #fbbf24, #fef3c7)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Head on top + shoulders on bottom + HIGHLIGHTED neck between */}
        <circle cx="50" cy="22" r="18" fill={S} stroke={SO} strokeWidth="2.5" />
        {/* Eyes */}
        <circle cx="44" cy="20" r="2" fill={D} />
        <circle cx="56" cy="20" r="2" fill={D} />
        <path d="M46,26 Q50,30 54,26" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
        {/* THE NECK — highlighted in different color */}
        <rect x="38" y="38" width="24" height="24" rx="6" fill="#fb923c" stroke="#ea580c" strokeWidth="3" />
        {/* Shoulders */}
        <path d="M22,72 Q22,60 38,58 L62,58 Q78,60 78,72 L78,90 L22,90Z" fill={S} stroke={SO} strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  SHOULDER: {
    bg: "linear-gradient(135deg, #8b5cf6, #ede9fe)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Upper body with HIGHLIGHTED shoulder areas */}
        {/* Head */}
        <circle cx="50" cy="20" r="14" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2.5" />
        <circle cx="45" cy="18" r="2" fill="#5b21b6" />
        <circle cx="55" cy="18" r="2" fill="#5b21b6" />
        <path d="M47,24 Q50,27 53,24" fill="none" stroke="#5b21b6" strokeWidth="1.5" strokeLinecap="round" />
        {/* Neck */}
        <rect x="44" y="32" width="12" height="10" rx="4" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2" />
        {/* Body */}
        <rect x="30" y="46" width="40" height="44" rx="6" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2" />
        {/* THE SHOULDERS — highlighted circles */}
        <circle cx="24" cy="48" r="12" fill="#c4b5fd" stroke="#6d28d9" strokeWidth="3" />
        <circle cx="76" cy="48" r="12" fill="#c4b5fd" stroke="#6d28d9" strokeWidth="3" />
        {/* Arms hanging from shoulders */}
        <rect x="14" y="56" width="12" height="30" rx="6" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2" />
        <rect x="74" y="56" width="12" height="30" rx="6" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2" />
      </svg>
    ),
  },
  BACK: {
    bg: "linear-gradient(135deg, #14b8a6, #ccfbf1)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Person seen from BEHIND — head, shoulders, spine */}
        {/* Head (back of) */}
        <circle cx="50" cy="18" r="14" fill="#ccfbf1" stroke="#0d9488" strokeWidth="2.5" />
        {/* Hair on back of head */}
        <path d="M36,18 Q36,6 50,4 Q64,6 64,18" fill="#0d9488" opacity="0.3" />
        {/* Back torso */}
        <path d="M26,36 L74,36 L78,86 L22,86Z" fill="#ccfbf1" stroke="#0d9488" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Spine */}
        <line x1="50" y1="36" x2="50" y2="82" stroke="#0d9488" strokeWidth="3" opacity="0.4" />
        {/* Vertebrae bumps */}
        <circle cx="50" cy="42" r="2.5" fill="#99f6e4" stroke="#0d9488" strokeWidth="1" />
        <circle cx="50" cy="52" r="2.5" fill="#99f6e4" stroke="#0d9488" strokeWidth="1" />
        <circle cx="50" cy="62" r="2.5" fill="#99f6e4" stroke="#0d9488" strokeWidth="1" />
        <circle cx="50" cy="72" r="2.5" fill="#99f6e4" stroke="#0d9488" strokeWidth="1" />
        {/* Shoulder blades */}
        <ellipse cx="38" cy="48" rx="8" ry="10" fill="none" stroke="#0d9488" strokeWidth="1.5" opacity="0.3" />
        <ellipse cx="62" cy="48" rx="8" ry="10" fill="none" stroke="#0d9488" strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
  },
  BELLY: {
    bg: "linear-gradient(135deg, #f97316, #ffedd5)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Torso front with round belly and belly button */}
        {/* Torso outline */}
        <path d="M26,8 L74,8 L78,88 L22,88Z" fill="#ffedd5" stroke="#ea580c" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Round belly bump */}
        <ellipse cx="50" cy="58" rx="26" ry="22" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
        {/* Belly button — the star of the show */}
        <circle cx="50" cy="56" r="6" fill="#fb923c" stroke="#ea580c" strokeWidth="2.5" />
        <circle cx="50" cy="56" r="2" fill="#ea580c" />
        {/* Chest line hint */}
        <path d="M36,20 Q50,28 64,20" fill="none" stroke="#ea580c" strokeWidth="1.5" opacity="0.25" />
      </svg>
    ),
  },
  THUMB: {
    bg: "linear-gradient(135deg, #22c55e, #dcfce7)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Thumbs up! — universally recognized */}
        {/* Fist */}
        <rect x="30" y="44" width="34" height="38" rx="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5" />
        {/* Curled fingers */}
        <path d="M34,44 Q34,36 42,36 Q50,36 50,44" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
        <path d="M46,44 Q46,38 54,38 Q62,38 62,44" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
        {/* THE THUMB — big, pointing up */}
        <rect x="56" y="6" width="16" height="46" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="3" />
        {/* Thumbnail */}
        <rect x="58" y="6" width="12" height="12" rx="6" fill="#86efac" stroke="#16a34a" strokeWidth="2" />
        {/* Sparkle to show it's a positive/thumbs up */}
        <path d="M80,16 l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#fbbf24" />
        <path d="M20,24 l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#fbbf24" opacity="0.6" />
      </svg>
    ),
  },
  NAIL: {
    bg: "linear-gradient(135deg, #ec4899, #fce7f3)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Finger with a painted nail — clear and fun */}
        {/* Finger pointing up */}
        <rect x="32" y="26" width="36" height="64" rx="18" fill={S} stroke={SO} strokeWidth="2.5" />
        {/* Knuckle line */}
        <path d="M32,62 L68,62" stroke={SO} strokeWidth="1.5" opacity="0.3" />
        {/* THE NAIL — big, colored, prominent */}
        <rect x="34" y="10" width="32" height="28" rx="16" fill="#f472b6" stroke="#be185d" strokeWidth="3" />
        {/* Nail shine */}
        <path d="M42,18 Q50,12 58,18" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        {/* Little sparkle on nail */}
        <circle cx="54" cy="26" r="2" fill="white" opacity="0.6" />
      </svg>
    ),
  },
  HAIR: {
    bg: "linear-gradient(135deg, #92400e, #fbbf24)",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        {/* Head with BIG colorful hair — clearly about "hair" */}
        {/* Face */}
        <circle cx="50" cy="58" r="24" fill={S} stroke={SO} strokeWidth="2" />
        <circle cx="42" cy="56" r="2.5" fill={D} />
        <circle cx="58" cy="56" r="2.5" fill={D} />
        <path d="M46,64 Q50,68 54,64" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
        {/* BIG hair — poofy, colorful, the main feature */}
        <path d="M20,52 Q16,10 50,6 Q84,10 80,52" fill="#92400e" stroke="#78350f" strokeWidth="2.5" />
        {/* Hair volume highlights */}
        <path d="M28,42 Q32,16 50,10 Q68,16 72,42" fill="#a16207" />
        {/* Flowing hair strands */}
        <path d="M22,50 Q26,24 42,14" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M78,50 Q74,24 58,14" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M34,36 Q40,18 50,12" fill="none" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        {/* Hair strands falling on sides */}
        <path d="M24,52 Q20,64 22,76" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M76,52 Q80,64 78,76" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" />
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
