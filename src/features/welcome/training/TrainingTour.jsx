import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '../../../i18n/I18nProvider.jsx'
import { TRAINING_STEPS, TRAINING_VIDEO_SRC } from './steps'

const TOOLTIP_WIDTH = 340
const VIEW_PAD = 12

function measureRect(element) {
  if (!element) return null
  const box = element.getBoundingClientRect()
  if (!box.width && !box.height) return null
  return {
    top: box.top,
    left: box.left,
    width: box.width,
    height: box.height,
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function tooltipPosition(rect) {
  const width = Math.min(TOOLTIP_WIDTH, window.innerWidth - VIEW_PAD * 2)
  const estimatedHeight = 240

  if (!rect) {
    return {
      top: Math.max(VIEW_PAD, (window.innerHeight - estimatedHeight) / 2),
      left: (window.innerWidth - width) / 2,
      width,
    }
  }

  const below = rect.top + rect.height + 14
  const above = rect.top - estimatedHeight - 14
  const top =
    below + estimatedHeight <= window.innerHeight - VIEW_PAD
      ? below
      : above >= VIEW_PAD
        ? above
        : clamp(below, VIEW_PAD, window.innerHeight - estimatedHeight - VIEW_PAD)

  return {
    top,
    left: clamp(
      rect.left + rect.width / 2 - width / 2,
      VIEW_PAD,
      window.innerWidth - width - VIEW_PAD,
    ),
    width,
  }
}

function TrainingVideoPanel() {
  const { t } = useI18n()
  if (TRAINING_VIDEO_SRC) {
    return (
      <video
        className="aspect-video w-full rounded-lg bg-slate-950 object-cover"
        src={TRAINING_VIDEO_SRC}
        controls
        playsInline
      >
        {t('train.videoFallback')}
      </video>
    )
  }

  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-dashed border-amber-800/25 bg-slate-950/90 px-4 text-center">
      <span className="text-3xl" aria-hidden="true">
        ▶
      </span>
      <p className="mt-3 text-sm font-medium text-amber-100">
        {t('train.videoTitle')}
      </p>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-400">
        {t('train.videoBody', {
          path: 'src/assets/training/hearing-walkthrough.mp4',
        })}
      </p>
    </div>
  )
}

export function TrainingTour({
  stepIndex,
  queueRef,
  bookRef,
  resumeRef,
  historyRef,
  onNext,
  onSkip,
  onDone,
}) {
  const { t } = useI18n()
  const step = TRAINING_STEPS[stepIndex]
  const isLast = stepIndex === TRAINING_STEPS.length - 1
  const [rect, setRect] = useState(null)
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }))
  const primaryRef = useRef(null)

  useLayoutEffect(() => {
    const targetRefs = {
      queue: queueRef,
      book: bookRef,
      resume: resumeRef,
      history: historyRef,
    }
    const element = step?.target ? targetRefs[step.target]?.current : null
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }

    const update = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
      setRect(element ? measureRect(element) : null)
    }
    update()

    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    const timer = window.setTimeout(update, 280)

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
      window.clearTimeout(timer)
    }
  }, [step, stepIndex, queueRef, bookRef, resumeRef, historyRef])

  useEffect(() => {
    primaryRef.current?.focus()
  }, [stepIndex])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' && !isLast) {
        event.preventDefault()
        onSkip()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isLast, onSkip])

  if (!step) return null

  const isVideo = step.kind === 'video'
  const tip = isVideo
    ? {
        top: Math.max(VIEW_PAD, viewport.height * 0.08),
        left: Math.max(VIEW_PAD, (viewport.width - Math.min(560, viewport.width - VIEW_PAD * 2)) / 2),
        width: Math.min(560, viewport.width - VIEW_PAD * 2),
      }
    : tooltipPosition(rect)

  return createPortal(
    <div className="fixed inset-0 z-[80] overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="training-step-title">
      <div className="absolute inset-0 bg-slate-950/50" />

      {rect && (
        <div
          className="pointer-events-none absolute z-[1] rounded-xl ring-2 ring-amber-300"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
          }}
        />
      )}

      <div
        className="absolute z-10 max-h-[min(92dvh,44rem)] animate-verdict-in overflow-y-auto rounded-xl border border-amber-800/20 bg-[#faf6ee] p-4 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.55)] sm:p-5"
        style={{ top: tip.top, left: tip.left, width: tip.width }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-800">
            Step {stepIndex + 1} of {TRAINING_STEPS.length}
          </p>
          <div className="flex gap-1" aria-hidden="true">
            {TRAINING_STEPS.map((item, index) => (
              <span
                key={item.id}
                className={`h-1.5 w-4 rounded-full ${
                  index === stepIndex
                    ? 'bg-amber-700'
                    : index < stepIndex
                      ? 'bg-amber-400'
                      : 'bg-amber-200'
                }`}
              />
            ))}
          </div>
        </div>

        <h3 id="training-step-title" className="mt-2 font-display text-xl font-semibold text-slate-900">
          {t(`train.${step.id}.title`)}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {t(`train.${step.id}.body`)}
        </p>

        {isVideo && (
          <div className="mt-4">
            <TrainingVideoPanel />
          </div>
        )}

        <div className={`mt-4 flex items-center ${isLast ? 'justify-end' : 'justify-between'} gap-3`}>
          {!isLast && (
            <button
              type="button"
              onClick={onSkip}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-white hover:text-slate-800"
            >
              {t('train.skip')}
            </button>
          )}
          {isLast ? (
            <button
              ref={primaryRef}
              type="button"
              onClick={onDone}
              className="rounded-md bg-amber-800 px-4 py-1.5 text-sm font-medium text-amber-50 hover:bg-amber-700"
            >
              {t('train.done')}
            </button>
          ) : (
            <button
              ref={primaryRef}
              type="button"
              onClick={onNext}
              className="rounded-md bg-amber-800 px-4 py-1.5 text-sm font-medium text-amber-50 hover:bg-amber-700"
            >
              {t('train.ok')}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
