import { useEffect, useState } from 'react'
import About from './components/About'
import AdminPanel from './components/AdminPanel'
import Chatbot from './components/Chatbot'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Navbar from './components/Navbar'
import Projects from './components/Projects'
import ScrollProgress from './components/ScrollProgress'
import Skills from './components/Skills'

export default function App() {
  const [adminOpen, setAdminOpen] = useState(() => {
    return typeof window !== 'undefined' && window.location.hash === '#admin'
  })

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setAdminOpen(true)
      }
    }

    const handleKeyDown = (event) => {
      // Shortcut: Ctrl + Shift + A (or Cmd + Shift + A) to open Admin Portal
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'A' || event.key === 'a')) {
        event.preventDefault()
        setAdminOpen((prev) => !prev)
      }
    }

    window.addEventListener('hashchange', handleHash)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('hashchange', handleHash)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleCloseAdmin = () => {
    setAdminOpen(false)
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#08090a] transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <div className="grain" aria-hidden="true" />
      <ScrollProgress />
      <Navbar />

      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer onOpenAdmin={() => setAdminOpen(true)} />

      <Chatbot />

      <AdminPanel isOpen={adminOpen} onClose={handleCloseAdmin} />
    </>
  )
}
