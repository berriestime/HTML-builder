const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

function createCssBundle() {
  fs.mkdir(outputDir, { recursive: true })
    .then(() => fs.readdir(stylesDir, { withFileTypes: true }))
    .then((files) => {
      const cssFiles = files.filter(
        (file) => file.isFile() && path.extname(file.name) === '.css',
      );

      const fileReads = cssFiles.map((file) => {
        const filePath = path.join(stylesDir, file.name);
        return fs.readFile(filePath, 'utf-8');
      });

      return Promise.all(fileReads);
    })
    .then((styles) => {
      const stylesBundle = styles.join(os.EOL);
      return fs.writeFile(outputFile, stylesBundle);
    })
    .then(() => {
      console.log('bundle.css has been created!');
    })
    .catch((err) => {
      console.error('An error occurred:', err);
    });
}

createCssBundle();
