# Ravjot Singh — Full-Stack Portfolio

A premium, responsive portfolio with a FastAPI backend, PostgreSQL database and a
Gemini-powered AI chatbot.

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, JavaScript
- **Backend:** Python, FastAPI, SQLAlchemy, Pydantic
- **Database:** PostgreSQL (Alembic migrations)
- **AI:** Google Gemini via the official `google-genai` SDK

## Features

- Dark, editorial portfolio design with smooth scroll-reveal animations
- Hero, About, Skills, Projects, Experience and Contact sections
- Interactive project cards with case-study modals
- **Fast first paint**
  - Static splash screen painted from `index.html` before any JavaScript runs
  - A React preloader holds the screen until the app, the webfonts and every
    asset are ready — the landing page is never revealed half-loaded
  - The admin console (~40 kB) is code-split and only fetched when it opens
  - Webfonts load without blocking the first paint
  - Below-the-fold sections are rendered on demand with accurate intrinsic sizes
- **Lead capture first** — the contact form is the only way into the AI assistant
  - Full name, email and phone (country code) required, message optional
  - Live verification for the email and phone fields; the submit button stays
    locked until all three required fields are valid
  - The same validation runs again on the server — the browser is never trusted
  - Honeypot field, per-IP and per-email rate limiting, duplicate detection
  - Clear privacy notice about how the data is stored and used
- **Gated Gemini chatbot** (bottom-right) that unlocks after a successful submission
  - Server-issued session token; the launcher stays locked until then
  - Welcome message personalised with the visitor's name
  - Suggested questions, message bubbles, typing indicator, auto-scroll
  - Minimize / close, smooth open & close animations, responsive mobile layout
  - Conversations and messages persisted in PostgreSQL and linked to the lead
- **Celery worker** handles lead notifications and other background work, so
  the contact request returns immediately
- Admin portal lists captured leads (email, phone, message) and live chats
- GitHub, X / Twitter and LinkedIn links in the Hero, Contact and Footer
- Accessible markup, keyboard support and reduced-motion handling

## Project structure

```text
├── src/                        # React frontend
│   ├── components/
│   │   ├── Chatbot.jsx         # Floating Gemini chatbot
│   │   ├── ui/                 # Button, Icon, Reveal, SectionHeading
│   │   └── ...
│   ├── data/portfolio.js       # All editable content + social URLs
│   ├── lib/api.js              # Frontend API client (sends the chat session token)
│   ├── lib/leadSession.js      # Local cache for the server-issued chat token
│   └── App.jsx
└── backend/
    ├── app/
    │   ├── main.py             # FastAPI app + REST endpoints
    │   ├── models.py           # SQLAlchemy models
    │   ├── schemas.py          # Pydantic request/response schemas
    │   ├── chatbot.py          # Gemini integration
    │   ├── security.py         # Session tokens + rate limiting
    │   ├── seed.py             # Default portfolio content
    │   ├── database.py         # Engine + session
    │   └── core/config.py      # Environment configuration
    ├── migrations/             # Alembic migrations
    ├── alembic.ini
    ├── check_gemini.py         # Backend-side Gemini connectivity check
    ├── check_lead_flow.py      # End-to-end lead capture + gated chat check
    └── requirements.txt
```

## Getting started

### 0. Everything at once

```bash
./dev.sh
```

This starts the FastAPI backend (`:8000`), the Celery worker and the Vite
frontend (`:5173`) together and stops them again with `Ctrl + C`.

### 1. Frontend

```bash
npm install
npm run dev        # http://localhost:5173
```

The frontend calls the backend at `VITE_API_URL` (defaults to
`http://localhost:8000`). A local `.env` is already configured:

```bash
VITE_API_URL=http://localhost:8000
```

### 2. PostgreSQL

Create a database and point `DATABASE_URL` at it:

```bash
createdb portfolio
```

The default development URL in `backend/.env` is:

```bash
DATABASE_URL=postgresql+psycopg2://postgres@127.0.0.1:5433/portfolio
```

Adjust the host, port, user and password for your own PostgreSQL instance.

### 3. Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # then edit .env
alembic upgrade head        # create tables (the app also auto-creates them)
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

API docs: `http://localhost:8000/api/docs`

### 4. Celery worker (background processing)

Lead submissions are stored synchronously, but everything that happens
afterwards — owner notifications, analytics — runs in a Celery worker so the
API never blocks on SMTP or third-party calls.

```bash
cd backend
celery -A app.tasks.celery_app worker --loglevel=info --concurrency=2
```

The default broker is a local SQLite file, so nothing extra has to be installed
for development. In production point it at Redis:

```bash
CELERY_BROKER_URL=redis://default:<password>@<host>:6379/0
CELERY_RESULT_BACKEND=redis://default:<password>@<host>:6379/1
```

If no broker or worker is reachable the API still works — the task is executed
inline as a fallback. On Railway, deploy the `worker` process type from
`backend/Procfile` alongside the `web` service.

