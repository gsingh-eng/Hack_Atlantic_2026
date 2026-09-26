const STORAGE_KEY = 'veritas.docket.v1'

export const CASE_STATUS = {
  scheduled: 'scheduled',
  ready: 'ready',
  heard: 'heard',
}

function sampleVerdict({
  id,
  venue,
  summary,
  damagesAwarded,
  awardReason,
  spokenVerdict,
  faultSplit,
  lawsDetail,
  disputeCategory,
  claimant,
  defendant,
}) {
  return {
    verdictSummary: summary,
    faultSplit,
    damagesAwarded,
    awardReason,
    lawsCited: lawsDetail.map((law) => law.title),
    lawsDetail,
    spokenVerdict,
    disputeCategory,
    engine: 'sample',
    engineLabel: 'Sample judgment',
    aggregatedTestimony: { claimant, defendant },
    caseContext: { jurisdiction: venue, caseId: id },
  }
}

function seedCases() {
  const hour = 60 * 60 * 1000
  const day = 24 * hour

  return [
    {
      id: 'VER-NS-2048',
      status: CASE_STATUS.scheduled,
      party1Name: 'Maya Chen',
      party2Name: 'Owen Fraser',
      jurisdiction: 'Canada',
      canadaProvince: 'Nova Scotia',
      disputeCategory: 'partnership_prize',
      language: 'English',
      schedule: { dayLabel: 'Friday, Sep 25', slot: '11:00 AM' },
      summary: 'Hackathon prize split after a weekend build.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 36 * hour,
    },
    {
      id: 'VER-ON-1182',
      status: CASE_STATUS.ready,
      party1Name: 'Priya Shah',
      party2Name: 'Northline Appliances',
      jurisdiction: 'Canada',
      canadaProvince: 'Ontario',
      disputeCategory: 'consumer_refund',
      language: 'English',
      schedule: null,
      summary: 'Defective espresso machine; refund refused.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 12 * hour,
    },
    {
      id: 'VER-QC-7710',
      status: CASE_STATUS.scheduled,
      party1Name: 'Émile Gagnon',
      party2Name: 'Sofia Hart',
      jurisdiction: 'Canada',
      canadaProvince: 'Quebec',
      disputeCategory: 'unpaid_contract',
      language: 'English',
      schedule: { dayLabel: 'Monday, Sep 28', slot: '01:00 PM' },
      summary: 'Unpaid invoice for freelance design work.',
      pin: '0000',
      sealed: true,
      updatedAt: Date.now() - 6 * hour,
    },
    {
      id: 'VER-NB-5510',
      status: CASE_STATUS.scheduled,
      party1Name: 'Gunpreet Singh',
      party2Name: 'Jordan Hale',
      jurisdiction: 'Canada',
      canadaProvince: 'New Brunswick',
      disputeCategory: 'shared_property',
      language: 'English',
      schedule: { dayLabel: 'Saturday, Sep 26', slot: '10:30 AM' },
      summary: 'Roommate hydro bill: $150 claimed, $100 said to be paid in cash.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 4 * hour,
    },
    {
      id: 'VER-AB-4102',
      status: CASE_STATUS.scheduled,
      party1Name: 'Aisha Rahman',
      party2Name: 'Peakline Roofing',
      jurisdiction: 'Canada',
      canadaProvince: 'Alberta',
      disputeCategory: 'unpaid_contract',
      language: 'English',
      schedule: { dayLabel: 'Tuesday, Sep 29', slot: '02:15 PM' },
      summary: 'Garage-roof patch billed at $680; homeowner says work was incomplete.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 8 * hour,
    },
    {
      id: 'VER-MB-2208',
      status: CASE_STATUS.scheduled,
      party1Name: 'Noah Keating',
      party2Name: 'Riley Cho',
      jurisdiction: 'Canada',
      canadaProvince: 'Manitoba',
      disputeCategory: 'shared_property',
      language: 'English',
      schedule: { dayLabel: 'Thursday, Oct 1', slot: '09:00 AM' },
      summary: 'Shared washer left in the hallway and sold without notice.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 10 * hour,
    },
    {
      id: 'VER-PE-0904',
      status: CASE_STATUS.scheduled,
      party1Name: 'Claire Doucette',
      party2Name: 'Harbour Gift Co.',
      jurisdiction: 'Canada',
      canadaProvince: 'Prince Edward Island',
      disputeCategory: 'consumer_refund',
      language: 'English',
      schedule: { dayLabel: 'Wednesday, Sep 30', slot: '03:45 PM' },
      summary: 'Online order arrived damaged; store offered store credit only.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 14 * hour,
    },
    {
      id: 'VER-NL-3340',
      status: CASE_STATUS.scheduled,
      party1Name: 'Marcus White',
      party2Name: 'Dana Pike',
      jurisdiction: 'Canada',
      canadaProvince: 'Newfoundland and Labrador',
      disputeCategory: 'negligence_damage',
      language: 'English',
      schedule: { dayLabel: 'Friday, Oct 2', slot: '11:30 AM' },
      summary: 'Parking-lot scrape; claimant wants $900 in bodywork.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 16 * hour,
    },
    {
      id: 'VER-SK-6671',
      status: CASE_STATUS.scheduled,
      party1Name: 'Tara Gill',
      party2Name: 'Ben Okonkwo',
      jurisdiction: 'Canada',
      canadaProvince: 'Saskatchewan',
      disputeCategory: 'partnership_prize',
      language: 'English',
      schedule: { dayLabel: 'Monday, Oct 5', slot: '01:30 PM' },
      summary: '$4,000 campus pitch prize; who did the build vs the pitch.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 18 * hour,
    },
    {
      id: 'VER-US-8821',
      status: CASE_STATUS.scheduled,
      party1Name: 'Elena Ruiz',
      party2Name: 'MetroFit Gym',
      jurisdiction: 'US',
      canadaProvince: '',
      disputeCategory: 'consumer_refund',
      language: 'English',
      schedule: { dayLabel: 'Thursday, Oct 1', slot: '04:00 PM' },
      summary: 'Annual gym fee charged after a written cancel request.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 20 * hour,
    },
    {
      id: 'VER-IN-1190',
      status: CASE_STATUS.scheduled,
      party1Name: 'Arjun Mehta',
      party2Name: 'Kavya Iyer',
      jurisdiction: 'India',
      canadaProvince: '',
      disputeCategory: 'unpaid_contract',
      language: 'English',
      schedule: { dayLabel: 'Saturday, Oct 3', slot: '10:00 AM' },
      summary: 'Wedding-photo edit package; final payment of ₹18,000 unpaid.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 22 * hour,
    },
    {
      id: 'VER-NS-7722',
      status: CASE_STATUS.ready,
      party1Name: 'Hannah MacLeod',
      party2Name: 'Eastport Phones',
      jurisdiction: 'Canada',
      canadaProvince: 'Nova Scotia',
      disputeCategory: 'consumer_refund',
      language: 'English',
      schedule: null,
      summary: 'Cracked-screen repair failed twice; wants the $220 fee back.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 3 * hour,
    },
    {
      id: 'VER-ON-4400',
      status: CASE_STATUS.ready,
      party1Name: 'Samir Patel',
      party2Name: 'Quinn Adler',
      jurisdiction: 'Canada',
      canadaProvince: 'Ontario',
      disputeCategory: 'negligence_damage',
      language: 'English',
      schedule: null,
      summary: 'Borrowed laptop dropped on concrete; repair quote $640.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 5 * hour,
    },
    {
      id: 'VER-BC-9088',
      status: CASE_STATUS.scheduled,
      party1Name: 'Mei Lin',
      party2Name: 'Harper Cole',
      jurisdiction: 'Canada',
      canadaProvince: 'British Columbia',
      disputeCategory: 'shared_property',
      language: 'English',
      schedule: { dayLabel: 'Sunday, Sep 27', slot: '02:00 PM' },
      summary: 'Sealed roommate file: deposit and a missing bike.',
      pin: '0000',
      sealed: true,
      updatedAt: Date.now() - 7 * hour,
    },
    {
      id: 'VER-US-5500',
      status: CASE_STATUS.ready,
      party1Name: 'Jordan Blake',
      party2Name: 'Cedar Storage LLC',
      jurisdiction: 'US',
      canadaProvince: '',
      disputeCategory: 'unpaid_contract',
      language: 'English',
      schedule: null,
      summary: 'Sealed file: unit cleared after a late-fee dispute.',
      pin: '0000',
      sealed: true,
      updatedAt: Date.now() - 9 * hour,
    },
    {
      id: 'VER-IN-6602',
      status: CASE_STATUS.scheduled,
      party1Name: 'Neha Kapoor',
      party2Name: 'Rohan Das',
      jurisdiction: 'India',
      canadaProvince: '',
      disputeCategory: 'partnership_prize',
      language: 'English',
      schedule: { dayLabel: 'Tuesday, Oct 6', slot: '12:00 PM' },
      summary: 'Sealed campus-hack prize split; PIN on the docket card.',
      pin: '0000',
      sealed: true,
      updatedAt: Date.now() - 11 * hour,
    },
    {
      id: 'VER-BC-3301',
      status: CASE_STATUS.heard,
      party1Name: 'Lena Okoye',
      party2Name: 'Chris Dalton',
      jurisdiction: 'Canada',
      canadaProvince: 'British Columbia',
      disputeCategory: 'shared_property',
      language: 'English',
      schedule: { dayLabel: 'Wednesday, Sep 16', slot: '03:00 PM' },
      summary: 'Roommate dispute over a discarded shared sofa.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 5 * day,
      verdict: sampleVerdict({
        id: 'VER-BC-3301',
        venue: 'Canada · British Columbia',
        summary:
          'In Case VER-BC-3301 (Canada · British Columbia), this was a shared-property dispute. The sofa was jointly purchased. The defendant discarded it without reasonable notice. The court awards the claimant $420 toward replacement.',
        damagesAwarded: '$420 payable by the defendant toward replacement',
        awardReason:
          'Joint purchase plus disposal without notice. Claimant kept the item usable; defendant acted unilaterally.',
        spokenVerdict:
          'This is Judge Veritas, rendering judgment for Case VER-BC-3301. The sofa was shared property. The defendant discarded it without notice. The court awards four hundred twenty dollars to the claimant. This concludes the verbal judgment.',
        faultSplit: { claimant: 25, defendant: 75 },
        lawsDetail: [
          {
            title: 'Small Claims Act (British Columbia)',
            note: 'Money and personal-property claims of this size belong in Small Claims Court.',
          },
          {
            title: 'Duty of reasonable notice',
            note: 'A co-owner should not dispose of shared goods without telling the other party.',
          },
        ],
        disputeCategory: 'shared_property',
        claimant: 'We bought the sofa together. He threw it out while I was away.',
        defendant: 'It was broken and taking space. I thought she did not want it.',
      }),
    },
    {
      id: 'VER-ON-2019',
      status: CASE_STATUS.heard,
      party1Name: 'Leah Martin',
      party2Name: 'QuickCart Inc.',
      jurisdiction: 'Canada',
      canadaProvince: 'Ontario',
      disputeCategory: 'consumer_refund',
      language: 'English',
      schedule: { dayLabel: 'Monday, Sep 14', slot: '10:00 AM' },
      summary: 'Heard: cancelled online order, refund delayed 40 days.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 8 * day,
      verdict: sampleVerdict({
        id: 'VER-ON-2019',
        venue: 'Canada · Ontario',
        summary:
          'In Case VER-ON-2019 (Canada · Ontario), the claimant cancelled within the promised window. The defendant kept $89. The court orders a full refund.',
        damagesAwarded: '$89 refund to the claimant',
        awardReason: 'Cancellation was on time. No restocking fee was in the record.',
        spokenVerdict:
          'This is Judge Veritas, rendering judgment for Case VER-ON-2019. The order was cancelled in time. The court orders an eighty-nine dollar refund. This concludes the verbal judgment.',
        faultSplit: { claimant: 0, defendant: 100 },
        lawsDetail: [
          {
            title: 'Consumer Protection Act, 2002 (Ontario)',
            note: 'Internet-agreement cancellations and refund timing.',
          },
        ],
        disputeCategory: 'consumer_refund',
        claimant: 'I cancelled the next morning. They still have my $89.',
        defendant: 'The item was already picked. We offered store credit.',
      }),
    },
    {
      id: 'VER-IN-3044',
      status: CASE_STATUS.heard,
      party1Name: 'Vikram Rao',
      party2Name: 'Sana Qureshi',
      jurisdiction: 'India',
      canadaProvince: '',
      disputeCategory: 'unpaid_contract',
      language: 'English',
      schedule: { dayLabel: 'Friday, Sep 11', slot: '05:00 PM' },
      summary: 'Heard: tutoring hours delivered; last two weeks unpaid.',
      pin: null,
      sealed: false,
      updatedAt: Date.now() - 10 * day,
      verdict: sampleVerdict({
        id: 'VER-IN-3044',
        venue: 'India',
        summary:
          'In Case VER-IN-3044 (India), tutoring was delivered for two unpaid weeks at the agreed rate. The court awards the unpaid balance.',
        damagesAwarded: '₹8,000 unpaid tutoring fees',
        awardReason: 'Hours were not disputed. Only payment was.',
        spokenVerdict:
          'This is Judge Veritas, rendering judgment for Case VER-IN-3044. The lessons were given. The court awards eight thousand rupees for the unpaid weeks. This concludes the verbal judgment.',
        faultSplit: { claimant: 10, defendant: 90 },
        lawsDetail: [
          {
            title: 'Indian Contract Act, 1872',
            note: 'Payment is due when agreed work is performed.',
          },
        ],
        disputeCategory: 'unpaid_contract',
        claimant: 'I taught both weeks. She stopped paying after week two.',
        defendant: 'I was unhappy with one session. I still attended.',
      }),
    },
  ]
}

function readRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { cases: seedCases() }
    const parsed = JSON.parse(raw)
    const stored = Array.isArray(parsed?.cases) ? parsed.cases : []
    const byId = new Map(stored.map((c) => [c.id, c]))
    for (const seed of seedCases()) {
      if (!byId.has(seed.id)) {
        byId.set(seed.id, seed)
        continue
      }
      const existing = byId.get(seed.id)
      if (existing?.sealed && existing.pin && existing.pin !== '0000') {
        byId.set(seed.id, { ...existing, pin: '0000' })
      }
    }
    return { cases: [...byId.values()] }
  } catch {
    return { cases: seedCases() }
  }
}

function writeRaw(cases) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ cases }))
}

export function listCases() {
  return readRaw()
    .cases.slice()
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
}

export function findCase(id) {
  if (!id?.trim()) return null
  const needle = id.trim().toUpperCase()
  return listCases().find((c) => c.id.toUpperCase() === needle) || null
}

export function upsertCase(partial) {
  if (!partial?.id) return null
  const cases = listCases()
  const id = String(partial.id).trim().toUpperCase()
  const index = cases.findIndex((c) => c.id.toUpperCase() === id)
  const prev = index >= 0 ? cases[index] : {}
  const next = {
    ...prev,
    ...partial,
    id,
    updatedAt: Date.now(),
  }
  if (index >= 0) cases[index] = next
  else cases.unshift(next)
  writeRaw(cases)
  return next
}

export function statusLabel(status) {
  if (status === CASE_STATUS.heard) return 'Heard'
  if (status === CASE_STATUS.scheduled) return 'Scheduled'
  if (status === CASE_STATUS.ready) return 'Ready to start'
  return 'On file'
}

export function formatSchedule(caseRecord) {
  if (!caseRecord?.schedule?.dayLabel) return 'No hearing time on file'
  return `${caseRecord.schedule.dayLabel} at ${caseRecord.schedule.slot}`
}
