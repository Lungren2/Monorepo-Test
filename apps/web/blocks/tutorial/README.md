# Tutorial Feature

A refactored tutorial system with clear separation of concerns and improved organization.

## Architecture

### Components

- **`SpotlightProvider`**: Manages spotlight state and positioning
- **`SpotlightLayer`**: Orchestrates tutorial flow and spotlight coordination
- **`SpotlightOverlay`**: Renders the spotlight mask overlay
- **`TutorialContent`**: Displays tutorial content in a popover

### Hooks

- **`useSpotlight`**: Access spotlight context (position, open/close)
- **`useTutorial`**: Manage tutorial state and navigation
- **`useTutorialStore`**: Global tutorial state management (Zustand)

### Utilities

- **`positioning.ts`**: Spotlight positioning and popover placement logic
- **`dom.ts`**: DOM manipulation utilities with error handling

### Types

- **`TutorialStep`**: Individual tutorial step definition
- **`TutorialContext`**: Tutorial navigation context
- **`SpotlightRect`**: Spotlight positioning data
- **`SpotlightContextValue`**: Spotlight provider context

## Usage

### Basic Setup (Next.js App Router)

```tsx
'use client';

import { SpotlightProvider, SpotlightLayer } from '@/blocks/tutorial';
import { useRouter } from 'next/navigation';

function App() {
  const router = useRouter();
  
  return (
    <SpotlightProvider>
      <YourAppContent />
      <SpotlightLayer 
        steps={tutorialSteps} 
        run={true} 
        autoAdvance={true}
        onNavigation={(path) => router.push(path)}
      />
    </SpotlightProvider>
  );
}
```

### Tutorial Steps

```tsx
const tutorialSteps = [
  {
    id: 'welcome',
    ref: welcomeRef,
    title: 'Welcome!',
    body: 'This is your first tutorial step.',
    side: 'bottom',
    autoFocus: true,
  },
  {
    id: 'cross-page',
    ref: dashboardRef,
    title: 'Cross-page Tutorial',
    body: 'This step will navigate to another page.',
    path: '/dashboard', // Optional: triggers navigation
    side: 'top',
  },
  // ... more steps
];
```

### Custom Content

```tsx
<SpotlightLayer
  steps={steps}
  run={true}
  renderContent={(step, context) => (
    <CustomTutorialCard
      step={step}
      onNext={context.next}
      onPrev={context.prev}
      onSkip={context.close}
    />
  )}
/>
```

## Key Improvements

1. **Next.js Compatibility**: Full support for App Router with optional cross-page navigation
2. **Separation of Concerns**: Spotlight logic is separate from tutorial logic
3. **Reusable Components**: Each component has a single responsibility
4. **Type Safety**: Comprehensive TypeScript interfaces
5. **Error Handling**: Graceful fallbacks for DOM operations
6. **Performance**: Optimized animations and event handling
7. **Maintainability**: Clear file structure and naming conventions
8. **No External Dependencies**: Uses only React, Motion, and Radix UI (no react-router-dom)

## File Structure

```
tutorial/
├── components/
│   ├── SpotlightProvider.tsx    # Spotlight state management
│   ├── SpotlightLayer.tsx       # Tutorial orchestration
│   ├── SpotlightOverlay.tsx     # Mask overlay rendering
│   └── TutorialContent.tsx      # Content popover
├── hooks/
│   ├── useSpotlight.ts          # Spotlight context hook
│   └── useTutorial.ts           # Tutorial state hook
├── stores/
│   └── tutorialStore.ts         # Global state (Zustand)
├── types/
│   └── index.ts                 # Type definitions
├── utils/
│   ├── positioning.ts            # Position calculations
│   └── dom.ts                   # DOM utilities
├── constants/
│   └── index.ts                 # Constants and defaults
├── examples/
│   └── nextjs-integration.tsx   # Next.js integration example
├── index.ts                     # Public API exports
└── README.md                    # Documentation
```
