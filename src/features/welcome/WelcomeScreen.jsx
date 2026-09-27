import { useRef } from 'react'
import ladyJustice from '../../assets/lady-justice.png'
import { CASE_STATUS } from '../../lib/cases/caseStore'
import { useI18n } from '../../i18n/I18nProvider.jsx'
import { WelcomeDocket } from './WelcomeDocket'
import { TrainingCongrats, TrainingTour, useTrainingTour } from './training'

export function WelcomeScreen({
  entryPanel,
  setEntryPanel,
  docketCases,
  caseIdInput,
  setCaseIdInput,
  onOpenCase,
  onCreateNew,
  onJoinQueue,
  onBookSlot,
}) {
  const heardCases = docketCases.filter((c) => c.status === CASE_STATUS.heard)
  const queueRef = useRef(null)
  const bookRef = useRef(null)
  const resumeRef = useRef(null)
  const historyRef = useRef(null)
  const tour = useTrainingTour()
  const { t } = useI18n()

  const startTraining = () => {
    setEntryPanel(null)
    tour.start()
  }

  return (
    <section className="animate-verdict-in flex w-full flex-col gap-5">
      {tour.showCongrats && <TrainingCongrats onDismiss={tour.dismissBanner} />}

      <div className="relative overflow-hidden rounded-2xl border border-amber-900/15 bg-[#faf6ee]/90 shadow-[0_20px_50px_-28px_rgba(80,60,20,0.35)]">
        <img
          src={ladyJustice}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-6%] right-[-6%] hidden h-[92%] w-auto max-w-[56%] select-none object-contain object-right-bottom opacity-[0.08] sm:block lg:opacity-[0.1]"
        />
        <div className="relative z-10 p-6 pb-28 sm:p-8 sm:pb-32 lg:p-10 lg:pb-36">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 pt-1 text-xs font-semibold uppercase tracking-widest text-amber-800">
              {t('welcome.kicker')}
            </p>
            <div className="relative z-20 flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => (tour.active ? tour.skip() : startTraining())}
                className={`relative rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
                  tour.active
                    ? 'border-amber-800/40 bg-amber-100 text-amber-950'
                    : 'border-amber-900/20 bg-white/90 text-slate-700 hover:border-amber-700/40 hover:bg-amber-50'
                }`}
              >
                {tour.active ? t('welcome.exitTraining') : t('welcome.training')}
                {!tour.completed && !tour.active && (
                  <span
                    className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-500"
                    aria-hidden="true"
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() =>
                  setEntryPanel((prev) => (prev === 'help' ? null : 'help'))
                }
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
                  entryPanel === 'help'
                    ? 'border-amber-800/40 bg-amber-100 text-amber-950'
                    : 'border-amber-900/20 bg-white/90 text-slate-700 hover:border-amber-700/40 hover:bg-amber-50'
                }`}
              >
                {entryPanel === 'help' ? t('welcome.closeHelp') : t('welcome.help')}
              </button>
            </div>
          </div>
          <div className="mt-2 max-w-2xl pr-2">
            <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {t('welcome.title')}
            </h2>
            <p className="mt-3 text-base text-slate-600">{t('welcome.lead')}</p>
          </div>

          {entryPanel === 'help' && (
            <div className="mt-6 grid gap-4 rounded-xl border border-amber-900/12 bg-white/70 p-5 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-800">
                  {t('welcome.help.flow')}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {t('welcome.help.flowBody')}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-800">
                  {t('welcome.help.bring')}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {t('welcome.help.bringBody')}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-800">
                  {t('welcome.help.demo')}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {t('welcome.help.demoBody')}
                </p>
              </div>
            </div>
          )}

          {entryPanel === 'resume' && (
            <WelcomeDocket
              cases={docketCases}
              caseIdInput={caseIdInput}
              onCaseIdInput={setCaseIdInput}
              onOpenCase={onOpenCase}
              onCreateNew={onCreateNew}
              onClose={() => setEntryPanel(null)}
            />
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <button
              ref={queueRef}
              type="button"
              onClick={onJoinQueue}
              className="group rounded-xl border border-amber-900/15 bg-white/80 p-9 text-left shadow-sm transition hover:border-sky-700/35 hover:bg-sky-50/60"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-700">
                {t('welcome.fastest')}
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold text-slate-900 group-hover:text-sky-900">
                {t('welcome.queueTitle')}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {t('welcome.queueBody')}
              </p>
              <span className="mt-8 inline-block text-sm font-medium text-sky-800 group-hover:underline">
                {t('welcome.queueCta')}
              </span>
            </button>

            <button
              ref={bookRef}
              type="button"
              onClick={onBookSlot}
              className="group rounded-xl border border-amber-900/15 bg-white/80 p-9 text-left shadow-sm transition hover:border-amber-700/40 hover:bg-amber-50/80"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                {t('welcome.scheduled')}
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold text-slate-900 group-hover:text-amber-950">
                {t('welcome.bookTitle')}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {t('welcome.bookBody')}
              </p>
              <span className="mt-8 inline-block text-sm font-medium text-amber-900 group-hover:underline">
                {t('welcome.bookCta')}
              </span>
            </button>

            <button
              ref={resumeRef}
              type="button"
              onClick={() =>
                setEntryPanel((prev) => (prev === 'resume' ? null : 'resume'))
              }
              className={`group rounded-xl border p-9 text-left shadow-sm transition ${
                entryPanel === 'resume'
                  ? 'border-slate-400/50 bg-slate-100/90'
                  : 'border-amber-900/15 bg-white/80 hover:border-slate-400/40 hover:bg-slate-50'
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                {t('welcome.returning')}
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold text-slate-900">
                {t('welcome.resumeTitle')}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {t('welcome.resumeBody')}
              </p>
              <span className="mt-8 inline-block text-sm font-medium text-slate-700 group-hover:underline">
                {entryPanel === 'resume' ? t('welcome.resumeOpen') : t('welcome.resumeCta')}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={historyRef}
        className="rounded-xl border border-amber-900/12 bg-white/70 px-4 py-4"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-800">
            Hearing history
          </p>
          <p className="text-xs text-slate-500">Saved on this browser</p>
        </div>
        {heardCases.length > 0 ? (
          <div className="flex gap-3 overflow-auto pb-1">
            {heardCases.map((record) => (
              <button
                key={record.id}
                type="button"
                onClick={() => onOpenCase(record, 'verdict')}
                className="min-w-[16rem] rounded-lg border border-amber-900/12 bg-[#faf6ee] px-4 py-3 text-left hover:border-amber-700/30"
              >
                <p className="font-mono text-xs font-semibold text-slate-900">
                  {record.id}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {record.party1Name} v. {record.party2Name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {record.verdict?.damagesAwarded || t('welcome.openJudgment')}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">{t('welcome.historyEmpty')}</p>
        )}
      </div>

      <div className="grid gap-3 rounded-xl border border-amber-900/12 bg-white/60 px-4 py-3 sm:grid-cols-3 sm:px-5">
        <div className="flex items-start gap-3 border-b border-amber-900/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
          <span className="mt-0.5 text-xs font-semibold text-amber-800">01</span>
          <div>
            <p className="text-sm font-medium text-slate-800">{t('welcome.feat1')}</p>
            <p className="mt-0.5 text-xs text-slate-500">{t('welcome.feat1Body')}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 border-b border-amber-900/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:px-4">
          <span className="mt-0.5 text-xs font-semibold text-amber-800">02</span>
          <div>
            <p className="text-sm font-medium text-slate-800">{t('welcome.feat2')}</p>
            <p className="mt-0.5 text-xs text-slate-500">{t('welcome.feat2Body')}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 sm:pl-4">
          <span className="mt-0.5 text-xs font-semibold text-amber-800">03</span>
          <div>
            <p className="text-sm font-medium text-slate-800">{t('welcome.feat3')}</p>
            <p className="mt-0.5 text-xs text-slate-500">{t('welcome.feat3Body')}</p>
          </div>
        </div>
      </div>

      {tour.active && (
        <TrainingTour
          stepIndex={tour.stepIndex}
          queueRef={queueRef}
          bookRef={bookRef}
          resumeRef={resumeRef}
          historyRef={historyRef}
          onNext={tour.next}
          onSkip={tour.skip}
          onDone={tour.finish}
        />
      )}
    </section>
  )
}
