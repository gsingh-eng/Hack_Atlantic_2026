import hearingWalkthrough from '../../../assets/training/VERITAS_AI.mp4'

export const TRAINING_VIDEO_SRC = hearingWalkthrough

export const TRAINING_STEPS = [
  {
    id: 'queue',
    target: 'queue',
    title: 'Wait in Queue',
    body: 'You will enter your name, email, and a short description of the dispute. Then stay in the queue until a slot opens — the wait is shortened for this demo.',
  },
  {
    id: 'book',
    target: 'book',
    title: 'Book a Slot',
    body: 'Prefer a set time? Pick an open day and hour. The case is saved on this device so you can come back when the hearing starts.',
  },
  {
    id: 'resume',
    target: 'resume',
    title: 'Resume Case ID',
    body: 'Already on the docket? Search by case ID, open a scheduled file, or unlock a sealed one with PIN 0000.',
  },
  {
    id: 'history',
    target: 'history',
    title: 'Hearing history',
    body: 'Finished hearings stay on this browser. Tap a card later to reopen the judgment, the award, and the transcripts.',
  },
  {
    id: 'video',
    target: null,
    kind: 'video',
    title: 'How the judge hears both sides',
    body: 'Watch Party 1 and Party 2 take the floor, then how Judge Veritas rules from what was actually said.',
  },
]
