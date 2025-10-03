#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  api: args.includes('--api') || args.includes('-a'),
  web: args.includes('--web') || args.includes('-w'),
  all: args.includes('--all') || args.includes('-A'),
  help: args.includes('--help') || args.includes('-h')
};

// Show help if requested
if (flags.help) {
  console.log(`
Usage: node scripts/build-utility.js [options]

Options:
  --api, -a     Build only the API
  --web, -w     Build only the Web application
  --all, -A     Build all applications
  --help, -h    Show this help message

If no flags are provided, you'll be prompted to select which applications to build.
`);
  process.exit(0);
}

// Interactive selection if no flags provided
if (!flags.api && !flags.web) {
  console.log(`
🔨 Build Selection

Which applications would you like to build?

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
        buildApplications(true, false);
        break;
      case '2':
        buildApplications(false, true);
        break;
      case '3':
        buildApplications(true, true);
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
  const buildApi = flags.api || (!flags.api && !flags.web);
  const buildWeb = flags.web || (!flags.api && !flags.web);
  const buildAll = flags.all || (!flags.api && !flags.web && !flags.all);
  buildApplications(buildApi, buildWeb);
}

function buildApplications(buildApi, buildWeb) {
  console.log('🔨 Building applications...\n');

  const buildPromises = [];

  if (buildApi) {
    console.log('📡 Building API...');
    const apiPromise = new Promise((resolve, reject) => {
      const apiProcess = spawn('dotnet', ['build'], {
        cwd: path.join(__dirname, '../apps/api'),
        stdio: 'inherit',
        shell: true
      });

      apiProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ API build completed successfully\n');
          resolve();
        } else {
          console.log('❌ API build failed\n');
          reject(new Error(`API build failed with code ${code}`));
        }
      });
    });
    buildPromises.push(apiPromise);
  }

  if (buildWeb) {
    console.log('🌐 Building Web application...');
    const webPromise = new Promise((resolve, reject) => {
      const webProcess = spawn('pnpm', ['build'], {
        cwd: path.join(__dirname, '../apps/web'),
        stdio: 'inherit',
        shell: true
      });

      webProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Web build completed successfully\n');
          resolve();
        } else {
          console.log('❌ Web build failed\n');
          reject(new Error(`Web build failed with code ${code}`));
        }
      });
    });
    buildPromises.push(webPromise);
  }

  if (buildAll) {
    console.log('🔨 Building all applications...');
    const allPromise = new Promise((resolve, reject) => {
      const allProcess = spawn('pnpm', ['build'], {
        cwd: path.join(__dirname, '../apps/all'),
        stdio: 'inherit',
        shell: true
      });
    });

    allProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ All builds completed successfully\n');
        resolve();
      } else {
        console.log('❌ All builds failed\n');
        reject(new Error(`All builds failed with code ${code}`));
      }
    });
    buildPromises.push(allPromise);
  }

  // Wait for all builds to complete
  Promise.all(buildPromises)
    .then(() => {
      console.log('🎉 All builds completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Build failed:', error.message);
      process.exit(1);
    });
}
