export const DISPUTE_CATEGORIES = [
  {
    id: 'partnership_prize',
    label: 'Partnership / prize / revenue split',
    blurb: 'Hackathon prizes, cofounder splits, joint venture payouts',
  },
  {
    id: 'shared_property',
    label: 'Shared property / roommate goods',
    blurb: 'Joint purchases, discarded items, household property',
  },
  {
    id: 'unpaid_contract',
    label: 'Contract / unpaid invoice',
    blurb: 'Services rendered, invoices unpaid, fee disputes',
  },
  {
    id: 'consumer_refund',
    label: 'Consumer purchase / refund',
    blurb: 'Defective goods, refunds, merchant disputes',
  },
  {
    id: 'negligence_damage',
    label: 'Negligence / damage to property',
    blurb: 'Broken items, accidents, careless harm',
  },
  {
    id: 'other',
    label: 'Other micro-claim',
    blurb: 'General small-claims dispute',
  },
]

export function extractPartySpeech(raw) {
  if (!raw?.trim()) return ''

  const paragraphs = raw
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)

  const kept = []
  for (const p of paragraphs) {
    if (/^\[Judge Veritas\]:/i.test(p)) {
      const withoutLabel = p.replace(/^\[Judge Veritas\]:\s*/i, '')
      const splitters = [
        /when ready\.\s*/i,
        /you may now speak\.\s*/i,
        /floor is yours[^.]*\.\s*/i,
        /render judgment\.\s*/i,
      ]
      let salvaged = ''
      for (const splitter of splitters) {
        const parts = withoutLabel.split(splitter)
        if (parts.length > 1 && parts.slice(1).join(' ').trim().length > 30) {
          salvaged = parts.slice(1).join(' ').trim()
          break
        }
      }
      if (!salvaged) {
        const nameStart = withoutLabel.match(/\bMy name is\b[\s\S]+/i)
        if (nameStart && nameStart[0].length > 30) salvaged = nameStart[0].trim()
      }
      if (salvaged) kept.push(salvaged)
      continue
    }
    kept.push(p)
  }

  return kept.join(' ').replace(/\s+/g, ' ').trim()
}

export function extractMoneyAmounts(text) {
  const amounts = []
  const re =
    /(?:\$|USD\s*|CAD\s*|Rs\.?\s*|INR\s*)(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?)|\b(\d{1,3}(?:,\d{3})+|\d{3,})(?:\s*(?:dollars?|bucks))?\b/gi
  let match
  while ((match = re.exec(text))) {
    const raw = match[1] || match[2]
    const value = Number(String(raw).replace(/,/g, ''))
    if (!Number.isNaN(value) && value >= 10 && value < 1_000_000) {
      amounts.push(value)
    }
  }
  return [...new Set(amounts)].sort((a, b) => b - a)
}

function detectCategory(explicitCategory, text) {
  if (explicitCategory && explicitCategory !== 'other') return explicitCategory
  const t = text.toLowerCase()
  if (/\b(hackathon|prize|winning|co-?partner|cofounder|split|50\/50|half and half|presentation|idea|develop)\b/.test(t)) {
    return 'partnership_prize'
  }
  if (/\b(roommate|shared|discard|coffee|appliance|joint purchase)\b/.test(t)) {
    return 'shared_property'
  }
  if (/\b(invoice|contract|unpaid|services|fee)\b/.test(t)) {
    return 'unpaid_contract'
  }
  if (/\b(refund|merchant|defective|purchase|store)\b/.test(t)) {
    return 'consumer_refund'
  }
  if (/\b(broke|damage|negligen|accident|leak|unsafe)\b/.test(t)) {
    return 'negligence_damage'
  }
  return explicitCategory || 'other'
}

