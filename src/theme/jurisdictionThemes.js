import indiaJudge from '../assets/jurisdictions/india-judge.png'
import indiaCourtroom from '../assets/jurisdictions/india-courtroom.png'
import canadaJudge from '../assets/jurisdictions/canada-judge.png'
import canadaCourtroom from '../assets/jurisdictions/canada-courtroom.png'
import usJudge from '../assets/jurisdictions/us-judge.png'

export const JURISDICTION_THEMES = {
  India: {
    id: 'India',
    judgeName: 'Judge Veritas',
    title: 'Honorable Magistrate',
    court: 'High Court of India · Lok Adalat',
    accent: 'text-orange-300',
    badge: 'border-orange-500/40 bg-orange-500/15 text-orange-200',
    panel:
      'border-amber-800/40 bg-[#2a1f16]/78 shadow-[0_16px_40px_rgba(15,23,42,0.35)]',
    benchBar: 'from-amber-950 via-orange-950/70 to-amber-950',
    ring: 'border-orange-400/70',
    glowLive: 'shadow-[0_0_36px_rgba(251,146,60,0.35)]',
    submitBtn: 'bg-orange-500 hover:bg-orange-400 text-slate-950',
    venueChip: 'border-orange-400/35 bg-orange-500/12 text-orange-100',
    avatarImage: indiaJudge,
    courtroomImage: indiaCourtroom,
    avatarObjectPosition: 'center 12%',
    courtroomPosition: 'center center',
    isAbstract: false,
  },
  Canada: {
    id: 'Canada',
    judgeName: 'Judge Veritas',
    title: 'Presiding Justice',
    court: 'Superior Court of Justice · Canada',
    accent: 'text-red-300',
    badge: 'border-red-500/40 bg-red-500/15 text-red-200',
    panel:
      'border-stone-600/45 bg-[#1c1917]/78 shadow-[0_16px_40px_rgba(15,23,42,0.35)]',
    benchBar: 'from-stone-900 via-red-950/40 to-stone-900',
    ring: 'border-red-400/70',
    glowLive: 'shadow-[0_0_36px_rgba(248,113,113,0.32)]',
    submitBtn: 'bg-red-600 hover:bg-red-500 text-white',
    venueChip: 'border-red-400/35 bg-red-500/12 text-red-100',
    avatarImage: canadaJudge,
    courtroomImage: canadaCourtroom,
    avatarObjectPosition: 'center 18%',
    courtroomPosition: 'center center',
    isAbstract: false,
  },
  US: {
    id: 'US',
    judgeName: 'Judge Adam Levy',
    title: 'Honorable Magistrate',
    court: 'Federal Circuit Court of the United States',
    accent: 'text-sky-300',
    badge: 'border-sky-500/40 bg-sky-500/15 text-sky-200',
    panel:
      'border-slate-500/40 bg-[#1e293b]/80 shadow-[0_16px_40px_rgba(15,23,42,0.35)]',
    benchBar: 'from-slate-900 via-blue-950/50 to-slate-900',
    ring: 'border-sky-400/70',
    glowLive: 'shadow-[0_0_36px_rgba(56,189,248,0.32)]',
    submitBtn: 'bg-sky-500 hover:bg-sky-400 text-slate-950',
    venueChip: 'border-sky-400/35 bg-sky-500/12 text-sky-100',
    avatarImage: usJudge,
    courtroomImage: usJudge,
    avatarObjectPosition: 'center 18%',
    courtroomPosition: 'center 25%',
    isAbstract: false,
  },
  International: {
    id: 'International',
    judgeName: 'Judge Veritas',
    title: 'Autonomous Arbitrator',
    court: 'International Micro-Claims Tribunal',
    accent: 'text-amber-300',
    badge: 'border-amber-500/40 bg-amber-500/15 text-amber-200',
    panel:
      'border-slate-500/40 bg-[#1e293b]/80 shadow-[0_16px_40px_rgba(15,23,42,0.35)]',
    benchBar: 'from-slate-900 via-amber-950/35 to-slate-900',
    ring: 'border-amber-400/70',
    glowLive: 'shadow-[0_0_36px_rgba(245,158,11,0.35)]',
    submitBtn: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    venueChip: 'border-amber-400/35 bg-amber-500/12 text-amber-100',
    avatarImage: null,
    courtroomImage: null,
    avatarObjectPosition: 'center',
    courtroomPosition: 'center',
    isAbstract: true,
  },
}

export function getJurisdictionTheme(jurisdiction) {
  return JURISDICTION_THEMES[jurisdiction] || JURISDICTION_THEMES.International
}
