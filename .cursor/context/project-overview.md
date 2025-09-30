# Robot APVSYS Project Overview

## Project Description

Robot APVSYS is a comprehensive system that combines a .NET 9 Minimal API backend with a Next.js frontend, designed to manage and control robotic systems with advanced authentication, navigation, and tutorial capabilities.

## System Architecture

### Backend (API)

- **Technology**: .NET 9 Minimal API with FastEndpoints
- **Location**: `apps/api/`
- **Key Features**:
  - RESTful API endpoints
  - Authentication and authorization
  - Database integration
  - Middleware for request/response handling
  - DTOs for data transfer
  - Validators for input validation

### Frontend (Web)

- **Technology**: Next.js with TypeScript
- **Location**: `apps/web/`
- **Key Features**:
  - Modern React-based UI with shadcn/ui components
  - Advanced navigation system with sidebar
  - User authentication and role-based access
  - Interactive tutorial system with spotlight overlays
  - Responsive design with theme support
  - Protected routes and error handling

### Database

- **Location**: `database/`
- **Features**:
  - SQL scripts and migrations
  - Seed data management
  - Stored procedures
  - Schema versioning

## Core Functionality

### 1. Authentication System

- User login/logout
- Password reset functionality
- Account lockout protection
- Role-based access control
- Session management

### 2. Navigation System

- Dynamic sidebar navigation
- Entity selector for different system views
- User profile management
- Responsive navigation components

### 3. Tutorial System

- Interactive step-by-step tutorials
- Spotlight overlays for UI guidance
- Tutorial state management
- Customizable tutorial content

### 4. UI Components

- Comprehensive component library (shadcn/ui)
- Form components with validation
- Data display components (tables, charts, etc.)
- Interactive elements (dialogs, modals, etc.)
- Theme and styling system

### 5. Development Tools

- Workspace management scripts
- Package management utilities
- Build and deployment tools
- Testing utilities

## Project Structure

```
Robot-APVSYS/
├── apps/
│   ├── api/                 # .NET 9 Minimal API
│   └── web/                 # Next.js Frontend
├── database/                # Database scripts and migrations
├── docs/                    # Documentation
├── scripts/                 # Development utilities
├── TODO/                    # Task management
│   ├── TBD/                # Tasks to be done
│   ├── Doing/              # Currently active task
│   ├── Done/               # Completed tasks
│   └── Reviewed/           # Tasks ready for review
└── .cursor/                # Cursor IDE configuration
```

## Development Workflow

1. **Task Management**: All development work is organized through the TODO directory structure
2. **Single Active Task**: Only one task is worked on at a time
3. **Git Integration**: All task transitions are committed to version control
4. **Code Review**: Completed tasks go through review process
5. **Documentation**: Project overview is updated as features are completed

## Technology Stack

- **Backend**: .NET 9, FastEndpoints, Entity Framework
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Database**: SQL Server (based on project structure)
- **Development**: Cursor IDE, Git, pnpm

## Current Status

The project is in active development with a solid foundation of:

- Basic API structure with FastEndpoints
- Modern Next.js frontend with comprehensive UI components
- Authentication and navigation systems
- Tutorial and user management features
- Development tooling and workspace management

## Next Steps

All future development will be managed through the TODO directory system, with tasks broken down from this project overview and tracked through the defined workflow.
