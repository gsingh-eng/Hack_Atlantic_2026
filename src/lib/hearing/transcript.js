import { extractPartySpeech } from '../judgment/analyzeDispute.js'

export function appendTranscript(prev, next) {
  const incoming = (next || '').trim()
  if (!incoming) return prev
  if (!prev?.trim()) return incoming
  return `${prev.trim()}\n${incoming}`
}

export function appendJudgeLog(prev, message) {
  const line = `[Judge Veritas]: ${message}`
  if (!prev?.trim()) return line
  return `${prev.trim()}\n\n${line}`
}

export function visiblePartySpeech(raw, speechFallback = '') {
  return extractPartySpeech(speechFallback) || extractPartySpeech(raw)
}
