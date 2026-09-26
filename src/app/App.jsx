import { useEffect, useRef, useState } from 'react'
import { AppHeader } from './AppHeader'
import { WelcomeScreen } from '../features/welcome/WelcomeScreen'
import { QueueScreen } from '../features/intake/QueueScreen'
import { BookScreen } from '../features/intake/BookScreen'
import { SetupScreen } from '../features/setup/SetupScreen'
import { DualCourtroom } from '../features/hearing/DualCourtroom'
import { CASE_STATUS, listCases, upsertCase } from '../lib/cases/caseStore'
import { generateCaseId } from '../lib/cases/ids'
import { getAvailableBookingDays } from '../lib/intake/booking'
import { addExhibitFiles } from '../lib/hearing/exhibits'
import { QUEUE_ETA_STEPS } from '../lib/constants'
import { getJurisdictionTheme } from '../theme/jurisdictionThemes'

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
  const [floor, setFloor] = useState('opening')
  const [claimantDone, setClaimantDone] = useState(false)
  const [defendantDone, setDefendantDone] = useState(false)
  const [claimantExhibits, setClaimantExhibits] = useState([])
  const [defendantExhibits, setDefendantExhibits] = useState([])
  const [isStandOpen, setIsStandOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [activeParty, setActiveParty] = useState(null)
  const [liveMediaMode, setLiveMediaMode] = useState('mic')
  const [livePreviewStream, setLivePreviewStream] = useState(null)

  const queueTimerRef = useRef(null)
  const micStreamRef = useRef(null)
  const advancingRef = useRef(false)

  const theme = getJurisdictionTheme(jurisdiction)
  const jurisdictionLabel =
    jurisdiction === 'Canada' ? `Canada · ${canadaProvince}` : jurisdiction
  const isNightBench = stage === 1
  const isDayCourt = !isNightBench

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
    const root = document.documentElement
    if (isNightBench) {
      root.classList.add('night-bench')
      root.classList.remove('day-court')
    } else {
      root.classList.add('day-court')
      root.classList.remove('night-bench')
    }
    return () => root.classList.remove('day-court', 'night-bench')
  }, [isNightBench])

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

  const stopMicTracks = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop())
      micStreamRef.current = null
    }
    setLivePreviewStream(null)
  }

  const resetHearingState = () => {
    stopMicTracks()
    setFloor('opening')
    setClaimantDone(false)
    setDefendantDone(false)
    setClaimantExhibits([])
    setDefendantExhibits([])
    setIsStandOpen(false)
    setIsConnecting(false)
    setIsSessionActive(false)
    setActiveParty(null)
    setLiveMediaMode('mic')
  }

  const beginHearing = (id) => {
    resetHearingState()
    setCaseId(id)
    setStage(1)
    window.setTimeout(() => setFloor('claimant'), 400)
  }

  const openDocketCase = (record, action) => {
    applyCaseRecord(record)
    setEntryPanel(null)
    if (action === 'verdict' && record.verdict) {
      setSavedVerdict(record.verdict)
      setStage('saved')
      return
    }
    if (action === 'hearing') {
      beginHearing(record.id)
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
    beginHearing(id)
  }

  const startPartyStand = async (party, mode) => {
    if (floor !== party || isStandOpen || isConnecting) return
    setIsConnecting(true)
    setActiveParty(party)
    setLiveMediaMode(mode)
    try {
      if (mode === 'video') {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { facingMode: 'user' },
        })
        stream.getAudioTracks().forEach((track) => track.stop())
        micStreamRef.current = stream
        setLivePreviewStream(stream)
      }
      setIsStandOpen(true)
      setIsSessionActive(true)
    } catch (error) {
      console.error('Could not open the stand:', error)
      setActiveParty(null)
      setLiveMediaMode('mic')
    } finally {
      setIsConnecting(false)
    }
  }

  const stopPartyStand = async (party) => {
    if (activeParty !== party || !isStandOpen || advancingRef.current) return
    advancingRef.current = true
    stopMicTracks()
    setIsStandOpen(false)
    setIsSessionActive(false)
    setActiveParty(null)
    if (party === 'claimant') {
      setClaimantDone(true)
      setFloor('defendant')
    } else {
      setDefendantDone(true)
      setFloor('closed')
      setStage('next')
    }
    advancingRef.current = false
  }

  const addPartyFiles = (party, fileList) => {
    const setter = party === 'claimant' ? setClaimantExhibits : setDefendantExhibits
    setter((prev) => addExhibitFiles(prev, fileList))
  }

  const removePartyFile = (party, fileId) => {
    const setter = party === 'claimant' ? setClaimantExhibits : setDefendantExhibits
    setter((prev) => prev.filter((item) => item.id !== fileId))
  }

  const resetToWelcome = () => {
    if (queueTimerRef.current) clearTimeout(queueTimerRef.current)
    resetHearingState()
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
            : stage === 1
              ? 'Live Hearing'
              : stage === 'saved'
                ? 'Saved judgment'
                : 'Hearing next'

  return (
    <div
      className={`min-h-screen ${
        isNightBench
          ? 'bg-transparent px-3 py-3 text-slate-200 sm:px-4'
          : 'bg-[#f3efe6] px-4 py-6 text-slate-800 sm:px-6 lg:px-10'
      }`}
      style={
        isDayCourt
          ? {
              backgroundImage:
                'radial-gradient(ellipse 70% 45% at 50% -10%, rgba(201, 162, 39, 0.14), transparent), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(148, 120, 70, 0.08), transparent)',
            }
          : undefined
      }
    >
      <div className="relative mx-auto w-full max-w-[1600px]">
        <AppHeader
          caseId={caseId}
          jurisdiction={stage === 'entry' ? '' : jurisdictionLabel}
          stageLabel={stageLabel}
          notification={topNotification}
          light={isDayCourt}
          compact={isNightBench}
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

        {stage === 1 && (
          <DualCourtroom
            jurisdiction={jurisdiction}
            caseId={caseId}
            party1Name={party1Name}
            party2Name={party2Name}
            floor={floor}
            claimantDone={claimantDone}
            defendantDone={defendantDone}
            isSessionActive={isSessionActive}
            isConnecting={isConnecting}
            isStandOpen={isStandOpen}
            activeParty={activeParty}
            liveMediaMode={liveMediaMode}
            livePreviewStream={livePreviewStream}
            onStartMic={(party) => startPartyStand(party, 'mic')}
            onStartVideo={(party) => startPartyStand(party, 'video')}
            onStopStand={stopPartyStand}
            theme={theme}
            claimantExhibits={claimantExhibits}
            defendantExhibits={defendantExhibits}
            onAddClaimantFiles={(files) => addPartyFiles('claimant', files)}
            onAddDefendantFiles={(files) => addPartyFiles('defendant', files)}
            onRemoveClaimantFile={(id) => removePartyFile('claimant', id)}
            onRemoveDefendantFile={(id) => removePartyFile('defendant', id)}
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
              Both parties have been heard
            </h2>
            <p className="mt-3 text-base text-slate-600">
              {party1Name} and {party2Name} finished in {jurisdictionLabel}.
              The written judgment comes next.
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
