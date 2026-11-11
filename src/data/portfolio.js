export const profile = {
  name: 'Ravjot Singh',
  firstName: 'Ravjot',
  initials: 'rs',
  role: 'Front-end Engineer & Interface Designer',
  location: 'Toronto, Canada',
  timezone: 'EST · UTC−5',
  email: 'hello@ravjotsingh.dev',
  availability: 'Available for new projects',
  heroLine: 'I craft digital products that feel',
  heroAccent: 'effortless.',
  heroIntro:
    "I'm Ravjot — a designer-developer hybrid with 6+ years turning complex ideas into fast, accessible, and quietly beautiful web experiences.",
  aboutLead:
    "Most products don't fail because of technology. They fail because the experience wasn't considered.",
  aboutBody: [
    'I sit at the intersection of design and engineering — close enough to the pixels to care about the details, and close enough to the code to know what it takes to ship them. For the past six years I’ve helped startups and studios design, build, and refine products used by millions.',
    'My work is guided by a simple belief: great interfaces should feel obvious. That means thoughtful information architecture, obsessive performance work, and motion that explains rather than decorates. I’m happiest when I’m shipping something real with a small, ambitious team.',
  ],
  // TODO: Replace these placeholder URLs with your real profile URLs.
  // GitHub, X / Twitter and LinkedIn are rendered in the Hero, Contact and Footer.
  socials: [
    { label: 'GitHub', icon: 'github', href: 'https://github.com/YOUR_GITHUB_USERNAME' },
    { label: 'X / Twitter', icon: 'x', href: 'https://x.com/YOUR_X_USERNAME' },
    { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/YOUR_LINKEDIN_USERNAME' },
  ],
}

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export const stats = [
  { value: '6+', label: 'Years of craft' },
  { value: '48', label: 'Products shipped' },
  { value: '99', label: 'Avg. Lighthouse' },
  { value: '12', label: 'Design awards' },
]

export const pillars = [
  {
    icon: 'palette',
    title: 'Design with intent',
    text: 'I turn fuzzy ideas into clear flows and interfaces that feel obvious in hindsight — grounded in research, not decoration.',
  },
  {
    icon: 'zap',
    title: 'Build for speed',
    text: 'Accessible, semantic React with real performance budgets. Design systems and codebases that stay fast as teams grow.',
  },
  {
    icon: 'sparkles',
    title: 'Sweat the details',
    text: 'Typography, spacing, motion and micro-interactions. The small decisions are what make a product feel genuinely premium.',
  },
]

export const skillGroups = [
  {
    index: '01',
    icon: 'code',
    title: 'Front-end engineering',
    blurb: 'Production-grade interfaces, built to last.',
    items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'JavaScript', 'HTML & CSS', 'Vite', 'React Query'],
  },
  {
    index: '02',
    icon: 'palette',
    title: 'Interface & product design',
    blurb: 'From first sketch to polished system.',
    items: ['Figma', 'Design systems', 'Interaction design', 'Prototyping', 'Motion design', 'Accessibility'],
  },
  {
    index: '03',
    icon: 'layers',
    title: 'Tooling & craft',
    blurb: 'The unglamorous work that keeps things sharp.',
    items: ['Git & GitHub', 'Storybook', 'Vitest', 'Vercel', 'CI / CD', 'Web performance', 'SEO', 'Analytics'],
  },
]

export const exploring = ['Three.js', 'React Native', 'AI interfaces', 'Creative coding']

