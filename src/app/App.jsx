import { AppHeader } from './AppHeader'

export default function App() {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <AppHeader stageLabel="Welcome" />
        <section className="rounded-2xl border border-amber-900/15 bg-[#faf6ee]/90 p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
            Welcome to Veritas
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
            Two sides. One hearing. One decision.
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Small-claims style arbitration for Hack Atlantic. Both parties
            speak. Judge Veritas writes the result. This is a demo, not legal
            advice.
          </p>
        </section>
      </div>
    </div>
  )
}
