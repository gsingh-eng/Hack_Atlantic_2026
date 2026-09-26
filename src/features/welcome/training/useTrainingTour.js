import { useCallback, useState } from 'react'
import {
  dismissTrainingBanner,
  isTrainingComplete,
  markTrainingComplete,
} from '../../../lib/training/store'
import { TRAINING_STEPS } from './steps'

export function useTrainingTour() {
  const [stepIndex, setStepIndex] = useState(null)
  const [showCongrats, setShowCongrats] = useState(false)
  const [completed, setCompleted] = useState(() => isTrainingComplete())

  const active = stepIndex !== null
  const isLast = stepIndex === TRAINING_STEPS.length - 1

  const start = () => {
    setShowCongrats(false)
    setStepIndex(0)
  }

  const skip = () => {
    setStepIndex(null)
  }

  const next = () => {
    setStepIndex((current) => {
      if (current === null) return null
      return Math.min(current + 1, TRAINING_STEPS.length - 1)
    })
  }

  const finish = () => {
    markTrainingComplete()
    setCompleted(true)
    setStepIndex(null)
    setShowCongrats(true)
  }

  const dismissBanner = useCallback(() => {
    dismissTrainingBanner()
    setShowCongrats(false)
  }, [])

  return {
    stepIndex,
    active,
    isLast,
    completed,
    showCongrats,
    start,
    skip,
    next,
    finish,
    dismissBanner,
  }
}
