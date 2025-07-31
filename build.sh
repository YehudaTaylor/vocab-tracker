#!/bin/bash

# Determine which service to build based on RENDER_SERVICE_NAME or directory
if [[ "$RENDER_SERVICE_NAME" == *"api"* ]] || [[ "$PWD" == *"backend"* ]]; then
    echo "Building backend service..."
    if [ -d "backend" ]; then
        cd backend
    fi
    npm install
    npm run migrate
elif [[ "$RENDER_SERVICE_NAME" == *"web"* ]] || [[ "$PWD" == *"frontend"* ]]; then
    echo "Building frontend service..."
    if [ -d "frontend" ]; then
        cd frontend
    fi
    npm install
    npm run build
else
    echo "Building from root directory..."
    # Default to backend if unsure
    cd backend
    npm install
    npm run migrate
fi