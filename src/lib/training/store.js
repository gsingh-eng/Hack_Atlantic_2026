const STORAGE_KEY = 'veritas.training.v1'

const emptyState = () => ({
  completed: false,
  bannerDismissed: false,
  completedAt: null,
})

export function readTrainingState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw)
    return {
      ...emptyState(),
      ...parsed,
      completed: Boolean(parsed?.completed),
      bannerDismissed: Boolean(parsed?.bannerDismissed),
    }
  } catch {
    return emptyState()
  }
}

function writeTrainingState(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function isTrainingComplete() {
  return readTrainingState().completed
}

export function markTrainingComplete() {
  return writeTrainingState({
    completed: true,
    bannerDismissed: false,
    completedAt: Date.now(),
  })
}

export function dismissTrainingBanner() {
  return writeTrainingState({
    ...readTrainingState(),
    bannerDismissed: true,
  })
}
