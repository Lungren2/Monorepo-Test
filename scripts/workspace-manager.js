#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE_CONFIG = 'pnpm-workspace.yaml';
const APPS_DIR = 'apps';

class WorkspaceManager {
  constructor() {
    this.rootDir = process.cwd();
    this.workspaceConfigPath = path.join(this.rootDir, WORKSPACE_CONFIG);
  }

  // Read current workspace configuration
  readWorkspaceConfig() {
    if (!fs.existsSync(this.workspaceConfigPath)) {
      return { packages: [] };
    }
    
    const content = fs.readFileSync(this.workspaceConfigPath, 'utf8');
    const packages = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') && !trimmed.startsWith('# ')) {
        const pattern = trimmed.substring(2).trim().replace(/^['"]|['"]$/g, '');
        
        // Handle glob patterns like 'apps/*'
        if (pattern.includes('*')) {
          const baseDir = pattern.replace('/*', '');
          const fullBaseDir = path.join(this.rootDir, baseDir);
          
          if (fs.existsSync(fullBaseDir)) {
            try {
              const entries = fs.readdirSync(fullBaseDir, { withFileTypes: true });
              for (const entry of entries) {
                if (entry.isDirectory()) {
                  packages.push(path.join(baseDir, entry.name));
                }
              }
            } catch (e) {
              // Directory doesn't exist or can't be read
            }
          }
        } else {
          packages.push(pattern);
        }
      }
    }
    
    return { packages };
  }

  // Write workspace configuration
  writeWorkspaceConfig(config) {
    const content = `packages:
${config.packages.map(pkg => `  - ${pkg}`).join('\n')}
`;
    fs.writeFileSync(this.workspaceConfigPath, content);
  }

  // List all workspaces
  listWorkspaces() {
    const config = this.readWorkspaceConfig();
    const workspaces = [];
    
    for (const packagePath of config.packages) {
      const fullPath = path.join(this.rootDir, packagePath);
      if (fs.existsSync(fullPath)) {
        const packageJsonPath = path.join(fullPath, 'package.json');
        const csprojPath = path.join(fullPath, '*.csproj');
        
        let workspaceInfo = {
          name: path.basename(fullPath),
          path: packagePath,
          type: 'unknown'
        };
        
        // Check if it's a Node.js workspace
        if (fs.existsSync(packageJsonPath)) {
          try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            workspaceInfo.type = 'nodejs';
            workspaceInfo.version = packageJson.version;
            workspaceInfo.description = packageJson.description || '';
          } catch (e) {
            workspaceInfo.type = 'nodejs (invalid package.json)';
          }
        }
        
        // Check if it's a .NET workspace
        const csprojFiles = this.findCsprojFiles(fullPath);
        if (csprojFiles.length > 0) {
          workspaceInfo.type = 'dotnet';
          workspaceInfo.csprojFiles = csprojFiles;
        }
        
        workspaces.push(workspaceInfo);
      }
    }
    
    return workspaces;
  }

  // Find .csproj files in a directory
  findCsprojFiles(dir) {
    const files = [];
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.csproj')) {
          files.push(entry.name);
        }
      }
    } catch (e) {
      // Directory doesn't exist or can't be read
    }
    return files;
  }

  // Add a new workspace
  addWorkspace(workspaceName, workspacePath) {
    const config = this.readWorkspaceConfig();
    const fullPath = path.join(this.rootDir, workspacePath);
    
    // Check if workspace directory exists
    if (!fs.existsSync(fullPath)) {
      console.error(`Error: Directory ${workspacePath} does not exist`);
      process.exit(1);
    }
    
    // Check if it's already in the workspace
    if (config.packages.includes(workspacePath)) {
      console.error(`Error: Workspace ${workspacePath} is already configured`);
      process.exit(1);
    }
    
    // Add to workspace configuration
    config.packages.push(workspacePath);
    this.writeWorkspaceConfig(config);
    
    console.log(`Added workspace: ${workspaceName} (${workspacePath})`);
    
    // Install dependencies if it's a Node.js workspace
    const packageJsonPath = path.join(fullPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      console.log('Installing Node.js dependencies...');
      try {
        execSync('pnpm install', { cwd: fullPath, stdio: 'inherit' });
      } catch (e) {
        console.error('Failed to install Node.js dependencies');
      }
    }
    
    // Restore packages if it's a .NET workspace
    const csprojFiles = this.findCsprojFiles(fullPath);
    if (csprojFiles.length > 0) {
      console.log('Restoring .NET packages...');
      try {
        execSync('dotnet restore', { cwd: fullPath, stdio: 'inherit' });
      } catch (e) {
        console.error('Failed to restore .NET packages');
      }
    }
  }

  // Remove a workspace
  removeWorkspace(workspaceName) {
    const config = this.readWorkspaceConfig();
    const workspacePath = config.packages.find(pkg => pkg.includes(workspaceName));
    
    if (!workspacePath) {
      console.error(`Error: Workspace ${workspaceName} not found`);
      process.exit(1);
    }
    
    // Remove from workspace configuration
    config.packages = config.packages.filter(pkg => pkg !== workspacePath);
    this.writeWorkspaceConfig(config);
    
    console.log(`Removed workspace: ${workspaceName} (${workspacePath})`);
    console.log(`Note: Directory ${workspacePath} was not deleted. Remove it manually if needed.`);
  }

  // Display workspace information
  displayWorkspaces(workspaces) {
    if (workspaces.length === 0) {
      console.log('No workspaces found');
      return;
    }
    
    console.log('\nWorkspaces:');
    console.log('─'.repeat(80));
    
    for (const workspace of workspaces) {
      console.log(`Name: ${workspace.name}`);
      console.log(`Path: ${workspace.path}`);
      console.log(`Type: ${workspace.type}`);
      
      if (workspace.version) {
        console.log(`Version: ${workspace.version}`);
      }
      
      if (workspace.description) {
        console.log(`Description: ${workspace.description}`);
      }
      
      if (workspace.csprojFiles) {
        console.log(`Project Files: ${workspace.csprojFiles.join(', ')}`);
      }
      
      console.log('─'.repeat(80));
    }
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const manager = new WorkspaceManager();
  
  switch (command) {
    case 'list':
      const workspaces = manager.listWorkspaces();
      manager.displayWorkspaces(workspaces);
      break;
      
    case 'add':
      if (args.length < 3) {
        console.error('Usage: workspace add <workspace-name> <workspace-path>');
        console.error('Example: workspace add new-app ./apps/new-app');
        process.exit(1);
      }
      manager.addWorkspace(args[1], args[2]);
      break;
      
    case 'remove':
      if (args.length < 2) {
        console.error('Usage: workspace remove <workspace-name>');
        process.exit(1);
      }
      manager.removeWorkspace(args[1]);
      break;
      
    default:
      console.log('Workspace Manager');
      console.log('Usage:');
      console.log('  workspace list                    - List all workspaces');
      console.log('  workspace add <name> <path>       - Add new workspace');
      console.log('  workspace remove <name>           - Remove workspace');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = WorkspaceManager;