Add `LEAD_NOTIFICATION_EMAIL` and the `SMTP_*` variables to receive an email for
every new enquiry; without them the notification is written to the worker log.

### 4. Gemini API key (required for the chatbot)

The chatbot will not answer until a key is configured.

1. Create a key at <https://aistudio.google.com/apikey>.
2. Add it to `backend/.env` (or export it in your shell):

   ```bash
   GEMINI_API_KEY=your-key-here
   GEMINI_MODEL=gemini-3.5-flash-lite
   ```

3. Restart the backend.

The key is read only by the backend and is never sent to the browser or written
to logs. If the key is missing, the chatbot returns a clear configuration
message instead of inventing an answer.

Test the endpoint directly (a chat token is required — see below):

```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test Visitor","email":"visitor@example.com","phone_number":"+919876543210"}'

curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Chat-Token: <session_token from the response above>" \
  -d '{"message":"What are Ravjot’s technical skills?"}'
```

Or run the backend-side check:

```bash
cd backend
python3 check_gemini.py
```

## API endpoints

| Method | Endpoint                              | Description                    |
| ------ | ------------------------------------- | ------------------------------ |
| GET    | `/api/health`                         | Health + DB + Gemini status    |
| GET    | `/api/portfolio`                      | Portfolio owner information    |
| GET    | `/api/projects`                       | Projects                       |
| GET    | `/api/skills`                         | Skill groups with items        |
| GET    | `/api/experience`                     | Professional experience        |
| GET    | `/api/education`                      | Education                      |
| GET    | `/api/awards`                         | Awards                         |
| POST   | `/api/contact`                        | Capture a lead, unlock the chat |
| GET    | `/api/lead/session`                   | Validate a stored chat token   |
| POST   | `/api/chat`                           | Send a chat message to Gemini  |
| GET    | `/api/chat/history/{conversation_id}` | Conversation history           |
| POST   | `/api/chat/start`                     | Create or reuse a conversation |

### Lead capture and chat access

`POST /api/contact` validates the payload with Pydantic, normalises the phone
number to E.164, stores the lead in PostgreSQL and returns an opaque session
token. Only the SHA-256 hash of that token is persisted, so a database leak can
never be used to hijack a live chat.

The frontend keeps the token in `localStorage` purely as a cache — the backend
re-validates it on every page load through `GET /api/lead/session`, and every
chat request must carry it in the `X-Chat-Token` header. A conversation can
only be read or continued by the lead that owns it.

Extra environment variables (all optional, see `backend/.env.example`):

```bash
CHAT_SESSION_HOURS=168            # how long an unlocked chat stays valid
CONTACT_RATE_LIMIT=5              # submissions allowed per window, per email
CONTACT_IP_RATE_LIMIT=15          # submissions allowed per window, per IP
CONTACT_RATE_WINDOW_SECONDS=900
CONVERSATION_RATE_LIMIT=20        # chat messages allowed per window, per session
CONVERSATION_RATE_WINDOW_SECONDS=300
DUPLICATE_LEAD_WINDOW_HOURS=24    # repeat submissions reuse the existing lead
```

### Field verification

The email and phone number are verified twice — in the browser for instant
feedback and again on the server, which is the only check that counts:

| Field   | Browser                                             | Backend                                                          |
| ------- | --------------------------------------------------- | ---------------------------------------------------------------- |
| Email   | strict address pattern, live “verified” tick         | Pydantic pattern, lower-cased, rejects `..`, bad domains and TLDs |
| Phone   | country-code selector + national length check        | normalised to E.164, real calling code, 4–14 national digits      |

A chat session token is only issued when **both** fields pass the server-side
checks, so the assistant can never be unlocked with an invalid address.

## Testing

With the backend running, the full lead capture + gated chatbot flow can be
verified end to end against the real API and database:

```bash
cd backend
python3 check_lead_flow.py
```

It checks that the chat is locked without a session, that invalid email/phone
payloads are rejected, that the honeypot blocks bots, that a valid submission
creates a lead and issues a token, that duplicates reuse the same lead, that
Gemini answers, that history is stored, and that a second visitor cannot read
or continue the first visitor's conversation.

## Social links

Social URLs live in `src/data/portfolio.js` under `profile.socials`:

- `https://github.com/ravjotsingh-ml`
- `https://www.linkedin.com/in/ravjot-singh-24608b34b`

They are rendered in the Hero, Contact and Footer with `target="_blank"` and `rel="noopener noreferrer"`.

## Database migrations

```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Notes

- Never commit `.env` files or real API keys.
- Visitor emails and phone numbers are never sent to the Gemini model and are
  never returned to another visitor. The admin portal is the only place lead
  contact details are visible.
- The backend allows CORS from `http://localhost:5173` by default; configure
  `BACKEND_CORS_ORIGINS` for production.
- The portfolio content is seeded automatically on first startup and can be
  edited in `backend/app/seed.py`.
