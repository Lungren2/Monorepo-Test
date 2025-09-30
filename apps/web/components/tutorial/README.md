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

### Basic Setup

```tsx
import { SpotlightProvider, SpotlightLayer } from '@/components/tutorial';

function App() {
  return (
    <SpotlightProvider>
      <YourAppContent />
      <SpotlightLayer steps={tutorialSteps} run={true} autoAdvance={true} />
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

1. **Separation of Concerns**: Spotlight logic is separate from tutorial logic
2. **Reusable Components**: Each component has a single responsibility
3. **Type Safety**: Comprehensive TypeScript interfaces
4. **Error Handling**: Graceful fallbacks for DOM operations
5. **Performance**: Optimized animations and event handling
6. **Maintainability**: Clear file structure and naming conventions

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
└── index.ts                     # Public API exports
```
