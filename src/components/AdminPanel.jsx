import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../lib/api'
import Icon from './ui/Icon'

const ADMIN_SESSION_KEY = 'ravjot_admin_session'

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

// ---------------------------------------------------------------------------
// Login Landing Page (Gatekeeper)
// ---------------------------------------------------------------------------

function AdminLoginView({ onLoginSuccess, onClose }) {
  const [mode, setMode] = useState('master') // 'master' | 'team'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [mode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Please enter your password.')
      return
    }
    if (mode === 'team' && !email.trim()) {
      setError('Please enter your team email address.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const payload = mode === 'master' ? { password: password.trim() } : { email: email.trim(), password: password.trim() }
      const res = await api.adminLogin(payload)
      if (res?.authenticated && res?.token) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(res))
        onLoginSuccess(res)
      } else {
        setError('Authentication failed. Please verify your credentials.')
      }
    } catch (err) {
      setError(err.message || 'Incorrect credentials. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background glow and subtle grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-[#4b6bff]/[0.05] blur-[100px]" />
      </div>

      <div className="relative w-full max-w-[430px] rounded-3xl border border-white/10 bg-[#0c0e11]/90 p-7 sm:p-9 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.95)] backdrop-blur-xl animate-fade-in">
        {/* Floating badge & close */}
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Restricted Admin Portal
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to Portfolio"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-faint transition-colors hover:border-white/25 hover:text-white"
          >
            <Icon name="close" size={14} />
          </button>
        </div>

        {/* Brand circle */}
        <div className="mt-7 flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-gradient-to-br from-[#283218] via-[#141810] to-[#0c0e11] font-serif text-2xl italic text-accent shadow-inner">
            rs
          </span>
          <div>
            <h2 className="text-xl font-medium tracking-tight text-white">
              Admin & Support
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              Ravjot Singh · Management Console
            </p>
          </div>
        </div>

        {/* Access Mode Selector */}
        <div className="mt-6 flex rounded-xl border border-white/10 bg-black/40 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('master')
              setError('')
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
              mode === 'master'
                ? 'bg-accent font-semibold text-[#08090a] shadow-sm'
                : 'text-faint hover:text-white'
            }`}
          >
            <Icon name="crown" size={13} />
            <span>Master Admin</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('team')
              setError('')
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
              mode === 'team'
                ? 'bg-accent font-semibold text-[#08090a] shadow-sm'
                : 'text-faint hover:text-white'
            }`}
          >
            <Icon name="users" size={13} />
            <span>Support Team</span>
          </button>
        </div>

        <div className="mt-5">
          <p className="text-[13px] leading-relaxed text-muted">
            {mode === 'master'
              ? 'Enter your master key to access full controls, live customer chats, and team member management.'
              : 'Sign in with your team credentials to respond to live visitor chats and client inquiries.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'team' && (
            <div>
              <label
                htmlFor="team-email"
                className="block font-mono text-[10px] uppercase tracking-[0.2em] text-faint"
              >
                Team Email
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint">
                  <Icon name="mail" size={15} />
                </span>
                <input
                  id="team-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@portfolio.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 font-mono text-[13px] text-ink placeholder-white/20 outline-none transition-colors focus:border-accent/60 focus:bg-white/[0.02]"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="admin-password"
              className="block font-mono text-[10px] uppercase tracking-[0.2em] text-faint"
            >
              {mode === 'master' ? 'Master Admin Password' : 'Password'}
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint">
                <Icon name="lock" size={15} />
              </span>
              <input
                ref={inputRef}
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                placeholder={mode === 'master' ? 'Enter master password...' : 'Enter your password...'}
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-10 font-mono text-[13px] text-ink placeholder-white/20 outline-none transition-colors focus:border-accent/60 focus:bg-white/[0.02]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-white"
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={15} />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/[0.08] p-3 text-[12px] text-red-300">
              <span className="shrink-0 text-red-400">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-[13px] font-semibold text-[#08090a] transition-all hover:bg-white hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            <Icon name="unlock" size={15} />
            <span>{isSubmitting ? 'Verifying...' : mode === 'master' ? 'Unlock Master Portal' : 'Sign In as Support'}</span>
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-7 flex items-center justify-between border-t border-white/[0.06] pt-5 text-[11px]">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-faint transition-colors hover:text-accent"
          >
            <Icon name="arrow-right" size={12} className="rotate-180" />
            Back to Website
          </button>
          <span className="font-mono text-[9px] text-white/25">
            Encrypted Session
          </span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Admin Dashboard
// ---------------------------------------------------------------------------

export default function AdminPanel({ isOpen, onClose }) {
  const [session, setSession] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      const stored = sessionStorage.getItem(ADMIN_SESSION_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const isMaster = session?.role === 'master'

  const [activeTab, setActiveTab] = useState('chats') // 'chats' | 'contacts' | 'team'
  const [contacts, setContacts] = useState([])
  const [conversations, setConversations] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [selectedContactId, setSelectedContactId] = useState(null)
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [replyText, setReplyText] = useState('')
  const [chatReplyText, setChatReplyText] = useState('')
  const [sendingChatReply, setSendingChatReply] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedReply, setCopiedReply] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Team Modal state
  const [showAddTeamModal, setShowAddTeamModal] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberPassword, setNewMemberPassword] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('support')
  const [teamError, setTeamError] = useState('')
  const [teamSubmitting, setTeamSubmitting] = useState(false)

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

      if (isMaster) {
        const teamData = await api.getTeamMembers().catch(() => [])
        setTeamMembers(teamData || [])
      }
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch when opened & authenticated
  useEffect(() => {
    if (isOpen && session?.authenticated) {
      fetchData()
    }
  }, [isOpen, session?.authenticated, isMaster])

  // Auto-refresh conversations & active chat messages every 4s
  useEffect(() => {
    if (!isOpen || !session?.authenticated || !autoRefresh) return

    const interval = setInterval(() => {
      // Refresh conversation list
      api.getAdminConversations().then((list) => {
        if (list) setConversations(list)
      }).catch(() => {})

      // If viewing a chat, refresh that chat's messages
      if (activeTab === 'chats' && selectedChatId) {
        api.getAdminConversation(selectedChatId).then((messages) => {
          if (messages) setChatMessages(messages)
        }).catch(() => {})
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [isOpen, session?.authenticated, autoRefresh, activeTab, selectedChatId])

  // Lock body scroll when admin modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const onKeyDown = (e) => {
        if (e.key === 'Escape' && !showAddTeamModal) onClose()
      }
      window.addEventListener('keydown', onKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', onKeyDown)
      }
    }
    document.body.style.overflow = ''
  }, [isOpen, onClose, showAddTeamModal])

  // Fetch full conversation when selected
  useEffect(() => {
    if (activeTab === 'chats' && selectedChatId && session?.authenticated) {
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
  }, [activeTab, selectedChatId, session?.authenticated])

  const handleSignOut = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    setSession(null)
  }

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
      if (!search.trim()) return true
      const q = search.toLowerCase()
      const matchesTitle = c.title?.toLowerCase().includes(q)
      const matchesPreview = c.preview?.toLowerCase().includes(q)
      const matchesId = String(c.id).includes(q)
      return matchesTitle || matchesPreview || matchesId
    })
  }, [conversations, search])

  const handleToggleRead = async (contactId) => {
    try {
      const updated = await api.toggleContactRead(contactId)
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, read: updated.read } : c))
      )
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return
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
    if (!window.confirm('Are you sure you want to delete this entire chat conversation?')) return
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

  // Send live reply into visitor conversation
  const handleSendChatReply = async (e) => {
    e?.preventDefault()
    if (!chatReplyText.trim() || !selectedChatId || sendingChatReply) return

    const content = chatReplyText.trim()
    const senderName = session?.user
      ? `${session.user} (${session.role === 'master' ? 'Master' : 'Support'})`
      : 'Support Team'

    setSendingChatReply(true)
    try {
      const savedMsg = await api.sendAdminChatReply(selectedChatId, content, senderName)
      setChatMessages((prev) => [...prev, savedMsg])
      setChatReplyText('')
      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
        }
      }, 50)
    } catch (err) {
      alert(err.message || 'Failed to send reply to user.')
    } finally {
      setSendingChatReply(false)
    }
  }

  // Team actions
  const handleCreateTeamMember = async (e) => {
    e.preventDefault()
    if (!newMemberName.trim() || !newMemberEmail.trim() || !newMemberPassword.trim()) {
      setTeamError('Please fill in all fields.')
      return
    }

    setTeamSubmitting(true)
    setTeamError('')
    try {
      const created = await api.createTeamMember({
        name: newMemberName.trim(),
        email: newMemberEmail.trim().toLowerCase(),
        password: newMemberPassword.trim(),
        role: newMemberRole,
      })
      setTeamMembers((prev) => [created, ...prev])
      setShowAddTeamModal(false)
      setNewMemberName('')
      setNewMemberEmail('')
      setNewMemberPassword('')
      setNewMemberRole('support')
    } catch (err) {
      setTeamError(err.message || 'Failed to create team member.')
    } finally {
      setTeamSubmitting(false)
    }
  }

  const handleToggleMemberActive = async (member) => {
    if (member.role === 'master') {
      alert('Cannot deactivate Master Administrator.')
      return
    }
    try {
      const updated = await api.updateTeamMember(member.id, {
        is_active: !member.is_active,
      })
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, is_active: updated.is_active } : m))
      )
    } catch (err) {
      alert(err.message || 'Failed to update member status.')
    }
  }

  const handleDeleteMember = async (member) => {
    if (member.role === 'master') {
      alert('Cannot delete Master Administrator.')
      return
    }
    if (!window.confirm(`Are you sure you want to remove ${member.name} from the support team?`)) return
    try {
      await api.deleteTeamMember(member.id)
      setTeamMembers((prev) => prev.filter((m) => m.id !== member.id))
    } catch (err) {
      alert(err.message || 'Failed to delete team member.')
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
    const subject = encodeURIComponent(
      `Re: Inquiry from Ravjot Singh Portfolio (${selectedContact.project || 'Project'})`
    )
    const body = encodeURIComponent(
      replyText
        ? `${replyText}\n\n---\nOriginal message from ${selectedContact.name}:\n"${selectedContact.message}"`
        : `Hi ${selectedContact.name},\n\nThank you for reaching out regarding ${selectedContact.project || 'your project'}!\n\nBest regards,\nRavjot Singh\nravjotsg03@gmail.com`
    )
    window.location.href = `mailto:${selectedContact.email}?subject=${subject}&body=${body}`
  }

  if (!isOpen) return null

  // If not authenticated, render Login Landing Page
  if (!session?.authenticated) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Admin Login"
        className="fixed inset-0 z-[120] flex flex-col bg-[#070809] text-ink backdrop-blur-2xl overflow-y-auto"
      >
        <AdminLoginView
          onLoginSuccess={(newSession) => {
            setSession(newSession)
          }}
          onClose={onClose}
        />
      </div>
    )
  }

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
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-[-0.01em] text-white">
                Admin Portal
              </h1>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                  isMaster
                    ? 'border border-accent/30 bg-accent/10 text-accent font-semibold'
                    : 'border border-blue-500/30 bg-blue-500/10 text-blue-300'
                }`}
              >
                <Icon name={isMaster ? 'crown' : 'shield'} size={10} />
                {isMaster ? 'Master Admin' : 'Support Team'}
              </span>
            </div>
            <p className="font-mono text-[10px] text-faint">
              {session.user} {session.email && `· ${session.email}`}
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-1">
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
            <span>Live Chats</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] text-faint">({conversations.length})</span>
            </span>
          </button>

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

          {isMaster && (
            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all ${
                activeTab === 'team'
                  ? 'bg-accent font-semibold text-[#08090a] shadow-sm'
                  : 'text-muted hover:text-white'
              }`}
            >
              <Icon name="users" size={13} />
              <span>Team</span>
              <span className="text-[10px] opacity-75">({teamMembers.length})</span>
            </button>
          )}
        </div>

        {/* Actions & Sign Out */}
        <div className="flex items-center gap-2">
          {activeTab === 'chats' && (
            <button
              type="button"
              onClick={() => setAutoRefresh((prev) => !prev)}
              title={autoRefresh ? 'Live Polling Active (4s)' : 'Live Polling Paused'}
              className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                autoRefresh
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-white/10 bg-white/[0.03] text-faint'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${autoRefresh ? 'bg-accent animate-ping' : 'bg-faint'}`} />
              <span className="hidden sm:inline">{autoRefresh ? 'Live' : 'Paused'}</span>
            </button>
          )}

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
            onClick={handleSignOut}
            title="Sign Out (Lock Portal)"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
          >
            <Icon name="lock" size={13} />
            <span className="hidden sm:inline">Lock</span>
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

      {/* Main Body */}
      {activeTab === 'team' ? (
        /* Support Team Management View (Master Admin Only) */
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Header info & Add Member button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-white/10 bg-[#0c0e11] p-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-white">Support Team Management</h2>
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] text-accent uppercase tracking-wider">
                    Master Admin Control
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-muted">
                  Create support agent accounts, manage member roles, and control access to live visitor communications.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTeamModal(true)}
                className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-mono text-[12px] font-semibold text-[#08090a] transition-all hover:bg-white hover:scale-[1.02]"
              >
                <Icon name="plus" size={14} />
                <span>Add Support Agent</span>
              </button>
            </div>

            {/* Team Roster Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => {
                const isMasterMember = member.role === 'master'
                return (
                  <div
                    key={member.id}
                    className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0e1014] p-5 transition-colors hover:border-white/20"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`grid h-10 w-10 place-items-center rounded-xl font-serif text-lg italic ${
                              isMasterMember
                                ? 'border border-accent/40 bg-accent/10 text-accent font-bold'
                                : 'border border-blue-500/30 bg-blue-500/10 text-blue-300'
                            }`}
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                            <p className="font-mono text-[11px] text-faint">{member.email}</p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                            isMasterMember
                              ? 'border border-accent/40 bg-accent/10 text-accent font-medium'
                              : 'border border-blue-500/30 bg-blue-500/10 text-blue-300'
                          }`}
                        >
                          {isMasterMember ? 'Master Admin' : 'Support Agent'}
                        </span>
                      </div>

                      <div className="mt-5 space-y-1.5 text-[11px] text-muted">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-faint">Status:</span>
                          <span
                            className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${
                              member.is_active ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                member.is_active ? 'bg-emerald-400' : 'bg-red-400'
                              }`}
                            />
                            {member.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-faint">Joined:</span>
                          <span className="font-mono text-faint">{formatDate(member.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Member action buttons */}
                    <div className="mt-5 flex items-center justify-end gap-2 border-t border-white/[0.06] pt-4">
                      {!isMasterMember ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleToggleMemberActive(member)}
                            className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted hover:border-white/20 hover:text-white"
                          >
                            {member.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(member)}
                            className="grid h-7 w-7 place-items-center rounded-lg border border-red-500/20 bg-red-500/[0.05] text-red-400 hover:border-red-500/40 hover:bg-red-500/10"
                            title="Delete Member"
                          >
                            <Icon name="trash" size={12} />
                          </button>
                        </>
                      ) : (
                        <span className="font-mono text-[10px] text-faint italic">Primary Account</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Add Team Member Modal */}
          {showAddTeamModal && (
            <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
              <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0e1014] p-7 shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                      <Icon name="users" size={14} />
                    </span>
                    <h3 className="text-base font-semibold text-white">Add Support Team Member</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddTeamModal(false)}
                    className="text-faint hover:text-white"
                  >
                    <Icon name="close" size={15} />
                  </button>
                </div>

                <form onSubmit={handleCreateTeamMember} className="mt-6 space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                      Agent Name
                    </label>
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      required
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 font-mono text-[13px] text-ink placeholder-white/20 outline-none focus:border-accent/60"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                      Agent Email
                    </label>
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="priya@portfolio.com"
                      required
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 font-mono text-[13px] text-ink placeholder-white/20 outline-none focus:border-accent/60"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                      Password
                    </label>
                    <input
                      type="password"
                      value={newMemberPassword}
                      onChange={(e) => setNewMemberPassword(e.target.value)}
                      placeholder="Create secure password..."
                      required
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 font-mono text-[13px] text-ink placeholder-white/20 outline-none focus:border-accent/60"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                      Role Privileges
                    </label>
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-[13px] text-ink outline-none focus:border-accent/60"
                    >
                      <option value="support">Support Agent (Live Chat & Inquiries)</option>
                      <option value="master">Master Administrator (Full Access)</option>
                    </select>
                  </div>

                  {teamError && (
                    <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-[12px] text-red-300">
                      {teamError}
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddTeamModal(false)}
                      className="rounded-xl border border-white/10 px-4 py-2 font-mono text-[12px] uppercase text-muted hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={teamSubmitting}
                      className="flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2 font-mono text-[12px] font-semibold uppercase text-[#08090a] hover:bg-white disabled:opacity-60"
                    >
                      <Icon name="check" size={13} />
                      <span>{teamSubmitting ? 'Creating...' : 'Create Account'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Split Layout for Live User Chats & Contact Inquiries */
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Left Sidebar List */}
          <aside className="flex w-full flex-col border-r border-white/[0.08] bg-[#0c0e11]/60 sm:w-80 md:w-96 shrink-0">
            {/* Search and Filters */}
            <div className="border-b border-white/[0.08] p-3 sm:p-4 space-y-3">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint">
                  <Icon name="search" size={14} />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    activeTab === 'contacts'
                      ? 'Search sender, email, project...'
                      : 'Search user query, session #...'
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2 pl-9 pr-8 text-[12px] font-mono text-ink placeholder-white/20 outline-none transition-colors focus:border-accent/60 focus:bg-white/[0.02]"
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
                <div className="flex items-center gap-1 rounded-lg border border-white/5 bg-black/30 p-1">
                  {['all', 'unread', 'read'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={`flex-1 rounded-md py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                        filter === f
                          ? 'bg-white/10 text-white font-medium'
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
              {loading && (
                <div className="p-8 text-center font-mono text-[11px] uppercase tracking-wider text-faint animate-pulse">
                  Loading conversations...
                </div>
              )}

              {activeTab === 'contacts' ? (
                /* Contact Messages List */
                filteredContacts.length === 0 && !loading ? (
                  <div className="p-8 text-center font-mono text-[11px] text-faint">
                    No contact messages found.
                  </div>
                ) : (
                  filteredContacts.map((contact) => {
                    const isSelected = contact.id === selectedContactId
                    return (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => setSelectedContactId(contact.id)}
                        className={`group relative flex w-full flex-col gap-1.5 p-4 text-left transition-colors ${
                          isSelected
                            ? 'bg-accent/[0.07] border-l-2 border-accent'
                            : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`font-semibold text-sm truncate ${
                              !contact.read ? 'text-white' : 'text-muted'
                            }`}
                          >
                            {contact.name}
                          </span>
                          <span className="font-mono text-[10px] text-faint shrink-0">
                            {timeAgo(contact.created_at)}
                          </span>
                        </div>

                        <p className="font-mono text-[11px] text-faint truncate">
                          {contact.email}
                        </p>

                        <p className="line-clamp-2 text-[12px] text-muted/80 leading-relaxed">
                          {contact.message}
                        </p>

                        <div className="mt-1 flex items-center justify-between">
                          <span className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-faint">
                            {contact.project || 'General'}
                          </span>
                          {!contact.read && (
                            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                          )}
                        </div>
                      </button>
                    )
                  })
                )
              ) : (
                /* Live User Conversations List */
                filteredConversations.length === 0 && !loading ? (
                  <div className="p-8 text-center font-mono text-[11px] text-faint">
                    No active user chat sessions.
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const isSelected = conv.id === selectedChatId
                    return (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => setSelectedChatId(conv.id)}
                        className={`group relative flex w-full flex-col gap-1.5 p-4 text-left transition-colors ${
                          isSelected
                            ? 'bg-accent/[0.07] border-l-2 border-accent'
                            : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 truncate">
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] font-mono text-[10px] text-accent">
                              U
                            </span>
                            <span className="font-semibold text-sm text-white truncate">
                              User #{conv.id}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-faint shrink-0">
                            {timeAgo(conv.updated_at)}
                          </span>
                        </div>

                        <p className="line-clamp-2 text-[12px] text-muted leading-relaxed">
                          "{conv.preview || conv.title || 'New inquiry'}"
                        </p>

                        <div className="mt-1 flex items-center justify-between">
                          <span className="rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] text-faint">
                            {conv.message_count} messages
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono text-[9px] text-accent">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                            Live Thread
                          </span>
                        </div>
                      </button>
                    )
                  })
                )
              )}
            </div>
          </aside>

          {/* Right Detail Pane */}
          <main className="flex-1 overflow-hidden bg-[#090b0d]">
            {activeTab === 'contacts' ? (
              /* Contact Detail View */
              selectedContact ? (
                <div className="flex h-full flex-col overflow-y-auto">
                  {/* Inquiry Header */}
                  <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0c0e11]/80 p-5 sm:px-8">
                    <div>
                      <h2 className="text-xl font-serif italic text-white">
                        {selectedContact.name}
                      </h2>
                      <p className="font-mono text-[11px] text-faint">
                        Received: {formatDate(selectedContact.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleRead(selectedContact.id)}
                        className={`rounded-lg border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                          selectedContact.read
                            ? 'border-white/10 bg-white/[0.03] text-muted hover:text-white'
                            : 'border-accent/40 bg-accent/10 text-accent font-semibold'
                        }`}
                      >
                        {selectedContact.read ? 'Mark as Unread' : 'Mark as Read'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteContact(selectedContact.id)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-red-500/20 bg-red-500/[0.05] text-red-400 hover:border-red-500/40 hover:bg-red-500/10"
                        title="Delete Message"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Inquiry Body */}
                  <div className="flex-1 p-5 sm:p-8 space-y-6">
                    <div className="grid gap-3 sm:grid-cols-2 rounded-2xl border border-white/10 bg-[#0e1013] p-4">
                      <div>
                        <span className="font-mono text-[10px] uppercase text-faint">Email</span>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="font-mono text-[13px] text-white select-all">
                            {selectedContact.email}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleCopyEmail(selectedContact.email)}
                            className="text-faint hover:text-accent"
                          >
                            <Icon name="copy" size={13} />
                          </button>
                          {copied && (
                            <span className="font-mono text-[10px] text-accent">Copied!</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase text-faint">
                          Project Type
                        </span>
                        <p className="mt-1 font-mono text-[13px] text-accent">
                          {selectedContact.project || 'General Inquiry'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-mono text-[11px] uppercase tracking-wider text-faint mb-2">
                        Message Content
                      </h4>
                      <div className="rounded-2xl border border-white/10 bg-[#0c0e11] p-5 text-[14px] leading-relaxed text-ink/90 whitespace-pre-wrap">
                        {selectedContact.message}
                      </div>
                    </div>

                    {/* Quick Response Composer */}
                    <div className="rounded-2xl border border-white/10 bg-[#0c0e11] p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-mono text-[11px] uppercase tracking-wider text-faint flex items-center gap-2">
                          <Icon name="reply" size={13} />
                          Draft Direct Email Reply
                        </h4>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleCopyReply}
                            className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase text-muted hover:text-white"
                          >
                            {copiedReply ? 'Copied Reply!' : 'Copy Text'}
                          </button>
                          <button
                            type="button"
                            onClick={handleOpenEmailClient}
                            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1 font-mono text-[11px] font-semibold text-[#08090a] hover:bg-white"
                          >
                            <Icon name="mail" size={12} />
                            <span>Open Mail Client</span>
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Hi ${selectedContact.name},\n\nThank you for reaching out regarding ${selectedContact.project || 'your project'}! I would be excited to connect...`}
                        className="w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-[12px] text-ink placeholder-white/20 outline-none focus:border-accent/60"
                      />
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
                  </div>
                </div>
              )
            ) : (
              /* Live Multi-User Chat Console & Interactive Reply */
              selectedConversation ? (
                <div className="flex h-full flex-col">
                  {/* Chat Session Header */}
                  <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0c0e11]/90 p-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl border border-accent/30 bg-accent/10 font-mono text-sm font-semibold text-accent">
                        #{selectedConversation.id}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-semibold text-white">
                            Visitor #{selectedConversation.id}
                          </h2>
                          <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
                            Connected
                          </span>
                        </div>
                        <p className="font-mono text-[10px] text-faint">
                          Last message {timeAgo(selectedConversation.updated_at)} · {chatMessages.length} total messages
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteConversation(selectedConversation.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.05] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-red-400 hover:border-red-500/40 hover:bg-red-500/10"
                    >
                      <Icon name="trash" size={13} />
                      <span className="hidden sm:inline">Delete Thread</span>
                    </button>
                  </div>

                  {/* Chat Stream Messages */}
                  <div
                    ref={chatScrollRef}
                    className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-radial from-[#0d1013] to-[#070809]"
                  >
                    {chatLoading ? (
                      <div className="grid h-32 place-items-center">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-faint animate-pulse">
                          Syncing conversation stream...
                        </span>
                      </div>
                    ) : chatMessages.length === 0 ? (
                      <p className="text-center font-mono text-[11px] text-faint">
                        No messages in this chat session yet.
                      </p>
                    ) : (
                      chatMessages.map((msg) => {
                        const isUser = msg.role === 'user'
                        const isSupportOrAdmin = Boolean(msg.sender_name)
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                          >
                            <span className="mb-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-faint">
                              {isUser ? (
                                <>
                                  <span className="text-white/60 font-semibold">Visitor</span> · {timeAgo(msg.created_at)}
                                </>
                              ) : isSupportOrAdmin ? (
                                <>
                                  <span className="text-accent font-semibold">
                                    {msg.sender_name}
                                  </span>{' '}
                                  · {timeAgo(msg.created_at)}
                                </>
                              ) : (
                                <>
                                  <span className="text-blue-300 font-semibold">Gemini AI Assistant</span> · {timeAgo(msg.created_at)}
                                </>
                              )}
                            </span>
                            <div
                              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-[13px] sm:text-[14px] leading-relaxed shadow-lg ${
                                isUser
                                  ? 'bg-[#15191e] border border-white/10 text-white rounded-tl-sm'
                                  : isSupportOrAdmin
                                  ? 'bg-gradient-to-br from-[#182012] to-[#12190e] border border-accent/40 text-white rounded-tr-sm shadow-[0_4px_20px_rgba(217,255,67,0.08)]'
                                  : 'bg-[#101317] border border-white/10 text-ink/90 rounded-tr-sm'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* Live Chat Direct Reply Console */}
                  <div className="border-t border-white/[0.08] bg-[#0c0e11] p-3 sm:p-4">
                    {/* Quick Response Suggestion Chips */}
                    <div className="mb-2.5 flex items-center gap-2 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-faint shrink-0">
                        Quick Chips:
                      </span>
                      {[
                        'Hi there! How can I assist you today?',
                        'You can reach me directly at ravjotsg03@gmail.com',
                        "I'd be glad to discuss your project requirements!",
                        'Thanks for checking out my portfolio!',
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setChatReplyText(chip)}
                          className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-faint hover:border-accent/40 hover:text-white transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Live Reply Input Form */}
                    <form onSubmit={handleSendChatReply} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chatReplyText}
                        onChange={(e) => setChatReplyText(e.target.value)}
                        placeholder={`Reply directly to Visitor #${selectedConversation.id} as ${session.user}...`}
                        className="flex-1 rounded-xl border border-white/10 bg-black/50 py-2.5 px-4 font-mono text-[13px] text-ink placeholder-white/25 outline-none focus:border-accent/60"
                      />
                      <button
                        type="submit"
                        disabled={sendingChatReply || !chatReplyText.trim()}
                        className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 font-mono text-[12px] font-semibold text-[#08090a] transition-all hover:bg-white disabled:opacity-50"
                      >
                        <Icon name="send" size={14} />
                        <span className="hidden sm:inline">Send Reply</span>
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="grid h-full place-items-center p-8 text-center">
                  <div>
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.02] text-faint">
                      <Icon name="message-square" size={20} />
                    </span>
                    <p className="mt-4 font-serif text-lg italic text-ink">
                      Select a user chat session
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-faint">
                      Respond live to visitors or monitor AI conversations.
                    </p>
                  </div>
                </div>
              )
            )}
          </main>
        </div>
      )}
    </div>
  )
}
