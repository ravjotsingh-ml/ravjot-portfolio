import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Preloader from './components/Preloader'
import './index.css'

/**
 * The landing page is only revealed once the app is mounted, the webfonts are
 * ready and the browser has finished loading every asset.
 */
function Root() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const windowReady =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }))
    // A short floor prevents a flash of the splash on instant connections.
    const minimumDelay = new Promise((resolve) => setTimeout(resolve, 550))

    Promise.all([fontsReady, windowReady, minimumDelay]).then(() => {
      if (!cancelled) setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <Preloader ready={ready} />
      {/* The landing page stays behind the loader until everything is ready.
          It is never hidden with a transition, because a backgrounded tab can
          freeze CSS transitions and leave the page invisible. */}
      <div className={ready ? undefined : 'pointer-events-none'} inert={!ready}>
        <App />
      </div>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
