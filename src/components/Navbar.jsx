import { useEffect, useState } from 'react'
import { navLinks, profile } from '../data/portfolio'
import useActiveSection from '../hooks/useActiveSection'
import Button from './ui/Button'
import Icon from './ui/Icon'

const sectionIds = navLinks.map((link) => link.id)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const onChange = (event) => {
      if (event.matches) setOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? 'border-b border-line bg-night/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <a
            href="#home"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/[0.03] font-serif text-[17px] italic leading-none text-accent transition-colors duration-300 group-hover:border-accent/40 group-hover:bg-accent/[0.08]">
              rs
            </span>
            <span className="text-[13px] font-semibold tracking-[-0.01em] text-ink">
              Ravjot Singh
              <span className="ml-1 hidden text-faint sm:inline">/ Portfolio</span>
            </span>
            <span className="sr-only">— back to top</span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.025] p-1 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = active === link.id
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] transition-colors duration-300 ${
                        isActive
                          ? 'bg-white/[0.08] text-ink'
                          : 'text-muted hover:bg-white/[0.04] hover:text-ink'
                      }`}
                    >
                      {isActive ? (
                        <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                      ) : null}
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block">
              <Button
                as="a"
                href="#contact"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Let’s talk
                <Icon
                  name="arrow-up-right"
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Button>
            </span>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-ink transition-colors hover:border-accent/40 hover:text-accent lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <Icon name={open ? 'close' : 'menu'} size={18} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-0 z-40 overflow-y-auto bg-night/95 backdrop-blur-2xl transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex min-h-dvh flex-col px-6 pb-10 pt-28">
          <nav aria-label="Mobile" className="flex-1">
            <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {navLinks.map((link, index) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline justify-between py-5"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-[10px] text-faint">
                        0{index + 1}
                      </span>
                      <span className="text-4xl font-light tracking-[-0.03em] text-ink transition-colors group-hover:text-accent">
                        {link.label}
                      </span>
                    </span>
                    <Icon
                      name="arrow-up-right"
                      size={20}
                      className="text-faint transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
                Say hello
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="mt-2 inline-block text-lg text-ink underline decoration-white/20 underline-offset-4 transition-colors hover:text-accent"
              >
                {profile.email}
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              {profile.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-muted transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <Icon name={social.icon} size={17} />
                </a>
              ))}
            </div>

            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {profile.availability}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
