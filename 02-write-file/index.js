const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

// Create a ReadLine interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to write text to the file
function writeToFile(text) {
  // Use the 'a' flag for append mode
  fs.appendFile(filePath, text + '\n', (err) => {
    if (err) {
      console.error(`Error writing to the file: ${err.message}`);
    } else {
      console.log('Text has been written to the file.');
      // Prompt for the next input
      rl.prompt();
    }
  });
}

// Prompt for the initial input
console.log('Enter text (Ctrl + C or type "exit" to exit):');
rl.prompt();

// Listen for user input
rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    // Display farewell message and exit the process
    console.log('Goodbye!');
    rl.close();
  } else {
    // Write input to the file
    writeToFile(input);
  }
});

// Listen for the 'close' event (Ctrl + C)
rl.on('close', () => {
  console.log('Exiting...');
  process.exit(0);
});