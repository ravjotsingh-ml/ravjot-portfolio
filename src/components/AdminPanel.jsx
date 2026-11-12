import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../lib/api'
import Icon from './ui/Icon'

function formatDate(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

function timeAgo(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(isoString)
}

export default function AdminPanel({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('contacts') // 'contacts' | 'chats'
  const [contacts, setContacts] = useState([])
  const [conversations, setConversations] = useState([])
  const [selectedContactId, setSelectedContactId] = useState(null)
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'unread' | 'read'
  const [replyText, setReplyText] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedReply, setCopiedReply] = useState(false)
  const chatScrollRef = useRef(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [contactsData, conversationsData] = await Promise.all([
        api.getAdminContacts().catch(() => []),
        api.getAdminConversations().catch(() => []),
      ])
      setContacts(contactsData || [])
      setConversations(conversationsData || [])

      if (contactsData?.length && !selectedContactId) {
        setSelectedContactId(contactsData[0].id)
      }
      if (conversationsData?.length && !selectedChatId) {
        setSelectedChatId(conversationsData[0].id)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  // Lock body scroll when admin modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const onKeyDown = (e) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', onKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', onKeyDown)
      }
    }
    document.body.style.overflow = ''
  }, [isOpen, onClose])

  // Fetch full conversation when selected
  useEffect(() => {
    if (activeTab === 'chats' && selectedChatId) {
      setChatLoading(true)
      api
        .getAdminConversation(selectedChatId)
        .then((messages) => {
          setChatMessages(messages || [])
          setTimeout(() => {
            if (chatScrollRef.current) {
              chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
            }
          }, 50)
        })
        .catch(() => setChatMessages([]))
        .finally(() => setChatLoading(false))
    }
  }, [activeTab, selectedChatId])

  const selectedContact = useMemo(() => {
    return contacts.find((c) => c.id === selectedContactId) || null
  }, [contacts, selectedContactId])

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedChatId) || null
  }, [conversations, selectedChatId])

  const unreadCount = useMemo(() => {
    return contacts.filter((c) => !c.read).length
  }, [contacts])

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      if (filter === 'unread' && c.read) return false
      if (filter === 'read' && !c.read) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchesName = c.name?.toLowerCase().includes(q)
        const matchesEmail = c.email?.toLowerCase().includes(q)
        const matchesProject = c.project?.toLowerCase().includes(q)
        const matchesMsg = c.message?.toLowerCase().includes(q)
        if (!matchesName && !matchesEmail && !matchesProject && !matchesMsg) return false
      }
      return true
    })
  }, [contacts, filter, search])

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchesTitle = c.title?.toLowerCase().includes(q)
        const matchesPreview = c.preview?.toLowerCase().includes(q)
        if (!matchesTitle && !matchesPreview) return false
      }
      return true
    })
  }, [conversations, search])

  const handleToggleRead = async (contactId) => {
    try {
      const updated = await api.toggleContactRead(contactId)
      setContacts((prev) => prev.map((c) => (c.id === contactId ? updated : c)))
    } catch (err) {
      console.error('Failed to toggle read status', err)
    }
  }

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return
    try {
      await api.deleteContact(contactId)
      setContacts((prev) => {
        const remaining = prev.filter((c) => c.id !== contactId)
        if (selectedContactId === contactId) {
          setSelectedContactId(remaining[0]?.id || null)
        }
        return remaining
      })
    } catch (err) {
      console.error('Failed to delete contact', err)
    }
  }

  const handleDeleteConversation = async (convId) => {
    if (!window.confirm('Are you sure you want to delete this AI conversation?')) return
    try {
      await api.deleteConversation(convId)
      setConversations((prev) => {
        const remaining = prev.filter((c) => c.id !== convId)
        if (selectedChatId === convId) {
          setSelectedChatId(remaining[0]?.id || null)
        }
        return remaining
      })
      setChatMessages([])
    } catch (err) {
      console.error('Failed to delete conversation', err)
    }
  }

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyReply = () => {
    if (!replyText) return
    navigator.clipboard.writeText(replyText)
    setCopiedReply(true)
    setTimeout(() => setCopiedReply(false), 2000)
  }

  const handleOpenEmailClient = () => {
    if (!selectedContact) return
    const subject = encodeURIComponent(`Re: Inquiry from Ravjot Singh Portfolio (${selectedContact.project || 'Project'})`)
    const body = encodeURIComponent(
      replyText
        ? `${replyText}\n\n---\nOriginal message:\n"${selectedContact.message}"`
        : `Hi ${selectedContact.name},\n\nThank you for reaching out regarding ${selectedContact.project || 'your project'}!\n\nBest regards,\nRavjot Singh\nravjotsg03@gmail.com`
    )
    window.location.href = `mailto:${selectedContact.email}?subject=${subject}&body=${body}`
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admin Portal"
      className="fixed inset-0 z-[120] flex flex-col bg-[#070809]/95 text-ink backdrop-blur-2xl animate-fade-in"
    >
      {/* Top Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0b0d0f]/90 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/[0.04] font-serif text-[15px] italic text-accent">
            rs
          </span>
          <div>
            <h1 className="text-sm font-semibold tracking-[-0.01em] text-white">
              Admin Portal
              <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.2em] text-accent/90">
                Live Data
              </span>
            </h1>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'contacts'
                ? 'bg-white/10 text-white shadow-sm font-medium'
                : 'text-muted hover:text-white'
            }`}
          >
            <Icon name="mail" size={13} />
            <span>Inquiries</span>
            {unreadCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-[#08090a]">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chats')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'chats'
                ? 'bg-white/10 text-white shadow-sm font-medium'
                : 'text-muted hover:text-white'
            }`}
          >
            <Icon name="message-square" size={13} />
            <span>AI Chats</span>
            <span className="text-[10px] text-faint">({conversations.length})</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchData}
            title="Refresh Data"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Icon name="refresh" size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close (Esc)"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:border-white/20 hover:text-white"
          >
            <Icon name="close" size={14} />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left Sidebar / List */}
        <aside className="flex w-full flex-col border-r border-white/[0.08] bg-[#090b0d]/70 sm:w-80 md:w-96 shrink-0">
          {/* Search and Filters */}
          <div className="border-b border-white/[0.06] p-3.5 space-y-2.5">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint">
                <Icon name="search" size={14} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={activeTab === 'contacts' ? 'Search inquiries...' : 'Search conversations...'}
                className="w-full rounded-xl border border-white/10 bg-white/[0.025] py-2 pl-9 pr-3 text-[12px] text-ink placeholder-faint outline-none transition-colors focus:border-accent/50 focus:bg-white/[0.04]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint hover:text-white"
                >
                  <Icon name="close" size={12} />
                </button>
              )}
            </div>

            {activeTab === 'contacts' && (
              <div className="flex items-center gap-1">
                {['all', 'unread', 'read'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`rounded-lg px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                      filter === f
                        ? 'bg-accent/15 text-accent font-semibold border border-accent/30'
                        : 'text-faint hover:text-muted'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
            {activeTab === 'contacts' ? (
              filteredContacts.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
                    No inquiries found
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact) => {
                  const isSelected = contact.id === selectedContactId
                  return (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => setSelectedContactId(contact.id)}
                      className={`w-full text-left p-3.5 transition-colors group flex items-start gap-3 ${
                        isSelected
                          ? 'bg-accent/[0.06] border-l-2 border-accent'
                          : 'hover:bg-white/[0.02] border-l-2 border-transparent'
                      }`}
                    >
                      <div className="pt-1">
                        {!contact.read ? (
                          <span className="block h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(217,255,67,0.7)]" />
                        ) : (
                          <span className="block h-2 w-2 rounded-full bg-white/10" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`truncate text-[13px] ${
                              !contact.read ? 'font-semibold text-white' : 'font-medium text-ink/80'
                            }`}
                          >
                            {contact.name}
                          </p>
                          <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-faint">
                            {timeAgo(contact.created_at)}
                          </span>
                        </div>
                        <p className="truncate text-[11px] text-faint font-mono mt-0.5">
                          {contact.email}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted">
                          {contact.message}
                        </p>
                        {contact.project && (
                          <span className="mt-2 inline-block rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-faint">
                            {contact.project}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })
              )
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
                  No conversations found
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedChatId
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setSelectedChatId(conv.id)}
                    className={`w-full text-left p-3.5 transition-colors group flex items-start gap-3 ${
                      isSelected
                        ? 'bg-accent/[0.06] border-l-2 border-accent'
                        : 'hover:bg-white/[0.02] border-l-2 border-transparent'
                    }`}
                  >
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-accent">
                      <Icon name="message-square" size={13} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[13px] font-medium text-ink">
                          {conv.title}
                        </p>
                        <span className="shrink-0 font-mono text-[9px] text-faint">
                          {timeAgo(conv.updated_at)}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-[11px] text-muted">
                        {conv.preview || 'No preview available'}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-faint">
                          {conv.message_count} {conv.message_count === 1 ? 'message' : 'messages'}
                        </span>
                        <span className="text-white/20">·</span>
                        <span className="font-mono text-[9px] text-faint">
                          ID: #{conv.id}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        {/* Right Main Conversation Window */}
        <main className="flex flex-1 flex-col overflow-hidden bg-[#070809]">
          {activeTab === 'contacts' ? (
            selectedContact ? (
              <div className="flex h-full flex-col">
                {/* Contact Header Bar */}
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] bg-[#0c0e11]/80 p-5 sm:px-8">
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-accent/20 to-accent/5 font-serif text-lg italic text-accent border border-accent/20">
                      {selectedContact.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        {selectedContact.name}
                      </h2>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-muted">
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="hover:text-accent font-mono text-[11px]"
                        >
                          {selectedContact.email}
                        </a>
                        {selectedContact.project && (
                          <>
                            <span className="text-white/20">·</span>
                            <span className="rounded bg-accent/[0.08] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent border border-accent/20">
                              {selectedContact.project}
                            </span>
                          </>
                        )}
                        <span className="text-white/20">·</span>
                        <span className="font-mono text-[10px] text-faint">
                          {formatDate(selectedContact.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(selectedContact.email)}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.025] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:border-white/20 hover:text-white"
                    >
                      <Icon name="copy" size={13} />
                      <span>{copied ? 'Copied!' : 'Copy Email'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleRead(selectedContact.id)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                        selectedContact.read
                          ? 'border-white/10 bg-white/[0.025] text-faint hover:text-white'
                          : 'border-accent/40 bg-accent/10 text-accent font-medium'
                      }`}
                    >
                      <Icon name="check" size={13} />
                      <span>{selectedContact.read ? 'Mark Unread' : 'Mark Read'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteContact(selectedContact.id)}
                      title="Delete inquiry"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-red-500/20 bg-red-500/[0.05] text-red-400/80 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>

                {/* Conversation Thread Window */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
                  {/* Visitor Message Card */}
                  <div className="rounded-2xl border border-white/10 bg-[#0e1114]/90 p-6 shadow-xl backdrop-blur-sm">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                        Incoming Client Message
                      </span>
                      <span className="font-mono text-[10px] text-faint">
                        {formatDate(selectedContact.created_at)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink/90">
                      {selectedContact.message}
                    </p>
                  </div>

                  {/* Direct Reply Composer Card */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <label
                        htmlFor="admin-reply-box"
                        className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted"
                      >
                        <Icon name="reply" size={13} className="text-accent" />
                        Reply to {selectedContact.name}
                      </label>
                      <span className="font-mono text-[10px] text-faint">
                        Prepares direct email
                      </span>
                    </div>

                    <textarea
                      id="admin-reply-box"
                      rows={5}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Hi ${selectedContact.name},\n\nThanks for reaching out! Regarding ${selectedContact.project || 'your project'}...`}
                      className="w-full resize-y rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-[13px] leading-relaxed text-ink placeholder-white/20 outline-none transition-colors focus:border-accent/50"
                    />

                    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleOpenEmailClient}
                          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 font-semibold text-[13px] text-[#08090a] transition-all hover:bg-white hover:scale-[1.02]"
                        >
                          <Icon name="send" size={14} />
                          Send via Email Client
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyReply}
                          disabled={!replyText.trim()}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:border-white/25 hover:text-white disabled:opacity-40"
                        >
                          <Icon name="copy" size={13} />
                          <span>{copiedReply ? 'Copied Reply!' : 'Copy Reply'}</span>
                        </button>
                      </div>
                      <span className="font-mono text-[10px] text-faint">
                        Recipient: {selectedContact.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid h-full place-items-center p-8 text-center">
                <div>
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.02] text-faint">
                    <Icon name="mail" size={20} />
                  </span>
                  <p className="mt-4 font-serif text-lg italic text-ink">
                    Select an inquiry from the list
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-faint">
                    Read messages, reply directly, or manage status.
                  </p>
                </div>
              </div>
            )
          ) : (
            /* AI Chat Conversations View */
            selectedConversation ? (
              <div className="flex h-full flex-col">
                {/* Chat Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0c0e11]/80 p-5 sm:px-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-white">
                        {selectedConversation.title}
                      </h2>
                      <span className="rounded bg-white/[0.05] px-2 py-0.5 font-mono text-[9px] text-faint border border-white/10">
                        Chat #{selectedConversation.id}
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-[11px] text-faint">
                      Last active: {formatDate(selectedConversation.updated_at)} · {selectedConversation.message_count} messages
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteConversation(selectedConversation.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.05] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Icon name="trash" size={13} />
                    <span>Delete Chat</span>
                  </button>
                </div>

                {/* Conversation Thread */}
                <div
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4"
                >
                  {chatLoading ? (
                    <div className="grid h-32 place-items-center">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-faint animate-pulse">
                        Loading messages...
                      </span>
                    </div>
                  ) : chatMessages.length === 0 ? (
                    <p className="text-center font-mono text-[11px] text-faint">
                      No messages recorded in this conversation.
                    </p>
                  ) : (
                    chatMessages.map((msg) => {
                      const isUser = msg.role === 'user'
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                        >
                          <span className="mb-1 font-mono text-[9px] uppercase tracking-wider text-faint">
                            {isUser ? 'Visitor' : 'Gemini AI Assistant'} · {timeAgo(msg.created_at)}
                          </span>
                          <div
                            className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-[14px] leading-relaxed shadow-md ${
                              isUser
                                ? 'bg-accent/15 border border-accent/30 text-white rounded-tr-sm'
                                : 'bg-[#101316] border border-white/10 text-ink/90 rounded-tl-sm'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="grid h-full place-items-center p-8 text-center">
                <div>
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.02] text-faint">
                    <Icon name="message-square" size={20} />
                  </span>
                  <p className="mt-4 font-serif text-lg italic text-ink">
                    Select a conversation
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-faint">
                    Review what visitors asked the Gemini assistant.
                  </p>
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  )
}