function venueForJurisdiction(jurisdiction) {
  const label = jurisdiction || 'International'
  if (label.includes('Nova Scotia')) {
    return {
      court: 'Small Claims Court Act (Nova Scotia)',
      note: 'Money claims of this size are heard in Nova Scotia Small Claims Court, not superior court.',
    }
  }
  if (label.includes('Ontario')) {
    return {
      court: 'Rules of the Small Claims Court (Ontario)',
      note: 'Ontario Small Claims Court decides debt, property, and contract claims within its monetary limit.',
    }
  }
  if (label.includes('British Columbia')) {
    return {
      court: 'Small Claims Act (British Columbia)',
      note: 'BC Small Claims Court covers most consumer, contract, and property money claims of this scale.',
    }
  }
  if (label.includes('Quebec')) {
    return {
      court: 'Code of Civil Procedure — Small Claims Division (Quebec)',
      note: 'Quebec’s small-claims division hears consumer and contract disputes within its limit.',
    }
  }
  if (label.startsWith('Canada')) {
    return {
      court: `Provincial small-claims practice (${label})`,
      note: 'Canadian small-claims rules are provincial. The selected province sets the court, limit, and forms.',
    }
  }
  if (label === 'US') {
    return {
      court: 'State small-claims / limited civil practice (US)',
      note: 'US small-claims procedure is state-based. This award uses general consumer and contract principles.',
    }
  }
  if (label === 'India') {
    return {
      court: 'Consumer Protection Act, 2019 / Lok Adalat practice (India)',
      note: 'Consumer and small civil money claims may be conciliated or decided in a consumer forum or Lok Adalat.',
    }
  }
  return {
    court: 'International micro-claims equity practice',
    note: 'No single statute applies. The bench uses good-faith accounting and contribution principles.',
  }
}

function lawsForCategory(category, jurisdiction) {
  const venue = venueForJurisdiction(jurisdiction)
  const extras = {
    partnership_prize: [
      {
        title: 'Equitable accounting among collaborators',
        note: 'Prize or revenue from a joint venture is split by proven contribution, not by who first claimed the idea.',
      },
      {
        title: 'Good-faith dealing between partners',
        note: 'Each side must give a fair account of work, money, and any side agreement about the split.',
      },
    ],
    shared_property: [
      {
        title: 'Duty of reasonable notice between co-owners',
        note: 'Shared goods should not be sold, discarded, or kept exclusively without telling the other owner.',
      },
      {
        title: 'Contribution toward jointly purchased property',
        note: 'If one party paid more or lost the item through the other’s act, money can adjust the imbalance.',
      },
    ],
    unpaid_contract: [
      {
        title: 'Payment for services rendered',
        note: 'Work accepted or used should be paid at the agreed price, or a reasonable price if none was written.',
      },
      {
        title: 'Simple breach of contract',
        note: 'Failure to pay an invoice after the work was delivered is a debt claim in small claims.',
      },
    ],
    consumer_refund: [
      {
        title: 'Fitness for purpose / merchantable quality',
        note: 'A seller who supplies a defective everyday good may owe a refund, repair, or replacement.',
      },
      {
        title: 'Consumer fair dealing',
        note: 'A refused refund is judged against what a reasonable buyer was promised at the time of sale.',
      },
    ],
    negligence_damage: [
      {
        title: 'Duty to prevent foreseeable harm',
        note: 'A person who carelessly damages another’s property can be ordered to pay repair or replacement value.',
      },
      {
        title: 'Fair apportionment of fault',
        note: 'If both sides were careless, the award is reduced by the claimant’s own share of fault.',
      },
    ],
    other: [
      {
        title: 'Good faith in micro-claims',
        note: 'Each party must state facts honestly. The bench weighs the live record, not later argument.',
      },
      {
        title: 'Equitable relief in small claims',
        note: 'Where a statute is thin, the court can still order a fair money adjustment from the testimony.',
      },
    ],
  }

  return [
    { title: venue.court, note: venue.note },
    ...(extras[category] || extras.other),
  ]
}

