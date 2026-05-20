#!/bin/bash

# Galaxium Travels Booking System - Startup Script
# This script sets up and runs both backend and frontend

set -e  # Exit on error

echo "🚀 Starting Galaxium Travels Booking System..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Cleanup function to kill background processes
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set up trap to catch Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# Check if venv exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment not found. Creating one...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${BLUE}📦 Activating virtual environment...${NC}"
source venv/bin/activate

# Navigate to python_backend directory
cd python_backend

# Install backend dependencies
echo -e "${BLUE}📥 Installing backend dependencies...${NC}"
pip install -q -r requirements.txt

# Seed database with demo data
echo -e "${BLUE}🌱 Seeding database with demo data...${NC}"
python -m app.seed_data

# Start the backend server in background
echo -e "${GREEN}✅ Starting API server on http://localhost:8082${NC}"
echo -e "${GREEN}📚 API Documentation: http://localhost:8082/docs${NC}"
echo -e "${GREEN}🏥 Health Check: http://localhost:8082/health${NC}"
uvicorn app.main:app --host 0.0.0.0 --port 8082 --reload > /dev/null 2>&1 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Navigate back to root and then to frontend
cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📥 Installing frontend dependencies...${NC}"
    npm install
fi

# Start the frontend server in background
echo -e "${GREEN}✅ Starting frontend server on http://localhost:3000${NC}"
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 2

echo ""
echo -e "${GREEN}🎉 Both servers are running!${NC}"
echo -e "${GREEN}   Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}   Backend:  http://localhost:8082${NC}"
echo -e "${GREEN}   API Docs: http://localhost:8082/docs${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
