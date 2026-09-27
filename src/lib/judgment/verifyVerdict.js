import { extractMoneyAmounts } from './analyzeDispute.js'

export const SMALL_CLAIMS_LIMITS = {
  'New Brunswick': 20000,
  'Nova Scotia': 25000,
  'Prince Edward Island': 16000,
  'Newfoundland and Labrador': 5000,
  Ontario: 35000,
  'British Columbia': 35000,
  Quebec: 15000,
  Alberta: 100000,
  Manitoba: 15000,
  Saskatchewan: 30000,
  US: 10000,
  India: 100000,
  International: 25000,
}

const KNOWN_LAW_NEEDLES = [
  'small claims act',
  'small claims court act',
  'small claims court',
  'rules of the small claims court',
  'partnership act',
  'code of civil procedure',
  'consumer protection act',
  'sale of goods act',
  'judicature act',
  'burden of proof',
  'equitable accounting',
  'good-faith',
  'good faith',
  'contribution toward',
  'duty of reasonable notice',
  'payment for services',
  'simple breach of contract',
  'fitness for purpose',
  'merchantable quality',
  'consumer fair dealing',
  'foreseeable harm',
  'apportionment of fault',
  'equitable relief',
  'lok adalat',
  'civil resolution tribunal',
]

function venueLimit(jurisdiction = '') {
  const label = String(jurisdiction)
  const hit = Object.keys(SMALL_CLAIMS_LIMITS).find((name) => label.includes(name))
  return {
    venue: hit || 'this venue',
    limit: hit ? SMALL_CLAIMS_LIMITS[hit] : SMALL_CLAIMS_LIMITS.International,
  }
}

function recordAmounts(context = {}, result = {}) {
  const text = [
    context.claimantText,
    context.defendantText,
    context.exhibitRecord,
    ...(context.claimantExhibits || []),
    ...(context.defendantExhibits || []),
    result.aggregatedTestimony?.claimantSpeech,
    result.aggregatedTestimony?.defendantSpeech,
  ]
    .filter(Boolean)
    .join(' ')
  return extractMoneyAmounts(text)
}

function awardAmounts(result = {}) {
  return extractMoneyAmounts(
    [result.damagesAwarded, result.damagesSpoken, result.spokenVerdict]
      .filter(Boolean)
      .join(' '),
  )
}

function amountFitsRecord(amount, recorded) {
  if (!recorded.length) return false
  if (recorded.some((value) => Math.abs(value - amount) < 1)) return true
  return recorded.some((value) => amount <= value + 0.5)
}

function lawVerified(title) {
  const t = String(title || '').toLowerCase()
  if (!t || t.length < 8) return false
  if (/section\s*5b/.test(t)) return false
  return KNOWN_LAW_NEEDLES.some((needle) => t.includes(needle))
}

function formatMoney(n) {
  return `$${Number(n).toLocaleString()}`
}

const STOP_WORDS = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'to',
  'of',
  'in',
  'on',
  'for',
  'is',
  'was',
  'were',
  'be',
  'it',
  'that',
  'this',
  'with',
  'as',
  'at',
  'by',
])

function normalizeWords(text) {
  return String(text || '')
    .split(/\n+/)
    .filter((line) => line.trim() && !/^\[Judge Veritas\]:/i.test(line.trim()))
    .join(' ')
    .replace(/\[Judge Veritas\]:[^\n]*/gi, ' ')
    .replace(/[\u2018\u2019\u0060]/g, "'")
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function meaningfulWords(text) {
  return normalizeWords(text)
    .split(' ')
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word))
}

function quoteOnRecord(quote, haystack) {
  const needle = normalizeWords(quote)
  const hay = normalizeWords(haystack)
  if (!needle || !hay) return false
  if (hay.includes(needle)) return true

  const quoteWords = meaningfulWords(quote)
  if (quoteWords.length < 2) return false
  const hayWords = new Set(meaningfulWords(haystack))
  const hits = quoteWords.filter((word) => hayWords.has(word)).length
  return hits / quoteWords.length >= 0.8
}

