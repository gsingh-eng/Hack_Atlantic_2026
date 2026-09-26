import { useEffect } from 'react'
import { createPortal } from 'react-dom'

const VISIBLE_MS = 5000

export function TrainingCongrats({ onDismiss }) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, VISIBLE_MS)
    return () => window.clearTimeout(timer)
  }, [onDismiss])

  return createPortal(
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 top-6 z-[90] flex justify-center px-4 sm:top-8"
    >
      <div className="animate-verdict-in pointer-events-auto w-full max-w-xl rounded-2xl border border-amber-400/50 bg-[#faf6ee] px-6 py-5 text-center shadow-[0_20px_50px_-20px_rgba(80,60,20,0.45)] sm:px-8">
        <p className="text-3xl" aria-hidden="true">
          🎊
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">
          Congrats — you went through every training step
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          You now know the queue, booking, case IDs, history, and how both
          parties appear before the judge.
        </p>
      </div>
    </div>,
    document.body,
  )
}
