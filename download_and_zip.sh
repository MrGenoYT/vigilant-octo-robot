
#!/bin/bash

# Create directories if they don't exist
mkdir -p downloads

# Ensure we have the extracted directories
if [ ! -d "extracted/frontend" ]; then
  echo "Error: Missing frontend directory. Please ensure 'extracted/frontend' exists."
  exit 1
fi

if [ ! -d "extracted/backend" ]; then
  echo "Error: Missing backend directory. Please ensure 'extracted/backend' exists."
  mkdir -p extracted/backend
fi

# Copy all files
echo "Preparing files..."
rm -rf downloads/frontend downloads/backend 2>/dev/null
cp -r extracted/frontend downloads/frontend
if [ -d "extracted/backend" ]; then
  cp -r extracted/backend downloads/backend
fi

# Create separate zip files
echo "Creating zip files..."
cd downloads
rm -f frontend.zip backend.zip COMPLETE_FILE.zip 2>/dev/null

echo "Creating frontend.zip..."
zip -r frontend.zip frontend

if [ -d "backend" ]; then
  echo "Creating backend.zip..."
  zip -r backend.zip backend
else
  # Create an empty backend zip if backend doesn't exist
  touch empty_backend_placeholder
  zip backend.zip empty_backend_placeholder
  rm empty_backend_placeholder
fi

echo "Creating COMPLETE_FILE.zip..."
zip -r COMPLETE_FILE.zip frontend backend

echo "Done! Files are available in the downloads folder:"
ls -la *.zip

cd ..
echo "Completed successfully!"
