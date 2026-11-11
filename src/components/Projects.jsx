import { useCallback, useState } from 'react'
import { projectFilters, projects } from '../data/portfolio'
import Button from './ui/Button'
import Icon from './ui/Icon'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered =
    filter === 'All' ? projects : projects.filter((project) => project.category === filter)

  const handleClose = useCallback(() => setSelected(null), [])

  const handleFilter = (option) => {
    if (option === filter) return
    setFilter(option)

    requestAnimationFrame(() => {
      const section = document.getElementById('work')
      if (!section) return
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    })
  }

  const countFor = (option) =>
    option === 'All' ? projects.length : projects.filter((project) => project.category === option).length

  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="03"
            eyebrow="Selected work"
            title={
              <>
                A few things I’ve{' '}
                <span className="font-serif font-normal italic text-accent">shipped.</span>
              </>
            }
            description="Six projects, each one a partnership. Open a case study to see the challenge, the decisions, and the outcome."
          />

          <div className="flex shrink-0 flex-wrap gap-1.5" role="group" aria-label="Filter projects">
            {projectFilters.map((option) => {
              const isActive = filter === option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleFilter(option)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-3.5 py-2 text-[12px] font-medium transition-all duration-300 ${
                    isActive
                      ? 'border-accent bg-accent text-[#08090a]'
                      : 'border-white/[0.1] bg-white/[0.02] text-muted hover:border-white/20 hover:text-ink'
                  }`}
                >
                  {option}
                  <span className={`ml-1.5 font-mono text-[9px] ${isActive ? 'opacity-60' : 'text-faint'}`}>
                    {String(countFor(option)).padStart(2, '0')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div key={filter} className="animate-fade-in mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
          {filtered.map((project, index) => {
            const isLast = index === filtered.length - 1
            const featured =
              filter === 'All'
                ? index === 0 || (filtered.length % 2 === 0 && isLast)
                : filtered.length === 1

            return (
              <ProjectCard
                key={project.id}
                project={project}
                featured={featured}
                onOpen={setSelected}
              />
            )
          })}
        </div>

        <Reveal className="mt-12">
          <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border border-line bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -left-20 -top-24 h-56 w-56 rounded-full bg-accent/[0.06] blur-3xl"
            />
            <div className="relative">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
                Have a project in mind?
              </p>
              <p className="mt-2 max-w-md text-pretty text-xl font-light tracking-[-0.02em] text-ink sm:text-2xl">
                Let’s turn it into something people love to use.
              </p>
            </div>
            <Button as="a" href="#contact" size="md" className="relative shrink-0">
              Start a project
              <Icon
                name="arrow-up-right"
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Button>
          </div>
        </Reveal>
      </div>

      {selected ? <ProjectModal project={selected} onClose={handleClose} /> : null}
    </section>
  )
}
