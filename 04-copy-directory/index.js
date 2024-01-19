const fs = require('fs').promises;
const path = require('path');

// Function to copy the contents of the 'files' folder to 'files-copy'
async function copyDir() {
  const sourceFolder = path.join(__dirname, 'files');
  const destinationFolder = path.join(__dirname, 'files-copy');

  try {
    // Create 'files-copy' folder if it doesn't exist
    await fs.mkdir(destinationFolder, { recursive: true });

    // Read the contents of the 'files' folder
    const files = await fs.readdir(sourceFolder);

    // Copy files from 'files' to 'files-copy'
    for (const file of files) {
      const sourceFilePath = path.join(sourceFolder, file);
      const destinationFilePath = path.join(destinationFolder, file);

      // Use copyFile to copy individual files
      await fs.copyFile(sourceFilePath, destinationFilePath);
      console.log(`Copied: ${file}`);
    }

    console.log('Copy operation completed successfully.');
  } catch (err) {
    console.error(`Error copying directory: ${err.message}`);
  }
}

// Call the copyDir function
copyDir();
