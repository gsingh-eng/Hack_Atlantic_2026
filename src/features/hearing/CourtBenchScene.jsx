import { useI18n } from '../../i18n/I18nProvider.jsx'
import { getJurisdictionTheme } from '../../theme/jurisdictionThemes'

export function CourtBenchScene({
  jurisdiction = 'International',
  isListening = false,
  callPhase = 'idle',
  compact = false,
}) {
  const { t } = useI18n()
  const theme = getJurisdictionTheme(jurisdiction)

  const statusLabel =
    callPhase === 'live'
      ? t('bench.live')
      : callPhase === 'connecting'
        ? t('bench.connecting')
        : callPhase === 'ended'
          ? t('bench.ended')
          : t('bench.idle')

  const stageAspect = compact
    ? 'min-h-0 flex-1'
    : theme.id === 'India' || theme.id === 'Canada'
      ? 'aspect-[16/10] max-h-[min(42vh,420px)]'
      : 'aspect-[16/10] sm:aspect-[2/1]'

  const courtroomPosition = compact
    ? {
        India: 'center 36%',
        Canada: 'center 34%',
        US: 'center 28%',
        International: 'center center',
      }[theme.id]
    : theme.courtroomPosition

  const seatStyle = compact
    ? {
        India: {
          left: '50%',
          top: '52%',
          width: '28%',
          minWidth: '168px',
          maxWidth: '260px',
          transform: 'translate(-50%, -52%)',
        },
        Canada: {
          left: '50%',
          top: '50%',
          width: '26%',
          minWidth: '164px',
          maxWidth: '248px',
          transform: 'translate(-50%, -50%)',
        },
        US: {
          left: '50%',
          top: '50%',
          width: '26%',
          minWidth: '164px',
          maxWidth: '256px',
          transform: 'translate(-50%, -52%)',
        },
        International: {
          left: '50%',
          top: '50%',
          width: '26%',
          minWidth: '164px',
          maxWidth: '248px',
          transform: 'translate(-50%, -50%)',
        },
      }[theme.id]
    : {
        India: {
          left: '50%',
          top: '47%',
          width: '36%',
          minWidth: '128px',
          maxWidth: '200px',
          transform: 'translate(-50%, -68%)',
        },
        Canada: {
          left: '50%',
          top: '36%',
          width: '28%',
          minWidth: '118px',
          maxWidth: '176px',
          transform: 'translate(-50%, -58%)',
        },
        US: {
          left: '50%',
          top: '44%',
          width: '20%',
          minWidth: '115px',
          maxWidth: '210px',
          transform: 'translate(-50%, -58%)',
        },
        International: {
          left: '50%',
          top: '45%',
          width: '20%',
          minWidth: '115px',
          maxWidth: '200px',
          transform: 'translate(-50%, -50%)',
        },
      }[theme.id]

  return (
    <aside
      className={`relative flex flex-col overflow-hidden rounded-2xl border backdrop-blur-sm ${
        compact ? 'h-full' : ''
      } ${theme.panel}`}
    >
      <div className={`bg-gradient-to-r px-4 ${compact ? 'py-2' : 'px-5 py-3'} ${theme.benchBar}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
              The Bench · ElevenLabs Judge Agent
            </p>
            <h3
              className={`font-display font-semibold ${theme.accent} ${
                compact ? 'text-xl' : 'text-2xl'
              }`}
            >
              {theme.judgeName}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
              callPhase === 'live'
                ? 'animate-status-pulse border-red-400/50 bg-red-500/20 text-red-200'
                : callPhase === 'connecting'
                  ? 'border-amber-400/40 bg-amber-500/15 text-amber-200'
                  : callPhase === 'ended'
                    ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                    : 'border-white/15 bg-black/30 text-white/70'
            }`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div
        className={`relative mx-auto w-full overflow-hidden bg-black ${stageAspect}`}
      >
        {theme.courtroomImage ? (
          <img
            src={theme.courtroomImage}
            alt={`${theme.court} courtroom`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: courtroomPosition }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 50% 20%, rgba(245,158,11,0.2), transparent 50%), linear-gradient(180deg, #0f172a, #020617)',
            }}
          />
        )}

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50"
          aria-hidden="true"
        />

        {theme.avatarImage && (
          <div
            className={`absolute z-20 ${isListening ? theme.glowLive : ''}`}
            style={seatStyle}
          >
            {isListening && (
              <>
                <span
                  className={`pointer-events-none absolute -inset-4 rounded-full border-2 ${theme.ring} animate-radar-ping opacity-60`}
                />
                <span
                  className={`pointer-events-none absolute -inset-8 rounded-full border ${theme.ring} animate-radar-ping opacity-30`}
                  style={{ animationDelay: '0.55s' }}
                />
              </>
            )}

            <div
              className="relative overflow-hidden border-2 shadow-[0_22px_50px_rgba(0,0,0,0.75)]"
              style={{
                borderColor:
                  theme.id === 'Canada'
                    ? 'rgba(220, 38, 38, 0.35)'
                    : 'rgba(180, 83, 9, 0.4)',
                borderRadius:
                  theme.id === 'India' || theme.id === 'Canada'
                    ? '42% 42% 18% 18% / 34% 34% 18% 18%'
                    : '1rem',
              }}
            >
              <img
                src={theme.avatarImage}
                alt={theme.judgeName}
                className="block aspect-[3/4] w-full object-cover"
                style={{ objectPosition: theme.avatarObjectPosition }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            </div>

            <div className="mx-auto mt-2 max-w-[15rem] rounded-md border border-yellow-600/40 bg-black/75 px-2 py-1.5 text-center shadow-lg backdrop-blur-sm">
              <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-amber-100">
                {theme.judgeName}
              </p>
              <p className="truncate text-[9px] text-white/60">{theme.title}</p>
            </div>
          </div>
        )}

        {!theme.avatarImage && (
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className={`font-display text-3xl ${theme.accent}`}>⚖️</p>
            <p className="mt-2 text-sm text-white/70">{theme.court}</p>
          </div>
        )}
      </div>

      {!compact && (
        <div className="border-t border-white/10 px-5 py-3">
          <p className="text-center text-sm text-white/65">
            {isListening
              ? `${theme.judgeName} is on the line — speak your testimony.`
              : callPhase === 'ended'
                ? 'Hearing paused. Step down when ready to submit.'
                : `Address the bench at ${theme.court}.`}
          </p>
        </div>
      )}
    </aside>
  )
}
