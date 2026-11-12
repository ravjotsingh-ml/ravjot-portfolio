const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const detail = data?.detail
    let message = `Request failed (${response.status})`
    if (typeof detail === 'string') message = detail
    else if (Array.isArray(detail)) {
      message = detail
        .map((item) => (item?.msg ? item.msg : 'Please check the form and try again.'))
        .join(' ')
    }
    throw new Error(message)
  }

  return data
}

export const api = {
  health: () => request('/api/health'),
  getPortfolio: () => request('/api/portfolio'),
  getProjects: () => request('/api/projects'),
  getSkills: () => request('/api/skills'),
  getExperience: () => request('/api/experience'),

  submitContact: (payload) =>
    request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  sendChatMessage: (message, conversationId) =>
    request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversation_id: conversationId || null,
      }),
    }),

  getChatHistory: async (conversationId) => {
    const data = await request(`/api/chat/history/${conversationId}`)
    return data.messages
  },

  startChat: () => request('/api/chat/start', { method: 'POST' }),

  // --- Admin API ---
  adminLogin: ({ password, email } = {}) =>
    request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        password,
        ...(email ? { email: email.trim() } : {}),
      }),
    }),
  getAdminContacts: () => request('/api/admin/contacts'),
  toggleContactRead: (id) => request(`/api/admin/contacts/${id}/read`, { method: 'PATCH' }),
  deleteContact: (id) => request(`/api/admin/contacts/${id}`, { method: 'DELETE' }),
  getAdminConversations: () => request('/api/admin/conversations'),
  getAdminConversation: async (id) => {
    const data = await request(`/api/chat/history/${id}`)
    return data.messages
  },
  sendAdminChatReply: (conversationId, content, senderName) =>
    request(`/api/admin/conversations/${conversationId}/reply`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        sender_name: senderName || null,
      }),
    }),
  deleteConversation: (id) => request(`/api/admin/conversations/${id}`, { method: 'DELETE' }),

  // --- Team Management (Master Admin) ---
  getTeamMembers: () => request('/api/admin/team'),
  createTeamMember: (payload) =>
    request('/api/admin/team', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateTeamMember: (id, payload) =>
    request(`/api/admin/team/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteTeamMember: (id) => request(`/api/admin/team/${id}`, { method: 'DELETE' }),
}
