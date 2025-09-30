#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PackageManager {
  constructor() {
    this.rootDir = process.cwd();
    this.workspaceConfigPath = path.join(this.rootDir, 'pnpm-workspace.yaml');
  }

  // Get all workspace paths
  getWorkspacePaths() {
    if (!fs.existsSync(this.workspaceConfigPath)) {
      return [];
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
    
    return packages;
  }

  // Find workspace by name or path
  findWorkspace(workspaceName) {
    const workspaces = this.getWorkspacePaths();
    
    // First try exact match by name
    for (const workspacePath of workspaces) {
      const fullPath = path.join(this.rootDir, workspacePath);
      if (path.basename(fullPath) === workspaceName) {
        return { name: path.basename(fullPath), path: workspacePath, fullPath };
      }
    }
    
    // Then try partial match
    for (const workspacePath of workspaces) {
      if (workspacePath.includes(workspaceName)) {
        const fullPath = path.join(this.rootDir, workspacePath);
        return { name: path.basename(fullPath), path: workspacePath, fullPath };
      }
    }
    
    return null;
  }

  // Check if directory has package.json
  hasPackageJson(dir) {
    return fs.existsSync(path.join(dir, 'package.json'));
  }

  // Find .csproj files in a directory
  findCsprojFiles(dir) {
    const files = [];
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.csproj')) {
          files.push(path.join(dir, entry.name));
        }
      }
    } catch (e) {
      // Directory doesn't exist or can't be read
    }
    return files;
  }

  // Add Node.js package
  addNodePackage(packageName, workspaceName, isDev = false) {
    const workspace = this.findWorkspace(workspaceName);
    if (!workspace) {
      console.error(`Error: Workspace '${workspaceName}' not found`);
      process.exit(1);
    }

    if (!this.hasPackageJson(workspace.fullPath)) {
      console.error(`Error: Workspace '${workspaceName}' is not a Node.js project`);
      process.exit(1);
    }

    try {
      const flag = isDev ? '--save-dev' : '--save';
      execSync(`pnpm add ${packageName} ${flag}`, { 
        cwd: workspace.fullPath, 
        stdio: 'inherit' 
      });
      console.log(`✅ Added ${packageName} to ${workspaceName}`);
    } catch (e) {
      console.error(`❌ Failed to add ${packageName} to ${workspaceName}`);
      process.exit(1);
    }
  }

  // Remove Node.js package
  removeNodePackage(packageName, workspaceName) {
    const workspace = this.findWorkspace(workspaceName);
    if (!workspace) {
      console.error(`Error: Workspace '${workspaceName}' not found`);
      process.exit(1);
    }

    if (!this.hasPackageJson(workspace.fullPath)) {
      console.error(`Error: Workspace '${workspaceName}' is not a Node.js project`);
      process.exit(1);
    }

    try {
      execSync(`pnpm remove ${packageName}`, { 
        cwd: workspace.fullPath, 
        stdio: 'inherit' 
      });
      console.log(`✅ Removed ${packageName} from ${workspaceName}`);
    } catch (e) {
      console.error(`❌ Failed to remove ${packageName} from ${workspaceName}`);
      process.exit(1);
    }
  }

  // Add .NET NuGet package
  addNuGetPackage(packageName, workspaceName, version = null) {
    const workspace = this.findWorkspace(workspaceName);
    if (!workspace) {
      console.error(`Error: Workspace '${workspaceName}' not found`);
      process.exit(1);
    }

    const csprojFiles = this.findCsprojFiles(workspace.fullPath);
    if (csprojFiles.length === 0) {
      console.error(`Error: Workspace '${workspaceName}' is not a .NET project`);
      process.exit(1);
    }

    try {
      const versionFlag = version ? `--version ${version}` : '';
      execSync(`dotnet add package ${packageName} ${versionFlag}`, { 
        cwd: workspace.fullPath, 
        stdio: 'inherit' 
      });
      console.log(`✅ Added ${packageName} to ${workspaceName}`);
    } catch (e) {
      console.error(`❌ Failed to add ${packageName} to ${workspaceName}`);
      process.exit(1);
    }
  }

  // Remove .NET NuGet package
  removeNuGetPackage(packageName, workspaceName) {
    const workspace = this.findWorkspace(workspaceName);
    if (!workspace) {
      console.error(`Error: Workspace '${workspaceName}' not found`);
      process.exit(1);
    }

    const csprojFiles = this.findCsprojFiles(workspace.fullPath);
    if (csprojFiles.length === 0) {
      console.error(`Error: Workspace '${workspaceName}' is not a .NET project`);
      process.exit(1);
    }

    try {
      execSync(`dotnet remove package ${packageName}`, { 
        cwd: workspace.fullPath, 
        stdio: 'inherit' 
      });
      console.log(`✅ Removed ${packageName} from ${workspaceName}`);
    } catch (e) {
      console.error(`❌ Failed to remove ${packageName} from ${workspaceName}`);
      process.exit(1);
    }
  }

  // List all workspaces with their types
  listWorkspaces() {
    const workspaces = this.getWorkspacePaths();
    
    console.log('\nAvailable workspaces:');
    console.log('─'.repeat(50));
    
    for (const workspacePath of workspaces) {
      const fullPath = path.join(this.rootDir, workspacePath);
      const workspaceName = path.basename(fullPath);
      
      let types = [];
      if (this.hasPackageJson(fullPath)) {
        types.push('Node.js');
      }
      if (this.findCsprojFiles(fullPath).length > 0) {
        types.push('.NET');
      }
      
      console.log(`${workspaceName} (${types.join(', ') || 'Unknown'})`);
    }
    
    console.log('─'.repeat(50));
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const manager = new PackageManager();
  
  switch (command) {
    case 'add:node':
      if (args.length < 3) {
        console.error('Usage: package add:node <package-name> <workspace-name> [--dev]');
        process.exit(1);
      }
      const isDev = args.includes('--dev');
      manager.addNodePackage(args[1], args[2], isDev);
      break;
      
    case 'remove:node':
      if (args.length < 3) {
        console.error('Usage: package remove:node <package-name> <workspace-name>');
        process.exit(1);
      }
      manager.removeNodePackage(args[1], args[2]);
      break;
      
    case 'add:nuget':
      if (args.length < 3) {
        console.error('Usage: package add:nuget <package-name> <workspace-name> [--version=<version>]');
        process.exit(1);
      }
      const versionArg = args.find(arg => arg.startsWith('--version='));
      const version = versionArg ? versionArg.split('=')[1] : null;
      manager.addNuGetPackage(args[1], args[2], version);
      break;
      
    case 'remove:nuget':
      if (args.length < 3) {
        console.error('Usage: package remove:nuget <package-name> <workspace-name>');
        process.exit(1);
      }
      manager.removeNuGetPackage(args[1], args[2]);
      break;
      
    case 'list':
      manager.listWorkspaces();
      break;
      
    default:
      console.log('Package Manager');
      console.log('Usage:');
      console.log('  package add:node <name> <workspace> [--dev]     - Add Node.js package');
      console.log('  package remove:node <name> <workspace>          - Remove Node.js package');
      console.log('  package add:nuget <name> <workspace> [--version=<ver>] - Add .NET package');
      console.log('  package remove:nuget <name> <workspace>         - Remove .NET package');
      console.log('  package list                                    - List workspaces');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = PackageManager;
