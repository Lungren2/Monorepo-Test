# Dashboard Base Block

## Purpose
A comprehensive dashboard layout with sidebar navigation, team switching, and inbox functionality. Provides a flexible foundation for dashboard applications with collapsible sidebar and conditional inbox view. Features clean architecture with abstracted data, hooks, and constants following the same pattern as the tutorial block.

## Architecture

### Components
- **`AppSidebar`**: Main sidebar component with navigation and conditional inbox
- **`InboxSidebar`**: Inbox-specific sidebar for mail display with search and filtering
- **`NavMain`**: Main navigation component with collapsible items
- **`NavProjects`**: Projects navigation section with context menus
- **`NavUser`**: User profile and settings dropdown
- **`TeamSwitcher`**: Team/organization switcher component

### Hooks
- **`useDashboard`**: Main dashboard state management (navigation, inbox visibility)
- **`useInbox`**: Inbox state management (mail filtering, search, unread toggle)
- **`useTeamSwitcher`**: Team selection and switching logic

### Data & Types
- **`dashboardData`**: Complete sample data structure
- **`types/`**: Comprehensive TypeScript interfaces for all components
- **`constants/`**: Configuration constants and CSS classes
- **`data/`**: Sample data with factory functions for dynamic generation

## Key Files / Entry Points
- `index.ts` - Main export file with clean API
- `page.tsx` - Main dashboard page component with sidebar provider
- `app-sidebar.tsx` - Main sidebar component with navigation and conditional inbox
- `inbox-sidebar.tsx` - Inbox-specific sidebar for mail display
- `nav-main.tsx` - Main navigation component with collapsible items
- `nav-projects.tsx` - Projects navigation section
- `nav-user.tsx` - User profile and settings dropdown
- `team-switcher.tsx` - Team/organization switcher component

## How to Use

### Basic Usage
```tsx
import { AppSidebar } from '@/blocks/dashboard-base';
import { dashboardData } from '@/blocks/dashboard-base/data';

function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar data={dashboardData} />
      <SidebarInset>
        {/* Your dashboard content */}
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### Custom Data
```tsx
import { AppSidebar } from '@/blocks/dashboard-base';
import { createMockUser, createMockTeam } from '@/blocks/dashboard-base/data';

const customData = {
  user: createMockUser({ name: 'John Doe', email: 'john@example.com' }),
  teams: [createMockTeam({ name: 'My Company', plan: 'Pro' })],
  // ... other data
};

<AppSidebar data={customData} />
```

### Using Hooks
```tsx
import { useDashboard } from '@/blocks/dashboard-base/hooks/useDashboard';
import { useInbox } from '@/blocks/dashboard-base/hooks/useInbox';

function MyComponent() {
  const { activeNavItem, isInboxActive, setActiveNavItem } = useDashboard();
  const { filteredMails, searchQuery, setSearchQuery } = useInbox();
  
  // Use the state and handlers
}
```

### Using Types
```tsx
import type { DashboardData, User, Team } from '@/blocks/dashboard-base/types';
import { SIDEBAR_CONFIG } from '@/blocks/dashboard-base/constants';
```

## Features
- **Collapsible sidebar** with icon and full modes
- **Team switching** functionality in the header
- **Main navigation** with collapsible sections (Inbox, Playground, Models, Documentation, Settings)
- **Projects section** with project management actions
- **Inbox functionality** - click "Inbox" in navigation to show mail sidebar
- **User profile** dropdown with account settings
- **Search and filtering** in inbox with unread toggle
- **Type-safe** with comprehensive TypeScript interfaces
- **Configurable** via constants and data abstraction

### Inbox Feature
When the "Inbox" navigation item is clicked:
- The sidebar expands to show a dual-pane layout
- Left pane shows main navigation (collapsed to icons)
- Right pane shows inbox with mail list, search, and unread toggle
- Mail items display sender, subject, date, and preview text
- Real-time search and filtering functionality

## File Structure
```
dashboard-base/
├── app-sidebar.tsx              # Main sidebar component
├── inbox-sidebar.tsx            # Inbox sidebar
├── nav-main.tsx                 # Main navigation
├── nav-projects.tsx             # Projects navigation
├── nav-user.tsx                 # User navigation
├── team-switcher.tsx            # Team switcher
├── page.tsx                     # Main dashboard page
├── index.ts                     # Main component exports only
├── hooks/
│   ├── useDashboard.ts          # Main dashboard state
│   ├── useInbox.ts              # Inbox state management
│   └── useTeamSwitcher.ts       # Team switching logic
├── types/
│   └── index.ts                 # TypeScript interfaces
├── data/
│   └── index.ts                 # Sample data and factories
├── constants/
│   └── index.ts                 # Configuration constants
└── README.md                    # Documentation
```

**Import Guidelines:**
- **Components**: Import from main `@/blocks/dashboard-base` (barrel export)
- **Hooks**: Direct import from `@/blocks/dashboard-base/hooks/[hook-name]`
- **Types**: Direct import from `@/blocks/dashboard-base/types`
- **Data**: Direct import from `@/blocks/dashboard-base/data`
- **Constants**: Direct import from `@/blocks/dashboard-base/constants`

## Links
- Parent: `/blocks/` - Block components overview
- Related: `/blocks/dashboard-inbox/` - Standalone inbox implementation
- Related: `/blocks/tutorial/` - Tutorial system with similar architecture
- UI Components: `/components/ui/sidebar/` - Sidebar primitives
