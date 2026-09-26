import { useEffect, useRef } from 'react'

function CameraPreview({ stream }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const node = videoRef.current
    if (!node) return undefined
    node.srcObject = stream || null
    return () => {
      node.srcObject = null
    }
  }, [stream])

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="h-full w-full -scale-x-100 object-cover"
    />
  )
}

export function PartyStand({
  side,
  partyName,
  roleLabel,
  hasFloor,
  isLive,
  isConnecting,
  isOnHold,
  turnComplete,
  mediaMode = 'mic',
  previewStream = null,
  onStartMic,
  onStartVideo,
  onStop,
  theme,
  compact = false,
  exhibits = [],
  onAddFiles,
  onRemoveFile,
}) {
  const isLeft = side === 'left'
  const canStart = hasFloor && !isLive && !isConnecting && !isOnHold
  const showVideo = mediaMode === 'video' && previewStream

  return (
    <section
      className={`flex min-h-0 flex-col rounded-2xl border backdrop-blur-md ${
        compact ? 'p-3 sm:p-3.5' : 'p-4 sm:p-5'
      } ${theme.panel} ${
        hasFloor && !isOnHold
          ? 'ring-2 ring-offset-2 ring-offset-transparent ' +
            (isLeft ? 'ring-sky-400/50' : 'ring-amber-400/50')
          : ''
      } ${isOnHold ? 'opacity-75' : ''}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p
            className={`text-[10px] font-semibold uppercase tracking-widest ${
              isLeft ? 'text-sky-300' : 'text-amber-300'
            }`}
          >
            {roleLabel}
          </p>
          <h3
            className={`font-display font-semibold text-white ${
              compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
            }`}
          >
            {partyName}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            isLive
              ? 'animate-status-pulse border-red-400/50 bg-red-500/20 text-red-200'
              : isOnHold
                ? 'border-white/10 bg-black/40 text-white/40'
                : hasFloor
                  ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                  : turnComplete
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-white/10 text-white/45'
          }`}
        >
          {isLive
            ? mediaMode === 'video'
              ? '● Video'
              : '● Mic'
            : isOnHold
              ? 'On hold'
              : hasFloor
                ? 'Your turn'
                : turnComplete
                  ? 'Heard'
                  : 'Waiting'}
        </span>
      </div>

      <div className="mb-2 flex min-h-0 flex-1 items-center justify-center">
        <div className="relative aspect-[3/2] h-full max-h-[min(26vh,220px)] w-auto min-w-[16rem] max-w-[min(26rem,100%)] overflow-hidden rounded-xl border border-white/10 bg-slate-950/50">
          {showVideo ? <CameraPreview stream={previewStream} /> : null}

          {!showVideo && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
              {isLive && mediaMode === 'mic' ? (
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-2xl text-white shadow-[0_0_24px_rgba(220,38,38,0.45)]">
                  <span className="absolute inset-0 animate-radar-ping rounded-full border-2 border-red-300/50" />
                  <span className="relative z-10">🎙️</span>
                </span>
              ) : !canStart ? (
                <p className="text-3xl opacity-50">{isOnHold ? '⏸' : '👤'}</p>
              ) : null}

              {canStart ? (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={onStartMic}
                    className="rounded-lg border border-white/15 bg-slate-950/55 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/85 transition hover:border-white/30"
                  >
                    Mic only
                  </button>
                  <button
                    type="button"
                    onClick={onStartVideo}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white transition hover:bg-emerald-500"
                  >
                    Start video
                  </button>
                </div>
              ) : (
                <p className="text-center text-sm text-white/70">
                  {isOnHold
                    ? 'Wait for the judge'
                    : isConnecting
                      ? 'Connecting…'
                      : isLive
                        ? 'Speaking — tap End when finished'
                        : turnComplete
                          ? 'Testimony heard'
                          : 'Wait for the judge'}
                </p>
              )}

              {isLive && mediaMode === 'mic' ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                >
                  End
                </button>
              ) : null}
            </div>
          )}

          {showVideo && isLive ? (
            <button
              type="button"
              onClick={onStop}
              className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white"
            >
              End
            </button>
          ) : null}
        </div>
      </div>

      <div className="shrink-0">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/45">
          Exhibits for the bench
        </p>
        <div className="flex items-center gap-2">
          <label className="inline-flex cursor-pointer items-center rounded-lg border border-white/15 bg-slate-950/50 px-2.5 py-1 text-[11px] font-medium text-white/80 transition hover:border-white/30 hover:bg-slate-900/70">
            Attach file
            <input
              type="file"
              accept="image/*,.pdf,.txt,.png,.jpg,.jpeg,.webp"
              multiple
              className="sr-only"
              onChange={(event) => {
                onAddFiles?.(event.target.files)
                event.target.value = ''
              }}
            />
          </label>
          <p className="truncate text-[10px] text-white/40">
            Receipt, note, or photo
          </p>
        </div>
        {exhibits.length > 0 && (
          <ul className="mt-1.5 max-h-14 space-y-1 overflow-auto">
            {exhibits.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-md border border-white/10 bg-slate-950/35 px-2 py-1 text-[11px] text-white/80"
              >
                <span className="truncate">{item.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveFile?.(item.id)}
                  className="shrink-0 text-white/40 hover:text-white/80"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
