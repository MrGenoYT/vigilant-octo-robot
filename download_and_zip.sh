
#!/bin/bash

# Create directories if they don't exist
mkdir -p downloads

# Download all files
echo "Downloading files..."
cp -r extracted/frontend downloads/frontend
cp -r extracted/backend downloads/backend

# Create separate zip files
echo "Creating zip files..."
cd downloads
zip -r frontend.zip frontend
zip -r backend.zip backend
zip -r COMPLETE_FILE.zip frontend backend

echo "Done! Files are available in the downloads folder:"
echo "- frontend.zip"
echo "- backend.zip"
echo "- COMPLETE_FILE.zip"

cd ..
echo "Completed successfully!"
