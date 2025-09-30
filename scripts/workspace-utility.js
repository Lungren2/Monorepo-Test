#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  list: args.includes('--list') || args.includes('-l'),
  add: args.includes('--add') || args.includes('-a'),
  remove: args.includes('--remove') || args.includes('-r'),
  help: args.includes('--help') || args.includes('-h')
};

// Show help if requested
if (flags.help) {
  console.log(`
Usage: node scripts/workspace-utility.js [options]

Options:
  --list, -l      List all workspaces
  --add, -a       Add a new workspace (interactive)
  --remove, -r    Remove a workspace (interactive)
  --help, -h      Show this help message

If no flags are provided, the script will show an interactive menu.
`);
  process.exit(0);
}

// Interactive menu if no specific action is requested
if (!flags.list && !flags.add && !flags.remove) {
  console.log(`
🏗️  Workspace Management Utility

Available actions:
1. List workspaces
2. Add workspace
3. Remove workspace
4. Exit

Please select an option (1-4): `);

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('', (answer) => {
    switch (answer.trim()) {
      case '1':
        listWorkspaces();
        break;
      case '2':
        addWorkspace();
        break;
      case '3':
        removeWorkspace();
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
  // Handle direct flags
  if (flags.list) listWorkspaces();
  if (flags.add) addWorkspace();
  if (flags.remove) removeWorkspace();
}

function listWorkspaces() {
  console.log('📋 Listing workspaces...\n');
  
  const process = spawn('node', ['scripts/workspace-manager.js', 'list'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true
  });

  process.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Workspace listing completed');
    } else {
      console.log('\n❌ Failed to list workspaces');
      process.exit(1);
    }
  });
}

function addWorkspace() {
  console.log('➕ Adding new workspace...\n');
  
  const process = spawn('node', ['scripts/workspace-manager.js', 'add'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true
  });

  process.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Workspace added successfully');
    } else {
      console.log('\n❌ Failed to add workspace');
      process.exit(1);
    }
  });
}

function removeWorkspace() {
  console.log('🗑️  Removing workspace...\n');
  
  const process = spawn('node', ['scripts/workspace-manager.js', 'remove'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true
  });

  process.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Workspace removed successfully');
    } else {
      console.log('\n❌ Failed to remove workspace');
      process.exit(1);
    }
  });
}
