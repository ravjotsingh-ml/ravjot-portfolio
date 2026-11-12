#!/usr/bin/env bash
# Start both backend and frontend development servers

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Cleaning up any existing servers on ports 8000 and 5173..."
pkill -f "uvicorn app.main:app" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 1

echo "==> Starting FastAPI backend on http://localhost:8000..."
cd "$PROJECT_DIR/backend"
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo "==> Starting Vite frontend on http://localhost:5173..."
cd "$PROJECT_DIR"
npm run dev &
FRONTEND_PID=$!

cleanup() {
  echo ""
  echo "==> Stopping servers..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

echo ""
echo "=========================================================="
echo "  Portfolio is running:"
echo "    Frontend: http://localhost:5173"
echo "    Backend:  http://localhost:8000 (Docs: /api/docs)"
echo "  Press Ctrl + C in this terminal to stop both servers."
echo "=========================================================="
echo ""

wait
