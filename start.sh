
#!/bin/sh

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run the development server
echo "Starting development server..."
npm run dev
