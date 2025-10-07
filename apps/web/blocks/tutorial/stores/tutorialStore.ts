import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TutorialStoreStep, TutorialOptions, TutorialState } from '../types';

export const useTutorialStore = create<TutorialState>()(
  devtools(
    persist(
      (set, get) => ({
        steps: [],
        index: 0,
        running: false,

        autoAdvance: false,
        dwell: 1800,
        autoFocus: true,

        targets: {},

        currentStep: () => {
          const { steps, index, running } = get();
          if (!running || index < 0 || index >= steps.length) return null;
          return steps[index];
        },

        currentTarget: () => {
          const step = get().currentStep();
          if (!step) return null;
          const el = get().targets[step.id];
          return (el as Element) ?? null;
        },

        start: (steps, opts) =>
          set(() => ({
            steps,
            index: 0,
            running: true,
            autoAdvance: opts?.autoAdvance ?? false,
            dwell: opts?.dwell ?? 1800,
            autoFocus: opts?.autoFocus ?? true,
          })),

        stop: () =>
          set(() => ({
            running: false,
          })),

        reset: () =>
          set(() => ({
            index: 0,
          })),

        next: () =>
          set((s) => {
            if (!s.running) return s;
            const ni = Math.min(s.index + 1, s.steps.length);
            if (ni >= s.steps.length) {
              // Finished
              return { ...s, running: false };
            }
            return { ...s, index: ni };
          }),

        prev: () =>
          set((s) => ({
            ...s,
            index: Math.max(0, s.index - 1),
          })),

        goto: (i) =>
          set((s) => ({
            ...s,
            index: Math.min(Math.max(0, i), s.steps.length - 1),
          })),

        setAutoAdvance: (v) => set(() => ({ autoAdvance: v })),
        setDwell: (ms) => set(() => ({ dwell: Math.max(0, ms | 0) })),
        setAutoFocus: (v) => set(() => ({ autoFocus: v })),

        registerTarget: (id, el) =>
          set((s) => ({
            ...s,
            targets: { ...s.targets, [id]: el ?? null },
          })),

        needsNavigation: (currentPathname: string) => {
          const step = get().currentStep();
          if (!step) return null;
          return step.path && step.path !== currentPathname ? step.path : null;
        },

        // Next.js navigation helper - can be set by the app
        navigateToStep: undefined,
      }),
      {
        name: 'tutorial-store',
        partialize: (state) => ({
          // Persist core flow + options; skip targets (DOM references).
          steps: state.steps,
          index: state.index,
          running: state.running,
          autoAdvance: state.autoAdvance,
          dwell: state.dwell,
          autoFocus: state.autoFocus,
        }),
      }
    )
  )
);

/* --------------------------------------------------------------------------
Next.js Integration Guide:

1) Set up navigation helper in your app (e.g., in layout.tsx or a provider):
   import { useRouter } from 'next/navigation';
   import { useTutorialStore } from '@/blocks/tutorial';
   
   const router = useRouter();
   useTutorialStore.getState().navigateToStep = (path: string) => {
     router.push(path);
   };

2) Define steps with optional `path` for cross-page tutorials:
   useTutorialStore.getState().start(
     [
       { id: "dash.cardA", path: "/dashboard", title: "...", body: "..." },
       { id: "settings.button", path: "/settings", title: "...", body: "..." },
       { id: "local.step", title: "...", body: "..." }, // No path = same page
     ],
     { autoAdvance: true, dwell: 1600, autoFocus: true }
   );

3) In each route where a step target exists, register the DOM element:
   useEffect(() => {
     const { registerTarget } = useTutorialStore.getState();
     registerTarget("dash.cardA", ref.current);
     return () => registerTarget("dash.cardA", null);
   }, []);

4) Use SpotlightLayer with Next.js integration:
   <SpotlightLayer 
     steps={tutorialSteps} 
     run={true} 
     autoAdvance={true}
     onNavigation={(path) => router.push(path)}
   />

This keeps routing concerns outside the store while giving you all the state + helpers you need.
---------------------------------------------------------------------------- */
