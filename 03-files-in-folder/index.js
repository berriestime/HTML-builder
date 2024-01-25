const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const BYTES_IN_KB = 1024;
const folderPath = path.join(__dirname, 'secret-folder');

async function displayFilesInfo() {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const ignorePatterns = [/^\./, /\..*\..*\..*/];
        if (ignorePatterns.some((pattern) => pattern.test(file.name))) {
          continue;
        }

        const filePath = path.join(folderPath, file.name);
        const fileStats = await fs.stat(filePath);
        const fileExt = path.extname(file.name);
        const fileName = path.basename(file.name, fileExt);
        const fileSize = fileStats.size / BYTES_IN_KB;

        process.stdout.write(
          `${fileName} - ${fileExt.slice(1)} - ${fileSize.toFixed(3)}kb${
            os.EOL
          }`,
        );
      }
    }
  } catch (error) {
    process.stderr.write(`Error reading the directory ${error}${os.EOL}`);
  }
}

displayFilesInfo();
