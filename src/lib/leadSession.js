const STORAGE_KEY = 'ravjot_chat_session_token'

/**
 * The token is only a cached credential. The backend decides whether it is
 * valid, so editing localStorage cannot unlock the assistant.
 */
export function readStoredToken() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || null
  } catch {
    return null
  }
}

export function storeToken(token) {
  try {
    if (token) window.localStorage.setItem(STORAGE_KEY, token)
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage can be blocked (private mode); the in-memory token still works
    // for the current page session.
  }
}

export function clearStoredToken() {
  storeToken(null)
}
