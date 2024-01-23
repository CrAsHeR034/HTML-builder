const fs = require('fs').promises;
const path = require('path');

// Function to replace template tags in the template file
async function replaceTemplateTags(templateContent, componentsFolder) {
  const tagRegex = /\{\{([^{}]+)\}\}/g;

  // Find all template tags in the template file
  const tags = templateContent.match(tagRegex);

  if (!tags) {
    return templateContent; // No tags found, return original content
  }

  // Replace each template tag with the content of the corresponding component
  for (const tag of tags) {
    const componentName = tag.slice(2, -2).trim(); // Extract component name from the tag
    const componentPath = path.join(componentsFolder, `${componentName}.html`);

    try {
      // Read the content of the component file
      const componentContent = await fs.readFile(componentPath, 'utf8');

      // Replace the template tag with the component content
      templateContent = templateContent.replace(tag, componentContent);
    } catch (err) {
      console.error(`Error reading component file (${componentName}.html): ${err.message}`);
    }
  }

  return templateContent;
}

// Function to copy assets (fonts, img, svg) to project-dist/assets
async function copyAssets(from, to) {
  try {
    // Create 'to' directory if it doesn't exist
    await fs.mkdir(to, { recursive: true });

    // Read the contents of the 'from' directory
    const items = await fs.readdir(from, { withFileTypes: true });

    // Copy each item to the 'to' directory
    await Promise.all(items.map(async (item) => {
      const sourcePath = path.join(from, item.name);
      const destinationPath = path.join(to, item.name);

      if (item.isDirectory()) {
        // If it's a directory, recursively copy its contents
        await copyAssets(sourcePath, destinationPath);
      } else {
        // If it's a file, copy it to the destination
        await fs.copyFile(sourcePath, destinationPath);
      }
    }));

    console.log(`Assets copied from ${from} to ${to} successfully.`);
  } catch (err) {
    console.error(`Error copying assets: ${err.message}`);
  }
}

// Function to build the HTML page
async function buildHTMLPage() {
  const templatePath = path.join(__dirname, 'template.html');
  const componentsFolder = path.join(__dirname, 'components');
  const stylesFolder = path.join(__dirname, 'styles');
  const assetsFolder = path.join(__dirname, 'assets');
  const distFolder = path.join(__dirname, 'project-dist');
  const assetsDistFolder = path.join(distFolder, 'assets');

  try {
    // Read the content of the template file
    const templateContent = await fs.readFile(templatePath, 'utf8');

    // Replace template tags with component content
    let modifiedTemplate = await replaceTemplateTags(templateContent, componentsFolder);

    // Concatenate styles from styles folder into a single file (style.css)
    const styles = await fs.readdir(stylesFolder);
    const styleContent = await Promise.all(styles.map(async file => {
      const filePath = path.join(stylesFolder, file);
      return await fs.readFile(filePath, 'utf-8');
    }));

    const stylePath = path.join(distFolder, 'style.css');
    await fs.writeFile(stylePath, styleContent.join('\n'));

    // Copy assets (fonts, img, svg) to project-dist/assets
    await copyAssets(assetsFolder, assetsDistFolder);

    // Create project-dist folder if it doesn't exist
    await fs.mkdir(distFolder, { recursive: true });

    // Write the modified template to the index.html file in the project-dist folder
    const indexPath = path.join(distFolder, 'index.html');
    await fs.writeFile(indexPath, modifiedTemplate);

    console.log('HTML page built successfully.');

  } catch (err) {
    console.error(`Error building HTML page: ${err.message}`);
  }
}

// Call the functions
buildHTMLPage();
