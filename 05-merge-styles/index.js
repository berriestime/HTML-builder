const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

function createCssBundle() {
  fs.mkdir(outputDir, { recursive: true }, (err) => {
    if (err) throw err;
    let stylesBundle = [];

    fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
      if (err) throw err;

      let cssFiles = files.filter(
        (file) => file.isFile() && path.extname(file.name) === '.css',
      );

      let fileReads = cssFiles.map((file) => {
        return new Promise((resolve, reject) => {
          fs.readFile(path.join(stylesDir, file.name), 'utf-8', (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
      });

      Promise.all(fileReads)
        .then((values) => {
          stylesBundle = values.join('\n');
          fs.writeFile(outputFile, stylesBundle, (err) => {
            if (err) throw err;
            console.log('bundle.css has been created!');
          });
        })
        .catch((err) => {
          console.error('Error reading CSS files:', err);
        });
    });
  });
}

createCssBundle();
