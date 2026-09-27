import { useEffect } from 'react'
import { useI18n } from '../../../i18n/I18nProvider.jsx'

const VISIBLE_MS = 5000

export function TrainingCongrats({ onDismiss }) {
  const { t } = useI18n()
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, VISIBLE_MS)
    return () => window.clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      role="status"
      className="rounded-2xl border border-amber-400/50 bg-[#faf6ee] px-6 py-5 text-center shadow-sm sm:px-8"
    >
      <p className="text-3xl" aria-hidden="true">
        🎊
      </p>
      <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">
        {t('train.congrats')}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {t('train.congratsBody')}
      </p>
    </div>
  )
}
