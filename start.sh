#!/bin/bash

# Determine which service to start based on RENDER_SERVICE_NAME or directory
if [[ "$RENDER_SERVICE_NAME" == *"api"* ]] || [[ "$PWD" == *"backend"* ]]; then
    echo "Starting backend service..."
    if [ -d "backend" ]; then
        cd backend
    fi
    npm start
elif [[ "$RENDER_SERVICE_NAME" == *"web"* ]] || [[ "$PWD" == *"frontend"* ]]; then
    echo "Starting frontend service..."
    if [ -d "frontend" ]; then
        cd frontend
    fi
    # Frontend is static, so this shouldn't be called
    echo "Frontend is static - no start command needed"
    exit 0
else
    echo "Starting from root directory..."
    # Default to backend if unsure
    cd backend
    npm start
fi