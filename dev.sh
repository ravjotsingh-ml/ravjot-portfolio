#!/usr/bin/env bash
# Start the FastAPI backend, the Celery worker and the Vite frontend.
#
#   ./dev.sh          # start everything
#   ./dev.sh --api    # backend + worker only (frontend already running)

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"

# Prefer the project virtualenv (it has Celery) and fall back to system python.
if [ -x "$BACKEND_DIR/.venv/bin/python" ]; then
  PYTHON="$BACKEND_DIR/.venv/bin/python"
else
  PYTHON="python3"
fi

# Kill by listening port instead of by process name, so other shells that
# merely mention these commands are never terminated.
kill_port() {
  local port="$1"
  local pids
  pids=$(ss -lptnH "sport = :$port" 2>/dev/null | grep -o 'pid=[0-9]*' | cut -d= -f2 | sort -u)
  for pid in $pids; do
    kill "$pid" 2>/dev/null || true
  done
}

if [ "$1" != "--api" ]; then
  echo "==> Freeing port 5173 for Vite..."
  kill_port 5173
fi

echo "==> Freeing port 8000 for the API..."
kill_port 8000
sleep 1

echo "==> Starting FastAPI backend on http://localhost:8000..."
cd "$BACKEND_DIR"
"$PYTHON" -m uvicorn app.main:app --app-dir . --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo "==> Starting Celery worker..."
"$PYTHON" -m celery -A app.tasks.celery_app worker --loglevel=info --concurrency=2 &
WORKER_PID=$!

FRONTEND_PID=""
if [ "$1" != "--api" ]; then
  echo "==> Starting Vite frontend on http://localhost:5173..."
  cd "$PROJECT_DIR"
  npm run dev &
  FRONTEND_PID=$!
fi

cleanup() {
  echo ""
  echo "==> Stopping services..."
  kill "$BACKEND_PID" "$WORKER_PID" ${FRONTEND_PID:+"$FRONTEND_PID"} 2>/dev/null || true
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

echo ""
echo "=========================================================="
echo "  Portfolio is running:"
echo "    Frontend: http://localhost:5173"
echo "    Backend:  http://localhost:8000 (Docs: /api/docs)"
echo "    Worker:   Celery worker processing lead notifications"
echo "  Press Ctrl + C in this terminal to stop everything."
echo "=========================================================="
echo ""

wait
