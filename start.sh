
#!/bin/bash

# Make the script executable
chmod +x start.sh

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Set PORT environment variable for Replit compatibility
export PORT=5000

# Start the application with improved error handling
echo "Starting the application..."
npm run dev || echo "Failed to start the application. Check logs for errors."
