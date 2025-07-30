#!/bin/sh
echo "Running database migrations..."
npm run migrate
echo "Starting application..."
exec npm start