import { QUEUE_ETA_STEPS } from '../../lib/constants'

export function QueueScreen({
  intakeName,
  setIntakeName,
  intakeEmail,
  setIntakeEmail,
  intakeDispute,
  setIntakeDispute,
  queueStep,
  onBack,
  onSubmit,
}) {
  return (
    <section className="animate-verdict-in mx-auto w-full max-w-3xl">
      <div className="rounded-2xl border border-amber-900/15 bg-[#faf6ee]/90 p-6 shadow-[0_20px_50px_-28px_rgba(80,60,20,0.35)] sm:p-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 text-xs text-slate-500 hover:text-slate-800"
        >
          ← Back
        </button>
        <h2 className="font-display text-3xl font-semibold text-slate-900">
          Live Court Queue
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter your details to join the waiting line.
        </p>

        {queueStep < 0 ? (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                Full name
              </label>
              <input
                required
                value={intakeName}
                onChange={(e) => setIntakeName(e.target.value)}
                className="w-full rounded-xl border border-amber-900/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-700/50 focus:ring-2 focus:ring-amber-700/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                Email
              </label>
              <input
                required
                type="email"
                value={intakeEmail}
                onChange={(e) => setIntakeEmail(e.target.value)}
                className="w-full rounded-xl border border-amber-900/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-700/50 focus:ring-2 focus:ring-amber-700/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                Brief dispute summary
              </label>
              <textarea
                rows={3}
                value={intakeDispute}
                onChange={(e) => setIntakeDispute(e.target.value)}
                className="w-full rounded-xl border border-amber-900/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-700/50 focus:ring-2 focus:ring-amber-700/20"
                placeholder="What is this hearing about?"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-5 py-4 font-semibold text-white hover:bg-slate-800"
            >
              Join Queue
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-800/25 bg-amber-100/80">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-amber-800 border-t-transparent" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                {QUEUE_ETA_STEPS[queueStep].label}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-slate-900">
                {QUEUE_ETA_STEPS[queueStep].detail}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Hello {intakeName || 'party'} — please keep this window open.
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-amber-900/10">
              <div
                className="h-full bg-amber-700 transition-all duration-700"
                style={{ width: `${QUEUE_ETA_STEPS[queueStep].progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
