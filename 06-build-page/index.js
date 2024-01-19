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

// Function to build the HTML page
async function buildHTMLPage() {
  const templatePath = path.join(__dirname, 'template.html');
  const componentsFolder = path.join(__dirname, 'components');
  const distFolder = path.join(__dirname, 'project-dist');

  try {
    // Read the content of the template file
    const templateContent = await fs.readFile(templatePath, 'utf8');

    // Replace template tags with component content
    const modifiedTemplate = await replaceTemplateTags(templateContent, componentsFolder);

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

// Call the buildHTMLPage function
buildHTMLPage();
