const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath, 'utf8');

readStream.on('data', function (chunk) {
  process.stdout.write(chunk);
});

readStream.on('error', function (err) {
  console.error('Error reading file:', err);
  process.exit(1);
});
