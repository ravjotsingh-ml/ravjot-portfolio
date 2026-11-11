import { profile } from '../data/portfolio'
import Button from './ui/Button'
import Icon from './ui/Icon'
import Reveal from './ui/Reveal'

function HeroCard() {
  return (
    <div className="relative mx-auto w-full max-w-[400px] sm:max-w-[430px] lg:ml-auto lg:mr-0">
      <div
        aria-hidden="true"
        className="absolute -inset-12 rounded-full bg-accent/[0.06] blur-[90px]"
      />

      <Reveal delay={150} className="relative">
        <div className="animate-float-slow rounded-[2rem] border border-white/10 bg-[#0b0d0e] p-2.5 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.55rem] border border-white/[0.06] bg-gradient-to-b from-[#171b13] via-[#0f1210] to-[#090a0b]">
            <div
              aria-hidden="true"
              className="bg-grid-sm absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_72%)]"
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[38%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.12] blur-[70px]"
            />

            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[43%] h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[43%] h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/15"
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[43%] h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full"
            >
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(217,255,67,0.5)]" />
            </div>

            <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">
                Portfolio — 2026
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/[0.07] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-accent/90">
                <span className="h-1 w-1 rounded-full bg-accent" />
                Open to work
              </span>
            </div>

            <div className="absolute inset-0 grid place-items-center pb-16">
              <div className="text-center">
                <span className="block bg-gradient-to-b from-white/95 via-white/45 to-white/[0.04] bg-clip-text font-serif text-[9.5rem] italic leading-[0.75] tracking-[-0.04em] text-transparent sm:text-[10.5rem]">
                  rs
                </span>
                <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.36em] text-white/35">
                  Design × Engineering
                </p>
              </div>
            </div>

            <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md">
              <div className="min-w-0">
                <p className="truncate font-serif text-[22px] italic leading-tight text-white">
                  Ravjot Singh
                </p>
                <p className="mt-1 truncate font-mono text-[8px] uppercase tracking-[0.18em] text-white/40">
                  Front-end engineer & designer
                </p>
              </div>
              <a
                href="#about"
                aria-label="Learn more about Ravjot"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 transition-colors hover:border-accent/50 hover:bg-accent hover:text-[#08090a]"
              >
                <Icon name="arrow-down" size={15} />
              </a>
            </div>

            <span
              aria-hidden="true"
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 rotate-180 font-mono text-[8px] uppercase tracking-[0.4em] text-white/20 [writing-mode:vertical-rl] sm:block"
            >
              Toronto · Canada
            </span>
          </div>
        </div>

        <div
          className="absolute -left-3 top-24 hidden animate-float items-center gap-3 rounded-2xl border border-white/10 bg-[#101315]/90 px-4 py-3 shadow-2xl backdrop-blur-md sm:flex lg:-left-8"
          style={{ animationDelay: '-2.5s' }}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent">
            <Icon name="zap" size={17} />
          </span>
          <span>
            <span className="block text-sm font-semibold leading-none text-ink">6+ years</span>
            <span className="mt-1 block text-[10px] leading-none text-faint">crafting products</span>
          </span>
        </div>

        <div
          className="absolute -right-2 bottom-28 hidden animate-float-slow items-center gap-3 rounded-2xl border border-white/10 bg-[#101315]/90 px-4 py-3 shadow-2xl backdrop-blur-md sm:flex lg:-right-7"
          style={{ animationDelay: '-4s' }}
        >
          <div className="flex items-end gap-[3px]" aria-hidden="true">
            {[10, 16, 12, 22, 18].map((height, index) => (
              <span
                key={height}
                className="w-[3px] rounded-full bg-accent"
                style={{ height: `${height}px`, opacity: 0.4 + index * 0.15 }}
              />
            ))}
          </div>
          <span>
            <span className="block text-sm font-semibold leading-none text-ink">99</span>
            <span className="mt-1 block text-[10px] leading-none text-faint">Lighthouse avg.</span>
          </span>
        </div>
      </Reveal>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 left-[8%] h-[34rem] w-[34rem] rounded-full bg-accent/[0.06] blur-[130px]" />
        <div className="absolute -right-32 top-24 h-[30rem] w-[30rem] rounded-full bg-[#4b6bff]/[0.07] blur-[130px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.06fr_0.94fr] lg:gap-12 lg:px-10 xl:gap-20">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-3 pr-4 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                {profile.availability}
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-7 flex flex-wrap items-center gap-2.5 text-[13px] text-muted">
              <span className="h-px w-7 bg-accent/70" aria-hidden="true" />
              Hi, I’m <span className="font-semibold text-ink">{profile.name}</span>
              <span className="text-faint">— designer &amp; developer</span>
            </p>
          </Reveal>

          <Reveal delay={140}>
            <h1 className="mt-4 max-w-[15ch] text-balance text-[clamp(2.85rem,7vw,5.4rem)] font-medium leading-[0.97] tracking-[-0.045em] text-ink">
              {profile.heroLine}{' '}
              <span className="font-serif font-normal italic tracking-[-0.02em] text-accent">
                {profile.heroAccent}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-lg text-pretty text-[15px] leading-relaxed text-muted sm:text-base">
              {profile.heroIntro}
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button as="a" href="#work" size="lg">
                View selected work
                <Icon
                  name="arrow-up-right"
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Button>
              <Button as="a" href="#contact" variant="outline" size="lg">
                Get in touch
                <Icon name="arrow-right" size={16} />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-line pt-6">
              <div className="flex items-center gap-2">
                {profile.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.09] bg-white/[0.02] text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
                  >
                    <Icon name={social.icon} size={15} />
                  </a>
                ))}
              </div>
              <span aria-hidden="true" className="hidden h-4 w-px bg-line sm:block" />
              <span className="flex items-center gap-2 text-[11px] text-faint">
                <Icon name="map-pin" size={14} />
                {profile.location}
                <span className="text-white/20">·</span>
                <span className="font-mono text-[10px] uppercase tracking-wider">
                  {profile.timezone}
                </span>
              </span>
            </div>
          </Reveal>
        </div>

        <HeroCard />
      </div>
    </section>
  )
}
