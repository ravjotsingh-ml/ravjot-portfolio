import { exploring, pillars, profile, stats } from '../data/portfolio'
import Button from './ui/Button'
import Icon from './ui/Icon'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

const atAGlance = [
  { icon: 'map-pin', label: 'Based in', value: 'Punjab, India' },
  { icon: 'clock', label: 'Degree', value: 'B.Tech CSE (2026)' },
  { icon: 'layers', label: 'Focus', value: 'AI, ML & Full-Stack' },
  { icon: 'mail', label: 'Email', value: 'ravjotsg03@gmail.com' },
]

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          index="01"
          eyebrow="About"
          title={
            <>
              Intelligent systems, robust{' '}
              <span className="font-serif font-normal italic text-accent">engineering.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="max-w-2xl text-pretty text-2xl font-light leading-[1.35] tracking-[-0.02em] text-ink sm:text-[1.75rem]">
                {profile.aboutLead}
              </p>
            </Reveal>

            <div className="mt-7 max-w-xl space-y-5">
              {profile.aboutBody.map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 24)} delay={80 + index * 60}>
                  <p className="text-pretty text-[15px] leading-[1.8] text-muted">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={220}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <span className="font-serif text-3xl italic text-ink">Ravjot</span>
                <span className="h-px w-10 bg-line" aria-hidden="true" />
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
                  AI · Full-Stack · Punjab
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/80 p-6 backdrop-blur-sm sm:p-7">
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/[0.06] blur-3xl"
                />
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-faint">
                    At a glance
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/[0.06] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-accent">
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    Open to work
                  </span>
                </div>

                <dl className="mt-6 divide-y divide-white/[0.06]">
                  {atAGlance.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4 py-3.5">
                      <dt className="flex items-center gap-3 text-[13px] text-muted">
                        <Icon name={item.icon} size={15} className="text-faint" />
                        {item.label}
                      </dt>
                      <dd className="text-right text-[13px] font-medium text-ink">{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 border-t border-white/[0.06] pt-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
                    Currently exploring
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {exploring.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-white/[0.09] bg-white/[0.025] px-2.5 py-1 text-[11px] text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button as="a" href="#contact" variant="outline" className="mt-6 w-full">
                  Start a conversation
                  <Icon
                    name="arrow-up-right"
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Button>
              </div>

              <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                Résumé available on request
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-line pt-10 md:mt-24 md:grid-cols-4 md:gap-0 md:divide-x md:divide-line">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 70}
              className="md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-light tracking-[-0.04em] text-ink sm:text-5xl">
                  {stat.value}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              </div>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 md:mt-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent/80" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted">
                What I bring
              </span>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 90}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-white/[0.015] p-6 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.03]">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="flex items-start justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-accent transition-colors duration-500 group-hover:border-accent/30 group-hover:bg-accent/[0.08]">
                      <Icon name={pillar.icon} size={19} />
                    </span>
                    <span className="font-mono text-[10px] text-faint">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium tracking-[-0.02em] text-ink">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{pillar.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
