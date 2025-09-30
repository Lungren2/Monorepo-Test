#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
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
Usage: node scripts/clean-utility.js [options]

Options:
  --api, -a     Clean only the API (bin, obj directories)
  --web, -w     Clean only the Web application (.next, node_modules)
  --all, -A     Clean everything (API, Web, and root node_modules)
  --help, -h    Show this help message

If no flags are provided, you'll be prompted to select what to clean.
`);
  process.exit(0);
}

// Interactive selection if no flags provided
if (!flags.api && !flags.web && !flags.all) {
  console.log(`
🧹 Clean Selection

What would you like to clean?

1. API only (bin, obj directories)
2. Web only (.next, node_modules)
3. Both API and Web
4. Everything (API, Web, and root node_modules)
5. Exit

Please select an option (1-5): `);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('', (answer) => {
    switch (answer.trim()) {
      case '1':
        cleanArtifacts(true, false, false);
        break;
      case '2':
        cleanArtifacts(false, true, false);
        break;
      case '3':
        cleanArtifacts(true, true, false);
        break;
      case '4':
        cleanArtifacts(true, true, true);
        break;
      case '5':
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
  const cleanApi = flags.api || flags.all || (!flags.api && !flags.web && !flags.all);
  const cleanWeb = flags.web || flags.all || (!flags.api && !flags.web && !flags.all);
  const cleanRoot = flags.all;
  cleanArtifacts(cleanApi, cleanWeb, cleanRoot);
}

function cleanArtifacts(cleanApi, cleanWeb, cleanRoot) {
  console.log('🧹 Cleaning build artifacts...\n');

  const cleanPromises = [];

  // Function to remove directory
  function removeDirectory(dirPath, name) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(dirPath)) {
        console.log(`📁 ${name} directory does not exist, skipping...`);
        resolve();
        return;
      }

      console.log(`🗑️  Removing ${name} directory...`);
      
      // Use appropriate command based on platform
      const isWindows = process.platform === 'win32';
      const command = isWindows ? 'rmdir' : 'rm';
      const args = isWindows ? ['/s', '/q', dirPath] : ['-rf', dirPath];
      
      const process = spawn(command, args, {
        stdio: 'inherit',
        shell: true
      });

      process.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ ${name} directory removed successfully`);
          resolve();
        } else {
          console.log(`⚠️  ${name} directory removal completed (some files may have been in use)`);
          resolve(); // Don't fail the entire process for cleanup issues
        }
      });
    });
  }

  if (cleanApi) {
    const apiBinPath = path.join(__dirname, '../apps/api/bin');
    const apiObjPath = path.join(__dirname, '../apps/api/obj');
    
    cleanPromises.push(removeDirectory(apiBinPath, 'API bin'));
    cleanPromises.push(removeDirectory(apiObjPath, 'API obj'));
  }

  if (cleanWeb) {
    const webNextPath = path.join(__dirname, '../apps/web/.next');
    const webNodeModulesPath = path.join(__dirname, '../apps/web/node_modules');
    
    cleanPromises.push(removeDirectory(webNextPath, 'Web .next'));
    cleanPromises.push(removeDirectory(webNodeModulesPath, 'Web node_modules'));
  }

  if (cleanRoot) {
    const rootNodeModulesPath = path.join(__dirname, '../node_modules');
    cleanPromises.push(removeDirectory(rootNodeModulesPath, 'Root node_modules'));
  }

  // Wait for all clean operations to complete
  Promise.all(cleanPromises)
    .then(() => {
      console.log('\n🎉 Cleanup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Cleanup failed:', error.message);
      process.exit(1);
    });
}
