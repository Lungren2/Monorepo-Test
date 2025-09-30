# Utility Scripts

This directory contains utility scripts that consolidate and simplify common development tasks for the Robot APVSYS monorepo.

## Available Utilities

### Development Utilities

#### `dev-utility.js`

Starts development servers with flexible options.

**Usage:**

```bash
# Start both API and Web servers (default)
pnpm dev

# Start only API server
pnpm dev --api
# or
pnpm dev:api

# Start only Web server
pnpm dev --web
# or
pnpm dev:web

# Show help
node scripts/dev-utility.js --help
```

#### `build-utility.js`

Builds applications with flexible options.

**Usage:**

```bash
# Build both API and Web (default)
pnpm build

# Build only API
pnpm build --api
# or
pnpm build:api

# Build only Web
pnpm build --web
# or
pnpm build:web

# Show help
node scripts/build-utility.js --help
```

#### `start-utility.js`

Starts production applications with flexible options.

**Usage:**

```bash
# Start both API and Web (default)
pnpm start

# Start only API
pnpm start --api
# or
pnpm start:api

# Start only Web
pnpm start --web
# or
pnpm start:web

# Show help
node scripts/start-utility.js --help
```

### Maintenance Utilities

#### `clean-utility.js`

Cleans build artifacts and dependencies with flexible options.

**Usage:**

```bash
# Clean both API and Web (default)
pnpm clean

# Clean only API
pnpm clean --api
# or
pnpm clean:api

# Clean only Web
pnpm clean --web
# or
pnpm clean:web

# Clean everything (including root node_modules)
pnpm clean --all
# or
pnpm clean:all

# Show help
node scripts/clean-utility.js --help
```

#### `install-utility.js`

Installs dependencies with flexible options.

**Usage:**

```bash
# Install all dependencies (default)
pnpm restore

# Install only API dependencies
pnpm restore --api
# or
pnpm restore:api

# Install only Web dependencies
pnpm restore --web
# or
pnpm restore:web

# Clean install (removes existing node_modules first)
pnpm restore --clean
# or
pnpm restore:clean

# Show help
node scripts/install-utility.js --help
```

#### `test-utility.js`

Runs tests with flexible options.

**Usage:**

```bash
# Run tests for both API and Web (default)
pnpm test

# Run only API tests
pnpm test --api
# or
pnpm test:api

# Run only Web tests
pnpm test --web
# or
pnpm test:web

# Show help
node scripts/test-utility.js --help
```

### Workspace Management

#### `workspace-utility.js`

Manages workspaces with interactive or flag-based options.

**Usage:**

```bash
# Interactive menu (default)
pnpm workspace

# List workspaces
pnpm workspace --list
# or
pnpm workspace:list

# Add workspace
pnpm workspace --add
# or
pnpm workspace:add

# Remove workspace
pnpm workspace --remove
# or
pnpm workspace:remove

# Show help
node scripts/workspace-utility.js --help
```

## Benefits

1. **Simplified Commands**: Instead of remembering multiple commands, use simple flags
2. **Flexible Execution**: Run commands for specific parts of the monorepo or everything
3. **Consistent Interface**: All utilities follow the same flag pattern (`--api`, `--web`, `--help`)
4. **Better Error Handling**: Improved error messages and process management
5. **Cross-Platform**: Works on Windows, macOS, and Linux
6. **Interactive Options**: Some utilities provide interactive menus when no flags are specified

## Examples

### Development Workflow

```bash
# Start development with both services
pnpm dev

# Start only the API for backend development
pnpm dev --api

# Start only the web for frontend development
pnpm dev --web
```

### Build and Deploy Workflow

```bash
# Clean everything
pnpm clean --all

# Install dependencies
pnpm restore

# Build everything
pnpm build

# Start production
pnpm start
```

### Testing Workflow

```bash
# Test everything
pnpm test

# Test only the API
pnpm test --api

# Test only the web
pnpm test --web
```

## Adding New Utilities

To add a new utility script:

1. Create a new `.js` file in the `scripts/` directory
2. Follow the established pattern for argument parsing
3. Add help documentation with `--help` flag
4. Update this README with usage instructions
5. Add corresponding package.json scripts if needed

## Script Structure

All utility scripts follow this pattern:

```javascript
#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  api: args.includes('--api') || args.includes('-a'),
  web: args.includes('--web') || args.includes('-w'),
  help: args.includes('--help') || args.includes('-h'),
};

// Show help if requested
if (flags.help) {
  // Show help text
  process.exit(0);
}

// Execute based on flags
// ...
```

This ensures consistency across all utilities and makes them easy to understand and maintain.
