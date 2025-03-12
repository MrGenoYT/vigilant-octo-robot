
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const GITHUB_REPO = 'MrGenoYT/files';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Set this as a secret in Replit

if (!GITHUB_TOKEN) {
  console.error('Please set your GITHUB_TOKEN environment variable');
  process.exit(1);
}

// Ensure the downloads directory exists
if (!fs.existsSync('downloads')) {
  console.log('Creating downloads directory...');
  execSync('bash download_and_zip.sh');
}

// Function to upload a file to GitHub
async function uploadFileToGitHub(filePath) {
  const fileName = path.basename(filePath);
  
  try {
    console.log(`Uploading ${fileName} to GitHub...`);
    
    // Use GitHub REST API to upload file
    const command = `
      curl -X PUT \\
      -H "Authorization: token ${GITHUB_TOKEN}" \\
      -H "Accept: application/vnd.github.v3+json" \\
      -H "Content-Type: application/octet-stream" \\
      --data-binary @${filePath} \\
      https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}?message=Upload%20${fileName}
    `;
    
    execSync(command, { stdio: 'inherit' });
    console.log(`Successfully uploaded ${fileName} to GitHub!`);
    return true;
  } catch (error) {
    console.error(`Failed to upload ${fileName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Starting GitHub upload...');
  
  // Check if the COMPLETE_FILE.zip exists
  const completeFilePath = path.join('downloads', 'COMPLETE_FILE.zip');
  if (!fs.existsSync(completeFilePath)) {
    console.log('COMPLETE_FILE.zip not found. Running download script...');
    execSync('bash download_and_zip.sh');
  }
  
  // Upload all zip files
  const filesToUpload = [
    path.join('downloads', 'frontend.zip'),
    path.join('downloads', 'backend.zip'),
    path.join('downloads', 'COMPLETE_FILE.zip')
  ];
  
  for (const file of filesToUpload) {
    await uploadFileToGitHub(file);
  }
  
  console.log('All uploads completed!');
}

main().catch(console.error);
