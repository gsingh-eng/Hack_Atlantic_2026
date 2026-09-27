const MODELS = [
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
]

function clampPercent(value, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.max(0, Math.min(100, Math.round(n)))
}

function buildPrompt({
  claimantText,
  defendantText,
  jurisdiction,
  caseId,
  language,
  disputeCategory,
  party1Name,
  party2Name,
  exhibitRecord = '',
}) {
  return `You are Judge Veritas, a mock micro-claims arbitrator for a student hackathon demo.
This is NOT real legal advice. Decide as a small-claims bench would, using public-style rules for the venue.

Venue: ${jurisdiction}
Case ID: ${caseId}
Language: ${language}
Dispute category: ${disputeCategory}
Claimant: ${party1Name}
Defendant: ${party2Name}

CLAIMANT TESTIMONY:
${claimantText || '(none recorded)'}

DEFENDANT TESTIMONY:
${defendantText || '(none recorded)'}

FILED EXHIBITS:
${exhibitRecord || '(none filed)'}

Rules:
- Use only facts on this record. Do not invent extra facts, documents, or dollar amounts.
- If a prize, invoice, or purchase price was spoken, use that number.
- You MAY read attached images and PDFs. Treat them as evidence. Do not invent contents you cannot see.
- If Canada + a province is named, cite that province's small-claims court / act, not a fake "Section 5B".
- If both testimonies are empty or only court directions, set outcome to "dismissed". faultSplit must be claimant 0 and defendant 0. Damages $0. A failed burden of proof is a dismissal — do NOT mark either party at fault.
- faultSplit is percent responsibility for the loss. It must sum to 100 unless dismissed (then both 0).
- Spoken verdict: 8-14 spoken sentences, first person as the judge, no markdown.
- List 2 to 5 key facts the decision relies on. For each fact give who said it (claimant or defendant) and a short exact quote of 4 to 15 words copied from their testimony. If there are no supporting words, do not list the fact.

Return ONLY JSON with this shape:
{
  "outcome": "claimant_wins | defendant_wins | split | dismissed",
  "verdictSummary": "2-4 sentences",
  "awardReason": "1-2 sentences explaining the money",
  "damagesAwarded": "short award string, include $ if money is on the record",
  "damagesSpoken": "plain speech version of the award, no $ sign needed",
  "faultSplit": { "claimant": 0, "defendant": 0 },
  "lawsDetail": [
    { "title": "real statute or rule name", "note": "why it applies here" }
  ],
  "spokenVerdict": "full oral judgment",
  "findings": [
    { "fact": "one key fact", "party": "claimant | defendant", "quote": "4 to 15 words from testimony" }
  ],
  "disputeCategory": "${disputeCategory}"
}`
}

function readOutcome(data) {
  const raw = String(data?.outcome || '')
    .toLowerCase()
    .trim()
  if (raw === 'dismiss' || raw === 'dismissed') return 'dismissed'
  if (raw === 'claimant_wins' || raw === 'defendant_wins' || raw === 'split') {
    return raw
  }
  const claimant = Number(data?.faultSplit?.claimant)
  const defendant = Number(data?.faultSplit?.defendant)
  if (claimant === 0 && defendant === 0) return 'dismissed'
  return 'split'
}

const VERDICT_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    outcome: {
      type: 'STRING',
      enum: ['claimant_wins', 'defendant_wins', 'split', 'dismissed'],
    },
    verdictSummary: { type: 'STRING' },
    awardReason: { type: 'STRING' },
    damagesAwarded: { type: 'STRING' },
    damagesSpoken: { type: 'STRING' },
    faultSplit: {
      type: 'OBJECT',
      properties: {
        claimant: { type: 'NUMBER' },
        defendant: { type: 'NUMBER' },
      },
      required: ['claimant', 'defendant'],
    },
    lawsDetail: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          note: { type: 'STRING' },
        },
        required: ['title', 'note'],
      },
    },
    spokenVerdict: { type: 'STRING' },
    findings: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          fact: { type: 'STRING' },
          party: { type: 'STRING', enum: ['claimant', 'defendant'] },
          quote: { type: 'STRING' },
        },
        required: ['fact', 'party', 'quote'],
      },
    },
    disputeCategory: { type: 'STRING' },
  },
  required: [
    'outcome',
    'verdictSummary',
    'awardReason',
    'damagesAwarded',
    'damagesSpoken',
    'faultSplit',
    'lawsDetail',
    'spokenVerdict',
    'findings',
  ],
}

const APPEAL_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    agrees: { type: 'BOOLEAN' },
    confidence: { type: 'STRING', enum: ['high', 'medium', 'low'] },
    concerns: {
      type: 'ARRAY',
      items: { type: 'STRING' },
    },
  },
  required: ['agrees', 'confidence', 'concerns'],
}

function parseModelJson(raw) {
  if (!raw) throw new Error('Empty Gemini text')
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '')
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Gemini did not return JSON')
  return JSON.parse(cleaned.slice(start, end + 1))
}

