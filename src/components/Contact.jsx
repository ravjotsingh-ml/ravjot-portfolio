import { profile } from '../data/portfolio'
import ContactForm from './ContactForm'
import Icon from './ui/Icon'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[5%] top-10 h-[28rem] w-[28rem] rounded-full bg-accent/[0.05] blur-[130px]" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#4b6bff]/[0.05] blur-[120px]" />
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_70%_40%,black,transparent)]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          index="05"
          eyebrow="Contact"
          title={
            <>
              Let’s build something worth{' '}
              <span className="font-serif font-normal italic text-accent">remembering.</span>
            </>
          }
          description="I’m booking a small number of projects for early 2027. Whether it’s a full product build or a focused design sprint, I’d love to hear what you’re working on."
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/[0.05] py-2 pl-3 pr-4">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent/90">
                  {profile.availability}
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <a
                href={`mailto:${profile.email}`}
                className="group mt-8 block border-b border-line pb-6"
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
                  Email me
                </span>
                <span className="mt-2 flex items-center justify-between gap-4">
                  <span className="break-all text-xl font-light tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                    {profile.email}
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 text-muted transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-[#08090a]">
                    <Icon
                      name="arrow-up-right"
                      size={16}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-7 space-y-5">
                <div className="flex items-start gap-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-faint">
                    <Icon name="map-pin" size={15} />
                  </span>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                      Based in
                    </p>
                    <p className="mt-1 text-[13px] text-ink">
                      {profile.location}{' '}
                      <span className="text-faint">· {profile.timezone}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-faint">
                    <Icon name="clock" size={15} />
                  </span>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                      Response time
                    </p>
                    <p className="mt-1 text-[13px] text-ink">
                      Within one business day
                      <span className="text-faint"> · usually sooner</span>
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-9">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
                  Find me online
                </p>
                <div className="mt-3 flex items-center gap-2">
                  {profile.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.label}
                      className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.09] bg-white/[0.02] text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
                    >
                      <Icon name={social.icon} size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <p className="mt-10 max-w-xs font-serif text-lg italic leading-relaxed text-faint">
                “Good work starts with a good conversation. No pitch decks required.”
              </p>
            </Reveal>
          </div>

          <Reveal delay={120} className="lg:col-span-7">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
