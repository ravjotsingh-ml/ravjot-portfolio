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
- Floating Gemini AI chatbot (bottom-right) with:
  - Welcome message and suggested questions
  - Typing indicator, message bubbles, minimize/close
  - Conversation history persisted in PostgreSQL
  - Responsive mobile layout
- Contact form that stores messages in PostgreSQL
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
│   ├── lib/api.js              # Frontend API client
│   └── App.jsx
└── backend/
    ├── app/
    │   ├── main.py             # FastAPI app + REST endpoints
    │   ├── models.py           # SQLAlchemy models
    │   ├── schemas.py          # Pydantic request/response schemas
    │   ├── chatbot.py          # Gemini integration
    │   ├── seed.py             # Default portfolio content
    │   ├── database.py         # Engine + session
    │   └── core/config.py      # Environment configuration
    ├── migrations/             # Alembic migrations
    ├── alembic.ini
    └── requirements.txt
```

## Getting started

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

### 4. Gemini API key (required for the chatbot)

The chatbot will not answer until a key is configured.

1. Create a key at <https://aistudio.google.com/apikey>.
2. Add it to `backend/.env` (or export it in your shell):

   ```bash
   GEMINI_API_KEY=your-key-here
   GEMINI_MODEL=gemini-2.0-flash
   ```

3. Restart the backend.

The key is read only by the backend and is never sent to the browser or written
to logs. If the key is missing, the chatbot returns a clear configuration
message instead of inventing an answer.

Test the endpoint directly:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
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
| POST   | `/api/contact`                        | Store a contact message        |
| POST   | `/api/chat`                           | Send a chat message to Gemini  |
| GET    | `/api/chat/history/{conversation_id}` | Conversation history           |
| POST   | `/api/chat/start`                     | Create a new conversation      |

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
- The backend allows CORS from `http://localhost:5173` by default; configure
  `BACKEND_CORS_ORIGINS` for production.
- The portfolio content is seeded automatically on first startup and can be
  edited in `backend/app/seed.py`.
