import React from 'react';
import { RobotIcon } from '@/components/loading-screen';
import { OchreBackground } from '@/components/ui/background';

export interface LoadingScreenProps {
  /** A single message or a list that will cycle on each rotate */
  message?: string | string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PHASES: Array<{ duration: number; rotate?: number }> = [
  { duration: 600 }, // green
  { duration: 600 }, // yellow
  { duration: 600 }, // red
  { duration: 200, rotate: 90 }, // rotate after the red
];

// Define icon + text sizing together
const sizeClasses = {
  sm: { icon: 'h-16 w-16', text: 'text-md' },
  md: { icon: 'h-24 w-24', text: 'text-lg' },
  lg: { icon: 'h-32 w-32', text: 'text-xl' },
} as const;

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = [
    'Coordinating Data',
    'Fetching Approvals',
    'Loading Matrix',
    'Processing Views',
  ],
  size = 'lg',
  className = '',
}) => {
  const [rotation, setRotation] = React.useState(0);

  const messages = React.useMemo(() => {
    const arr = Array.isArray(message) ? message : [message];
    const cleaned = arr.map((m) => `${m}`.trim()).filter(Boolean);
    return cleaned.length ? cleaned : ['Loading...'];
  }, [message]);

  const [msgIndex, setMsgIndex] = React.useState(0);

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduceMotion) {
      setMounted(true);
      return;
    }

    const id = requestAnimationFrame(() => setMounted(true));

    let idx = 0;
    let angle = 0;
    let timer: number | null = null;

    const step = () => {
      const phase = PHASES[idx];

      if (typeof phase.rotate === 'number') {
        angle = (angle + phase.rotate) % 360;
        setRotation(angle);
        if (messages.length > 1) {
          setMsgIndex((i) => (i + 1) % messages.length);
        }
      }

      idx = (idx + 1) % PHASES.length;
      timer = window.setTimeout(step, phase.duration);
    };

    step();

    return () => {
      cancelAnimationFrame(id);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [messages.length]);

  const { icon, text } = sizeClasses[size];

  return (
    <OchreBackground>
      <div
        className={`min-h-screen flex flex-col items-center justify-center transition-opacity duration-300 ${
          mounted ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      >
        <div
          className="transition-transform duration-200 ease-out will-change-transform"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <RobotIcon className={icon} />
        </div>

        <p
          key={msgIndex}
          className={`mt-3 text-muted-foreground font-medium animate-fade-in ${text}`}
          aria-live="polite"
        >
          {messages[msgIndex]}
        </p>
      </div>
    </OchreBackground>
  );
};

export default LoadingScreen;
