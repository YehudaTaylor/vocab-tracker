#!/bin/bash

# Function to check if running in Docker
is_docker() {
    [ -f /.dockerenv ] || grep -q 'docker\|lxc' /proc/1/cgroup 2>/dev/null
}

# Determine which service to build based on RENDER_SERVICE_NAME or directory
if [[ "$RENDER_SERVICE_NAME" == *"api"* ]] || [[ "$PWD" == *"backend"* ]]; then
    echo "Building backend service..."
    if [ -d "backend" ]; then
        cd backend
    fi
    npm install
    # Skip migrations during build if DATABASE_URL is not available
    if [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != "undefined" ]; then
        echo "DATABASE_URL available, running migrations"
        npm run migrate
    elif is_docker && [ -f .env ] && grep -q "DB_HOST" .env; then
        echo "Local Docker environment detected, running migrations"
        npm run migrate
    elif [ -f .env.local ]; then
        echo "Using local environment for migrations"
        cp .env .env.backup 2>/dev/null || true
        cp .env.local .env
        npm run migrate
        mv .env.backup .env 2>/dev/null || true
    else
        echo "DATABASE_URL not available during build, skipping migrations"
        echo "Migrations will run during application startup"
    fi
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
    # Skip migrations during build if DATABASE_URL is not available
    if [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != "undefined" ]; then
        echo "DATABASE_URL available, running migrations"
        npm run migrate
    elif is_docker && [ -f .env ] && grep -q "DB_HOST" .env; then
        echo "Local Docker environment detected, running migrations"
        npm run migrate
    elif [ -f .env.local ]; then
        echo "Using local environment for migrations"
        cp .env .env.backup 2>/dev/null || true
        cp .env.local .env
        npm run migrate
        mv .env.backup .env 2>/dev/null || true
    else
        echo "DATABASE_URL not available during build, skipping migrations"
        echo "Migrations will run during application startup"
    fi
fi