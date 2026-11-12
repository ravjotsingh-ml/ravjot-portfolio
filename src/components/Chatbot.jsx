import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../lib/api'
import Icon from './ui/Icon'

const SUGGESTED_QUESTIONS = [
  'Tell me about Ravjot.',
  'What technical skills does he have?',
  'Explain his Agentic AI and ML work.',
  'What is his professional experience?',
  'How can I hire or contact him?',
]

function firstNameOf(fullName) {
  return (fullName || '').trim().split(/\s+/)[0] || 'there'
}

function welcomeFor(fullName) {
  return {
    role: 'assistant',
    content: `Hi ${firstNameOf(fullName)}! Thanks for connecting with me. I'm Ravjot's AI assistant. Feel free to ask me anything about his skills, projects, experience, or professional background.`,
    welcome: true,
  }
}

function toBubble(item) {
  return {
    role: item.role,
    content: item.content,
    sender_name: item.sender_name || null,
  }
}

export default function Chatbot({ accessStatus, lead, openSignal, onSessionExpired }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [conversationId, setConversationId] = useState(lead?.conversation_id || null)

  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const closeTimerRef = useRef(null)
  const accessRef = useRef(accessStatus)
  const leadIdRef = useRef(lead?.lead_id || null)

  const isUnlocked = accessStatus === 'unlocked'

  useEffect(() => {
    accessRef.current = accessStatus
  }, [accessStatus])

  // --- Open automatically after a successful submission -----------------
  useEffect(() => {
    if (!openSignal) return
    if (accessStatus !== 'unlocked') return
    window.clearTimeout(closeTimerRef.current)
    setIsClosing(false)
    setIsMinimized(false)
    setIsOpen(true)
  }, [openSignal, accessStatus])

  // --- Initialise (or restore) the conversation for this lead -----------
  useEffect(() => {
    const leadId = lead?.lead_id || null
    if (!leadId) {
      leadIdRef.current = null
      setMessages([])
      setConversationId(null)
      setIsReady(false)
      return undefined
    }

    if (leadIdRef.current === leadId && isReady) return undefined
    leadIdRef.current = leadId

    let cancelled = false
    const welcome = welcomeFor(lead?.full_name)

    const initialise = async () => {
      const restoreId = lead?.conversation_id || conversationId

      if (restoreId) {
        try {
          const history = await api.getChatHistory(restoreId)
          if (cancelled) return
          setConversationId(restoreId)
          setMessages([welcome, ...(history || []).map(toBubble)])
          setIsReady(true)
          return
        } catch (error) {
          if (cancelled) return
          if (error.status === 401 || error.status === 403) {
            onSessionExpired?.()
            return
          }
          // Any other failure falls through to a fresh conversation.
        }
      }

      try {
        const conversation = await api.startChat()
        if (cancelled) return
        setConversationId(conversation.conversation_id)
      } catch (error) {
        if (cancelled) return
        if (error.status === 401 || error.status === 403) {
          onSessionExpired?.()
          return
        }
      }

      if (cancelled) return
      setMessages([welcome])
      setIsReady(true)
    }

    initialise()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.lead_id, accessStatus])

  // --- Poll for live replies from the support team ----------------------
  useEffect(() => {
    if (!isUnlocked || !isOpen || isMinimized || !conversationId) return undefined

    const interval = setInterval(async () => {
      try {
        const history = await api.getChatHistory(conversationId)
        if (!history) return

        setMessages((prev) => {
          const previousCount = prev.filter((message) => !message.welcome && !message.error).length
          if (previousCount === history.length) return prev
          return [welcomeFor(lead?.full_name), ...history.map(toBubble)]
        })
      } catch (error) {
        if (error.status === 401 || error.status === 403) {
          onSessionExpired?.()
        }
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [isUnlocked, isOpen, isMinimized, conversationId, lead?.full_name, onSessionExpired])

  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, isTyping, isOpen, isMinimized])

  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus()
  }, [isOpen, isMinimized])

  useEffect(
    () => () => {
      window.clearTimeout(closeTimerRef.current)
    },
    [],
  )

  const openChat = useCallback(() => {
    window.clearTimeout(closeTimerRef.current)
    setIsClosing(false)
    setIsMinimized(false)
    setIsOpen(true)
  }, [])

  const closeChat = useCallback(() => {
    setIsClosing(true)
    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false)
      setIsMinimized(false)
      setIsClosing(false)
    }, 200)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeChat()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeChat])

  const goToContactForm = useCallback(() => {
    // Scrolling to the field itself (instead of the section) forces the
    // deferred section to render first, so the visitor lands on the form.
    const field = document.getElementById('contact-name')
    const section = document.getElementById('contact')

    if (field) {
      field.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.setTimeout(() => {
      document.getElementById('contact-name')?.focus({ preventScroll: true })
    }, 700)
  }, [])

  const handleChatError = (error) => {
    if (error.status === 401 || error.status === 403) {
      onSessionExpired?.()
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            'Your chat session has expired. Please submit the contact form again to unlock the assistant.',
          error: true,
        },
      ])
      return
    }

    const isNetworkError =
      error.message?.includes('Failed to fetch') || error.message?.includes('fetch')
    const message = isNetworkError
      ? `Sorry, I couldn't reach the assistant. Please check your connection and try again, or email Ravjot at ravjotsg03@gmail.com.`
      : `Sorry, I couldn't reach the assistant. ${error.message}`

    setMessages((current) => [...current, { role: 'assistant', content: message, error: true }])
  }

  const sendMessage = async (raw) => {
    const text = (raw ?? input).trim()
    if (!text || isTyping) return

    if (!isUnlocked) {
      goToContactForm()
      return
    }

    setMessages((current) => [...current, { role: 'user', content: text }])
    setInput('')
    setIsTyping(true)

    try {
      const response = await api.sendChatMessage(text, conversationId)
      setConversationId(response.conversation_id)
      setMessages((current) => [...current, toBubble(response.message)])
    } catch (error) {
      handleChatError(error)
    } finally {
      setIsTyping(false)
    }
  }

  // The greeting is rendered immediately, even while the conversation history
  // is still being restored from the backend.
  const visibleMessages = useMemo(() => {
    if (messages.length) return messages
    if (isUnlocked && lead?.full_name) return [welcomeFor(lead.full_name)]
    return []
  }, [messages, isUnlocked, lead?.full_name])

  const showSuggestions = isReady && isUnlocked && visibleMessages.length <= 1 && !isTyping

  // --- Checking a stored session on load: render nothing ----------------
  if (accessStatus === 'checking') return null

  return (
    <>
      {/* Locked launcher — visible proof the assistant needs a submission */}
      {!isUnlocked && (
        <button
          type="button"
          onClick={goToContactForm}
          title="Submit the contact form to unlock the AI assistant"
          className="group fixed bottom-5 right-5 z-[90] flex items-center gap-2.5 rounded-full border border-line bg-surface/90 py-2.5 pl-3.5 pr-4 text-muted shadow-[0_16px_50px_-12px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-all duration-300 hover:border-accent/40 hover:text-ink"
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
            <Icon name="lock" size={16} />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-[12px] font-semibold text-ink">AI chat locked</span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
              Unlock via contact form
            </span>
          </span>
          <Icon
            name="arrow-up"
            size={13}
            className="ml-0.5 rotate-45 text-faint transition-transform duration-300 group-hover:text-accent"
          />
        </button>
      )}

      {/* Floating launcher */}
      {isUnlocked && !isOpen && (
        <button
          type="button"
          onClick={openChat}
          aria-label="Open AI chat"
          aria-expanded="false"
          className="group fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[#08090a] shadow-[0_12px_40px_-10px_rgba(217,255,67,0.65)] transition-all duration-300 hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <Icon
            name="sparkles"
            size={22}
            className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
          />
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-night bg-accent"
          />
        </button>
      )}

      {/* Minimized pill */}
      {isUnlocked && isOpen && isMinimized && (
        <button
          type="button"
          onClick={openChat}
          aria-label="Expand AI chat"
          className="fixed bottom-5 right-5 z-[90] flex items-center gap-3 rounded-full border border-line bg-surface/90 py-2.5 pl-4 pr-3 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-all duration-300 hover:border-accent/40"
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-[13px] font-medium text-ink">Chat with AI</span>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/[0.05] text-muted transition-colors hover:text-accent">
            <Icon name="arrow-up" size={14} />
          </span>
        </button>
      )}

      {/* Chat panel */}
      {isUnlocked && isOpen && !isMinimized && (
        <div
          id="ai-chat-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Ravjot's AI assistant"
          className={`chat-panel fixed bottom-24 left-4 right-4 z-[90] flex h-[min(560px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:left-auto sm:right-5 sm:w-[380px] ${
            isClosing ? 'is-closing' : ''
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-line bg-white/[0.02] px-4 py-3.5">
            <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-accent/25 bg-accent/10 font-serif text-[15px] italic text-accent">
              rs
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ink">Ravjot · AI Assistant</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-faint">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Online · Gemini AI · chatting as {firstNameOf(lead?.full_name)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              aria-label="Minimize chat"
              className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.05] hover:text-ink"
            >
              <Icon name="chevron-down" size={16} />
            </button>
            <button
              type="button"
              onClick={closeChat}
              aria-label="Close chat"
              className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.05] hover:text-ink"
            >
              <Icon name="close" size={16} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {visibleMessages.map((message, index) => {
              const isSupport = Boolean(message.sender_name)
              return (
                <div
                  key={index}
                  className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {isSupport && (
                    <span className="mb-1 ml-1 flex items-center gap-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-accent">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                      {message.sender_name}
                    </span>
                  )}
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      message.role === 'user'
                        ? 'rounded-br-sm bg-accent text-[#08090a]'
                        : message.error
                          ? 'rounded-bl-sm border border-red-400/25 bg-red-400/[0.08] text-red-200'
                          : isSupport
                            ? 'rounded-bl-sm border border-accent/40 bg-accent/[0.08] text-white shadow-[0_2px_15px_rgba(217,255,67,0.08)]'
                            : 'rounded-bl-sm border border-white/[0.08] bg-white/[0.04] text-ink/90'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              )
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/[0.08] bg-white/[0.04] px-3.5 py-3">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
                      style={{ animationDelay: `${dot * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {showSuggestions && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-3">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  className="rounded-full border border-white/[0.09] bg-white/[0.03] px-3 py-1.5 text-[11px] text-muted transition-all duration-300 hover:border-accent/40 hover:bg-accent/[0.06] hover:text-ink"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            className="flex items-center gap-2 border-t border-line bg-white/[0.02] p-3"
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage()
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about skills, projects, experience…"
              aria-label="Chat message"
              maxLength={2000}
              className="min-w-0 flex-1 rounded-full border border-white/[0.09] bg-white/[0.03] px-4 py-2.5 text-[13px] text-ink placeholder:text-faint focus:border-accent/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              aria-label="Send message"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-[#08090a] transition-all duration-300 hover:scale-105 hover:bg-white disabled:pointer-events-none disabled:opacity-40"
            >
              <Icon name="send" size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