function partyHaystack(party, context = {}, result = {}) {
  const speechKey = party === 'defendant' ? 'defendantSpeech' : 'claimantSpeech'
  const textKey = party === 'defendant' ? 'defendantText' : 'claimantText'
  const exhibitKey = party === 'defendant' ? 'defendantExhibits' : 'claimantExhibits'
  return [
    context[textKey],
    result.aggregatedTestimony?.[speechKey],
    result.aggregatedTestimony?.[party],
    ...(context[exhibitKey] || []),
    ...(result.aggregatedTestimony?.[exhibitKey] || []),
  ]
    .filter(Boolean)
    .join(' ')
}

function verifyFindings(findings, context = {}, result = {}) {
  if (!Array.isArray(findings)) return []
  const claimantHay = partyHaystack('claimant', context, result)
  const defendantHay = partyHaystack('defendant', context, result)

  return findings.map((item) => {
    const claimed = item?.party === 'defendant' ? 'defendant' : 'claimant'
    const own = claimed === 'defendant' ? defendantHay : claimantHay
    const other = claimed === 'defendant' ? claimantHay : defendantHay
    const otherParty = claimed === 'defendant' ? 'claimant' : 'defendant'
    const quote = item?.quote || ''

    if (quoteOnRecord(quote, own)) {
      return { ...item, party: claimed, status: 'on_record' }
    }
    if (quoteOnRecord(quote, other)) {
      return { ...item, party: otherParty, status: 'reattributed' }
    }
    return { ...item, party: claimed, status: 'not_found' }
  })
}

export function verifyVerdict(result, context = {}) {
  const dismissed = result?.outcome === 'dismissed'
  const { venue, limit } = venueLimit(context.jurisdiction)
  const recorded = recordAmounts(context, result)
  const awarded = awardAmounts(result)
  const topAward = awarded[0] || 0

  let damagesAwarded = result.damagesAwarded
  let awardReason = result.awardReason || ''
  let moneyStatus = 'verified'
  let moneyNote = 'No dollar award to check.'

  if (dismissed || /dismissed|\$0\b|zero dollars/i.test(String(result.damagesAwarded))) {
    moneyStatus = 'verified'
    moneyNote = 'Dismissal / $0 — no invented award.'
  } else if (!awarded.length) {
    moneyStatus = 'verified'
    moneyNote = 'Award is qualitative; no invented dollar figure.'
  } else if (topAward > limit) {
    moneyStatus = 'capped'
    moneyNote = `Award exceeded the ${venue} small-claims limit of ${formatMoney(limit)}. Capped.`
    damagesAwarded = `${formatMoney(limit)} · capped at ${venue} small-claims limit`
    awardReason = `${awardReason} ${moneyNote}`.trim()
  } else if (!amountFitsRecord(topAward, recorded)) {
    moneyStatus = 'unverified'
    moneyNote = `${formatMoney(topAward)} was not found on the testimony or exhibit record.`
  } else {
    moneyStatus = 'verified'
    moneyNote = `${formatMoney(topAward)} appears on the record or as a share of a recorded amount.`
  }

  const lawsDetail = (result.lawsDetail || []).map((law) => {
    const verified = lawVerified(law.title)
    return {
      ...law,
      verified,
      verifyLabel: verified ? 'Verified statute' : 'Unverified',
    }
  })

  const findings = verifyFindings(result.findings, context, result)
  const findingsOnRecord = findings.filter(
    (item) => item.status === 'on_record' || item.status === 'reattributed',
  ).length

  return {
    ...result,
    damagesAwarded,
    awardReason,
    lawsDetail,
    lawsCited: lawsDetail.map((law) => law.title),
    findings,
    verification: {
      money: {
        status: moneyStatus,
        note: moneyNote,
        limit,
        venue,
      },
      findings: {
        checked: findings.length,
        onRecord: findingsOnRecord,
      },
      laws: {
        checked: lawsDetail.length,
        verified: lawsDetail.filter((law) => law.verified).length,
      },
    },
  }
}
