export function generateCaseId() {
  const segment = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `VER-${segment}`
}