export const projects = [
  {
    id: 'northwind',
    title: 'Northwind Analytics',
    category: 'SaaS',
    year: '2026',
    tagline: 'Product analytics, made legible.',
    description:
      'A real-time analytics workspace that turns dense product data into clear, confident decisions for product teams.',
    overview:
      'Northwind’s data platform was powerful but impenetrable. I led the redesign of their core analytics workspace — from information architecture and design system through to a highly performant React front end.',
    challenge:
      'Customers were exporting CSVs to make sense of their own dashboards. The interface surfaced every metric at once, creating noise instead of insight.',
    solution:
      'We rebuilt the experience around progressive disclosure: a focused overview, composable saved views, and a query language that non-analysts can actually use. A new charting layer renders 50k+ points without dropping a frame.',
    role: 'Lead designer & front-end engineer',
    timeline: '14 weeks',
    metrics: [
      { value: '31%', label: 'faster time-to-insight' },
      { value: '2.4×', label: 'dashboard adoption' },
      { value: '98', label: 'Lighthouse performance' },
    ],
    tags: ['React', 'TypeScript', 'D3.js', 'Tailwind CSS'],
    accent: '#d9ff43',
    visual: 'analytics',
  },
  {
    id: 'atlas',
    title: 'Atlas Research',
    category: 'SaaS',
    year: '2025',
    tagline: 'An AI copilot for deep research.',
    description:
      'A calm, citation-first research assistant that helps teams read, connect, and synthesise complex source material.',
    overview:
      'Atlas asked a hard question: how do you make an AI research tool that people actually trust? I designed and built the reading and synthesis experience, with citations woven into every answer.',
    challenge:
      'Early users loved the answers but didn’t trust them. Hallucinations eroded confidence and long responses felt like a black box.',
    solution:
      'Every claim links back to a highlighted source passage. A side-by-side reading mode lets researchers verify in context, while streaming responses and optimistic UI keep the tool feeling instant.',
    role: 'Product designer & front-end lead',
    timeline: '10 weeks',
    metrics: [
      { value: '63%', label: 'weekly retention lift' },
      { value: '4.8/5', label: 'trust score' },
      { value: '<120ms', label: 'interaction latency' },
    ],
    tags: ['Next.js', 'TypeScript', 'OpenAI', 'Streaming'],
    accent: '#7c9cff',
    visual: 'ai',
  },
  {
    id: 'lumen',
    title: 'Lumen Banking',
    category: 'Mobile',
    year: '2025',
    tagline: 'Money, finally in focus.',
    description:
      'A mobile-first banking experience that makes everyday finances feel clear, calm, and quietly delightful.',
    overview:
      'Lumen is a challenger bank for freelancers. I owned the end-to-end product design and built the React Native component library that powers their iOS and Android apps.',
    challenge:
      'Freelancers juggle irregular income, taxes, and multiple accounts. Existing banking apps added anxiety instead of removing it.',
    solution:
      'A single “safe to spend” number, automatic tax set-asides, and a transaction feed that groups spending by project. Motion and haptics make every state change feel tangible without slowing things down.',
    role: 'Product designer & design systems',
    timeline: '22 weeks',
    metrics: [
      { value: '+38%', label: 'activation rate' },
      { value: '4.9★', label: 'App Store rating' },
      { value: '−27%', label: 'support tickets' },
    ],
    tags: ['React Native', 'TypeScript', 'Figma', 'Reanimated'],
    accent: '#c4a7ff',
    visual: 'finance',
  },
  {
    id: 'tideline',
    title: 'Tideline',
    category: 'Mobile',
    year: '2024',
    tagline: 'Slow travel, beautifully planned.',
    description:
      'A trip-planning companion for people who’d rather collect moments than checkpoints. Designed for iPhone and Android.',
    overview:
      'Tideline is a bootstrapped travel app with a contrarian thesis: fewer notifications, fewer lists, more presence. I partnered with the founders from naming through launch.',
    challenge:
      'Travel apps compete on features, overwhelming users with itineraries, maps, and bookings. Tideline needed to feel like a deep breath.',
    solution:
      'An editorial, photo-led home feed, one-tap day plans, and offline-first saves. The interface uses generous whitespace and a restrained palette so the destinations remain the hero.',
    role: 'Design partner & front-end developer',
    timeline: '12 weeks',
    metrics: [
      { value: '18k', label: 'first-month installs' },
      { value: '4.7★', label: 'average rating' },
      { value: '92%', label: 'day-7 retention' },
    ],
    tags: ['React Native', 'Expo', 'Supabase', 'Reanimated'],
    accent: '#6fe3c1',
    visual: 'travel',
  },
  {
    id: 'forma',
    title: 'Forma Studio',
    category: 'Websites',
    year: '2024',
    tagline: 'Space for architecture to breathe.',
    description:
      'An editorial portfolio for a Copenhagen architecture studio — image-led, quiet, and built to load in under a second.',
    overview:
      'Forma needed a digital home as considered as their buildings. The result is a minimal, typographically driven site with a custom project viewer and a lightweight CMS.',
    challenge:
      'Architecture photography is heavy. The previous site loaded 12MB of unoptimised images and buried projects behind a confusing grid.',
    solution:
      'Responsive AVIF/WebP art direction, blur-up placeholders, and a gallery that respects the images. Animations are limited to opacity and transform so scrolling stays glassy on mobile.',
    role: 'Design & development',
    timeline: '8 weeks',
    metrics: [
      { value: '0.7s', label: 'largest contentful paint' },
      { value: '100', label: 'Lighthouse performance' },
      { value: '+54%', label: 'enquiries' },
    ],
    tags: ['React', 'Vite', 'GSAP', 'Sanity'],
    accent: '#ffb178',
    visual: 'studio',
  },
  {
    id: 'mono',
    title: 'Mono Design System',
    category: 'Systems',
    year: '2023',
    tagline: 'One language, forty products.',
    description:
      'A token-driven design system unifying twelve product teams — from accessible primitives to living documentation.',
    overview:
      'Mono is an open-source design system I created and maintain. It now powers a suite of enterprise products and is used by more than 40 engineers every week.',
    challenge:
      'Twelve teams were shipping twelve different buttons. Inconsistent accessibility, duplicate work, and a brand that drifted with every release.',
    solution:
      'A three-tier token architecture, headless accessible primitives, and documentation that lives inside Storybook. Adoption was driven by codemods and a dedicated office-hours ritual, not mandates.',
    role: 'Founder & maintainer',
    timeline: 'Ongoing',
    metrics: [
      { value: '40+', label: 'weekly users' },
      { value: '−60%', label: 'UI build time' },
      { value: 'WCAG', label: '2.2 AA compliant' },
    ],
    tags: ['React', 'TypeScript', 'Storybook', 'Radix UI'],
    accent: '#ff9ecf',
    visual: 'system',
  },
]

