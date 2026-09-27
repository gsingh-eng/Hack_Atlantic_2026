import { analyzeDispute, extractPartySpeech } from './analyzeDispute.js'
import { decideWithGemini, reviewVerdictWithGemini } from './geminiVerdict.js'
import { verifyVerdict } from './verifyVerdict.js'

function withFallbackFields(result, context = {}) {
  const prepared = {
    ...result,
    outcome: result.outcome || 'split',
    engine: result.engine || 'heuristic',
    engineLabel: result.engineLabel || 'Local rules engine',
    awardReason:
      result.awardReason ||
      result.reasoning ||
      'Award follows the testimony, claimed amounts, and selected dispute category.',
    lawsDetail:
      result.lawsDetail ||
      (result.lawsCited || []).map((title) => ({
        title,
        note: 'Cited from the demo micro-claims rule pack for this jurisdiction.',
      })),
  }
  return verifyVerdict(prepared, context)
}

function hasRecordedSpeech(text) {
  return extractPartySpeech(text).length >= 12
}

function dismissedForEmptyRecord(context, claimantRaw, defendantRaw) {
  const venue = context.jurisdiction || 'this venue'
  const caseId = context.caseId || 'this case'
  const party1Name = context.party1Name || 'the claimant'
  const party2Name = context.party2Name || 'the defendant'

  return withFallbackFields(
    {
      outcome: 'dismissed',
      verdictSummary: `In Case ${caseId} (${venue}), neither ${party1Name} nor ${party2Name} placed testimony or exhibits on the record. The claim is dismissed. That is not a finding that ${party1Name} caused the harm — there was simply nothing to decide.`,
      awardReason:
        'No testimony or proof of loss was recorded, so no money can be awarded.',
      damagesAwarded: '$0 · claim dismissed',
      damagesSpoken: 'zero dollars. The claim is dismissed',
      faultSplit: { claimant: 0, defendant: 0 },
      lawsDetail: [
        {
          title: `${venue} small-claims burden of proof`,
          note: 'The claimant must prove the claim. Silence is a dismissal, not a 100% fault finding against them.',
        },
      ],
      lawsCited: [`${venue} small-claims burden of proof`],
      spokenVerdict: `This is Judge Veritas, rendering judgment for Case ${caseId}. Neither party placed testimony on the record. The court cannot invent facts. The claim is dismissed. No damages are awarded. This is not a finding of fault against ${party1Name}. The matter is adjourned.`,
      reasoning: 'Empty record. Dismissal, not a fault split.',
      disputeCategory: context.disputeCategory,
      engine: 'empty-record',
      engineLabel: 'Record check · no testimony',
      caseContext: {
        jurisdiction: context.jurisdiction,
        caseId: context.caseId,
        language: context.language,
        disputeCategory: context.disputeCategory,
      },
      aggregatedTestimony: {
        claimant: claimantRaw,
        defendant: defendantRaw,
        claimantSpeech: '',
        defendantSpeech: '',
        claimantExhibits: context.claimantExhibits || [],
        defendantExhibits: context.defendantExhibits || [],
      },
    },
    context,
  )
}

export async function decideVerdict(claimantRaw, defendantRaw, context) {
  const claimantText = extractPartySpeech(claimantRaw)
  const defendantText = extractPartySpeech(defendantRaw)
  const hasExhibits =
    (context.claimantExhibits || []).length > 0 ||
    (context.defendantExhibits || []).length > 0 ||
    (context.exhibitParts || []).length > 0

  const recordContext = {
    ...context,
    claimantText,
    defendantText,
  }

  if (!hasRecordedSpeech(claimantRaw) && !hasRecordedSpeech(defendantRaw) && !hasExhibits) {
    return dismissedForEmptyRecord(context, claimantRaw, defendantRaw)
  }

  try {
    const gemini = await decideWithGemini(claimantText, defendantText, {
      ...context,
      claimantText,
      defendantText,
    })
    if (gemini?.verdictSummary && gemini?.spokenVerdict) {
      let appealReview = null
      try {
        appealReview = await reviewVerdictWithGemini(
          claimantText,
          defendantText,
          gemini,
        )
      } catch (error) {
        console.warn('Appeal review failed open:', error)
        appealReview = null
      }

      return withFallbackFields(
        {
          ...gemini,
          appealReview,
          caseContext: {
            jurisdiction: context.jurisdiction,
            caseId: context.caseId,
            language: context.language,
            disputeCategory: gemini.disputeCategory || context.disputeCategory,
          },
          aggregatedTestimony: {
            claimant: claimantRaw,
            defendant: defendantRaw,
            claimantSpeech: claimantText,
            defendantSpeech: defendantText,
          },
        },
        recordContext,
      )
    }
  } catch (error) {
    console.warn('Gemini unavailable, using local engine:', error)
  }

  const result = await analyzeDispute(claimantRaw, defendantRaw, context)
  return withFallbackFields(result, recordContext)
}
