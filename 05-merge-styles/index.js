const fs = require('fs').promises;
const path = require('path');

// Function to compile styles into a single bundle.css file
async function buildCSSBundle() {
  const stylesFolder = path.join(__dirname, 'styles');
  const distFolder = path.join(__dirname, 'project-dist');
  const bundleFilePath = path.join(distFolder, 'bundle.css');

  try {
    // Read the contents of the 'styles' folder
    const files = await fs.readdir(stylesFolder);

    // Filter out only CSS files
    const cssFiles = files.filter(file => path.extname(file).toLowerCase() === '.css');

    // Read and concatenate styles from each CSS file
    const stylesArray = await Promise.all(cssFiles.map(async file => {
      const filePath = path.join(stylesFolder, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      return fileContent;
    }));

    // Write the concatenated styles to the bundle.css file
    await fs.mkdir(distFolder, { recursive: true });
    await fs.writeFile(bundleFilePath, stylesArray.join('\n'));

    console.log('CSS Bundle created successfully.');
  } catch (err) {
    console.error(`Error building CSS bundle: ${err.message}`);
  }
}

// Call the buildCSSBundle function
buildCSSBundle();
