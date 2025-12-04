#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

# Check for .env file
if [ ! -f "server/.env" ]; then
    echo "Error: server/.env file not found!"
    echo "Please copy server/.env.example to server/.env and add your API keys."
    exit 1
fi

# Start Backend
echo "Starting Backend Server..."
cd server
# Check if venv exists, if so activate it
if [ -d "venv" ]; then
    source venv/bin/activate
fi
python3 app.py &
BACKEND_PID=$!
echo "Backend running with PID $BACKEND_PID"

# Start Frontend
echo "Starting Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend running with PID $FRONTEND_PID"

# Wait for processes
wait
