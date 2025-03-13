
#!/bin/bash

# Make sure we're in the project root
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Set PORT environment variable for Replit compatibility
export PORT=5000

# Start the application
echo "Starting the application..."
npm run dev
