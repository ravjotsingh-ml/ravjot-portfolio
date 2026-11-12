import { useCallback, useEffect, useState } from 'react'
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
import { api, setChatToken } from './lib/api'
import { clearStoredToken, readStoredToken, storeToken } from './lib/leadSession'

export default function App() {
  const [adminOpen, setAdminOpen] = useState(() => {
    return typeof window !== 'undefined' && window.location.hash === '#admin'
  })

  // Chat access is granted by the backend, never by the browser alone.
  // 'checking' -> validating a stored token, 'locked' -> no valid session.
  const [chatAccess, setChatAccess] = useState({ status: 'checking', lead: null })
  const [chatOpenSignal, setChatOpenSignal] = useState(0)

  useEffect(() => {
    let cancelled = false
    const token = readStoredToken()

    if (!token) {
      setChatAccess({ status: 'locked', lead: null })
      return undefined
    }

    setChatToken(token)
    api
      .getLeadSession()
      .then((session) => {
        if (cancelled) return
        if (!session?.valid) {
          setChatToken(null)
          clearStoredToken()
          setChatAccess({ status: 'locked', lead: null })
          return
        }
        setChatAccess({ status: 'unlocked', lead: session })
      })
      .catch(() => {
        if (cancelled) return
        setChatToken(null)
        clearStoredToken()
        setChatAccess({ status: 'locked', lead: null })
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleUnlocked = useCallback((result) => {
    setChatToken(result.session_token)
    storeToken(result.session_token)
    setChatAccess({
      status: 'unlocked',
      lead: {
        valid: true,
        lead_id: result.lead_id,
        full_name: result.full_name,
        expires_at: result.expires_at,
        conversation_id: result.conversation_id ?? null,
      },
    })
    // Automatically open the assistant after a successful submission.
    setChatOpenSignal((value) => value + 1)
  }, [])

  const handleSessionExpired = useCallback(() => {
    setChatToken(null)
    clearStoredToken()
    setChatAccess({ status: 'locked', lead: null })
  }, [])

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
        <Contact
          accessStatus={chatAccess.status}
          lead={chatAccess.lead}
          onUnlocked={handleUnlocked}
        />
      </main>

      <Footer onOpenAdmin={() => setAdminOpen(true)} />

      <Chatbot
        accessStatus={chatAccess.status}
        lead={chatAccess.lead}
        openSignal={chatOpenSignal}
        onSessionExpired={handleSessionExpired}
      />

      <AdminPanel isOpen={adminOpen} onClose={handleCloseAdmin} />
    </>
  )
}
