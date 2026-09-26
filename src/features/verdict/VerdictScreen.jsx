import { useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider.jsx'

export function VerdictScreen({
  caseId,
  party1Name,
  party2Name,
  claimantText,
  defendantText,
  jurisdictionLabel,
  historyOnly,
  isAnalyzing,
  isSpeakingVerdict,
  verdictData,
  verdictError = '',
  humanReviewRequested = false,
  onRequestReview,
  onReplay,
  onRetry,
  onBack,
}) {
  const [showTranscripts, setShowTranscripts] = useState(false)
  const { t } = useI18n()

  return (
    <section className="animate-verdict-in space-y-6">
      <div className="flex flex-col gap-4 border-b border-amber-900/15 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
            {historyOnly ? t('verdict.saved') : t('verdict.decision')}
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold text-slate-900">
            {t('verdict.title', { id: caseId })}
          </h2>
          {verdictData?.engineLabel && (
            <p className="mt-2 text-xs text-slate-500">{verdictData.engineLabel}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onBack}
          className="border border-amber-900/20 bg-white/70 px-4 py-2 text-xs text-slate-600 transition hover:border-amber-700/35 hover:bg-amber-50 hover:text-slate-900"
        >
          {t('verdict.back')}
        </button>
      </div>

      {!isAnalyzing && verdictError && (
        <div className="rounded-2xl border border-red-200 bg-red-50/90 p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-red-800">
            {t('verdict.failed')}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-red-950/80">
            {verdictError}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="border border-red-800/25 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-950 transition hover:bg-red-100"
              >
                {t('verdict.retry')}
              </button>
            )}
            <button
              type="button"
              onClick={onBack}
              className="border border-amber-900/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:bg-amber-50"
            >
              {t('verdict.back')}
            </button>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex min-h-[14rem] flex-col items-center justify-center gap-3 rounded-2xl border border-amber-900/15 bg-[#faf6ee]/90 p-8 shadow-sm">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" />
          <p className="animate-status-pulse text-center text-sm text-slate-700">
            {t('verdict.reviewing', { venue: jurisdictionLabel })}
          </p>
        </div>
      )}

      {verdictData && (
        <>
          <div>
            <button
              type="button"
              onClick={() => setShowTranscripts((open) => !open)}
              className="rounded-lg border border-amber-900/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:border-amber-700/35 hover:bg-amber-50"
            >
              {showTranscripts ? t('verdict.hideTranscripts') : t('verdict.transcripts')}
            </button>
            {showTranscripts && (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-amber-900/15 bg-white/75 p-5 shadow-sm">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-sky-800">
                    {t('verdict.claimant', { name: party1Name })}
                  </h3>
                  {verdictData.disputeCategory && (
                    <p className="mb-2 text-[11px] uppercase tracking-wider text-slate-500">
                      {t('verdict.category', {
                        name: t(`cat.${verdictData.disputeCategory}`),
                      })}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {verdictData.aggregatedTestimony?.claimant || claimantText}
                  </p>
                  {verdictData.aggregatedTestimony?.claimantExhibits?.length > 0 && (
                    <p className="mt-3 text-xs text-slate-500">
                      {t('verdict.exhibits', {
                        list: verdictData.aggregatedTestimony.claimantExhibits.join(', '),
                      })}
                    </p>
                  )}
                </div>
                <div className="rounded-2xl border border-amber-900/15 bg-white/75 p-5 shadow-sm">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
                    {t('verdict.defendant', { name: party2Name })}
                  </h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {verdictData.aggregatedTestimony?.defendant || defendantText}
                  </p>
                  {verdictData.aggregatedTestimony?.defendantExhibits?.length > 0 && (
                    <p className="mt-3 text-xs text-slate-500">
                      {t('verdict.exhibits', {
                        list: verdictData.aggregatedTestimony.defendantExhibits.join(', '),
                      })}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-amber-900/15 bg-[#faf6ee]/90 p-6 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('verdict.summary')}
            </h3>
            <p className="text-base leading-relaxed text-slate-800">
              {verdictData.verdictSummary}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-900/15 bg-white/75 p-6 shadow-sm">
            {verdictData.outcome === 'dismissed' ? (
              <>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {t('verdict.finding')}
                </h3>
                <p className="text-base font-medium text-slate-800">
                  {t('verdict.dismissed')}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {t('verdict.dismissedNote', { name: party1Name })}
                </p>
              </>
            ) : (
              <>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {verdictData.disputeCategory === 'partnership_prize'
                    ? t('verdict.prizeSplit')
                    : t('verdict.faultSplit')}
                </h3>
                <div className="mb-3 flex justify-between text-sm font-medium">
                  <span className="text-sky-800">
                    {party1Name} {verdictData.faultSplit.claimant}%
                  </span>
                  <span className="text-amber-900">
                    {party2Name} {verdictData.faultSplit.defendant}%
                  </span>
                </div>
                <div className="flex h-4 w-full overflow-hidden rounded-full bg-amber-900/10">
                  <div
                    className="h-full bg-sky-600 transition-all duration-700 ease-out"
                    style={{ width: `${verdictData.faultSplit.claimant}%` }}
                  />
                  <div
                    className="h-full bg-amber-600 transition-all duration-700 ease-out"
                    style={{ width: `${verdictData.faultSplit.defendant}%` }}
                  />
                </div>
              </>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-amber-900/15 bg-white/75 p-6 shadow-sm">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('verdict.damages')}
              </h3>
              <p className="font-display text-2xl font-semibold text-amber-900">
                {verdictData.damagesAwarded}
              </p>
              {verdictData.verification?.money && (
                <p
                  className={`mt-2 text-xs font-medium ${
                    verdictData.verification.money.status === 'verified'
                      ? 'text-emerald-800'
                      : 'text-amber-800'
                  }`}
                >
                  {verdictData.verification.money.status === 'verified'
                    ? t('verdict.moneyOk')
                    : verdictData.verification.money.status === 'capped'
                      ? t('verdict.moneyCap')
                      : t('verdict.moneyMiss')}
                  {verdictData.verification.money.note
                    ? ` · ${verdictData.verification.money.note}`
                    : ''}
                </p>
              )}
              {verdictData.awardReason && (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {verdictData.awardReason}
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-amber-900/15 bg-white/75 p-6 shadow-sm">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('verdict.laws')}
              </h3>
              <ul className="space-y-3">
                {(
                  verdictData.lawsDetail ||
                  (verdictData.lawsCited || []).map((title) => ({ title }))
                ).map((law) => (
                  <li
                    key={law.title || law}
                    className="border-l-2 border-amber-700/50 pl-3 text-sm text-slate-700"
                  >
                    <p className="font-medium">
                      {law.title || law}
                      {law.verified && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                          {t('verdict.verified')}
                        </span>
                      )}
                    </p>
                    {law.note && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {law.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-amber-800/30 bg-amber-50/60 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              {t('verdict.voice')}
            </p>
            {isSpeakingVerdict ? (
              <p className="mt-3 animate-status-pulse text-sm font-medium text-amber-900">
                {t('verdict.reading')}
              </p>
            ) : (
              <p className="mt-3 text-sm text-slate-600">
                {t('verdict.ready', { id: caseId, venue: jurisdictionLabel })}
              </p>
            )}
            <p className="mt-3 text-sm italic leading-relaxed text-slate-700">
              &ldquo;{verdictData.spokenVerdict}&rdquo;
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={onReplay}
                disabled={isSpeakingVerdict}
                className="border border-amber-800/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-950 transition hover:bg-amber-100 disabled:opacity-50"
              >
                {isSpeakingVerdict ? t('verdict.speaking') : t('verdict.replay')}
              </button>
              {humanReviewRequested ? (
                <p className="px-3 py-2 text-xs font-medium text-emerald-800">
                  {t('verdict.reviewOn')}
                </p>
              ) : (
                onRequestReview && (
                  <button
                    type="button"
                    onClick={onRequestReview}
                    className="border border-amber-900/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:bg-amber-50"
                  >
                    {t('verdict.review')}
                  </button>
                )
              )}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
