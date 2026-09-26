import { DISPUTE_CATEGORIES } from '../../lib/judgment/analyzeDispute'
import { CANADIAN_PROVINCES, JURISDICTIONS, LANGUAGES } from '../../lib/constants'
import { useI18n } from '../../i18n/I18nProvider.jsx'
import { CourtBenchScene } from '../hearing/CourtBenchScene'

export function SetupScreen({
  jurisdiction,
  setJurisdiction,
  canadaProvince,
  setCanadaProvince,
  disputeCategory,
  setDisputeCategory,
  party1Name,
  setParty1Name,
  party2Name,
  setParty2Name,
  language,
  setLanguage,
  caseMode,
  setCaseMode,
  caseIdInput,
  setCaseIdInput,
  onSubmit,
}) {
  const { t } = useI18n()
  return (
    <section className="animate-verdict-in w-full">
      <div className="rounded-2xl border border-amber-900/15 bg-[#faf6ee]/90 p-6 shadow-[0_20px_50px_-28px_rgba(80,60,20,0.35)] sm:p-8 lg:p-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
            {t('setup.kicker')}
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-slate-900 lg:text-5xl">
            {t('setup.title')}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">{t('setup.lead')}</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-3 block text-xs font-semibold tracking-wider text-slate-500">
                {t('setup.jurisdiction')}
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {JURISDICTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setJurisdiction(option)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      jurisdiction === option
                        ? 'border-amber-700/50 bg-amber-100 text-amber-950'
                        : 'border-amber-900/15 bg-white/80 text-slate-700 hover:border-amber-700/30 hover:bg-amber-50/80'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {jurisdiction === 'Canada' && (
                <div className="mt-4">
                  <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-500">
                    {t('setup.province')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CANADIAN_PROVINCES.map((province) => (
                      <button
                        key={province}
                        type="button"
                        onClick={() => setCanadaProvince(province)}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                          canadaProvince === province
                            ? 'border-amber-700/50 bg-amber-100 text-amber-950'
                            : 'border-amber-900/15 bg-white/80 text-slate-600 hover:border-amber-700/30 hover:bg-amber-50/80'
                        }`}
                      >
                        {province}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="mb-3 block text-xs font-semibold tracking-wider text-slate-500">
                {t('setup.category')}
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {DISPUTE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setDisputeCategory(cat.id)}
                    className={`rounded-xl border px-3 py-3 text-left transition ${
                      disputeCategory === cat.id
                        ? 'border-amber-700/50 bg-amber-100 text-slate-900'
                        : 'border-amber-900/15 bg-white/80 text-slate-700 hover:border-amber-700/30 hover:bg-amber-50/80'
                    }`}
                  >
                    <span className="block text-sm font-medium">{t(`cat.${cat.id}`)}</span>
                    <span
                      className={`mt-1 block text-[11px] ${
                        disputeCategory === cat.id
                          ? 'text-amber-900/70'
                          : 'text-slate-500'
                      }`}
                    >
                      {t(`cat.${cat.id}.blurb`)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="party1"
                  className="mb-2 block text-xs font-semibold tracking-wider text-sky-800"
                >
                  {t('setup.party1')}
                </label>
                <input
                  id="party1"
                  type="text"
                  value={party1Name}
                  onChange={(e) => setParty1Name(e.target.value)}
                  className="w-full rounded-xl border border-amber-900/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-700/20 placeholder:text-slate-400 focus:border-sky-600/50 focus:ring-2"
                />
              </div>
              <div>
                <label
                  htmlFor="party2"
                  className="mb-2 block text-xs font-semibold tracking-wider text-amber-800"
                >
                  {t('setup.party2')}
                </label>
                <input
                  id="party2"
                  type="text"
                  value={party2Name}
                  onChange={(e) => setParty2Name(e.target.value)}
                  className="w-full rounded-xl border border-amber-900/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-amber-700/20 placeholder:text-slate-400 focus:border-amber-700/50 focus:ring-2"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="language"
                className="mb-2 block text-xs font-semibold tracking-wider text-slate-500"
              >
                {t('setup.recordLang')}
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-amber-900/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-700/50 focus:ring-2 focus:ring-amber-700/20"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-xs font-semibold tracking-wider text-slate-500">
                {t('setup.access')}
              </label>
              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setCaseMode('create')}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    caseMode === 'create'
                      ? 'border-amber-700/50 bg-amber-100 text-amber-950'
                      : 'border-amber-900/15 bg-white/80 text-slate-700 hover:border-amber-700/30'
                  }`}
                >
                  {t('setup.create')}
                </button>
                <button
                  type="button"
                  onClick={() => setCaseMode('join')}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    caseMode === 'join'
                      ? 'border-amber-700/50 bg-amber-100 text-amber-950'
                      : 'border-amber-900/15 bg-white/80 text-slate-700 hover:border-amber-700/30'
                  }`}
                >
                  {t('setup.join')}
                </button>
              </div>
              {caseMode === 'join' && (
                <input
                  type="text"
                  value={caseIdInput}
                  onChange={(e) => setCaseIdInput(e.target.value)}
                  placeholder="e.g. VER-A1B2C3"
                  className="w-full rounded-xl border border-amber-900/20 bg-white px-4 py-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-700/50 focus:ring-2 focus:ring-amber-700/20"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-5 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
            >
              {t('setup.enter')}
            </button>
          </div>

          <div className="min-h-[28rem] overflow-hidden rounded-2xl border border-amber-900/15 shadow-sm lg:sticky lg:top-6">
            <CourtBenchScene jurisdiction={jurisdiction} callPhase="idle" />
          </div>
        </form>
      </div>
    </section>
  )
}
