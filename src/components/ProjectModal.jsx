import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Button from './ui/Button'
import Icon from './ui/Icon'
import ProjectArtwork from './ProjectArtwork'

export default function ProjectModal({ project, onClose }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30)

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (!panelRef.current.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      window.clearTimeout(focusTimer)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        className="animate-fade-in relative z-10 max-h-[92dvh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-t-3xl border border-line bg-night shadow-2xl sm:rounded-3xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition-colors hover:border-accent/50 hover:bg-accent hover:text-[#08090a]"
        >
          <Icon name="close" size={16} />
        </button>

        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-line">
          <ProjectArtwork project={project} />
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
            <span className="text-accent">{project.category}</span>
            <span className="h-1 w-1 rounded-full bg-white/15" aria-hidden="true" />
            <span>{project.year}</span>
            <span className="h-1 w-1 rounded-full bg-white/15" aria-hidden="true" />
            <span>{project.role}</span>
          </div>

          <h2
            id="case-study-title"
            className="mt-4 text-3xl font-medium tracking-[-0.035em] text-ink sm:text-4xl"
          >
            {project.title}
          </h2>
          <p className="mt-2 font-serif text-xl italic text-accent">{project.tagline}</p>
          <p className="mt-5 text-pretty text-[14px] leading-[1.75] text-muted">{project.overview}</p>

          <div className="mt-7 grid grid-cols-3 divide-x divide-line border-y border-line py-5">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="px-3 first:pl-0 last:pr-0">
                <p className="text-xl font-medium tracking-[-0.03em] text-ink sm:text-2xl">
                  {metric.value}
                </p>
                <p className="mt-1 text-[10px] leading-snug text-faint">{metric.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                The challenge
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{project.challenge}</p>
            </div>
            <div>
              <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                The approach
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{project.solution}</p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
            <ul className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-white/[0.09] bg-white/[0.02] px-2.5 py-1 text-[10px] text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
              {project.timeline}
            </span>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-line bg-white/[0.02] p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-ink">Want the full walkthrough?</p>
              <p className="mt-1 text-xs text-faint">
                Happy to talk through the decisions behind this one.
              </p>
            </div>
            <Button as="a" href="#contact" onClick={onClose} size="sm" className="shrink-0">
              Let’s talk
              <Icon name="arrow-up-right" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
