const fs = require('fs').promises;
const path = require('path');
const os = require('os');

async function buildPage() {
  const projectDistPath = path.join(__dirname, 'project-dist');
  const templateFilePath = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');
  const stylesPath = path.join(__dirname, 'styles');
  const assetsPath = path.join(__dirname, 'assets');
  const TEMPLATE_TAG_REGEX = /{{\w+}}/g;

  try {
    await fs.mkdir(projectDistPath, { recursive: true });

    let templateContent = await fs.readFile(templateFilePath, 'utf-8');

    const tags = templateContent.match(TEMPLATE_TAG_REGEX) || [];

    for (const tag of tags) {
      const tagName = tag.slice(2, -2);
      const componentContent = await fs.readFile(
        path.join(componentsPath, `${tagName}.html`),
        'utf-8',
      );
      templateContent = templateContent.replace(
        new RegExp(tag, 'g'),
        componentContent,
      );
    }

    await fs.writeFile(
      path.join(projectDistPath, 'index.html'),
      templateContent,
    );

    const styleFiles = await fs.readdir(stylesPath);
    let styleContent = '';
    for (const file of styleFiles) {
      const filePath = path.join(stylesPath, file);
      const fileStat = await fs.stat(filePath);
      if (fileStat.isFile() && path.extname(file) === '.css') {
        styleContent += (await fs.readFile(filePath, 'utf-8')) + os.EOL;
      }
    }
    await fs.writeFile(path.join(projectDistPath, 'style.css'), styleContent);

    await copyDirectory(assetsPath, path.join(projectDistPath, 'assets'));

    console.log('Project built successfully.');
  } catch (error) {
    console.error('Error building project:', error);
  }
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  let entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? await copyDirectory(srcPath, destPath)
      : await fs.copyFile(srcPath, destPath);
  }
}

buildPage();
