import About from './components/About'
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

      <Footer />

      <Chatbot />
    </>
  )
}
