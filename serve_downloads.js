
const express = require('express');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const app = express();
const PORT = 3000;

// Create directories if they don't exist
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// First ensure the download script has run to create the zip files
console.log('Running download script to generate zip files...');
try {
  execSync('bash download_and_zip.sh');
  
  // Copy zip files to public folder
  if (fs.existsSync('downloads/COMPLETE_FILE.zip')) {
    fs.copyFileSync('downloads/COMPLETE_FILE.zip', 'public/COMPLETE_FILE.zip');
    fs.copyFileSync('downloads/frontend.zip', 'public/frontend.zip');
    fs.copyFileSync('downloads/backend.zip', 'public/backend.zip');
  }
} catch (error) {
  console.error('Error generating zip files:', error);
}

// Serve static files from the public directory
app.use(express.static('public'));

// Create a simple HTML page with download links
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LostCloud Downloads</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background-color: #f5f5f5;
        }
        h1 {
          color: #333;
          text-align: center;
        }
        .download-container {
          background-color: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .download-item {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
        }
        .download-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .download-button {
          display: inline-block;
          background-color: #6c63ff;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          margin-top: 10px;
        }
        .download-button:hover {
          background-color: #5a52d5;
        }
        h2 {
          margin-top: 0;
          color: #444;
        }
        p {
          color: #666;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <h1>LostCloud Downloads</h1>
      <div class="download-container">
        <div class="download-item">
          <h2>Complete Package</h2>
          <p>Download the entire project with both frontend and backend code.</p>
          <a href="/COMPLETE_FILE.zip" class="download-button" download>Download Complete Package</a>
        </div>
        
        <div class="download-item">
          <h2>Frontend Only</h2>
          <p>Download only the frontend code.</p>
          <a href="/frontend.zip" class="download-button" download>Download Frontend</a>
        </div>
        
        <div class="download-item">
          <h2>Backend Only</h2>
          <p>Download only the backend code.</p>
          <a href="/backend.zip" class="download-button" download>Download Backend</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log('You can now download the files directly from your browser');
});
