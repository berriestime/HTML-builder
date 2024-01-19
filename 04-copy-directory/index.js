const fs = require('fs').promises;
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.mkdir(destinationDir, { recursive: true });
    const sourceEntries = await fs.readdir(sourceDir, { withFileTypes: true });
    const destinationEntries = new Set(await fs.readdir(destinationDir));

    for (const entry of sourceEntries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const destinationPath = path.join(destinationDir, entry.name);
      await fs.copyFile(sourcePath, destinationPath);
      destinationEntries.delete(entry.name);
    }

    for (const extraFile of destinationEntries) {
      await fs.rm(path.join(destinationDir, extraFile));
    }
  } catch (error) {
    console.error('Error copying directory:', error);
  }
}

copyDir();