function cleanFindings(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => ({
      fact: String(item?.fact || '').trim(),
      party: item?.party === 'defendant' ? 'defendant' : 'claimant',
      quote: String(item?.quote || '').trim(),
    }))
    .filter((item) => item.fact && item.quote)
    .slice(0, 6)
}

async function callModel(
  apiKey,
  model,
  prompt,
  extraParts = [],
  useSchema = true,
  schema = VERDICT_RESPONSE_SCHEMA,
  timeoutMs = 0,
) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  const generationConfig = {
    temperature: 0.25,
    responseMimeType: 'application/json',
  }
  if (useSchema) generationConfig.responseSchema = schema

  const controller = timeoutMs > 0 ? new AbortController() : null
  const timer =
    controller && setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }, ...extraParts] }],
        generationConfig,
      }),
      signal: controller?.signal,
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      const msg = payload?.error?.message || `Gemini ${model} failed (${response.status})`
      throw new Error(msg)
    }

    const text = payload?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim()
    return parseModelJson(text)
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export async function decideWithGemini(claimantText, defendantText, context) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) return null

  const prompt = buildPrompt({
    claimantText,
    defendantText,
    ...context,
  })
  const extraParts = Array.isArray(context.exhibitParts) ? context.exhibitParts : []

  let lastError
  for (const model of MODELS) {
    try {
      let data
      try {
        data = await callModel(apiKey, model, prompt, extraParts, true)
      } catch (schemaError) {
        console.warn(`Gemini ${model} schema rejected, retrying plain JSON:`, schemaError)
        data = await callModel(apiKey, model, prompt, extraParts, false)
      }
      const outcome = readOutcome(data)
      const dismissed = outcome === 'dismissed'
      const claimant = dismissed ? 0 : clampPercent(data.faultSplit?.claimant, 50)
      const defendant = dismissed ? 0 : 100 - claimant
      const lawsDetail = Array.isArray(data.lawsDetail)
        ? data.lawsDetail
            .filter((law) => law?.title)
            .map((law) => ({
              title: String(law.title),
              note: String(law.note || ''),
            }))
        : []

      return {
        outcome,
        verdictSummary: String(data.verdictSummary || '').trim(),
        awardReason: String(data.awardReason || data.verdictSummary || '').trim(),
        damagesAwarded: String(
          dismissed
            ? data.damagesAwarded || '$0 · claim dismissed'
            : data.damagesAwarded || 'Equitable relief on the record',
        ).trim(),
        damagesSpoken: String(
          dismissed
            ? data.damagesSpoken || 'zero dollars. The claim is dismissed'
            : data.damagesSpoken || data.damagesAwarded || '',
        ).trim(),
        faultSplit: { claimant, defendant },
        lawsDetail,
        lawsCited: lawsDetail.map((law) => law.title),
        spokenVerdict: String(data.spokenVerdict || data.verdictSummary || '').trim(),
        findings: cleanFindings(data.findings),
        model,
        disputeCategory: data.disputeCategory || context.disputeCategory,
        engine: 'gemini',
        engineLabel: `Gemini · ${model}`,
      }
    } catch (error) {
      lastError = error
      console.warn(`Gemini model ${model} failed:`, error)
    }
  }

  throw lastError || new Error('Gemini verdict failed')
}

export async function reviewVerdictWithGemini(claimantText, defendantText, verdict) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) return null
  if (!verdict || verdict.outcome === 'dismissed') return null

  const prompt = `You are a skeptical appeal reviewer for a student hackathon mock court. This is NOT real legal advice.
Read both testimonies and the draft verdict. Decide whether the outcome follows from what was said, whether the money is supported, and whether it relies on facts nobody said.

CLAIMANT TESTIMONY:
${claimantText || '(none recorded)'}

DEFENDANT TESTIMONY:
${defendantText || '(none recorded)'}

DRAFT VERDICT:
outcome: ${verdict.outcome || ''}
faultSplit: claimant ${verdict.faultSplit?.claimant ?? ''} / defendant ${verdict.faultSplit?.defendant ?? ''}
award: ${verdict.damagesAwarded || ''}
reason: ${verdict.awardReason || verdict.verdictSummary || ''}

Return ONLY JSON:
{
  "agrees": true,
  "confidence": "high | medium | low",
  "concerns": ["short concern"]
}`

  const model = MODELS[0]
  try {
    const data = await callModel(
      apiKey,
      model,
      prompt,
      [],
      true,
      APPEAL_RESPONSE_SCHEMA,
      10000,
    )
    const confidence = String(data?.confidence || '').toLowerCase()
    return {
      agrees: data?.agrees !== false,
      confidence:
        confidence === 'high' || confidence === 'low' ? confidence : 'medium',
      concerns: Array.isArray(data?.concerns)
        ? data.concerns.map((item) => String(item).trim()).filter(Boolean).slice(0, 3)
        : [],
    }
  } catch (error) {
    console.warn(`Appeal review ${model} failed:`, error)
    return null
  }
}
