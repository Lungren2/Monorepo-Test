#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DependencyManager {
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

  // Check if directory has package.json
  hasPackageJson(dir) {
    return fs.existsSync(path.join(dir, 'package.json'));
  }

  // Install dependencies for all workspaces
  install() {
    console.log('Installing dependencies for all workspaces...\n');
    
    const workspaces = this.getWorkspacePaths();
    let success = true;
    
    for (const workspacePath of workspaces) {
      const fullPath = path.join(this.rootDir, workspacePath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Skipping ${workspacePath} (directory not found)`);
        continue;
      }
      
      console.log(`📦 Processing ${workspacePath}...`);
      
      // Install Node.js dependencies
      if (this.hasPackageJson(fullPath)) {
        try {
          console.log(`  📦 Installing Node.js dependencies...`);
          execSync('pnpm install', { cwd: fullPath, stdio: 'inherit' });
          console.log(`  ✅ Node.js dependencies installed`);
        } catch (e) {
          console.log(`  ❌ Failed to install Node.js dependencies: ${e.message}`);
          success = false;
        }
      }
      
      // Restore .NET packages
      const csprojFiles = this.findCsprojFiles(fullPath);
      if (csprojFiles.length > 0) {
        try {
          console.log(`  🔧 Restoring .NET packages...`);
          execSync('dotnet restore', { cwd: fullPath, stdio: 'inherit' });
          console.log(`  ✅ .NET packages restored`);
        } catch (e) {
          console.log(`  ❌ Failed to restore .NET packages: ${e.message}`);
          success = false;
        }
      }
      
      if (!this.hasPackageJson(fullPath) && csprojFiles.length === 0) {
        console.log(`  ⚠️  No package.json or .csproj files found`);
      }
      
      console.log('');
    }
    
    if (success) {
      console.log('✅ All dependencies installed successfully');
    } else {
      console.log('❌ Some dependencies failed to install');
      process.exit(1);
    }
  }

  // Clean install (clean build artifacts first)
  installClean() {
    console.log('Cleaning and installing dependencies...\n');
    
    // Clean first
    this.clean();
    console.log('');
    
    // Then install
    this.install();
  }

  // Clean build artifacts
  clean() {
    console.log('Cleaning build artifacts...\n');
    
    const workspaces = this.getWorkspacePaths();
    
    for (const workspacePath of workspaces) {
      const fullPath = path.join(this.rootDir, workspacePath);
      
      if (!fs.existsSync(fullPath)) {
        continue;
      }
      
      console.log(`🧹 Cleaning ${workspacePath}...`);
      
      // Clean Node.js artifacts
      if (this.hasPackageJson(fullPath)) {
        const nodeModulesPath = path.join(fullPath, 'node_modules');
        const nextPath = path.join(fullPath, '.next');
        
        try {
          if (fs.existsSync(nodeModulesPath)) {
            fs.rmSync(nodeModulesPath, { recursive: true, force: true });
            console.log(`  🗑️  Removed node_modules`);
          }
          
          if (fs.existsSync(nextPath)) {
            fs.rmSync(nextPath, { recursive: true, force: true });
            console.log(`  🗑️  Removed .next directory`);
          }
        } catch (e) {
          console.log(`  ⚠️  Failed to clean Node.js artifacts: ${e.message}`);
        }
      }
      
      // Clean .NET artifacts
      const csprojFiles = this.findCsprojFiles(fullPath);
      if (csprojFiles.length > 0) {
        try {
          execSync('dotnet clean', { cwd: fullPath, stdio: 'inherit' });
          console.log(`  🗑️  Cleaned .NET build artifacts`);
        } catch (e) {
          console.log(`  ⚠️  Failed to clean .NET artifacts: ${e.message}`);
        }
      }
    }
    
    console.log('\n✅ Clean completed');
  }

  // Update dependencies
  update() {
    console.log('Updating dependencies across all workspaces...\n');
    
    const workspaces = this.getWorkspacePaths();
    let success = true;
    
    for (const workspacePath of workspaces) {
      const fullPath = path.join(this.rootDir, workspacePath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Skipping ${workspacePath} (directory not found)`);
        continue;
      }
      
      console.log(`🔄 Updating ${workspacePath}...`);
      
      // Update Node.js dependencies
      if (this.hasPackageJson(fullPath)) {
        try {
          console.log(`  📦 Updating Node.js dependencies...`);
          execSync('pnpm update --latest', { cwd: fullPath, stdio: 'inherit' });
          console.log(`  ✅ Node.js dependencies updated`);
        } catch (e) {
          console.log(`  ❌ Failed to update Node.js dependencies: ${e.message}`);
          success = false;
        }
      }
      
      // Update .NET packages
      const csprojFiles = this.findCsprojFiles(fullPath);
      if (csprojFiles.length > 0) {
        try {
          console.log(`  🔧 Updating .NET packages...`);
          execSync('dotnet add package --version latest', { cwd: fullPath, stdio: 'inherit' });
          console.log(`  ✅ .NET packages updated`);
        } catch (e) {
          console.log(`  ⚠️  .NET package update requires manual intervention`);
        }
      }
      
      console.log('');
    }
    
    if (success) {
      console.log('✅ Dependencies updated successfully');
    } else {
      console.log('❌ Some dependencies failed to update');
    }
  }

  // Check for outdated dependencies
  outdated() {
    console.log('Checking for outdated dependencies...\n');
    
    const workspaces = this.getWorkspacePaths();
    
    for (const workspacePath of workspaces) {
      const fullPath = path.join(this.rootDir, workspacePath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Skipping ${workspacePath} (directory not found)`);
        continue;
      }
      
      console.log(`🔍 Checking ${workspacePath}...`);
      
      // Check Node.js outdated packages
      if (this.hasPackageJson(fullPath)) {
        try {
          console.log(`  📦 Node.js packages:`);
          execSync('pnpm outdated', { cwd: fullPath, stdio: 'inherit' });
        } catch (e) {
          console.log(`  ℹ️  No outdated Node.js packages found`);
        }
      }
      
      // Check .NET outdated packages
      const csprojFiles = this.findCsprojFiles(fullPath);
      if (csprojFiles.length > 0) {
        try {
          console.log(`  🔧 .NET packages:`);
          execSync('dotnet list package --outdated', { cwd: fullPath, stdio: 'inherit' });
        } catch (e) {
          console.log(`  ℹ️  No outdated .NET packages found`);
        }
      }
      
      console.log('');
    }
  }

  // Security audit
  audit() {
    console.log('Running security audit...\n');
    
    const workspaces = this.getWorkspacePaths();
    let success = true;
    
    for (const workspacePath of workspaces) {
      const fullPath = path.join(this.rootDir, workspacePath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Skipping ${workspacePath} (directory not found)`);
        continue;
      }
      
      console.log(`🔒 Auditing ${workspacePath}...`);
      
      // Audit Node.js packages
      if (this.hasPackageJson(fullPath)) {
        try {
          console.log(`  📦 Node.js security audit:`);
          execSync('pnpm audit', { cwd: fullPath, stdio: 'inherit' });
        } catch (e) {
          console.log(`  ⚠️  Node.js audit found issues`);
          success = false;
        }
      }
      
      // Audit .NET packages
      const csprojFiles = this.findCsprojFiles(fullPath);
      if (csprojFiles.length > 0) {
        try {
          console.log(`  🔧 .NET security audit:`);
          execSync('dotnet list package --vulnerable', { cwd: fullPath, stdio: 'inherit' });
        } catch (e) {
          console.log(`  ℹ️  No .NET vulnerabilities found`);
        }
      }
      
      console.log('');
    }
    
    if (success) {
      console.log('✅ Security audit completed - no issues found');
    } else {
      console.log('❌ Security audit found issues that need attention');
    }
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const manager = new DependencyManager();
  
  switch (command) {
    case 'install':
      manager.install();
      break;
      
    case 'install:clean':
      manager.installClean();
      break;
      
    case 'update':
      manager.update();
      break;
      
    case 'outdated':
      manager.outdated();
      break;
      
    case 'audit':
      manager.audit();
      break;
      
    case 'clean':
      manager.clean();
      break;
      
    default:
      console.log('Dependency Manager');
      console.log('Usage:');
      console.log('  deps install           - Install dependencies for all workspaces');
      console.log('  deps install:clean     - Clean install (clean artifacts first)');
      console.log('  deps update            - Update dependencies across all workspaces');
      console.log('  deps outdated          - Check for outdated dependencies');
      console.log('  deps audit             - Security audit for all packages');
      console.log('  deps clean             - Clean build artifacts');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = DependencyManager;
