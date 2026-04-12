import type { ReactNode } from "react";

/*
 * Body Part illustrations — educational anatomy-poster style.
 *
 * Reference: cartoon body-part posters for kids. Each icon shows the actual
 * body part as it looks on a child — skin-toned, cropped close-up, soft
 * light background. NOT abstract symbols or colored shapes.
 *
 * Palette:
 *   Skin:   #fcd5b8 (fill), #e8b998 (shadow), #c4956a (outline)
 *   Hair:   #5c3a1e (dark brown)
 *   Lips:   #e88da0
 *   Bg:     #e8f4fd (light blue circle)
 */

const SK = "#fcd5b8";
const SKS = "#e8b998";
const SKO = "#c4956a";
const HR = "#5c3a1e";
const D = "#3b3b3b";

const BODY_PART_DEFS: Record<string, { svg: ReactNode; bg: string }> = {
  HEAD: {
    bg: "#e8f4fd",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="50" cy="52" r="30" fill={SK} stroke={SKO} strokeWidth="2" />
        <path d="M24,42 Q26,14 50,10 Q74,14 76,42" fill={HR} />
        <path d="M30,36 Q34,18 50,14 Q66,18 70,36" fill="#7a5230" />
        <circle cx="38" cy="48" r="3.5" fill="white" />
        <circle cx="62" cy="48" r="3.5" fill="white" />
        <circle cx="39.5" cy="48.5" r="2" fill={D} />
        <circle cx="63.5" cy="48.5" r="2" fill={D} />
        <circle cx="40" cy="48" r="0.8" fill="white" />
        <circle cx="64" cy="48" r="0.8" fill="white" />
        <ellipse cx="50" cy="56" rx="2.5" ry="1.5" fill={SKS} />
        <path d="M43,62 Q50,68 57,62" fill="none" stroke="#e88da0" strokeWidth="2" strokeLinecap="round" />
        <circle cx="34" cy="56" r="4" fill="#f5b5a8" opacity="0.4" />
        <circle cx="66" cy="56" r="4" fill="#f5b5a8" opacity="0.4" />
      </svg>
    ),
  },
  FACE: {
    bg: "#fce4ec",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="50" cy="50" r="38" fill={SK} stroke={SKO} strokeWidth="2" />
        <ellipse cx="36" cy="44" rx="5" ry="6" fill="white" />
        <ellipse cx="64" cy="44" rx="5" ry="6" fill="white" />
        <circle cx="37.5" cy="45" r="3" fill="#6b4423" />
        <circle cx="65.5" cy="45" r="3" fill="#6b4423" />
        <circle cx="38" cy="44" r="1" fill="white" />
        <circle cx="66" cy="44" r="1" fill="white" />
        <path d="M36,38 Q36,34 40,36" fill="none" stroke={HR} strokeWidth="1.5" />
        <path d="M64,38 Q64,34 60,36" fill="none" stroke={HR} strokeWidth="1.5" />
        <ellipse cx="50" cy="56" rx="3" ry="2" fill={SKS} />
        <path d="M40,64 Q50,74 60,64" fill="#e88da0" stroke="#d47a8e" strokeWidth="1.5" />
        <path d="M42,64 Q50,70 58,64" fill="white" />
        <circle cx="30" cy="56" r="5" fill="#f5b5a8" opacity="0.35" />
        <circle cx="70" cy="56" r="5" fill="#f5b5a8" opacity="0.35" />
      </svg>
    ),
  },
  EYE: {
    bg: "#e8f4fd",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <ellipse cx="50" cy="50" rx="40" ry="24" fill="white" stroke={SKO} strokeWidth="2.5" />
        <circle cx="50" cy="50" r="16" fill="#8B6914" />
        <circle cx="50" cy="50" r="9" fill={D} />
        <circle cx="44" cy="44" r="4.5" fill="white" />
        <circle cx="54" cy="48" r="2" fill="white" />
        <path d="M12,50 Q12,30 26,24" fill="none" stroke={SKO} strokeWidth="2" strokeLinecap="round" />
        <path d="M88,50 Q88,30 74,24" fill="none" stroke={SKO} strokeWidth="2" strokeLinecap="round" />
        <path d="M18,28 L14,20" stroke={HR} strokeWidth="2" strokeLinecap="round" />
        <path d="M28,22 L26,14" stroke={HR} strokeWidth="2" strokeLinecap="round" />
        <path d="M40,20 L40,12" stroke={HR} strokeWidth="2" strokeLinecap="round" />
        <path d="M60,20 L60,12" stroke={HR} strokeWidth="2" strokeLinecap="round" />
        <path d="M72,22 L74,14" stroke={HR} strokeWidth="2" strokeLinecap="round" />
        <path d="M82,28 L86,20" stroke={HR} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  EAR: {
    bg: "#fef3c7",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M56,12 C78,12 88,30 88,50 C88,74 72,90 54,90 C46,90 40,84 40,78" fill={SK} stroke={SKO} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M56,26 C68,26 76,38 76,50 C76,64 66,74 56,74" fill="none" stroke={SKS} strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="60" cy="54" rx="6" ry="5" fill={SKS} stroke={SKO} strokeWidth="1.5" />
        <path d="M38,40 L28,40" stroke={SKO} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M38,50 L22,50" stroke={SKO} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M38,60 L28,60" stroke={SKO} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
  NOSE: {
    bg: "#fff1e6",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M50,10 C50,10 50,40 50,50 C50,60 38,72 30,72 C24,72 22,66 26,62" fill="none" stroke={SKO} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M50,50 C50,60 62,72 70,72 C76,72 78,66 74,62" fill="none" stroke={SKO} strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="50" cy="64" rx="20" ry="14" fill={SK} stroke={SKO} strokeWidth="2" />
        <ellipse cx="40" cy="68" rx="5" ry="4" fill={SKS} />
        <ellipse cx="60" cy="68" rx="5" ry="4" fill={SKS} />
        <ellipse cx="46" cy="56" rx="6" ry="4" fill="white" opacity="0.3" transform="rotate(-10,46,56)" />
      </svg>
    ),
  },
  MOUTH: {
    bg: "#fce4ec",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M14,44 Q50,36 86,44 Q80,76 50,80 Q20,76 14,44Z" fill="#e88da0" stroke="#d47a8e" strokeWidth="2.5" />
        <path d="M14,44 Q50,54 86,44" fill="#d47a8e" />
        <rect x="22" y="44" width="12" height="12" rx="1.5" fill="white" />
        <rect x="36" y="44" width="12" height="12" rx="1.5" fill="white" />
        <rect x="50" y="44" width="12" height="12" rx="1.5" fill="white" />
        <rect x="64" y="44" width="12" height="12" rx="1.5" fill="white" />
        <ellipse cx="50" cy="68" rx="16" ry="8" fill="#e57385" />
      </svg>
    ),
  },
  TOOTH: {
    bg: "#f0f9ff",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M50,6 C68,6 82,22 82,42 L76,76 C74,86 66,92 60,92 L56,74 L50,92 L44,74 L40,92 C34,92 26,86 24,76 L18,42 C18,22 32,6 50,6Z" fill="white" stroke="#b0bec5" strokeWidth="3" />
        <ellipse cx="40" cy="28" rx="10" ry="6" fill="white" opacity="0" />
        <path d="M30,24 Q40,16 52,22" fill="none" stroke="#e0e7ee" strokeWidth="4" strokeLinecap="round" />
        <circle cx="38" cy="42" r="3.5" fill="#b0bec5" opacity="0.5" />
        <circle cx="58" cy="42" r="3.5" fill="#b0bec5" opacity="0.5" />
        <path d="M42,54 Q50,60 58,54" fill="none" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  TONGUE: {
    bg: "#fce4ec",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M18,30 Q50,22 82,30 Q82,46 50,48 Q18,46 18,30Z" fill="#e88da0" stroke="#d47a8e" strokeWidth="2" />
        <rect x="28" y="30" width="10" height="8" rx="1" fill="white" />
        <rect x="40" y="30" width="10" height="8" rx="1" fill="white" />
        <rect x="52" y="30" width="10" height="8" rx="1" fill="white" />
        <rect x="64" y="30" width="10" height="8" rx="1" fill="white" />
        <path d="M30,48 L30,82 Q30,94 50,94 Q70,94 70,82 L70,48" fill="#f47b8e" stroke="#e05a70" strokeWidth="2.5" />
        <line x1="50" y1="52" x2="50" y2="86" stroke="#e05a70" strokeWidth="2" opacity="0.35" />
      </svg>
    ),
  },
  HAND: {
    bg: "#e8f4fd",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="22" y="52" width="56" height="36" rx="10" fill={SK} stroke={SKO} strokeWidth="2" />
        <rect x="12" y="14" width="13" height="44" rx="6.5" fill={SK} stroke={SKO} strokeWidth="2" />
        <rect x="27" y="6" width="13" height="52" rx="6.5" fill={SK} stroke={SKO} strokeWidth="2" />
        <rect x="42" y="4" width="13" height="54" rx="6.5" fill={SK} stroke={SKO} strokeWidth="2" />
        <rect x="57" y="8" width="13" height="50" rx="6.5" fill={SK} stroke={SKO} strokeWidth="2" />
        <rect x="72" y="18" width="12" height="40" rx="6" fill={SK} stroke={SKO} strokeWidth="2" />
        <path d="M28,62 Q48,56 70,62" fill="none" stroke={SKS} strokeWidth="1.5" />
        <path d="M30,72 Q44,66 58,72" fill="none" stroke={SKS} strokeWidth="1.5" />
      </svg>
    ),
  },
  FOOT: {
    bg: "#e8f4fd",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M30,10 L30,60 Q30,78 48,80 L74,80 Q86,80 86,70 Q86,62 78,60 L42,60 L42,10" fill={SK} stroke={SKO} strokeWidth="2.5" strokeLinejoin="round" />
        <ellipse cx="56" cy="74" rx="4" ry="3" fill={SKS} />
        <ellipse cx="64" cy="72" rx="3.5" ry="3" fill={SKS} />
        <ellipse cx="72" cy="72" rx="3" ry="2.5" fill={SKS} />
        <ellipse cx="78" cy="68" rx="3" ry="2.5" fill={SKS} />
        <ellipse cx="48" cy="76" rx="3.5" ry="3" fill={SKS} />
        <path d="M36,32 L42,32" stroke={SKS} strokeWidth="1.5" opacity="0.4" />
      </svg>
    ),
  },
  ARM: {
    bg: "#fff8e1",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M14,14 L14,58" stroke={SK} strokeWidth="24" strokeLinecap="round" />
        <path d="M14,14 L14,58" stroke={SKO} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M14,58 Q14,80 36,88 L68,88" stroke={SK} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14,58 Q14,80 36,88 L68,88" stroke={SKO} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="66" y="78" width="22" height="20" rx="8" fill={SK} stroke={SKO} strokeWidth="2" />
        <path d="M10,34 L18,34" stroke={SKS} strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
  },
  LEG: {
    bg: "#e8f4fd",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="26" y="4" width="22" height="56" rx="11" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <rect x="52" y="4" width="22" height="56" rx="11" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <path d="M26,56 L26,70 Q26,84 36,86 L48,86 Q54,86 54,80" fill={SK} stroke={SKO} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M52,56 L52,70 Q52,84 62,86 L74,86 Q80,86 80,80" fill={SK} stroke={SKO} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="37" cy="36" r="6" fill={SKS} stroke={SKO} strokeWidth="1.5" />
        <circle cx="63" cy="36" r="6" fill={SKS} stroke={SKO} strokeWidth="1.5" />
      </svg>
    ),
  },
  FINGER: {
    bg: "#fff8e1",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="28" y="54" width="44" height="34" rx="12" fill={SK} stroke={SKO} strokeWidth="2" />
        <path d="M32,54 Q32,44 42,44 Q50,44 50,54" fill={SK} stroke={SKO} strokeWidth="2" />
        <path d="M46,54 Q46,46 54,46 Q62,46 62,54" fill={SK} stroke={SKO} strokeWidth="2" />
        <path d="M58,54 Q58,48 64,48 Q70,48 70,54" fill={SK} stroke={SKO} strokeWidth="2" />
        <rect x="20" y="6" width="16" height="56" rx="8" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <ellipse cx="28" cy="10" rx="6" ry="4" fill={SKS} stroke={SKO} strokeWidth="1.5" />
        <path d="M20,32 L36,32" stroke={SKS} strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
  },
  KNEE: {
    bg: "#e8f4fd",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="28" y="2" width="44" height="42" rx="10" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <rect x="28" y="56" width="44" height="42" rx="10" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <ellipse cx="50" cy="50" rx="20" ry="14" fill={SKS} stroke={SKO} strokeWidth="2.5" />
        <ellipse cx="46" cy="46" rx="6" ry="4" fill="white" opacity="0.25" transform="rotate(-10,46,46)" />
      </svg>
    ),
  },
  BONE: {
    bg: "#f0f9ff",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <g transform="rotate(-25, 50, 50)">
          <rect x="8" y="42" width="84" height="16" rx="8" fill="white" stroke="#b0bec5" strokeWidth="3" />
          <circle cx="12" cy="36" r="13" fill="white" stroke="#b0bec5" strokeWidth="3" />
          <circle cx="12" cy="64" r="13" fill="white" stroke="#b0bec5" strokeWidth="3" />
          <circle cx="88" cy="36" r="13" fill="white" stroke="#b0bec5" strokeWidth="3" />
          <circle cx="88" cy="64" r="13" fill="white" stroke="#b0bec5" strokeWidth="3" />
        </g>
        <ellipse cx="42" cy="40" rx="8" ry="4" fill="white" opacity="0.6" transform="rotate(-25,42,40)" />
      </svg>
    ),
  },
  BRAIN: {
    bg: "#fce4ec",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M50,88 C26,88 12,70 12,50 C12,36 18,26 30,22 C30,12 38,4 50,4 C62,4 70,12 70,22 C82,26 88,36 88,50 C88,70 74,88 50,88Z" fill="#f8bbd0" stroke="#e91e63" strokeWidth="2.5" />
        <path d="M50,10 L50,84" stroke="#e91e63" strokeWidth="2" opacity="0.3" />
        <path d="M24,36 Q36,28 50,36" fill="none" stroke="#e91e63" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
        <path d="M50,36 Q64,28 76,36" fill="none" stroke="#e91e63" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
        <path d="M26,52 Q38,44 50,52" fill="none" stroke="#e91e63" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
        <path d="M50,52 Q62,44 74,52" fill="none" stroke="#e91e63" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
        <path d="M28,68 Q40,60 50,68" fill="none" stroke="#e91e63" strokeWidth="2" opacity="0.25" strokeLinecap="round" />
        <path d="M50,68 Q60,60 72,68" fill="none" stroke="#e91e63" strokeWidth="2" opacity="0.25" strokeLinecap="round" />
      </svg>
    ),
  },
  HEART: {
    bg: "#ffebee",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <path d="M50,90 C16,68 2,44 14,26 C24,10 40,14 50,30 C60,14 76,10 86,26 C98,44 84,68 50,90Z" fill="#ef5350" stroke="#c62828" strokeWidth="2.5" />
        <path d="M40,18 Q34,4 40,2" stroke="#c62828" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M50,14 Q50,0 56,0" stroke="#c62828" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M60,18 Q66,6 62,2" stroke="#c62828" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="34" cy="34" rx="8" ry="6" fill="white" opacity="0.2" transform="rotate(-20,34,34)" />
      </svg>
    ),
  },
  MUSCLE: {
    bg: "#fff8e1",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="16" y="48" width="20" height="46" rx="10" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <rect x="10" y="8" width="18" height="48" rx="9" fill={SK} stroke={SKO} strokeWidth="2.5" transform="rotate(25, 20, 32)" />
        <circle cx="48" cy="14" r="14" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <path d="M42,10 L42,18 M48,8 L48,18 M54,10 L54,18" stroke={SKS} strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="36" cy="40" rx="16" ry="10" fill={SKS} stroke={SKO} strokeWidth="2" />
        <path d="M62,8 L72,4" stroke="#ffd54f" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M66,18 L76,14" stroke="#ffd54f" strokeWidth="3" strokeLinecap="round" />
        <path d="M64,30 L74,28" stroke="#ffd54f" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  NECK: {
    bg: "#e8f4fd",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="50" cy="22" r="18" fill={SK} stroke={SKO} strokeWidth="2" />
        <path d="M34,14 Q36,4 50,2 Q64,4 66,14" fill={HR} />
        <circle cx="44" cy="22" r="2" fill={D} />
        <circle cx="56" cy="22" r="2" fill={D} />
        <path d="M46,28 Q50,32 54,28" fill="none" stroke="#e88da0" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="38" y="38" width="24" height="26" rx="4" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <path d="M22,74 Q22,62 38,60 L62,60 Q78,62 78,74 L78,94 L22,94Z" fill="#81d4fa" stroke="#4fc3f7" strokeWidth="2" strokeLinejoin="round" />
        <path d="M38,40 L38,60" stroke={SKS} strokeWidth="1" opacity="0.3" />
        <path d="M62,40 L62,60" stroke={SKS} strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
  SHOULDER: {
    bg: "#e8f4fd",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="50" cy="18" r="14" fill={SK} stroke={SKO} strokeWidth="2" />
        <path d="M38,10 Q40,2 50,0 Q60,2 62,10" fill={HR} />
        <circle cx="45" cy="18" r="1.5" fill={D} />
        <circle cx="55" cy="18" r="1.5" fill={D} />
        <path d="M47,24 Q50,27 53,24" fill="none" stroke="#e88da0" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="44" y="30" width="12" height="10" rx="4" fill={SK} />
        <path d="M20,54 Q20,38 44,36 L56,36 Q80,38 80,54 L80,92 L20,92Z" fill="#81d4fa" stroke="#4fc3f7" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="20" cy="46" r="10" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <circle cx="80" cy="46" r="10" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <rect x="10" y="52" width="12" height="32" rx="6" fill={SK} stroke={SKO} strokeWidth="2" />
        <rect x="78" y="52" width="12" height="32" rx="6" fill={SK} stroke={SKO} strokeWidth="2" />
      </svg>
    ),
  },
  BACK: {
    bg: "#e8f4fd",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="50" cy="16" r="14" fill={SK} stroke={SKO} strokeWidth="2" />
        <path d="M36,16 Q36,4 50,2 Q64,4 64,16" fill={HR} />
        <path d="M26,34 L74,34 L78,90 L22,90Z" fill={SK} stroke={SKO} strokeWidth="2.5" strokeLinejoin="round" />
        <line x1="50" y1="34" x2="50" y2="86" stroke={SKS} strokeWidth="2.5" opacity="0.5" />
        <circle cx="50" cy="42" r="2.5" fill={SKS} />
        <circle cx="50" cy="52" r="2.5" fill={SKS} />
        <circle cx="50" cy="62" r="2.5" fill={SKS} />
        <circle cx="50" cy="72" r="2.5" fill={SKS} />
        <ellipse cx="38" cy="48" rx="8" ry="10" fill="none" stroke={SKS} strokeWidth="1.5" opacity="0.3" />
        <ellipse cx="62" cy="48" rx="8" ry="10" fill="none" stroke={SKS} strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
  },
  BELLY: {
    bg: "#fff8e1",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <ellipse cx="50" cy="50" rx="38" ry="40" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <circle cx="50" cy="50" r="6" fill={SKS} stroke={SKO} strokeWidth="2" />
        <path d="M48,48 Q46,50 48,52" fill="none" stroke={SKO} strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="38" cy="34" rx="10" ry="6" fill="white" opacity="0.15" transform="rotate(-15,38,34)" />
      </svg>
    ),
  },
  THUMB: {
    bg: "#e8f5e9",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="30" y="48" width="40" height="40" rx="12" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <path d="M34,48 Q34,38 44,38 Q52,38 52,48" fill={SK} stroke={SKO} strokeWidth="2" />
        <path d="M48,48 Q48,40 56,40 Q64,40 64,48" fill={SK} stroke={SKO} strokeWidth="2" />
        <rect x="56" y="4" width="20" height="52" rx="10" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <ellipse cx="66" cy="8" rx="7" ry="4" fill={SKS} stroke={SKO} strokeWidth="1.5" />
        <path d="M56,30 L76,30" stroke={SKS} strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
  },
  NAIL: {
    bg: "#fce4ec",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <rect x="26" y="24" width="48" height="68" rx="24" fill={SK} stroke={SKO} strokeWidth="2.5" />
        <path d="M26,62 L74,62" stroke={SKS} strokeWidth="1.5" opacity="0.3" />
        <rect x="28" y="8" width="44" height="30" rx="22" fill="#f48fb1" stroke="#e91e63" strokeWidth="2.5" />
        <path d="M40,18 Q50,10 60,18" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
        <circle cx="56" cy="28" r="2" fill="white" opacity="0.5" />
      </svg>
    ),
  },
  HAIR: {
    bg: "#efebe9",
    svg: (
      <svg viewBox="0 0 100 100" className="shape-svg">
        <circle cx="50" cy="60" r="22" fill={SK} stroke={SKO} strokeWidth="2" />
        <circle cx="42" cy="58" r="2" fill={D} />
        <circle cx="58" cy="58" r="2" fill={D} />
        <path d="M46,66 Q50,70 54,66" fill="none" stroke="#e88da0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16,54 Q18,6 50,2 Q82,6 84,54" fill={HR} stroke="#3e2723" strokeWidth="2" />
        <path d="M24,46 Q28,12 50,6 Q72,12 76,46" fill="#7a5230" />
        <path d="M18,54 Q14,68 16,82" stroke={HR} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M82,54 Q86,68 84,82" stroke={HR} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M24,52 Q20,66 22,78" stroke="#7a5230" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M76,52 Q80,66 78,78" stroke="#7a5230" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M28,50 Q32,24 46,10" fill="none" stroke="#3e2723" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <path d="M72,50 Q68,24 54,10" fill="none" stroke="#3e2723" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
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
    <div className="shape-image" style={{ background: part.bg, borderRadius: "50%" }}>
      {part.svg}
    </div>
  );
}
