/* =============================================================================
 * CONTEXT: blocks/tutorial/examples
 * PATTERN: integration-example
 * DEPENDS_ON: Next.js App Router, tutorial system
 * USED_BY: Developers integrating tutorial system
 * -----
 * Example showing how to integrate the tutorial system with Next.js App Router.
 * Demonstrates cross-page navigation and target registration.
 * =============================================================================
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  SpotlightProvider,
  SpotlightLayer,
  useTutorialStore,
  TutorialStep,
} from '../index';

// Example tutorial steps
const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    ref: { current: null }, // Will be set by registerTarget
    title: 'Welcome to the Tutorial!',
    body: 'This is your first step. Click Next to continue.',
    side: 'bottom',
    autoFocus: true,
  },
  {
    id: 'navigation',
    ref: { current: null },
    title: 'Navigation',
    body: 'This step demonstrates cross-page navigation.',
    side: 'top',
    path: '/dashboard', // This will trigger navigation
  },
  {
    id: 'dashboard-feature',
    ref: { current: null },
    title: 'Dashboard Feature',
    body: 'You have successfully navigated to the dashboard!',
    side: 'bottom',
  },
];

// Example component that uses the tutorial
export function TutorialExample() {
  const router = useRouter();
  const pathname = usePathname();
  const welcomeRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLButtonElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const { registerTarget, start, stop, running } = useTutorialStore();

  // Set up navigation helper
  useEffect(() => {
    useTutorialStore.getState().navigateToStep = (path: string) => {
      router.push(path);
    };
  }, [router]);

  // Register targets when components mount
  useEffect(() => {
    registerTarget('welcome', welcomeRef.current);
    registerTarget('navigation', navigationRef.current);
    registerTarget('dashboard-feature', dashboardRef.current);

    return () => {
      registerTarget('welcome', null);
      registerTarget('navigation', null);
      registerTarget('dashboard-feature', null);
    };
  }, [registerTarget]);

  // Update step refs when targets are registered
  useEffect(() => {
    tutorialSteps[0].ref = welcomeRef;
    tutorialSteps[1].ref = navigationRef;
    tutorialSteps[2].ref = dashboardRef;
  }, []);

  const handleStartTutorial = () => {
    start(tutorialSteps, {
      autoAdvance: false,
      dwell: 3000,
      autoFocus: true,
    });
  };

  const handleStopTutorial = () => {
    stop();
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Tutorial Example</h1>
      
      <div className="space-y-4">
        <button
          onClick={handleStartTutorial}
          disabled={running}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Start Tutorial
        </button>
        
        <button
          onClick={handleStopTutorial}
          disabled={!running}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Stop Tutorial
        </button>
      </div>

      {/* Tutorial targets */}
      <div
        ref={welcomeRef}
        className="p-4 border-2 border-dashed border-gray-300 rounded"
      >
        <h2 className="text-lg font-semibold">Welcome Target</h2>
        <p>This is the first tutorial target.</p>
      </div>

      <button
        ref={navigationRef}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Navigation Target
      </button>

      {pathname === '/dashboard' && (
        <div
          ref={dashboardRef}
          className="p-4 border-2 border-dashed border-blue-300 rounded"
        >
          <h2 className="text-lg font-semibold">Dashboard Target</h2>
          <p>This target is only visible on the dashboard page.</p>
        </div>
      )}
    </div>
  );
}

// Main app wrapper with tutorial providers
export function TutorialApp({ children }: { children: React.ReactNode }) {
  return (
    <SpotlightProvider>
      {children}
      <SpotlightLayer
        steps={tutorialSteps}
        run={useTutorialStore((state) => state.running)}
        autoAdvance={false}
        onNavigation={(path) => {
          // This will be handled by the router in the component
          console.log('Navigating to:', path);
        }}
      />
    </SpotlightProvider>
  );
}
