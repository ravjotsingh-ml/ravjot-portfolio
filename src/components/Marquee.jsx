const items = [
  'React',
  'TypeScript',
  'Design systems',
  'Motion design',
  'Accessibility',
  'Performance',
  'Product design',
  'Tailwind CSS',
]

export default function Marquee() {
  return (
    <div className="marquee relative overflow-hidden border-y border-line bg-white/[0.012] py-4">
      <div className="marquee-track flex w-max">
        {[0, 1].map((group) => (
          <div
            key={group}
            aria-hidden={group === 1 ? 'true' : undefined}
            className="flex shrink-0 items-center"
          >
            {items.map((item) => (
              <span key={`${group}-${item}`} className="flex items-center">
                <span className="px-7 font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:px-9">
                  {item}
                </span>
                <span className="text-[11px] text-accent/60" aria-hidden="true">
                  ✳
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
