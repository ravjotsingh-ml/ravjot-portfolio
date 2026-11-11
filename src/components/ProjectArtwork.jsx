const domains = {
  scholarsync: 'scholarsync.edu',
  'cracked-screen': 'screencheck.ai',
  beantheory: 'beantheory.coffee',
  northwind: 'northwind.app',
  atlas: 'atlas.study',
  lumen: 'lumen.bank',
  tideline: 'tideline.travel',
  forma: 'forma.studio',
  mono: 'mono.design',
}

function BrowserChrome({ project }) {
  return (
    <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.02] px-3">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `${project.accent}99` }} />
      <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
      <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
      <span className="mx-auto flex items-center gap-1 rounded-[3px] bg-white/[0.04] px-3 py-[3px] font-mono text-[7px] text-white/65">
        <span className="h-1 w-1 rounded-full bg-white/20" />
        {domains[project.id] ?? 'example.com'}
      </span>
      <span className="hidden h-1 w-4 rounded bg-white/10 sm:block" />
    </div>
  )
}

function Analytics({ accent }) {
  return (
    <div className="flex h-full gap-3">
      <aside className="hidden w-[21%] flex-col gap-2.5 border-r border-white/[0.06] pr-2.5 sm:flex">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: accent }} />
          <span className="h-1.5 w-10 rounded-full bg-white/20" />
        </div>
        <div className="mt-1 space-y-1.5">
          {['Overview', 'Reports', 'Funnels', 'Audience', 'Settings'].map((item, index) => (
            <div
              key={item}
              className={`flex items-center gap-1.5 rounded-[3px] px-1.5 py-1 text-[7px] ${
                index === 0 ? 'bg-white/[0.06] text-white/80' : 'text-white/65'
              }`}
            >
              <span
                className="h-1 w-1 rounded-full"
                style={{ backgroundColor: index === 0 ? accent : 'rgba(255,255,255,0.2)' }}
              />
              {item}
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-1.5 border-t border-white/[0.06] pt-2">
          <span className="h-4 w-4 rounded-full bg-white/10" />
          <span className="h-1 w-8 rounded bg-white/10" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[13px] font-semibold leading-tight text-white/90">Overview</p>
            <p className="text-[7px] text-white/65">Performance across all workspaces</p>
          </div>
          <span className="rounded-full border border-white/10 px-2 py-1 text-[7px] text-white/75">
            Last 30 days
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: 'Revenue', value: '$84.2k', delta: '+12.4%' },
            { label: 'Active users', value: '24,180', delta: '+8.1%' },
            { label: 'Conversion', value: '3.92%', delta: '+0.6%' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-md border border-white/[0.07] bg-white/[0.025] p-2"
            >
              <p className="text-[6.5px] uppercase tracking-wider text-white/65">{stat.label}</p>
              <p className="mt-1 text-[11px] font-semibold leading-none text-white/85">{stat.value}</p>
              <p className="mt-1 text-[6.5px]" style={{ color: accent }}>
                {stat.delta}
              </p>
            </div>
          ))}
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col rounded-md border border-white/[0.07] bg-white/[0.015] p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[7.5px] font-medium text-white/75">Weekly active users</span>
            <span className="flex items-center gap-1 text-[6.5px] text-white/65">
              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accent }} />
              This year
            </span>
          </div>
          <div className="relative mt-2 flex flex-1 items-end gap-1">
            <div className="absolute inset-0 flex flex-col justify-between pb-1" aria-hidden="true">
              {[0, 1, 2].map((line) => (
                <span key={line} className="h-px w-full bg-white/[0.04]" />
              ))}
            </div>
            {[38, 62, 48, 78, 58, 88, 70, 96, 64, 82, 74, 92].map((height, index) => (
              <span
                key={index}
                className="relative z-10 flex-1 rounded-t-[2px] transition-all duration-500"
                style={{
                  height: `${height}%`,
                  backgroundColor: accent,
                  opacity: 0.28 + index * 0.05,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Finance({ accent }) {
  return (
    <div className="flex h-full items-center justify-center gap-5">
      <div className="flex h-full max-h-[230px] w-[48%] max-w-[150px] flex-col rounded-[14px] border border-white/15 bg-[#0a0b0d] p-2.5 shadow-2xl">
        <span className="mx-auto mb-2 h-1 w-8 rounded-full bg-white/20" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[6px] text-white/65">Good morning</p>
            <p className="text-[9px] font-medium text-white/80">Alex</p>
          </div>
          <span className="h-4 w-4 rounded-full bg-white/10" />
        </div>
        <p className="mt-3 text-[6px] uppercase tracking-wider text-white/65">Total balance</p>
        <p className="mt-0.5 text-[18px] font-semibold leading-none tracking-tight text-white">
          $12,480<span className="text-[10px] text-white/75">.00</span>
        </p>
        <span className="mt-1 text-[6.5px]" style={{ color: accent }}>
          +4.2% this month
        </span>

        <div
          className="relative mt-2.5 h-[44px] overflow-hidden rounded-[7px] p-2"
          style={{ background: `linear-gradient(130deg, ${accent}, #4f46e5)` }}
        >
          <span className="absolute -right-3 -top-5 h-14 w-14 rounded-full bg-white/15" />
          <span className="block h-2.5 w-3.5 rounded-[2px] bg-[#0a0b0d]/40" />
          <span className="mt-1 block font-mono text-[6px] text-[#0a0b0d]/80">•••• 4821</span>
          <span className="absolute bottom-1.5 right-2 text-[5px] font-semibold uppercase tracking-wider text-[#0a0b0d]/70">
            Lumen
          </span>
        </div>

        <div className="mt-2 space-y-1.5">
          {[
            { name: 'Figma', amount: '−$15.00' },
            { name: 'Transfer', amount: '+$2,400' },
            { name: 'Coffee', amount: '−$6.20' },
          ].map((tx) => (
            <div key={tx.name} className="flex items-center justify-between text-[6.5px]">
              <span className="flex items-center gap-1 text-white/75">
                <span className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
                {tx.name}
              </span>
              <span className="text-white/75">{tx.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden h-full w-[34%] flex-col justify-center gap-2 sm:flex">
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-3">
          <p className="text-[7px] text-white/35">Spending this month</p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="grid h-11 w-11 place-items-center rounded-full"
              style={{
                background: `conic-gradient(${accent} 0 62%, rgba(255,255,255,0.08) 62% 100%)`,
              }}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0c0e10] text-[7px] font-semibold text-white/80">
                62%
              </span>
            </span>
            <span className="space-y-1">
              <span className="flex items-center gap-1 text-[6.5px] text-white/75">
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accent }} />
                Essentials
              </span>
              <span className="flex items-center gap-1 text-[6.5px] text-white/75">
                <span className="h-1 w-1 rounded-full bg-white/15" />
                Lifestyle
              </span>
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-3">
          <p className="text-[7px] text-white/35">Tax set-aside</p>
          <p className="mt-1 text-[13px] font-semibold text-white/80">$3,120</p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
            <span
              className="block h-full w-[68%] rounded-full"
              style={{ backgroundColor: accent }}
            />
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5">
          <p className="text-[7px] text-white/35">Safe to spend</p>
          <p className="mt-0.5 text-[10px] font-semibold text-white/80">$1,860.40</p>
        </div>
      </div>
    </div>
  )
}

function Travel({ accent }) {
  return (
    <div className="relative h-full overflow-hidden rounded-md">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(155deg, ${accent}55 0%, #14302b 45%, #0a0d0c 100%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 75% 15%, rgba(255,255,255,0.3), transparent 40%)',
        }}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 400 220"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[62%] w-full"
      >
        <path d="M0 160 70 95l45 40 55-70 70 90 55-45 105 75v35H0Z" fill="#0a0f0e" opacity=".55" />
        <path d="M0 185 60 145l60 35 70-55 80 60 70-30 60 40v25H0Z" fill="#070908" />
      </svg>

      <div className="relative flex h-full flex-col p-3">
        <div className="flex items-center justify-between">
          <span className="font-serif text-sm italic text-white/90">tideline</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 text-[7px] text-white/80">
            ☰
          </span>
        </div>

        <div className="mx-auto mt-3 flex w-[86%] items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] p-1 pl-3 backdrop-blur-md">
          <span className="text-[7px] text-white/65">Where to next?</span>
          <span className="ml-auto flex h-5 items-center rounded-full px-2 text-[6.5px] font-semibold text-[#0a0b0a]" style={{ backgroundColor: accent }}>
            Explore
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="pb-1">
            <p className="font-mono text-[6px] uppercase tracking-[0.2em] text-white/75">
              68°N · North Atlantic
            </p>
            <p className="mt-1 font-serif text-[26px] italic leading-none text-white">
              Faroe Islands
            </p>
            <p className="mt-1.5 text-[7px] text-white/45">
              7 days · 4 stops · slow travel
            </p>
          </div>
          <div className="hidden gap-1.5 sm:flex">
            {['#6fe3c1', '#3f7f72'].map((color) => (
              <div
                key={color}
                className="h-12 w-9 overflow-hidden rounded-[5px] border border-white/15"
                style={{ background: `linear-gradient(160deg, ${color}, #0a0d0c)` }}
              >
                <span className="mt-8 block h-px w-full bg-white/20" />
                <span className="mx-auto mt-1 block h-0.5 w-4 rounded bg-white/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Studio({ accent }) {
  return (
    <div className="flex h-full gap-3">
      <div
        className="relative flex-1 overflow-hidden rounded-md"
        style={{ background: 'linear-gradient(150deg, #ece2d2 0%, #c9b8a1 55%, #8f7c65 100%)' }}
      >
        <div className="absolute -right-6 top-4 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
        <div className="absolute bottom-0 left-[18%] h-[58%] w-[34%] bg-[#6f6557]/50" />
        <div className="absolute bottom-0 left-[46%] h-[76%] w-[28%] bg-[#4f463b]/60" />
        <div className="absolute bottom-0 right-[8%] h-[44%] w-[18%] bg-[#332d26]/70" />
        <div className="absolute inset-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[6px] uppercase tracking-[0.18em] text-[#2a251f]/60">
            <span>Architecture &amp; space</span>
            <span>Est. 2012</span>
          </div>
          <div>
            <p
              className="font-serif text-[34px] italic leading-none tracking-[-0.03em]"
              style={{ color: '#231f19' }}
            >
              Forma
            </p>
            <div className="mt-1.5 flex items-center gap-2 text-[6px] uppercase tracking-[0.16em] text-[#2a251f]/60">
              <span>Copenhagen</span>
              <span className="h-px w-5" style={{ backgroundColor: accent }} />
              <span>Selected works</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden w-[36%] flex-col justify-between py-0.5 sm:flex">
        <div>
          <p className="font-mono text-[6px] uppercase tracking-[0.2em] text-white/65">
            Index / 01—04
          </p>
          <div className="mt-2.5 space-y-1.5">
            {[
              { name: 'Villa Kyst', tag: 'Residential', tint: '#8d7a62' },
              { name: 'Atrium House', tag: 'Cultural', tint: '#5f6a63' },
              { name: 'Nord Pavilion', tag: 'Public', tint: '#88786c' },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 rounded-[4px] border border-white/[0.06] bg-white/[0.02] p-1.5"
              >
                <span
                  className="h-7 w-8 shrink-0 rounded-[2px]"
                  style={{ background: `linear-gradient(140deg, ${item.tint}, #161a18)` }}
                />
                <span className="min-w-0">
                  <span className="block truncate text-[7px] text-white/80">{item.name}</span>
                  <span className="mt-0.5 block text-[6px] text-white/65">{item.tag}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/[0.07] pt-2">
          <span className="text-[6px] uppercase tracking-[0.16em] text-white/65">View project</span>
          <span
            className="grid h-4 w-4 place-items-center rounded-full text-[7px] text-[#08090a]"
            style={{ backgroundColor: accent }}
          >
            ↗
          </span>
        </div>
      </div>
    </div>
  )
}

function Ai({ accent }) {
  return (
    <div className="flex h-full gap-3">
      <aside className="hidden w-[23%] flex-col gap-2 border-r border-white/[0.06] pr-2.5 sm:flex">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: `${accent}55` }}>
            <span className="m-auto block h-1 w-1 translate-y-1 rounded-full" style={{ backgroundColor: accent }} />
          </span>
          <span className="text-[7px] font-medium text-white/80">Atlas</span>
        </div>
        <div
          className="mt-1 flex items-center justify-between rounded-[4px] px-1.5 py-1 text-[6.5px] font-semibold text-[#08090a]"
          style={{ backgroundColor: accent }}
        >
          <span>New research</span>
          <span>+</span>
        </div>
        <div className="mt-1 space-y-1.5">
          {['Urban farming', 'Climate policy', 'Design systems'].map((item, index) => (
            <div
              key={item}
              className={`truncate rounded-[3px] px-1.5 py-1 text-[6.5px] ${
                index === 0 ? 'bg-white/[0.06] text-white/65' : 'text-white/65'
              }`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-1.5 border-t border-white/[0.06] pt-2">
          <span className="h-4 w-4 rounded-full bg-white/10" />
          <span className="h-1 w-9 rounded bg-white/10" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
          <div>
            <p className="text-[9px] font-medium text-white/80">The future of urban farming</p>
            <p className="text-[6px] text-white/65">24 sources · 12 min read</p>
          </div>
          <span className="rounded-full border border-white/10 px-1.5 py-0.5 text-[6px] text-white/75">
            Share
          </span>
        </div>

        <div className="mt-2.5 flex justify-end">
          <div className="max-w-[75%] rounded-lg rounded-br-sm bg-white/[0.07] px-2.5 py-1.5 text-[7px] text-white/75">
            Summarise the key findings for me.
          </div>
        </div>

        <div className="mt-2 flex gap-1.5">
          <span
            className="mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full text-[6px] text-[#08090a]"
            style={{ backgroundColor: accent }}
          >
            A
          </span>
          <div className="min-w-0">
            <div className="space-y-1">
              <span className="block h-1 w-[92%] rounded bg-white/15" />
              <span className="block h-1 w-[80%] rounded bg-white/10" />
              <span className="block h-1 w-[60%] rounded bg-white/10" />
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {['[1] Nature Cities', '[2] FAO Report'].map((cite) => (
                <span
                  key={cite}
                  className="rounded-[3px] border px-1 py-0.5 text-[5.5px]"
                  style={{ color: accent, borderColor: `${accent}30`, backgroundColor: `${accent}0d` }}
                >
                  {cite}
                </span>
              ))}
            </div>
            <div className="mt-2 space-y-1">
              <span className="block h-1 w-[86%] rounded bg-white/10" />
              <span className="block h-1 w-[54%] rounded bg-white/10" />
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] p-1 pl-2">
          <span className="text-[6.5px] text-white/45">Ask a follow-up…</span>
          <span
            className="ml-auto grid h-4 w-4 place-items-center rounded-full text-[6px] text-[#08090a]"
            style={{ backgroundColor: accent }}
          >
            ↑
          </span>
        </div>
      </div>
    </div>
  )
}

function System({ accent }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <p className="text-[8px] font-medium text-white/80">
          Mono <span className="text-white/45">/ Foundations</span>
        </p>
        <span className="rounded-full border border-white/10 px-1.5 py-0.5 font-mono text-[5.5px] text-white/35">
          v2.4.0
        </span>
      </div>

      <div className="mt-2 grid min-h-0 flex-1 grid-cols-2 gap-1.5 sm:grid-cols-3">
        <div className="rounded-md border border-white/[0.07] bg-white/[0.02] p-2">
          <p className="text-[5.5px] uppercase tracking-[0.14em] text-white/65">Color</p>
          <div className="mt-1.5 flex gap-1">
            {[accent, '#f2f3ee', '#989ea3', '#2a2e31'].map((color) => (
              <span
                key={color}
                className="h-5 flex-1 rounded-[2px] border border-white/[0.06]"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <p className="mt-1 font-mono text-[5px] text-white/45">accent.400</p>
        </div>

        <div className="rounded-md border border-white/[0.07] bg-white/[0.02] p-2">
          <p className="text-[5.5px] uppercase tracking-[0.14em] text-white/65">Type</p>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="font-serif text-2xl italic leading-none text-white/80">Aa</span>
            <span className="text-[7px] text-white/75">Manrope</span>
          </div>
          <div className="mt-1.5 space-y-1">
            <span className="block h-0.5 w-full rounded bg-white/15" />
            <span className="block h-0.5 w-3/4 rounded bg-white/10" />
          </div>
        </div>

        <div className="rounded-md border border-white/[0.07] bg-white/[0.02] p-2">
          <p className="text-[5.5px] uppercase tracking-[0.14em] text-white/65">Actions</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <span
              className="rounded-full px-1.5 py-0.5 text-[5.5px] font-semibold text-[#08090a]"
              style={{ backgroundColor: accent }}
            >
              Primary
            </span>
            <span className="rounded-full border border-white/15 px-1.5 py-0.5 text-[5.5px] text-white/65">
              Ghost
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1">
            <span
              className="flex h-2.5 w-4 items-center rounded-full p-0.5"
              style={{ backgroundColor: accent }}
            >
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#08090a]" />
            </span>
            <span className="text-[5.5px] text-white/65">Enabled</span>
          </div>
        </div>

        <div className="hidden rounded-md border border-white/[0.07] bg-white/[0.02] p-2 sm:block">
          <p className="text-[5.5px] uppercase tracking-[0.14em] text-white/65">Spacing</p>
          <div className="mt-2 flex items-end gap-1">
            {[4, 8, 12, 16, 22].map((size, index) => (
              <span
                key={size}
                className="w-1.5 rounded-sm"
                style={{
                  height: `${size}px`,
                  backgroundColor: accent,
                  opacity: 0.3 + index * 0.14,
                }}
              />
            ))}
          </div>
        </div>

        <div className="hidden rounded-md border border-white/[0.07] bg-white/[0.02] p-2 sm:block">
          <p className="text-[5.5px] uppercase tracking-[0.14em] text-white/65">Radius</p>
          <div className="mt-1.5 flex items-end gap-1">
            {['rounded-sm', 'rounded', 'rounded-md', 'rounded-lg'].map((radius, index) => (
              <span
                key={radius}
                className={`border border-white/15 ${radius}`}
                style={{ height: `${8 + index * 3}px`, width: `${8 + index * 3}px` }}
              />
            ))}
          </div>
        </div>

        <div className="hidden items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.02] p-2 sm:flex">
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full border border-white/10">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
            <span className="absolute inset-1 rounded-full border border-dashed border-white/10" />
          </span>
        </div>
      </div>
    </div>
  )
}

const variants = {
  analytics: Analytics,
  finance: Finance,
  travel: Travel,
  studio: Studio,
  ai: Ai,
  system: System,
}

export default function ProjectArtwork({ project }) {
  const Visual = variants[project.visual] ?? Analytics

  return (
    <div
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden bg-[#0a0c0d]"
      style={{ '--accent': project.accent }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 78% 12%, ${project.accent}24, transparent 55%), radial-gradient(circle at 12% 90%, ${project.accent}12, transparent 50%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="bg-grid-sm absolute inset-0 opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
      />

      <div className="absolute inset-x-4 top-6 bottom-0 sm:inset-x-6 sm:top-8 lg:inset-x-8 lg:top-10">
        <div className="h-full overflow-hidden rounded-t-xl border border-white/[0.09] bg-[#0c0e10]/95 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-sm transition-transform duration-700 ease-out group-hover:-translate-y-2">
          <BrowserChrome project={project} />
          <div className="h-[calc(100%-1.75rem)] overflow-hidden p-3 sm:p-4">
            <Visual accent={project.accent} />
          </div>
        </div>
      </div>
    </div>
  )
}
