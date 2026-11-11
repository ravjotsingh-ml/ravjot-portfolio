import { useEffect, useState } from 'react'

export default function useActiveSection(ids) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    let frame = 0

    const update = () => {
      const marker = window.scrollY + window.innerHeight * 0.3
      let current = ''

      for (const section of sections) {
        if (section.offsetTop <= marker) current = section.id
      }

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8
      if (atBottom) current = ids[ids.length - 1]

      setActive(current)
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])

  return active
}
