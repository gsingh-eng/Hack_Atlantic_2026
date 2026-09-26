function waitForVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve([])
  }
  const existing = window.speechSynthesis.getVoices()
  if (existing.length) return Promise.resolve(existing)
  return new Promise((resolve) => {
    const finish = () => resolve(window.speechSynthesis.getVoices())
    window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true })
    window.setTimeout(finish, 400)
  })
}

export async function speakCourtScript(text, { rate = 0.92, pitch = 0.95 } = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return
  }

  const script = (text || '').trim()
  if (!script) return

  const voices = await waitForVoices()
  window.speechSynthesis.cancel()

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(script)
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.lang = 'en-US'

    const preferred =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          /male|daniel|alex|david|google us english|microsoft david/i.test(v.name),
      ) || voices.find((v) => v.lang.startsWith('en'))

    if (preferred) utterance.voice = preferred

    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()
    window.speechSynthesis.speak(utterance)
  })
}

export function stopCourtSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}
