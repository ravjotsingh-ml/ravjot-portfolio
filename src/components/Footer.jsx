import { useEffect, useState } from 'react'
import { navLinks, profile } from '../data/portfolio'
import Icon from './ui/Icon'

function formatLocalTime() {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: profile.timezoneName || 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())
}

function LocalTime() {
  const [time, setTime] = useState(formatLocalTime)

  useEffect(() => {
    const interval = window.setInterval(() => setTime(formatLocalTime()), 30000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
      <span className="h-1 w-1 rounded-full bg-accent/70" aria-hidden="true" />
      India · {time}
    </span>
  )
}

export default function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href="#home" className="group inline-flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/[0.03] font-serif text-[17px] italic text-accent transition-colors group-hover:border-accent/40 group-hover:bg-accent/[0.08]">
                rs
              </span>
              <span className="text-[13px] font-semibold text-ink">Ravjot Singh</span>
              <span className="sr-only">— back to top</span>
            </a>
            <p className="mt-5 max-w-xs text-pretty text-[13px] leading-relaxed text-muted">
              Building intelligent AI systems and robust full-stack applications. Open to full-time engineering roles and collaborative projects.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {profile.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.09] text-muted transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <Icon name={social.icon} size={15} />
                </a>
              ))}
            </div>
          </div>

          <nav className="md:col-span-3" aria-label="Footer">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint">Navigate</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-1">
              {[{ id: 'home', label: 'Home' }, ...navLinks].map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-[13px] text-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint">Get in touch</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-4 inline-block text-[15px] text-ink underline decoration-white/15 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/40"
            >
              {profile.email}
            </a>
            <p className="mt-3 flex items-center gap-2 text-[12px] text-faint">
              <Icon name="map-pin" size={13} />
              {profile.location}
            </p>
            <a
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium text-ink transition-colors hover:text-accent"
            >
              Start a project
              <Icon name="arrow-right" size={14} />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-[11px] text-faint">© 2026 Ravjot Singh. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="text-[11px] text-faint">Built with React, Vite &amp; Tailwind CSS</p>
            <LocalTime />
            <a
              href="#home"
              className="group inline-flex items-center gap-2 text-[11px] text-muted transition-colors hover:text-accent"
            >
              Back to top
              <span className="grid h-7 w-7 place-items-center rounded-full border border-white/12 transition-colors group-hover:border-accent/50 group-hover:text-accent">
                <Icon
                  name="arrow-up"
                  size={13}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
