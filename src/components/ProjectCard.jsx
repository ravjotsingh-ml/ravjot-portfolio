import Icon from './ui/Icon'
import ProjectArtwork from './ProjectArtwork'

export default function ProjectCard({ project, featured = false, onOpen }) {
  return (
    <article className={featured ? 'md:col-span-2' : ''}>
      <button
        type="button"
        onClick={() => onOpen(project)}
        className={`group relative flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-surface text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] ${
          featured ? 'md:grid md:grid-cols-[1.15fr_0.85fr]' : ''
        }`}
      >
        <div
          className={`relative overflow-hidden ${
            featured
              ? 'aspect-[16/10] md:aspect-auto md:h-full md:min-h-[380px]'
              : 'aspect-[16/10]'
          }`}
        >
          <ProjectArtwork project={project} />
        </div>

        <div
          className={`flex flex-1 flex-col justify-between ${
            featured ? 'p-6 sm:p-8 lg:p-9' : 'p-5 sm:p-6'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
              <span className="text-accent/90">{project.category}</span>
              <span className="h-1 w-1 rounded-full bg-white/15" aria-hidden="true" />
              <span>{project.year}</span>
            </div>

            <h3
              className={`mt-4 font-medium tracking-[-0.03em] text-ink transition-colors duration-300 group-hover:text-accent ${
                featured ? 'text-2xl sm:text-[1.75rem]' : 'text-xl sm:text-[1.35rem]'
              }`}
            >
              {project.title}
            </h3>
            <p className="mt-1.5 font-serif text-[15px] italic text-muted">{project.tagline}</p>
            <p
              className={`mt-3 text-pretty leading-relaxed text-muted ${
                featured ? 'text-[14px]' : 'text-[13px]'
              }`}
            >
              {project.description}
            </p>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[10px] text-faint"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="text-[13px] font-medium text-ink">View case study</span>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/[0.02] text-muted transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-[#08090a]">
              <Icon
                name="arrow-up-right"
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </button>
    </article>
  )
}
