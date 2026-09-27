function looksLikePrematureAward(text) {
  const t = String(text || '').toLowerCase()
  if (!t.trim()) return false
  return (
    /\b(award|awarded|shall pay|must pay|ordered to pay|order(?:s|ed)? (?:the )?(?:defendant|claimant) to pay)\b/.test(
      t,
    ) ||
    /\b(the (?:court|defendant) (?:asks|orders|directs).{0,40}pay)\b/.test(t) ||
    /\b(i (?:find|rule|hold|award)|judgment is|this (?:court )?(?:awards|orders))\b/.test(
      t,
    ) ||
    /\b(liable|liability|fault split|verdict|case is (?:closed|decided)|this matter is decided)\b/.test(
      t,
    ) ||
    /\bpay (?:the )?(?:claimant|defendant|them)\b/.test(t)
  )
}

const PROOF_ONCE =
  'You may ask once whether they have a text, photo, or file. If they will attach it, say noted and move on. If they cannot or say no, say okay and keep going from what they said. Do not ask again about attaching, PDFs, or proof.'

export function hearingContextualUpdate({
  party,
  party1Name,
  party2Name,
  claimantSpeech = '',
}) {
  if (party === 'claimant') {
    return `You are taking the CLAIMANT's testimony only. ${party2Name} has not spoken. Behave like a judge examining a witness: stay quiet on small yes/ok lines. When they state a fact, amount, item, or injury, confirm that line. ${PROOF_ONCE} NEVER award money, find fault, or give a verdict. The final decision comes only after both parties have finished.`
  }

  const summary = String(claimantSpeech || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(-1500)
  const claimBlock = summary
    ? `The claimant ${party1Name || 'Party 1'} alleged: "${summary}". Put each claim to the defendant and ask them to respond.`
    : `The claimant ${party1Name || 'Party 1'} placed little on the record. Ask the defendant to state their side.`

  return `You are taking the DEFENDANT's testimony only. ${claimBlock} Behave like a judge: stay quiet on small yes/ok lines. When they state a fact, amount, or defence, confirm that line. ${PROOF_ONCE} NEVER award money or announce a verdict. The final decision comes after this turn ends.`
}

export function prematureAwardNudge(party2Name) {
  return `Stop. That was a decision. The defendant ${party2Name} has not been heard. Retract any award. Ask one short question about their side and wait. Do not ask about files or proof.`
}

export function isPrematureAwardLine(text) {
  return looksLikePrematureAward(text)
}
