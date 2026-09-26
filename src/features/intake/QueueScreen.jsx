import { QUEUE_ETA_STEPS } from '../../lib/constants'
import { useI18n } from '../../i18n/I18nProvider.jsx'

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
  const { t } = useI18n()
  return (
    <section className="animate-verdict-in mx-auto w-full max-w-3xl">
      <div className="rounded-2xl border border-amber-900/15 bg-[#faf6ee]/90 p-6 shadow-[0_20px_50px_-28px_rgba(80,60,20,0.35)] sm:p-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 text-xs text-slate-500 hover:text-slate-800"
        >
          {t('queue.back')}
        </button>
        <h2 className="font-display text-3xl font-semibold text-slate-900">
          {t('queue.title')}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{t('queue.lead')}</p>

        {queueStep < 0 ? (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                {t('queue.name')}
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
                {t('queue.email')}
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
                {t('queue.summary')}
              </label>
              <textarea
                rows={3}
                value={intakeDispute}
                onChange={(e) => setIntakeDispute(e.target.value)}
                className="w-full rounded-xl border border-amber-900/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-700/50 focus:ring-2 focus:ring-amber-700/20"
                placeholder={t('queue.placeholder')}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-5 py-4 font-semibold text-white hover:bg-slate-800"
            >
              {t('queue.join')}
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-800/25 bg-amber-100/80">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-amber-800 border-t-transparent" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                {t(`queue.eta.${queueStep}.label`)}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-slate-900">
                {t(`queue.eta.${queueStep}.detail`)}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {t('queue.hello', { name: intakeName || t('queue.party') })}
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
