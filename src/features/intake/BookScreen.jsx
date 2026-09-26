import { useI18n } from '../../i18n/I18nProvider.jsx'

export function BookScreen({
  bookingDays,
  selectedDayKey,
  setSelectedDayKey,
  selectedSlot,
  setSelectedSlot,
  intakeName,
  setIntakeName,
  intakeEmail,
  setIntakeEmail,
  intakeDispute,
  setIntakeDispute,
  bookingConfirmed,
  caseId,
  onBack,
  onSubmit,
  onContinueSetup,
}) {
  const { t } = useI18n()
  return (
    <section className="animate-verdict-in w-full">
      <div className="rounded-2xl border border-amber-900/15 bg-[#faf6ee]/90 p-6 shadow-[0_20px_50px_-28px_rgba(80,60,20,0.35)] sm:p-8 lg:p-10">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 text-xs text-slate-500 hover:text-slate-800"
        >
          {t('queue.back')}
        </button>
        <h2 className="font-display text-3xl font-semibold text-slate-900 lg:text-4xl">
          {t('book.title')}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{t('book.lead')}</p>

        {!bookingConfirmed ? (
          <form
            onSubmit={onSubmit}
            className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('book.days')}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {bookingDays.map((day) => (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => {
                      setSelectedDayKey(day.key)
                      setSelectedSlot('')
                    }}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                      selectedDayKey === day.key
                        ? 'border-amber-700/50 bg-amber-100 text-amber-950'
                        : 'border-amber-900/15 bg-white/80 text-slate-700 hover:border-amber-700/30'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>

              <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('book.slots')}
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  bookingDays.find((d) => d.key === selectedDayKey)?.slots ||
                  []
                ).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      selectedSlot === slot
                        ? 'border-emerald-700/40 bg-emerald-50 text-emerald-900'
                        : 'border-amber-900/15 bg-white/80 text-slate-700 hover:border-amber-700/30'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-amber-900/15 bg-white/75 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                {t('book.details')}
              </p>
              <input
                required
                placeholder={t('book.name')}
                value={intakeName}
                onChange={(e) => setIntakeName(e.target.value)}
                className="w-full rounded-xl border border-amber-900/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-700/50 focus:ring-2 focus:ring-amber-700/20"
              />
              <input
                required
                type="email"
                placeholder={t('book.email')}
                value={intakeEmail}
                onChange={(e) => setIntakeEmail(e.target.value)}
                className="w-full rounded-xl border border-amber-900/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-700/50 focus:ring-2 focus:ring-amber-700/20"
              />
              <textarea
                rows={3}
                placeholder={t('book.summary')}
                value={intakeDispute}
                onChange={(e) => setIntakeDispute(e.target.value)}
                className="w-full rounded-xl border border-amber-900/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-700/50 focus:ring-2 focus:ring-amber-700/20"
              />
              <button
                type="submit"
                disabled={!selectedDayKey || !selectedSlot}
                className="w-full rounded-xl bg-slate-900 px-5 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40"
              >
                {t('book.confirm')}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 max-w-xl rounded-2xl border border-emerald-700/25 bg-emerald-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">
              {t('book.confirmed')}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">
              {t('book.booked')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-emerald-900/80">
              {t('header.caseId', { id: caseId })}
              <br />
              {t('docket.atTime', {
                day: bookingConfirmed.dayLabel,
                slot: bookingConfirmed.slot,
              })}
              <br />
              {t('book.sent', { email: bookingConfirmed.email })}
              <br />
              {t('book.saved')}
            </p>
            <button
              type="button"
              onClick={onContinueSetup}
              className="mt-6 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              {t('book.continue')}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
