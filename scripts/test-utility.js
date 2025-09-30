#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  api: args.includes('--api') || args.includes('-a'),
  web: args.includes('--web') || args.includes('-w'),
  help: args.includes('--help') || args.includes('-h')
};

// Show help if requested
if (flags.help) {
  console.log(`
Usage: node scripts/test-utility.js [options]

Options:
  --api, -a     Run tests only for the API
  --web, -w     Run tests only for the Web application
  --help, -h    Show this help message

If no flags are provided, you'll be prompted to select which tests to run.
`);
  process.exit(0);
}

// Interactive selection if no flags provided
if (!flags.api && !flags.web) {
  console.log(`
🧪 Test Selection

Which tests would you like to run?

1. API only
2. Web only  
3. Both API and Web
4. Exit

Please select an option (1-4): `);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('', (answer) => {
    switch (answer.trim()) {
      case '1':
        runTests(true, false);
        break;
      case '2':
        runTests(false, true);
        break;
      case '3':
        runTests(true, true);
        break;
      case '4':
        console.log('👋 Goodbye!');
        process.exit(0);
        break;
      default:
        console.log('❌ Invalid option. Please run the script again.');
        process.exit(1);
    }
    rl.close();
  });
} else {
  // Use flags if provided
  const testApi = flags.api || (!flags.api && !flags.web);
  const testWeb = flags.web || (!flags.api && !flags.web);
  runTests(testApi, testWeb);
}

function runTests(testApi, testWeb) {
  console.log('🧪 Running tests...\n');

  const testPromises = [];

  if (testApi) {
    console.log('📡 Running API tests...');
    const apiPromise = new Promise((resolve, reject) => {
      const apiProcess = spawn('dotnet', ['test'], {
        cwd: path.join(__dirname, '../apps/api'),
        stdio: 'inherit',
        shell: true
      });

      apiProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ API tests passed\n');
          resolve();
        } else {
          console.log('❌ API tests failed\n');
          reject(new Error(`API tests failed with code ${code}`));
        }
      });
    });
    testPromises.push(apiPromise);
  }

  if (testWeb) {
    console.log('🌐 Running Web tests...');
    const webPromise = new Promise((resolve, reject) => {
      const webProcess = spawn('pnpm', ['test'], {
        cwd: path.join(__dirname, '../apps/web'),
        stdio: 'inherit',
        shell: true
      });

      webProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Web tests passed\n');
          resolve();
        } else {
          console.log('❌ Web tests failed\n');
          reject(new Error(`Web tests failed with code ${code}`));
        }
      });
    });
    testPromises.push(webPromise);
  }

  // Wait for all tests to complete
  Promise.all(testPromises)
    .then(() => {
      console.log('🎉 All tests passed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Tests failed:', error.message);
      process.exit(1);
    });
}