function scoreContribution(text) {
  const t = text.toLowerCase()
  let score = 40
  if (/\b(i did|i developed|i created|i built|i implemented|all the work|most of the|80|90|technical)\b/.test(t)) {
    score += 25
  }
  if (/\b(my idea|initial idea|my features|presentation|i pitched|i presented)\b/.test(t)) {
    score += 18
  }
  if (/\b(half|50\/50|equal|we agreed)\b/.test(t)) score += 5
  if (/\b(he did|she did|they only|just did|only presentation|only idea)\b/.test(t)) {
    score += 8
  }
  return Math.max(10, Math.min(90, score))
}

function analyzePartnershipPrize(claimantText, defendantText, amounts) {
  const cScore = scoreContribution(claimantText)
  const dScore = scoreContribution(defendantText)
  const total = cScore + dScore || 1

  let claimantShare = Math.round((cScore / total) * 100)
  claimantShare = Math.max(25, Math.min(75, claimantShare))
  const defendantShare = 100 - claimantShare

  const prize = amounts.find((a) => a >= 1000) || amounts[0] || 8000
  const claimantAsk =
    amounts.find((a) => a !== prize && a >= 500) || Math.round(prize * 0.625)
  const claimantAward = Math.round((prize * claimantShare) / 100)
  const defendantAward = prize - claimantAward
  const allocation = { claimant: claimantShare, defendant: defendantShare }

  return {
    faultSplit: allocation,
    damagesAwarded: `Prize pool $${prize.toLocaleString()}: Claimant $${claimantAward.toLocaleString()} (${claimantShare}%) · Defendant $${defendantAward.toLocaleString()} (${defendantShare}%)`,
    damagesSpoken: `${claimantAward} dollars to the claimant and ${defendantAward} dollars to the defendant from the ${prize} dollar prize pool`,
    reasoning: `This is a collaboration / prize-split dispute over approximately $${prize.toLocaleString()}. The claimant emphasizes majority development work; the defendant emphasizes idea ownership and presentation. Balancing contribution evidence on the record, the court allocates ${claimantShare}% / ${defendantShare}%.`,
    favored:
      claimantShare >= defendantShare ? 'claimant' : 'defendant',
    claimantAsk,
  }
}

