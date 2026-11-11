import { awards, education, experience } from '../data/portfolio'
import Icon from './ui/Icon'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function Experience() {
  return (
    <section id="experience" className="relative border-y border-line bg-white/[0.012] py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-40 top-24 h-96 w-96 rounded-full bg-accent/[0.03] blur-[130px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          index="04"
          eyebrow="Experience"
          title={
            <>
              Hands-on experience in{' '}
              <span className="font-serif font-normal italic text-accent">industry.</span>
            </>
          }
          description="Developing agentic AI systems, computer vision pipelines, and full-stack web applications in engineering teams."
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <div className="rounded-2xl border border-line bg-night/50 p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
                    Education
                  </p>
                  <div className="mt-3 divide-y divide-white/[0.06]">
                    {(Array.isArray(education) ? education : [education]).map((item) => (
                      <div key={item.degree} className="py-3.5 first:pt-1 last:pb-0">
                        <p className="text-[14px] font-medium text-ink">{item.degree}</p>
                        <p className="mt-1 text-[12px] text-muted">
                          {item.school}
                          {item.period ? (
                            <>
                              <span className="mx-2 text-white/20">·</span>
                              {item.period}
                            </>
                          ) : null}
                        </p>
                        {item.note && (
                          <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
                            {item.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="mt-8">
                  <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-faint">
                    Recognition
                  </p>
                  <ul className="mt-4 divide-y divide-white/[0.06] border-y border-white/[0.06]">
                    {awards.map((award) => (
                      <li key={award.title} className="flex items-start gap-3 py-3.5">
                        <Icon name="sparkles" size={13} className="mt-0.5 shrink-0 text-accent/70" />
                        <span>
                          <span className="block text-[12px] text-ink">{award.title}</span>
                          <span className="mt-0.5 block text-[10px] text-faint">{award.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={180}>
                <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                  References available on request
                </p>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8">
            {experience.map((job, index) => (
              <Reveal
                key={job.company}
                delay={index * 80}
                className="relative border-l border-white/[0.1] pb-12 pl-7 last:pb-0 sm:pl-9"
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full ${
                    index === 0
                      ? 'bg-accent shadow-[0_0_0_4px_rgba(217,255,67,0.1)]'
                      : 'bg-white/25'
                  }`}
                />

                <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                  <span className={index === 0 ? 'text-accent/90' : ''}>{job.period}</span>
                  <span className="h-1 w-1 rounded-full bg-white/15" aria-hidden="true" />
                  <span>{job.location}</span>
                </div>

                <h3 className="mt-3 text-xl font-medium tracking-[-0.025em] text-ink sm:text-2xl">
                  {job.role}
                </h3>
                <p className="mt-1.5 font-serif text-lg italic text-accent/90">{job.company}</p>
                <p className="mt-3 max-w-xl text-pretty text-[13px] leading-relaxed text-muted">
                  {job.summary}
                </p>

                <ul className="mt-5 max-w-xl space-y-2.5">
                  {job.achievements.map((achievement) => (
                    <li key={achievement} className="flex gap-3 text-[13px] leading-relaxed text-muted">
                      <Icon
                        name="arrow-right"
                        size={13}
                        className="mt-1 shrink-0 text-accent/60"
                        strokeWidth={1.8}
                      />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[10px] text-faint"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
