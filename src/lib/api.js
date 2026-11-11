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
}
