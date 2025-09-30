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
Usage: node scripts/dev-utility.js [options]

Options:
  --api, -a     Run only the API development server
  --web, -w     Run only the Web development server
  --help, -h    Show this help message

If no flags are provided, you'll be prompted to select which services to run.
`);
  process.exit(0);
}

// Interactive selection if no flags provided
if (!flags.api && !flags.web) {
  console.log(`
🚀 Development Server Selection

Which services would you like to start?

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
        startDevServers(true, false);
        break;
      case '2':
        startDevServers(false, true);
        break;
      case '3':
        startDevServers(true, true);
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
  const runApi = flags.api || (!flags.api && !flags.web);
  const runWeb = flags.web || (!flags.api && !flags.web);
  startDevServers(runApi, runWeb);
}

function startDevServers(runApi, runWeb) {
  console.log('🚀 Starting development servers...\n');

  if (runApi && runWeb) {
    // Run both concurrently
    console.log('📡 Starting API server...');
    console.log('🌐 Starting Web server...\n');
    
    const apiProcess = spawn('dotnet', ['run'], {
      cwd: path.join(__dirname, '../apps/api'),
      stdio: 'inherit',
      shell: true
    });

    const webProcess = spawn('pnpm', ['dev'], {
      cwd: path.join(__dirname, '../apps/web'),
      stdio: 'inherit',
      shell: true
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down development servers...');
      apiProcess.kill('SIGINT');
      webProcess.kill('SIGINT');
      process.exit(0);
    });

  } else if (runApi) {
    // Run only API
    console.log('📡 Starting API server...\n');
    const apiProcess = spawn('dotnet', ['run'], {
      cwd: path.join(__dirname, '../apps/api'),
      stdio: 'inherit',
      shell: true
    });

    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down API server...');
      apiProcess.kill('SIGINT');
      process.exit(0);
    });

  } else if (runWeb) {
    // Run only Web
    console.log('🌐 Starting Web server...\n');
    const webProcess = spawn('pnpm', ['dev'], {
      cwd: path.join(__dirname, '../apps/web'),
      stdio: 'inherit',
      shell: true
    });

    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down Web server...');
      webProcess.kill('SIGINT');
      process.exit(0);
    });
  }
}
