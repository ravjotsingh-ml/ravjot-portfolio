import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import Icon from './ui/Icon'

const WELCOME_MESSAGE =
  "Hi! I'm Ravjot's AI assistant. Ask me anything about his skills, projects, or experience."

const SUGGESTED_QUESTIONS = [
  'Tell me about Ravjot.',
  'What technical skills does he have?',
  'Explain his projects.',
  'What is his professional experience?',
  'How can I contact him?',
]

const STORAGE_KEY = 'ravjot_chat_conversation_id'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [conversationId, setConversationId] = useState(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? Number(stored) : null
  })

  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const didInitRef = useRef(false)

  useEffect(() => {
    if (!isOpen || didInitRef.current) return
    didInitRef.current = true

    const initialise = async () => {
      const welcome = { role: 'assistant', content: WELCOME_MESSAGE }

      if (conversationId) {
        try {
          const history = await api.getChatHistory(conversationId)
          const historyMessages = history.map((item) => ({
            role: item.role,
            content: item.content,
            sender_name: item.sender_name || null,
          }))
          setMessages([welcome, ...historyMessages])
          setIsReady(true)
          return
        } catch {
          // Fall through to a fresh conversation.
        }
      }

      try {
        const conversation = await api.startChat()
        setConversationId(conversation.conversation_id)
        window.localStorage.setItem(STORAGE_KEY, String(conversation.conversation_id))
      } catch {
        // The chat still works without a persisted conversation.
      }

      setMessages((current) => (current.length ? current : [welcome]))
      setIsReady(true)
    }

    initialise()
  }, [isOpen, conversationId])

  // Poll for live replies from Support / Admin when open
  useEffect(() => {
    if (!isOpen || isMinimized || !conversationId) return

    const interval = setInterval(async () => {
      try {
        const history = await api.getChatHistory(conversationId)
        if (!history || history.length === 0) return

        const welcome = { role: 'assistant', content: WELCOME_MESSAGE }
        const historyMessages = history.map((item) => ({
          role: item.role,
          content: item.content,
          sender_name: item.sender_name || null,
        }))

        // Only update if count has changed
        setMessages((prev) => {
          const nonWelcomePrev = prev.filter((m) => m.content !== WELCOME_MESSAGE && !m.error)
          if (nonWelcomePrev.length !== historyMessages.length) {
            return [welcome, ...historyMessages]
          }
          return prev
        })
      } catch {
        // Silently ignore polling network errors
      }
    }, 3500)

    return () => clearInterval(interval)
  }, [isOpen, isMinimized, conversationId])

  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, isTyping, isOpen, isMinimized])

  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus()
  }, [isOpen, isMinimized])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
        setIsMinimized(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const openChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const sendMessage = async (raw) => {
    const text = (raw ?? input).trim()
    if (!text || isTyping) return

    setMessages((current) => [...current, { role: 'user', content: text }])
    setInput('')
    setIsTyping(true)

    try {
      const response = await api.sendChatMessage(text, conversationId)
      const nextConversationId = response.conversation_id
      setConversationId(nextConversationId)
      window.localStorage.setItem(STORAGE_KEY, String(nextConversationId))
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: response.message.content },
      ])
    } catch (error) {
      const isNetworkError =
        error.message?.includes('NetworkError') ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('fetch')
      const message = isNetworkError
        ? "Sorry, I couldn't connect to the backend server. It may still be waking up from cold start or connecting. Please try again in a moment, or contact Ravjot directly at ravjotsg03@gmail.com."
        : `Sorry, I couldn't reach the assistant. ${error.message}`
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: message,
          error: true,
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const showSuggestions = isReady && messages.length <= 1 && !isTyping

  return (
    <>
      {/* Floating launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={openChat}
          aria-label="Open AI chat"
          aria-expanded="false"
          className="fixed bottom-5 right-5 z-[90] group flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[#08090a] shadow-[0_12px_40px_-10px_rgba(217,255,67,0.65)] transition-all duration-300 hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
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
      {isOpen && isMinimized && (
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
      {isOpen && !isMinimized && (
        <div
          id="ai-chat-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Ravjot's AI assistant"
          className="animate-fade-in fixed bottom-24 left-4 right-4 z-[90] flex h-[min(560px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:left-auto sm:right-5 sm:w-[380px]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-line bg-white/[0.02] px-4 py-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-accent/25 bg-accent/10 font-serif text-[15px] italic text-accent">
              rs
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ink">
                Ravjot's AI assistant
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-faint">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Online · powered by Gemini
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
            {messages.map((message, index) => {
              const isSupport = Boolean(message.sender_name)
              return (
                <div
                  key={index}
                  className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {isSupport && (
                    <span className="mb-1 ml-1 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-accent font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
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
