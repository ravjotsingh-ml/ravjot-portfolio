import { useEffect, useState } from 'react'

const STEPS = [
  'Loading portfolio',
  'Preparing sections',
  'Warming the assistant',
]

/**
 * Full-screen loader shown until the app, the fonts and every asset are ready.
 * The landing page stays hidden behind it, so the visitor never sees a
 * half-painted page.
 */
export default function Preloader({ ready, onDone }) {
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((current) => (current < STEPS.length - 1 ? current + 1 : current))
    }, 700)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!ready) return undefined

    const leaveTimer = setTimeout(() => setLeaving(true), 220)
    const removeTimer = setTimeout(() => {
      setVisible(false)
      onDone?.()
    }, 720)

    return () => {
      clearTimeout(leaveTimer)
      clearTimeout(removeTimer)
    }
  }, [ready, onDone])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5 bg-night transition-opacity duration-500 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <span className="grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full border border-accent/35 bg-accent/[0.08] font-serif text-xl italic text-accent animate-[float_2.4s_ease-in-out_infinite]">
        rs
      </span>

      <div className="text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-faint">
          Ravjot Singh — Portfolio
        </p>
        <p className="mt-2 text-[13px] text-muted">{STEPS[step]}</p>
      </div>

      <div className="h-0.5 w-36 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
        <span
          className={`block h-full rounded-full bg-accent transition-all duration-700 ${
            leaving ? 'w-full' : step === 0 ? 'w-1/3' : step === 1 ? 'w-2/3' : 'w-full'
          }`}
        />
      </div>
    </div>
  )
}
