import { useI18n } from '../../i18n/I18nProvider.jsx'
import { CourtBenchScene } from './CourtBenchScene'
import { PartyStand } from './PartyStand'

export function DualCourtroom({
  jurisdiction,
  caseId,
  party1Name,
  party2Name,
  floor,
  claimantDone,
  defendantDone,
  isSessionActive,
  isConnecting,
  isStandOpen = false,
  activeParty,
  liveMediaMode = 'mic',
  livePreviewStream = null,
  onStartMic,
  onStartVideo,
  onStopStand,
  theme,
  claimantExhibits = [],
  defendantExhibits = [],
  onAddClaimantFiles,
  onAddDefendantFiles,
  onRemoveClaimantFile,
  onRemoveDefendantFile,
}) {
  const { t } = useI18n()
  const floorLabel =
    floor === 'claimant'
      ? t('hearing.floor', { name: party1Name })
      : floor === 'defendant'
        ? t('hearing.floor', { name: party2Name })
        : floor === 'closed'
          ? t('hearing.closed')
          : t('hearing.opening')

  return (
    <div className="animate-verdict-in relative flex h-[calc(100dvh-7.25rem)] min-h-[36rem] flex-col overflow-hidden rounded-2xl border border-white/15 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.55)]">
      {theme.courtroomImage && (
        <div
          className="pointer-events-none absolute inset-0 scale-105 bg-cover opacity-[0.38] blur-[0.5px]"
          style={{
            backgroundImage: `url(${theme.courtroomImage})`,
            backgroundPosition: theme.courtroomPosition,
          }}
          aria-hidden="true"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-900/55 to-slate-950/70" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-2 p-2 sm:p-3">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${theme.venueChip}`}
          >
            {theme.court}
          </span>
          <span className="rounded-full border border-white/20 bg-slate-950/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/85">
            {floorLabel}
          </span>
          <span className="font-mono text-[11px] text-white/50">{caseId}</span>
        </div>

        <div className="mx-auto min-h-[28vh] w-full max-w-6xl flex-1">
          <CourtBenchScene
            compact
            jurisdiction={jurisdiction}
            isListening={isSessionActive}
            callPhase={
              isConnecting
                ? 'connecting'
                : isSessionActive
                  ? 'live'
                  : floor === 'closed'
                    ? 'ended'
                    : 'idle'
            }
          />
        </div>

        <p className="shrink-0 text-center text-[10px] uppercase tracking-[0.2em] text-white/45">
          {t('hearing.bothFace')}
        </p>

        <div className="grid h-[min(36vh,340px)] shrink-0 gap-3 lg:grid-cols-2">
          <PartyStand
            compact
            side="left"
            partyName={party1Name}
            roleLabel={t('hearing.role1')}
            hasFloor={floor === 'claimant'}
            isLive={isStandOpen && activeParty === 'claimant'}
            isConnecting={isConnecting && activeParty === 'claimant'}
            isOnHold={floor !== 'claimant' && floor !== 'closed'}
            turnComplete={claimantDone}
            mediaMode={activeParty === 'claimant' ? liveMediaMode : 'mic'}
            previewStream={activeParty === 'claimant' ? livePreviewStream : null}
            onStartMic={() => onStartMic('claimant')}
            onStartVideo={() => onStartVideo('claimant')}
            onStop={() => onStopStand('claimant')}
            theme={theme}
            exhibits={claimantExhibits}
            onAddFiles={onAddClaimantFiles}
            onRemoveFile={onRemoveClaimantFile}
          />
          <PartyStand
            compact
            side="right"
            partyName={party2Name}
            roleLabel={t('hearing.role2')}
            hasFloor={floor === 'defendant'}
            isLive={isStandOpen && activeParty === 'defendant'}
            isConnecting={isConnecting && activeParty === 'defendant'}
            isOnHold={floor !== 'defendant' && floor !== 'closed'}
            turnComplete={defendantDone}
            mediaMode={activeParty === 'defendant' ? liveMediaMode : 'mic'}
            previewStream={activeParty === 'defendant' ? livePreviewStream : null}
            onStartMic={() => onStartMic('defendant')}
            onStartVideo={() => onStartVideo('defendant')}
            onStop={() => onStopStand('defendant')}
            theme={theme}
            exhibits={defendantExhibits}
            onAddFiles={onAddDefendantFiles}
            onRemoveFile={onRemoveDefendantFile}
          />
        </div>
      </div>
    </div>
  )
}
