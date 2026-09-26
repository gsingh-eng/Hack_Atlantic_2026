export function AppHeader({ caseId, jurisdiction, stageLabel, notification }) {
  return (
    <header className="mb-6 space-y-3">
      {notification && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-600/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <span className="mt-0.5 text-base" aria-hidden="true">
            ✓
          </span>
          <div>
            <p className="font-semibold text-emerald-800">{notification.title}</p>
            <p className="mt-0.5 text-emerald-700/80">{notification.body}</p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4 border-b border-amber-900/15 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-700/35 bg-white/70 text-2xl text-amber-700 shadow-sm"
            aria-hidden="true"
          >
            ⚖️
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-[0.12em] text-slate-900 sm:text-4xl">
              VERITAS AI
            </h1>
            <p className="mt-0.5 text-sm text-slate-600">The AI Arbitrator</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {caseId && (
            <span className="border border-amber-900/20 bg-white/70 px-3 py-1.5 font-mono text-xs text-slate-700">
              Case ID: {caseId}
            </span>
          )}
          {jurisdiction && (
            <span className="border border-amber-900/20 bg-white/70 px-3 py-1.5 text-xs text-slate-600">
              {jurisdiction}
            </span>
          )}
          <span className="inline-flex items-center border border-amber-700/30 bg-amber-100/80 px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-amber-900">
            {stageLabel}
          </span>
        </div>
      </div>
    </header>
  )
}