function analyzeGeneric(claimantText, defendantText, amounts, category) {
  const tC = claimantText.toLowerCase()
  const tD = defendantText.toLowerCase()

  let cLiab = 45
  let dLiab = 55

  if (/\b(i did all|majority|80|90|most of the work)\b/.test(tC)) dLiab += 10
  if (/\b(my idea|presentation|features was mine)\b/.test(tD)) cLiab += 8
  if (/\b(admit|my fault|sorry)\b/.test(tC)) cLiab += 12
  if (/\b(admit|my fault|sorry)\b/.test(tD)) dLiab += 12
  if (/\b(never|no notice|didn't tell)\b/.test(tC)) dLiab += 8
  if (/\b(never|no notice|didn't tell)\b/.test(tD)) cLiab += 8

  const total = cLiab + dLiab
  let claimant = Math.round((cLiab / total) * 100)
  claimant = Math.max(20, Math.min(80, claimant))
  const defendant = 100 - claimant
  const fault = { claimant, defendant }

  const pool = amounts[0]
  let damagesAwarded
  let damagesSpoken
  if (pool) {
    const owed = Math.round(pool * (defendant / 100))
    damagesAwarded = `$${owed.toLocaleString()} payable by defendant (${defendant}% of $${pool.toLocaleString()} in dispute)`
    damagesSpoken = `${owed} dollars payable by the defendant`
  } else if (category === 'unpaid_contract') {
    damagesAwarded = 'Contract balance due — amount to be confirmed from invoice evidence'
    damagesSpoken = 'the unpaid contract balance to be confirmed from invoice evidence'
  } else {
    damagesAwarded = 'Equitable relief granted based on the live testimony record'
    damagesSpoken = 'equitable relief based on the testimony presented'
  }

  return {
    faultSplit: fault,
    damagesAwarded,
    damagesSpoken,
    reasoning: `After weighing both accounts in this ${category.replace(/_/g, ' ')} dispute, liability is ${claimant}% claimant / ${defendant}% defendant.`,
    favored: defendant >= claimant ? 'claimant' : 'defendant',
  }
}

function excerpt(text, max = 180) {
  const clean = (text || '').trim()
  if (!clean) return '(no spoken testimony recorded)'
  return clean.length > max ? `${clean.slice(0, max)}…` : clean
}

export function analyzeDispute(
  claimantRaw,
  defendantRaw,
  {
    jurisdiction = 'International',
    caseId = 'VER-UNKNOWN',
    language = 'English',
    disputeCategory = 'other',
    party1Name = 'Claimant',
    party2Name = 'Defendant',
    claimantExhibits = [],
    defendantExhibits = [],
  } = {},
) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const claimantText = extractPartySpeech(claimantRaw)
      const defendantText = extractPartySpeech(defendantRaw)
      const combined = `${claimantText} ${defendantText}`
      const amounts = extractMoneyAmounts(combined)
      const category = detectCategory(disputeCategory, combined)
      const lawsDetail = lawsForCategory(category, jurisdiction)
      const lawsCited = lawsDetail.map((law) => law.title)

      const analysis =
        category === 'partnership_prize'
          ? analyzePartnershipPrize(claimantText, defendantText, amounts)
          : analyzeGeneric(claimantText, defendantText, amounts, category)

      const categoryLabel =
        DISPUTE_CATEGORIES.find((c) => c.id === category)?.label || category

      const awardReason = amounts.length
        ? `${analysis.reasoning} Dollar figures on the record: ${amounts
            .slice(0, 3)
            .map((n) => `$${n.toLocaleString()}`)
            .join(', ')}.`
        : `${analysis.reasoning} No clear dollar figure was spoken, so the award stays qualitative.`

      const verdictSummary = [
        `In Case ${caseId} (${jurisdiction}), dispute category: ${categoryLabel}.`,
        analysis.reasoning,
        `${party1Name} (Claimant) testified: "${excerpt(claimantText)}".`,
        `${party2Name} (Defendant) testified: "${excerpt(defendantText)}".`,
        `Allocation / fault on the record: ${analysis.faultSplit.claimant}% to ${party1Name}, ${analysis.faultSplit.defendant}% to ${party2Name}.`,
        claimantExhibits.length || defendantExhibits.length
          ? `Exhibits filed: claimant ${claimantExhibits.join(', ') || 'none'}; defendant ${defendantExhibits.join(', ') || 'none'}.`
          : '',
        `Award: ${analysis.damagesAwarded}.`,
      ]
        .filter(Boolean)
        .join(' ')

      const spokenVerdict = [
        `This is Judge Veritas, rendering judgment for Case ${caseId}.`,
        `Under ${jurisdiction} micro-claims practice, this matter is treated as a ${categoryLabel} dispute.`,
        `${party1Name} stated: ${excerpt(claimantText, 110)}.`,
        `${party2Name} stated: ${excerpt(defendantText, 110)}.`,
        analysis.reasoning,
        `The court allocates ${analysis.faultSplit.claimant} percent regarding ${party1Name} and ${analysis.faultSplit.defendant} percent regarding ${party2Name}.`,
        `The court awards ${analysis.damagesSpoken}.`,
        `This decision relies on ${lawsCited[0]}, and also considers ${lawsCited[1]}.`,
        'This concludes the verbal judgment of the Autonomous Micro-Claims Court.',
      ].join(' ')

      resolve({
        verdictSummary,
        faultSplit: analysis.faultSplit,
        damagesAwarded: analysis.damagesAwarded,
        awardReason,
        lawsCited,
        lawsDetail,
        spokenVerdict,
        reasoning: analysis.reasoning,
        engine: 'heuristic',
        disputeCategory: category,
        caseContext: {
          jurisdiction,
          caseId,
          language,
          disputeCategory: category,
        },
        aggregatedTestimony: {
          claimant: claimantRaw,
          defendant: defendantRaw,
          claimantSpeech: claimantText,
          defendantSpeech: defendantText,
          claimantExhibits,
          defendantExhibits,
        },
      })
    }, 1600)
  })
}
