const fs = require('fs');
const path = require('path');

// Define the path to the secret folder
const secretFolderPath = path.join(__dirname, 'secret-folder');

// Read the contents of the secret folder
fs.readdir(secretFolderPath, (err, files) => {
  if (err) {
    console.error(`Error reading the folder: ${err.message}`);
  } else {
    // Iterate through each file in the folder
    files.forEach((file) => {
      const filePath = path.join(secretFolderPath, file);

      // Check if the object is a file
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          console.error(`Error getting file stats: ${statErr.message}`);
        } else {
          if (stats.isFile()) {
            // Display file data in the console
            const fileSizeInKB = stats.size / 1024;
            console.log(`${path.parse(file).name} - ${path.parse(file).ext.slice(1)} - ${fileSizeInKB.toFixed(3)}kb`);
          } else {
            console.error(`${file} is a directory. Skipping...`);
          }
        }
      });
    });
  }
});
