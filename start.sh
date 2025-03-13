
#!/bin/bash

# Make the script executable if it's not already
chmod +x start.sh

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
