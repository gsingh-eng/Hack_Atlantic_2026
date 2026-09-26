export function AppHeader({
  caseId,
  jurisdiction,
  stageLabel,
  notification,
  light = false,
  compact = false,
}) {
  return (
    <header className={`${compact ? 'mb-2 space-y-2' : 'mb-6 space-y-3'}`}>
      {notification && (
        <div
          className={`animate-verdict-in flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            light
              ? 'border-emerald-600/30 bg-emerald-50 text-emerald-900'
              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
          }`}
        >
          <span className="mt-0.5 text-base" aria-hidden="true">
            ✓
          </span>
          <div>
            <p className={`font-semibold ${light ? 'text-emerald-800' : 'text-emerald-200'}`}>
              {notification.title}
            </p>
            <p className={`mt-0.5 ${light ? 'text-emerald-700/80' : 'text-emerald-100/80'}`}>
              {notification.body}
            </p>
          </div>
        </div>
      )}
      <div
        className={`flex flex-col gap-3 border-b sm:flex-row sm:items-center sm:justify-between ${
          compact ? 'pb-2' : 'gap-4 pb-5'
        } ${light ? 'border-amber-900/15' : 'border-slate-800'}`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl border text-2xl ${
              light
                ? 'border-amber-700/35 bg-white/70 text-amber-700 shadow-sm'
                : 'border-amber-500/40 bg-slate-900 text-amber-500'
            }`}
            aria-hidden="true"
          >
            ⚖️
          </div>
          <div>
            <h1
              className={`font-display text-3xl font-semibold tracking-[0.12em] sm:text-4xl ${
                light ? 'text-slate-900' : 'text-white'
              }`}
            >
              VERITAS AI
            </h1>
            <p className={`mt-0.5 text-sm ${light ? 'text-slate-600' : 'text-slate-400'}`}>
              The AI Arbitrator
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {caseId && (
            <span
              className={`border px-3 py-1.5 font-mono text-xs ${
                light
                  ? 'border-amber-900/20 bg-white/70 text-slate-700'
                  : 'border-slate-700 bg-slate-900/80 text-slate-300'
              }`}
            >
              Case ID: {caseId}
            </span>
          )}
          {jurisdiction && (
            <span
              className={`border px-3 py-1.5 text-xs ${
                light
                  ? 'border-amber-900/20 bg-white/70 text-slate-600'
                  : 'border-slate-700 bg-slate-900/80 text-slate-400'
              }`}
            >
              {jurisdiction}
            </span>
          )}
          <span
            className={`inline-flex items-center border px-3 py-1.5 text-xs font-medium uppercase tracking-widest ${
              light
                ? 'border-amber-700/30 bg-amber-100/80 text-amber-900'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
            }`}
          >
            {stageLabel}
          </span>
        </div>
      </div>
    </header>
  )
}
