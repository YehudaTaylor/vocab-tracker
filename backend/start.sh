#!/bin/sh
echo "Running database migrations..."
if npm run migrate; then
    echo "Migrations completed successfully"
else
    echo "Migrations failed, but continuing with application startup"
    echo "Database connection will be attempted during app initialization"
fi
echo "Starting application..."
exec npm start