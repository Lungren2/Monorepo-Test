#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  clean: args.includes('--clean') || args.includes('-c'),
  api: args.includes('--api') || args.includes('-a'),
  web: args.includes('--web') || args.includes('-w'),
  help: args.includes('--help') || args.includes('-h')
};

// Show help if requested
if (flags.help) {
  console.log(`
Usage: node scripts/install-utility.js [options]

Options:
  --clean, -c    Perform clean installation (removes existing node_modules first)
  --api, -a      Install dependencies only for the API
  --web, -w      Install dependencies only for the Web application
  --help, -h     Show this help message

If no flags are provided, you'll be prompted to select what to install.
`);
  process.exit(0);
}

// Interactive selection if no flags provided
if (!flags.api && !flags.web) {
  console.log(`
📦 Installation Selection

What would you like to install?

1. API only
2. Web only  
3. Both API and Web
4. All dependencies (root + API + Web)
5. Clean install (removes existing node_modules first)
6. Exit

Please select an option (1-6): `);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('', (answer) => {
    switch (answer.trim()) {
      case '1':
        installDependencies(false, true, false, false);
        break;
      case '2':
        installDependencies(false, false, true, false);
        break;
      case '3':
        installDependencies(false, true, true, false);
        break;
      case '4':
        installDependencies(true, true, true, false);
        break;
      case '5':
        installDependencies(true, true, true, true);
        break;
      case '6':
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
  const installApi = flags.api || (!flags.api && !flags.web);
  const installWeb = flags.web || (!flags.api && !flags.web);
  const installRoot = !flags.api && !flags.web;
  installDependencies(installRoot, installApi, installWeb, flags.clean);
}

function installDependencies(installRoot, installApi, installWeb, cleanInstall) {
  console.log('📦 Installing dependencies...\n');

  const installPromises = [];

  if (installRoot) {
    console.log('🏠 Installing root dependencies...');
    const rootPromise = new Promise((resolve, reject) => {
      const command = cleanInstall ? 'install:clean' : 'install:all';
      const process = spawn('node', [`scripts/dependency-manager.js`, command], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
        shell: true
      });

      process.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Root dependencies installed successfully\n');
          resolve();
        } else {
          console.log('❌ Root dependencies installation failed\n');
          reject(new Error(`Root dependencies installation failed with code ${code}`));
        }
      });
    });
    installPromises.push(rootPromise);
  }

  if (installApi) {
    console.log('📡 Installing API dependencies...');
    const apiPromise = new Promise((resolve, reject) => {
      const process = spawn('dotnet', ['restore'], {
        cwd: path.join(__dirname, '../apps/api'),
        stdio: 'inherit',
        shell: true
      });

      process.on('close', (code) => {
        if (code === 0) {
          console.log('✅ API dependencies installed successfully\n');
          resolve();
        } else {
          console.log('❌ API dependencies installation failed\n');
          reject(new Error(`API dependencies installation failed with code ${code}`));
        }
      });
    });
    installPromises.push(apiPromise);
  }

  if (installWeb) {
    console.log('🌐 Installing Web dependencies...');
    const webPromise = new Promise((resolve, reject) => {
      const process = spawn('pnpm', ['install'], {
        cwd: path.join(__dirname, '../apps/web'),
        stdio: 'inherit',
        shell: true
      });

      process.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Web dependencies installed successfully\n');
          resolve();
        } else {
          console.log('❌ Web dependencies installation failed\n');
          reject(new Error(`Web dependencies installation failed with code ${code}`));
        }
      });
    });
    installPromises.push(webPromise);
  }

  // Wait for all installations to complete
  Promise.all(installPromises)
    .then(() => {
      console.log('🎉 All dependencies installed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Installation failed:', error.message);
      process.exit(1);
    });
}
