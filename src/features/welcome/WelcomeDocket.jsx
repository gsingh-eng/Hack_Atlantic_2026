import { useMemo, useState } from 'react'
import { CASE_STATUS, findCase } from '../../lib/cases/caseStore'
import { useI18n } from '../../i18n/I18nProvider.jsx'

function statusTone(status) {
  if (status === CASE_STATUS.heard) return 'border-emerald-700/25 bg-emerald-50 text-emerald-900'
  if (status === CASE_STATUS.scheduled) return 'border-amber-700/25 bg-amber-50 text-amber-950'
  return 'border-sky-700/25 bg-sky-50 text-sky-900'
}

export function WelcomeDocket({
  cases,
  caseIdInput,
  onCaseIdInput,
  onOpenCase,
  onCreateNew,
  onClose,
}) {
  const [selectedId, setSelectedId] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')
  const [lookupMiss, setLookupMiss] = useState(false)
  const { t } = useI18n()

  const hearingTime = (record) => {
    if (!record?.schedule?.dayLabel) return t('docket.noTime')
    return t('docket.atTime', {
      day: record.schedule.dayLabel,
      slot: record.schedule.slot,
    })
  }

  const fileStatus = (record) => {
    if (record.status === CASE_STATUS.heard) return t('status.heard')
    if (record.status === CASE_STATUS.scheduled) return t('status.scheduled')
    if (record.status === CASE_STATUS.ready) return t('status.ready')
    return t('status.file')
  }

  const query = caseIdInput.trim().toUpperCase()
  const filtered = useMemo(() => {
    if (!query) return cases
    return cases.filter((c) => {
      const hay = `${c.id} ${c.party1Name} ${c.party2Name} ${c.summary}`.toUpperCase()
      return hay.includes(query)
    })
  }, [cases, query])

  const selected = cases.find((c) => c.id === selectedId) || null

  const tryOpen = (record, action) => {
    if (record.sealed && record.pin) {
      setSelectedId(record.id)
      setPinError('')
      if (pinInput !== record.pin) {
        setPinError(pinInput ? t('docket.pinError') : '')
        return
      }
    }
    setPinError('')
    onOpenCase(record, action)
  }

  const lookupTyped = () => {
    const found = findCase(caseIdInput)
    if (!found) {
      setLookupMiss(true)
      setSelectedId('')
      return
    }
    setLookupMiss(false)
    setSelectedId(found.id)
    setPinInput('')
    setPinError('')
  }

  return (
    <div className="mt-6 rounded-xl border border-amber-900/12 bg-white/75 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-800">
            Case docket
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Search a Case ID, open a scheduled file, or start a new one.
            Sealed files use PIN 0000.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-800"
        >
          Close
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={caseIdInput}
          onChange={(e) => {
            onCaseIdInput(e.target.value)
            setLookupMiss(false)
          }}
          placeholder={t('docket.search')}
          className="flex-1 rounded-lg border border-amber-900/20 bg-white px-3 py-2.5 font-mono text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-amber-700/30"
        />
        <button
          type="button"
          onClick={lookupTyped}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          {t('docket.lookup')}
        </button>
      </div>

      {lookupMiss && (
        <div className="mt-4 rounded-lg border border-amber-800/20 bg-amber-50 px-4 py-3 text-sm text-slate-700">
          {t('docket.noMatch', { id: query || t('docket.thatId') })}
          <button
            type="button"
            onClick={() => onCreateNew(caseIdInput)}
            className="ml-2 font-medium text-amber-950 underline"
          >
            {t('docket.create')}
          </button>
        </div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <ul className="max-h-72 space-y-2 overflow-auto pr-1">
          {filtered.length === 0 && (
            <li className="rounded-lg border border-amber-900/10 bg-white px-3 py-3 text-sm text-slate-500">
              {t('docket.noFiles')}
            </li>
          )}
          {filtered.map((record) => (
            <li key={record.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(record.id)
                  setPinInput('')
                  setPinError('')
                  onCaseIdInput(record.id)
                }}
                className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                  selectedId === record.id
                    ? 'border-amber-700/40 bg-amber-50'
                    : 'border-amber-900/10 bg-white hover:border-amber-700/25'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-sm font-semibold text-slate-900">
                    {record.id}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusTone(
                      record.status,
                    )}`}
                  >
                    {record.sealed ? t('docket.sealed') : ''}
                    {fileStatus(record)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {record.party1Name} v. {record.party2Name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{hearingTime(record)}</p>
              </button>
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-amber-900/12 bg-[#faf6ee]/80 p-4">
          {!selected ? (
            <p className="text-sm text-slate-500">
              {t('docket.select')}
            </p>
          ) : (
            <>
              <p className="font-mono text-sm font-semibold text-slate-900">{selected.id}</p>
              <p className="mt-1 text-sm text-slate-700">
                {selected.party1Name} v. {selected.party2Name}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">
                {selected.jurisdiction}
                {selected.canadaProvince ? ` · ${selected.canadaProvince}` : ''}
              </p>
              <p className="mt-2 text-sm text-slate-600">{selected.summary}</p>
              <p className="mt-3 text-sm font-medium text-slate-800">
                {hearingTime(selected)}
              </p>

              {selected.sealed && (
                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                    {t('docket.pin')}
                  </label>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value)
                      setPinError('')
                    }}
                    placeholder={t('docket.pinPlaceholder')}
                    className="w-full rounded-lg border border-amber-900/20 bg-white px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-amber-700/30"
                  />
                  {pinError && (
                    <p className="mt-1.5 text-xs text-red-700">{pinError}</p>
                  )}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2">
                {selected.status === CASE_STATUS.heard ? (
                  <button
                    type="button"
                    onClick={() => tryOpen(selected, 'verdict')}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    {t('docket.viewVerdict')}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => tryOpen(selected, 'setup')}
                      className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      {t('docket.openSetup')}
                    </button>
                    <button
                      type="button"
                      onClick={() => tryOpen(selected, 'hearing')}
                      className="rounded-lg border border-amber-900/20 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-amber-50"
                    >
                      {t('docket.startHearing')}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
