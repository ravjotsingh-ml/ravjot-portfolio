import Reveal from './Reveal'

export default function SectionHeading({ index, eyebrow, title, description, className = '' }) {
  return (
    <Reveal className={className}>
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-accent/80" aria-hidden="true" />
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
          {index ? `${index} — ` : ''}
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-5 max-w-3xl text-balance text-[clamp(2rem,4.4vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.035em] text-ink">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </Reveal>
  )
}
