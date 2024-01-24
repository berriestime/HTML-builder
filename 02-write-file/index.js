const fs = require('fs');
const readline = require('readline');
const path = require('path');
const os = require('os');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const outputFile = path.join(__dirname, 'output.txt');
const outputStream = fs.createWriteStream(outputFile, { flags: 'a' });

process.stdout.write(
  `Welcome! Please enter text to write to the file. Type "exit" to end the session.${os.EOL}`,
);

const handleInput = (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    rl.close();
  } else {
    outputStream.write(input + os.EOL);
    process.stdout.write(
      `Text is written to the file. Continue typing or enter "exit" to end.${os.EOL}`,
    );
  }
};

rl.on('line', handleInput);

process.on('SIGINT', () => {
  rl.close();
});

rl.on('close', () => {
  process.stdout.write('Thank you for using the text writer. Goodbye!');
  outputStream.end();
  process.exit(0);
});
