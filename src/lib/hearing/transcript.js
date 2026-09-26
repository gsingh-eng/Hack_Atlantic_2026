export function appendTranscript(prev, next) {
  const incoming = (next || '').trim()
  if (!incoming) return prev
  if (!prev?.trim()) return incoming
  return `${prev.trim()}\n${incoming}`
}
