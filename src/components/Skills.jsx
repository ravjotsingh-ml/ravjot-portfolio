import { skillGroups } from '../data/portfolio'
import Icon from './ui/Icon'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

const process = [
  { step: '01', title: 'Understand', text: 'Research, constraints, and what success actually looks like.' },
  { step: '02', title: 'Prototype', text: 'Flows, visual language, and testable builds — early and often.' },
  { step: '03', title: 'Ship & refine', text: 'Accessibility, performance, and the details that compound.' },
]

export default function Skills() {
  return (
    <section id="skills" className="relative border-y border-line bg-white/[0.012] py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-accent/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          index="02"
          eyebrow="Capabilities"
          title={
            <>
              A sharp toolbox, chosen{' '}
              <span className="font-serif font-normal italic text-accent">carefully.</span>
            </>
          }
          description="I keep the stack small and intentional. The goal is never more tools — it’s fewer seams between the design and the product people use."
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <figure className="relative overflow-hidden rounded-3xl border border-line bg-night/60 p-6 sm:p-7">
                  <Icon
                    name="quote"
                    size={26}
                    className="text-accent/60"
                    strokeWidth={1.3}
                  />
                  <blockquote className="mt-5 text-pretty text-lg font-light leading-[1.55] tracking-[-0.01em] text-ink/90">
                    “Ravjot is the rare designer who can hand you a polished Figma file and
                    the production code to match. Our team moved faster because of it.”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-white/[0.07] pt-5">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#3c4a24] to-[#1a2013] font-mono text-[11px] text-accent">
                      MC
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ink">Maya Chen</span>
                      <span className="mt-0.5 block text-[11px] text-faint">
                        VP Product, Northwind Labs
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-8">
                  <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-faint">
                    How I work
                  </p>
                  <ol className="mt-4 space-y-4">
                    {process.map((item) => (
                      <li key={item.step} className="flex gap-4">
                        <span className="mt-0.5 font-mono text-[10px] text-accent/80">
                          {item.step}
                        </span>
                        <span>
                          <span className="block text-[13px] font-medium text-ink">
                            {item.title}
                          </span>
                          <span className="mt-1 block text-[12px] leading-relaxed text-faint">
                            {item.text}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8">
            {skillGroups.map((group, index) => (
              <Reveal
                key={group.title}
                delay={index * 80}
                className="group border-t border-white/[0.07] py-7 first:border-t-0 first:pt-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.025] text-accent transition-colors duration-500 group-hover:border-accent/30 group-hover:bg-accent/[0.07]">
                      <Icon name={group.icon} size={18} />
                    </span>
                    <span>
                      <h3 className="text-lg font-medium tracking-[-0.02em] text-ink">
                        {group.title}
                      </h3>
                      <p className="mt-1 text-[13px] text-faint">{group.blurb}</p>
                    </span>
                  </div>
                  <span aria-hidden="true" className="font-mono text-[10px] text-faint">
                    {group.index}
                  </span>
                </div>

                <ul className="mt-5 flex flex-wrap gap-2 pl-0 sm:pl-14">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="inline-block cursor-default rounded-full border border-white/[0.09] bg-white/[0.02] px-3.5 py-1.5 text-[12px] text-muted transition-all duration-300 hover:border-accent/40 hover:bg-accent/[0.05] hover:text-ink">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}

            <Reveal delay={240}>
              <p className="mt-8 flex items-center gap-2 border-t border-white/[0.07] pt-6 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                <span className="h-1 w-1 rounded-full bg-accent/70" aria-hidden="true" />
                Comfortable across the stack. Obsessive about the last 10%.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
