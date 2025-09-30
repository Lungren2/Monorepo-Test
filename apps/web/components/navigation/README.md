# Navigation Feature

A comprehensive, maintainable navigation system with collapsible sidebar, role-based menu items, and responsive design.

## 🏗️ Architecture

### Core Components

- **`SidebarNavigation`**: Main sidebar navigation component (orchestrates other components)
- **`SidebarHeader`**: Logo and header section component
- **`NavigationMenu`**: Navigation items list component
- **`NavigationItem`**: Individual navigation item component
- **`UserProfile`**: User profile and logout section component
- **`Sidebar`**: Core sidebar UI component
- **`SidebarRail`**: Sidebar rail for additional functionality
- **`SidebarTrigger`**: Button to toggle sidebar visibility

### Custom Hooks

- **`useNavigation`**: Manages navigation logic, filtering, and active state
- **`useSidebar`**: Manages sidebar state (open/closed, collapsed/expanded)

### Contexts

- **`SidebarContext`**: Manages sidebar state and provides context to child components

### Configuration

- **`navigation.ts`**: Centralized navigation configuration with role-based items
- **`ui.ts`**: UI constants for consistent styling and transitions

### Types

- **`NavigationItem`**: Interface for navigation items with icons, roles, and metadata
- **`NavigationGroup`**: Interface for grouping navigation items
- **`SidebarNavigationProps`**: Props for the main sidebar component
- **`NavigationItemProps`**: Props for individual navigation items
- **`UserProfileProps`**: Props for the user profile component

## 🚀 Key Improvements

### 1. **Separation of Concerns**

- Navigation logic separated into custom hooks
- UI components focused on rendering only
- Configuration separated from implementation

### 2. **Modularity**

- Each component has a single responsibility
- Easy to test individual components
- Simple to extend with new features

### 3. **Maintainability**

- Centralized navigation configuration
- Consistent UI constants
- Clear type definitions
- Reduced code duplication

### 4. **Flexibility**

- Easy to add/remove navigation items
- Simple role-based filtering
- Configurable navigation structure

## 📁 File Structure

```
navigation/
├── components/
│   ├── SidebarNavigation.tsx    # Main orchestrator component
│   ├── SidebarHeader.tsx        # Logo and header
│   ├── NavigationMenu.tsx       # Navigation items list
│   ├── NavigationItem.tsx       # Individual navigation item
│   ├── UserProfile.tsx          # User profile section
│   ├── sidebar.tsx              # Core sidebar component
│   ├── SidebarRail.tsx          # Sidebar rail
│   └── SidebarTrigger.tsx       # Toggle button
├── hooks/
│   ├── useNavigation.ts         # Navigation logic hook
│   └── useSidebar.tsx           # Sidebar state hook
├── contexts/
│   └── SidebarContext.tsx       # Sidebar state management
├── constants/
│   ├── navigation.ts            # Navigation configuration
│   └── ui.ts                    # UI constants
├── types/
│   └── index.ts                 # Type definitions
├── index.ts                     # Public API exports
└── README.md                    # This file
```

## 🎯 Usage

### Basic Sidebar Setup

```tsx
import { SidebarProvider, SidebarNavigation } from '@/components/navigation';

function App() {
  return (
    <SidebarProvider>
      <div className="flex">
        <SidebarNavigation />
        <main className="flex-1">
          <YourMainContent />
        </main>
      </div>
    </SidebarProvider>
  );
}
```

### Using Navigation Hook

```tsx
import { useNavigation } from '@/components/navigation';

function YourComponent() {
  const { navigationItems, isActiveRoute, currentPath } = useNavigation();

  return (
    <div>
      <p>Current path: {currentPath}</p>
      <ul>
        {navigationItems.map((item) => (
          <li
            key={item.href}
            className={isActiveRoute(item.href) ? 'active' : ''}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Adding New Navigation Items

```tsx
// In constants/navigation.ts
export const NEW_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'New Feature',
    href: '/new-feature',
    icon: NewIcon,
    roles: ['user', 'manager', 'admin'],
    description: 'Access new functionality',
  },
];

// Add to ALL_NAVIGATION_ITEMS
export const ALL_NAVIGATION_ITEMS = [
  ...ADMIN_NAVIGATION_ITEMS,
  ...MANAGER_NAVIGATION_ITEMS,
  ...USER_NAVIGATION_ITEMS,
  ...NEW_NAVIGATION_ITEMS, // Add here
];
```

## 🔧 Configuration

### Navigation Items

Each navigation item supports:

- `label`: Display text
- `href`: Route path
- `icon`: Lucide React icon component
- `roles`: Array of user roles that can access this item
- `description`: Optional description for tooltips
- `badge`: Optional badge or notification count
- `children`: Optional nested navigation items

### Role-Based Access

Navigation items are automatically filtered based on user roles:

- **Admin**: Full access to all features
- **Manager**: Access to approvals and user features
- **User**: Access to basic request features

### UI Constants

Centralized styling constants in `constants/ui.ts`:

- Transition durations and easing
- Spacing values
- State-based styling
- Layout configurations

## 🧪 Testing

Each component can be tested independently:

```tsx
import { render, screen } from '@testing-library/react';
import NavigationItem from './NavigationItem';

test('renders navigation item with correct label', () => {
  const mockItem = {
    label: 'Test Item',
    href: '/test',
    icon: TestIcon,
    roles: ['user'],
  };

  render(
    <NavigationItem item={mockItem} isActive={false} isCollapsed={false} />
  );

  expect(screen.getByText('Test Item')).toBeInTheDocument();
});
```

## 🔄 Migration Guide

### From Old Structure

1. **Import Updates**: Update imports to use new component names
2. **Hook Usage**: Replace inline logic with `useNavigation` hook
3. **Component Props**: Update component props to match new interfaces

### Breaking Changes

- `SidebarHeader` component renamed to `SidebarHeaderWrapper` in exports
- Navigation logic moved to `useNavigation` hook
- UI constants centralized in `constants/ui.ts`

## 🚀 Future Enhancements

- **Nested Navigation**: Support for multi-level navigation menus
- **Custom Themes**: Configurable sidebar themes and styling
- **Navigation Analytics**: Track navigation usage patterns
- **Dynamic Navigation**: Server-driven navigation configuration
- **Accessibility**: Enhanced keyboard navigation and screen reader support
