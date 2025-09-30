import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export type WinningFormBadgeProps = {
  phrases?: string[];
  intervalMs?: number;
  href?: string;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export default function WinningFormBadge({
  phrases = ['Created', 'Designed', 'Powered'],
  intervalMs = 3800,
  href,
  compact = false,
  className,
  style,
  title,
}: WinningFormBadgeProps) {
  const shouldReduce = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const phrase = phrases[index % phrases.length];

  React.useEffect(() => {
    if (shouldReduce || phrases.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % phrases.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [intervalMs, phrases.length, shouldReduce]);

  const Wrapper: React.ElementType = href ? 'a' : 'div';
  const pad = compact ? 'px-2.5 py-1' : 'px-3.5 py-1.5';
  const textSize = compact ? 'text-body-xs' : 'text-body-sm';
  const logoHeight = compact ? 18 : 24;

  return (
    <Wrapper
      href={href}
      className={[
        'inline-flex items-center gap-2 rounded-full justify-center',
        'border border-wf-border bg-wf-card text-wf-fg',
        'select-none no-underline',
        pad,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      title={title}
    >
      <span className={['inline-flex items-center gap-1 ', textSize].join(' ')}>
        <AnimatePresence mode="wait" initial={false}>
          {shouldReduce ? (
            <span key={phrase}>{phrase}</span>
          ) : (
            <motion.span
              key={phrase}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              {phrase}
            </motion.span>
          )}
        </AnimatePresence>
        <span className="opacity-70">by</span>
      </span>
      <WinningFormLogo
        aria-hidden="true"
        height={logoHeight}
        className="shrink-0 -ml-1.5"
      />
    </Wrapper>
  );
}

export function WinningFormLogo(
  props: React.SVGProps<SVGSVGElement> & { title?: string }
) {
  const { title, ...rest } = props;
  const titleId = React.useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 454.53 128.56"
      role={title ? 'img' : 'presentation'}
      aria-labelledby={title ? titleId : undefined}
      fill="currentColor"
      stroke="none"
      {...rest}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <g>
        <path
          fillRule="evenodd"
          d="m400.9 108.8l2.5 11h3.3l-5.4-23.1-6.3 13.9c-0.4 0.8-0.9 1.8-1.3 3.1q-0.9-2.5-1.2-3.1l-6.6-13.9-5.2 23.1h3.3l2.4-11q0.3-1.4 0.4-3 0.4 1.4 1.1 2.8l5.8 12.1 5.8-11.9c0.5-1 0.8-2 1-3 0.2 1.6 0.3 2.6 0.4 3zm-43.9 1h0.4l7.4 10h4.1l-7.6-10.1c3.3-0.4 5-2.4 5-6 0-2.1-0.8-3.8-2.1-4.9-1.4-1-3.1-1.2-5.5-1.2h-5v22.2h3.3zm0.3-2.8v-6.4h0.6c3.2 0 4.7 0.6 4.7 3.3 0 2.7-1.5 3.1-4.7 3.1zm-19.5 1.6c0-3.1-1.2-6-3.5-8.2-2.3-2.2-5.2-3.4-8.4-3.4-3.2 0-6.1 1.2-8.4 3.4-2.2 2.2-3.4 5.1-3.4 8.2 0 3.2 1.2 6.1 3.4 8.3 2.2 2.2 5.3 3.4 8.4 3.4 3.2 0 6.1-1.2 8.4-3.4 2.3-2.2 3.5-5.1 3.5-8.3zm-3.8 0c0 2.3-0.8 4.3-2.4 5.9-1.5 1.6-3.5 2.4-5.7 2.4-2.1 0-4.2-0.8-5.7-2.4-1.6-1.6-2.4-3.6-2.4-5.9 0-2.2 0.8-4.3 2.4-5.9 1.5-1.5 3.6-2.4 5.7-2.4 2.2 0 4.2 0.9 5.7 2.4 1.6 1.6 2.4 3.7 2.4 5.9zm-47.1 11.1h3.7v-10.4h8.7v-3.2h-8.7v-5.5h8.7v-3.1h-12.4zm-33.8-11.3v3h5.4v0.3c0 3.3-2.5 5.4-6.7 5.4-4.8 0-8.1-3.4-8.1-8.5 0-4.9 3.4-8.3 8.1-8.3 2.3 0 4.2 0.9 5.7 2.6l2.6-2c-2.1-2.6-4.8-3.9-8.3-3.9-3.4 0-6.3 1.2-8.5 3.3-2.2 2.2-3.4 5-3.4 8.4 0 3.3 1.2 6.2 3.3 8.4 2.1 2.2 4.9 3.2 8.6 3.2 6.4 0 10.2-3.6 10.2-9.9q0-0.7-0.1-2zm-48.9 11.3h3.3v-15.4q0.9 1.3 2.1 2.5l14.4 13.8v-23.1h-3.3v15.4c-0.8-0.9-1.6-1.8-2.5-2.7l-14-13.5zm-20.6 0h3.6v-22.2h-3.6zm-36.8 0h3.3v-15.4q0.9 1.3 2.1 2.5l14.4 13.8v-23.1h-3.3v15.4c-0.8-0.9-1.5-1.8-2.4-2.7l-14.1-13.5zm-36.7 0h3.3v-15.5q0.9 1.4 2.1 2.5l14.4 13.8v-23h-3.3v15.4c-0.8-1-1.6-1.9-2.5-2.7l-14-13.6zm-20.6 0h3.6v-22.1h-3.6zm-43.6-22.2l8.5 23 5-12.6q0.6-1.5 1-3.1c0.3 0.9 0.7 2 1.1 3.1l5.1 12.6 8.6-23h-3.6l-4.2 11.3c-0.4 1.2-0.8 2.4-1.1 3.4q-0.5-1.9-1.2-3.5l-4.6-12.1-4.5 11.8c-0.1 0.4-0.6 1.6-1.2 3.8q-0.5-1.8-1.2-3.5l-4.2-11.2h-3.5z"
        />
        <path
          fillRule="evenodd"
          d="m25.8 47.5c0 0 21.8 14.9 43.6 9.7 21.7-5.2 45.6-13.8 62.6-7.6 17.1 6.2 27.2 16.1 43.2 23.8 16 7.6 22.2 7.2 31.4 5.4 18.8-3.6 22-8.5 21.1-14.8 0 0-20.4-2.5-28.7-16.5-8.3-13.9 8.3-26.6 31.8-26.9 23.5-0.2 33.9 3.6 35.9 4.4 0.7-6 3.2-17.5 16.2-17.1 10.5 0.4 13 13.5 13.5 18.6 1.5 0.4 4.6 1.4 7.5 4.5-6.1 0-9.1-0.9-10.8 3.3-1.6 4.3-0.4 2.7-1.4 3.5-1 0.8-2.1 0.8-2.3 2-0.1 1.3-1.5 5.3-6.6 5.7-5.1 0.4-6.6-2-12 0.6-5.4 2.7-5.3 14 8.9 23 10-10.1 24.9-22.1 38.6-25.2 13.8-3.1 13.6-1.8 22.7-8-2.5-9.9 2.8-12.1 3.4-14.6 3.1 3.9 14.2 12.5 15.3 15.5 14.3 0.2 14.1-0.9 69.1 38.1-14.2-7.1-52.1-32-65.5-33.4-4.6-0.5-7.4-0.6-9-0.6-5.6-0.1 2.1 0.2-2.5-5.4-2.9-3.4-4.9-6.5-6.9-9.5-2.8 3-1 10.3-1 10.3 0 0-8.4 9.9-21.8 14.6-13.5 4.6-23.5 7.8-28 10.7-4.5 3-13.9 10.2-13.9 10.2 0 0-24.1-8.4-17-25.9 2.6-6.6 15.8-2.8 17.5-3.2 1.7-0.3 3.4 1.3 5.4-4.3 2.1-5.6 3.3-2.2 4.4-5.3 1.1-3.2 5.3-2.8 3.9-6-1.4-3.3-2-12.8-13.2-13.1-11.3-0.3-12 12.8-12.7 13.6-31-7.4-48.8-1.3-48.8-1.3 0 0-23.9 6.2-12.8 24.6 4.4 7.2 23.2 11.1 23.2 11.1 0 0 11.1 20.7-22.2 20.9-33.3 0.2-59.5-20.5-73.5-24.1-13.9-3.6-17.3-7.5-52.4 1.4-35.3 8.9-56.2-12.7-56.2-12.7z"
        />
      </g>
    </svg>
  );
}
