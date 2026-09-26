import { useEffect, useRef, useState } from 'react'
import { AppHeader } from './AppHeader'
import { WelcomeScreen } from '../features/welcome/WelcomeScreen'
import { QueueScreen } from '../features/intake/QueueScreen'
import { BookScreen } from '../features/intake/BookScreen'
import { SetupScreen } from '../features/setup/SetupScreen'
import { CASE_STATUS, listCases, upsertCase } from '../lib/cases/caseStore'
import { generateCaseId } from '../lib/cases/ids'
import { getAvailableBookingDays } from '../lib/intake/booking'
import { QUEUE_ETA_STEPS } from '../lib/constants'

export default function App() {
  const [stage, setStage] = useState('entry')

  const [jurisdiction, setJurisdiction] = useState('Canada')
  const [canadaProvince, setCanadaProvince] = useState('New Brunswick')
  const [language, setLanguage] = useState('English')
  const [caseMode, setCaseMode] = useState('create')
  const [caseIdInput, setCaseIdInput] = useState('')
  const [caseId, setCaseId] = useState('')
  const [party1Name, setParty1Name] = useState('Alex Claimant')
  const [party2Name, setParty2Name] = useState('Jordan Defendant')
  const [disputeCategory, setDisputeCategory] = useState('shared_property')

  const [intakeName, setIntakeName] = useState('')
  const [intakeEmail, setIntakeEmail] = useState('')
  const [intakeDispute, setIntakeDispute] = useState('')
  const [queueStep, setQueueStep] = useState(-1)
  const [bookingDays] = useState(() => getAvailableBookingDays())
  const [selectedDayKey, setSelectedDayKey] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookingConfirmed, setBookingConfirmed] = useState(null)
  const [topNotification, setTopNotification] = useState(null)
  const [entryPanel, setEntryPanel] = useState(null)
  const [docketCases, setDocketCases] = useState(() => listCases())
  const [savedVerdict, setSavedVerdict] = useState(null)

  const queueTimerRef = useRef(null)

  const jurisdictionLabel =
    jurisdiction === 'Canada' ? `Canada · ${canadaProvince}` : jurisdiction

  useEffect(() => {
    if (!topNotification) return undefined
    const timer = setTimeout(() => setTopNotification(null), 7000)
    return () => clearTimeout(timer)
  }, [topNotification])

  useEffect(() => {
    if (!selectedDayKey && bookingDays[0]) {
      setSelectedDayKey(bookingDays[0].key)
    }
  }, [bookingDays, selectedDayKey])

  useEffect(() => {
    return () => {
      if (queueTimerRef.current) clearTimeout(queueTimerRef.current)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.add('day-court')
    document.documentElement.classList.remove('night-bench')
    return () => document.documentElement.classList.remove('day-court', 'night-bench')
  }, [])

  const applyCaseRecord = (record) => {
    if (!record) return
    setCaseId(record.id)
    setCaseIdInput(record.id)
    setCaseMode('join')
    if (record.party1Name) setParty1Name(record.party1Name)
    if (record.party2Name) setParty2Name(record.party2Name)
    if (record.jurisdiction) setJurisdiction(record.jurisdiction)
    if (record.canadaProvince) setCanadaProvince(record.canadaProvince)
    if (record.disputeCategory) setDisputeCategory(record.disputeCategory)
    if (record.language) setLanguage(record.language)
    if (record.schedule) {
      setBookingConfirmed({
        name: record.party1Name,
        email: intakeEmail,
        dispute: record.summary || '',
        dayLabel: record.schedule.dayLabel,
        slot: record.schedule.slot,
      })
    }
  }

  const openDocketCase = (record, action) => {
    applyCaseRecord(record)
    setEntryPanel(null)
    if (action === 'verdict' && record.verdict) {
      setSavedVerdict(record.verdict)
      setStage('saved')
      return
    }
    setStage(0)
  }

  const createFromLookup = (rawId) => {
    const id = rawId.trim().toUpperCase() || generateCaseId()
    setCaseId(id)
    setCaseIdInput(id)
    setCaseMode('join')
    setEntryPanel(null)
    setStage(0)
  }

  const startQueueDemo = (e) => {
    e.preventDefault()
    if (!intakeName.trim() || !intakeEmail.trim()) return
    if (intakeName.trim()) setParty1Name(intakeName.trim())
    setQueueStep(0)

    const runStep = (index) => {
      setQueueStep(index)
      if (index >= QUEUE_ETA_STEPS.length - 1) {
        queueTimerRef.current = setTimeout(() => {
          setTopNotification({
            title: 'Queue cleared — you are up',
            body: 'Your estimated wait is over. Continue to courtroom setup.',
          })
          setStage(0)
        }, 1800)
        return
      }
      queueTimerRef.current = setTimeout(() => runStep(index + 1), 2800)
    }

    runStep(0)
  }

  const confirmBooking = (e) => {
    e.preventDefault()
    if (!intakeName.trim() || !intakeEmail.trim() || !selectedDayKey || !selectedSlot) {
      return
    }

    const day = bookingDays.find((d) => d.key === selectedDayKey)
    const confirmed = {
      name: intakeName.trim(),
      email: intakeEmail.trim(),
      dispute: intakeDispute.trim(),
      dayLabel: day?.label || selectedDayKey,
      slot: selectedSlot,
    }
    const bookedId = caseId || generateCaseId()
    setCaseId(bookedId)
    setCaseIdInput(bookedId)
    setCaseMode('join')
    setBookingConfirmed(confirmed)
    if (intakeName.trim()) setParty1Name(intakeName.trim())
    upsertCase({
      id: bookedId,
      status: CASE_STATUS.scheduled,
      party1Name: intakeName.trim(),
      party2Name: party2Name,
      jurisdiction,
      canadaProvince,
      disputeCategory,
      language,
      summary: intakeDispute.trim(),
      schedule: { dayLabel: confirmed.dayLabel, slot: confirmed.slot },
    })
    setDocketCases(listCases())
    setTopNotification({
      title: 'Hearing booked successfully',
      body: `Case ${bookedId} — ${confirmed.dayLabel} at ${confirmed.slot}. Saved on this device.`,
    })
  }

  const enterCourtroom = (e) => {
    e.preventDefault()
    const id =
      caseMode === 'create'
        ? generateCaseId()
        : caseIdInput.trim().toUpperCase() || caseId || generateCaseId()
    setCaseId(id)
    setCaseIdInput(id)
    upsertCase({
      id,
      status: CASE_STATUS.ready,
      party1Name: party1Name.trim() || 'Party 1',
      party2Name: party2Name.trim() || 'Party 2',
      jurisdiction,
      canadaProvince,
      disputeCategory,
      language,
      summary: intakeDispute.trim(),
    })
    setDocketCases(listCases())
    setStage('next')
  }

  const resetToWelcome = () => {
    if (queueTimerRef.current) clearTimeout(queueTimerRef.current)
    setStage('entry')
    setCaseId('')
    setCaseIdInput('')
    setQueueStep(-1)
    setBookingConfirmed(null)
    setTopNotification(null)
    setSelectedSlot('')
    setSavedVerdict(null)
    setDocketCases(listCases())
    setEntryPanel(null)
  }

  const stageLabel =
    stage === 'entry'
      ? 'Welcome'
      : stage === 'queue'
        ? 'Live Queue'
        : stage === 'book'
          ? 'Book Hearing'
          : stage === 0
            ? 'Setup'
            : stage === 'saved'
              ? 'Saved judgment'
              : 'Hearing next'

  return (
    <div
      className="min-h-screen bg-[#f3efe6] px-4 py-6 text-slate-800 sm:px-6 lg:px-10"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 70% 45% at 50% -10%, rgba(201, 162, 39, 0.14), transparent), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(148, 120, 70, 0.08), transparent)',
      }}
    >
      <div className="relative mx-auto w-full max-w-[1600px]">
        <AppHeader
          caseId={caseId}
          jurisdiction={stage === 'entry' ? '' : jurisdictionLabel}
          stageLabel={stageLabel}
          notification={topNotification}
          light
        />

        {stage === 'entry' && (
          <WelcomeScreen
            entryPanel={entryPanel}
            setEntryPanel={setEntryPanel}
            docketCases={docketCases}
            caseIdInput={caseIdInput}
            setCaseIdInput={setCaseIdInput}
            onOpenCase={openDocketCase}
            onCreateNew={createFromLookup}
            onJoinQueue={() => {
              setEntryPanel(null)
              setQueueStep(-1)
              setStage('queue')
            }}
            onBookSlot={() => {
              setEntryPanel(null)
              setBookingConfirmed(null)
              setSelectedSlot('')
              setStage('book')
            }}
          />
        )}

        {stage === 'queue' && (
          <QueueScreen
            intakeName={intakeName}
            setIntakeName={setIntakeName}
            intakeEmail={intakeEmail}
            setIntakeEmail={setIntakeEmail}
            intakeDispute={intakeDispute}
            setIntakeDispute={setIntakeDispute}
            queueStep={queueStep}
            onBack={() => {
              if (queueTimerRef.current) clearTimeout(queueTimerRef.current)
              setQueueStep(-1)
              setStage('entry')
            }}
            onSubmit={startQueueDemo}
          />
        )}

        {stage === 'book' && (
          <BookScreen
            bookingDays={bookingDays}
            selectedDayKey={selectedDayKey}
            setSelectedDayKey={setSelectedDayKey}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            intakeName={intakeName}
            setIntakeName={setIntakeName}
            intakeEmail={intakeEmail}
            setIntakeEmail={setIntakeEmail}
            intakeDispute={intakeDispute}
            setIntakeDispute={setIntakeDispute}
            bookingConfirmed={bookingConfirmed}
            caseId={caseId}
            onBack={() => {
              setBookingConfirmed(null)
              setStage('entry')
            }}
            onSubmit={confirmBooking}
            onContinueSetup={() => setStage(0)}
          />
        )}

        {stage === 0 && (
          <SetupScreen
            jurisdiction={jurisdiction}
            setJurisdiction={setJurisdiction}
            canadaProvince={canadaProvince}
            setCanadaProvince={setCanadaProvince}
            disputeCategory={disputeCategory}
            setDisputeCategory={setDisputeCategory}
            party1Name={party1Name}
            setParty1Name={setParty1Name}
            party2Name={party2Name}
            setParty2Name={setParty2Name}
            language={language}
            setLanguage={setLanguage}
            caseMode={caseMode}
            setCaseMode={setCaseMode}
            caseIdInput={caseIdInput}
            setCaseIdInput={setCaseIdInput}
            onSubmit={enterCourtroom}
          />
        )}

        {stage === 'saved' && savedVerdict && (
          <section className="animate-verdict-in mx-auto max-w-3xl rounded-2xl border border-amber-900/15 bg-[#faf6ee]/90 p-8">
            <button
              type="button"
              onClick={resetToWelcome}
              className="mb-4 text-xs text-slate-500 hover:text-slate-800"
            >
              ← Back to Welcome
            </button>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Saved judgment
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
              Case {caseId}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              {savedVerdict.verdictSummary}
            </p>
            <p className="mt-4 font-display text-2xl font-semibold text-amber-900">
              {savedVerdict.damagesAwarded}
            </p>
          </section>
        )}

        {stage === 'next' && (
          <section className="animate-verdict-in mx-auto max-w-3xl rounded-2xl border border-amber-900/15 bg-[#faf6ee]/90 p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Case {caseId}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
              Setup is saved
            </h2>
            <p className="mt-3 text-base text-slate-600">
              {party1Name} and {party2Name} are ready for {jurisdictionLabel}.
              The live courtroom comes next.
            </p>
            <button
              type="button"
              onClick={resetToWelcome}
              className="mt-6 border border-amber-900/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 hover:bg-amber-50"
            >
              Back to Welcome
            </button>
          </section>
        )}
      </div>
    </div>
  )
}
