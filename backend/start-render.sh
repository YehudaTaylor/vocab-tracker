#!/bin/sh
echo "Starting application for Render deployment..."

# Try migrations but don't fail if they don't work
echo "Attempting database migrations..."
if npm run migrate; then
    echo "Migrations completed successfully"
else
    echo "Migrations failed or skipped - app will attempt to connect anyway"
fi

echo "Starting Node.js server..."
exec npm start