export const experience = [
  {
    role: 'Senior Front-end Engineer',
    company: 'Northwind Labs',
    period: '2023 — Present',
    location: 'Toronto · Remote',
    summary:
      'Lead front-end for Northwind’s analytics platform, working alongside product and design to raise the bar on craft and performance.',
    achievements: [
      'Rebuilt the core workspace in React and TypeScript, cutting interaction latency by 47% and lifting dashboard adoption 2.4×.',
      'Introduced a token-driven design system adopted by four product squads, reducing UI build time by roughly 60%.',
      'Mentored three engineers and established the team’s accessibility and performance review process.',
    ],
    tags: ['React', 'TypeScript', 'Design systems', 'Performance'],
  },
  {
    role: 'Front-end Engineer & Designer',
    company: 'Studio Nomad',
    period: '2021 — 2023',
    location: 'Remote',
    summary:
      'A six-person studio building brand-led digital experiences for architecture, fashion, and culture clients.',
    achievements: [
      'Designed and shipped 14 award-considered marketing sites, averaging 98+ Lighthouse scores.',
      'Created the studio’s reusable motion and page-transition toolkit, cutting project setup from days to hours.',
      'Partnered directly with clients on strategy, art direction, and front-end delivery.',
    ],
    tags: ['Next.js', 'GSAP', 'Sanity', 'Art direction'],
  },
  {
    role: 'UI Designer & Developer',
    company: 'Independent',
    period: '2019 — 2021',
    location: 'Toronto',
    summary:
      'Freelance designer-developer helping early-stage startups turn rough ideas into shippable product interfaces.',
    achievements: [
      'Launched MVPs for seven pre-seed startups across fintech, health, and creator tools.',
      'Built a reputation for fast, opinionated design paired with clean, maintainable code.',
      'Ran discovery workshops and usability tests that shaped product roadmaps.',
    ],
    tags: ['React', 'Figma', 'Product design', 'Prototyping'],
  },
]

export const education = {
  degree: 'B.Des, Interaction Design',
  school: 'OCAD University',
  period: '2015 — 2019',
  note: 'Graduated with honours. Thesis on accessible interface motion.',
}

export const awards = [
  { title: 'Awwwards Honourable Mention', detail: 'Forma Studio · 2024' },
  { title: 'CSS Design Awards — Best UI', detail: 'Tideline · 2024' },
  { title: 'Northwind Craft Award', detail: 'Design systems · 2025' },
]

export const projectFilters = ['All', 'SaaS', 'Mobile', 'Websites', 'Systems']
