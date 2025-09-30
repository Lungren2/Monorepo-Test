import * as React from 'react';

export type RobotIconProps = React.SVGProps<SVGSVGElement> & {
  /** outline | solid | auto (auto = OS theme via CSS media query) */
  surface?: 'auto' | 'solid' | 'outline';
  title?: string;
  desc?: string;
  /** Rotation in degrees around the viewBox center (654, 269) */
  rotate?: number;
  /** Stroke width in px (wired to --robot-stroke-width) */
  strokeWidth?: number;
  /** Per-instance color overrides (HSL strings recommended) */
  colors?: {
    frame?: string;
    frameStroke?: string;
    accent1?: string; // red
    accent2?: string; // green
    accent3?: string; // yellow
  };
};

const RobotIcon = React.forwardRef<SVGSVGElement, RobotIconProps>(
  (
    {
      surface = 'auto',
      title,
      desc,
      rotate = 0,
      strokeWidth = 32,
      colors,
      width = '1em',
      height = '1em',
      style,
      ...rest
    },
    ref
  ) => {
    const titleId = React.useId();
    const descId = React.useId();
    const labelledBy =
      [title ? titleId : null, desc ? descId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    const styleVars: React.CSSProperties = {
      ...(style || {}),
      ...(colors?.frame && { ['--robot-frame' as any]: colors.frame }),
      ...(colors?.frameStroke && {
        ['--robot-frame-stroke' as any]: colors.frameStroke,
      }),
      ...(colors?.accent1 && { ['--robot-accent-1' as any]: colors.accent1 }),
      ...(colors?.accent2 && { ['--robot-accent-2' as any]: colors.accent2 }),
      ...(colors?.accent3 && { ['--robot-accent-3' as any]: colors.accent3 }),
      ['--robot-stroke-width' as any]: String(strokeWidth),
    };

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1308 538"
        role="img"
        width={width}
        height={height}
        aria-labelledby={labelledBy}
        aria-hidden={labelledBy ? undefined : true}
        data-surface={surface}
        className="robot-icon transition-all duration-100 ease-in-out"
        style={styleVars}
        focusable="false"
        {...rest}
      >
        {title ? <title id={titleId}>{title}</title> : null}
        {desc ? <desc id={descId}>{desc}</desc> : null}

        <g
          className="robot-icon"
          transform={rotate ? `rotate(${rotate}, 654, 269)` : undefined}
        >
          <path
            className="frame"
            d="m269 20h770c138.1 0 250 111.9 250 250 0 138.1-111.9 250-250 250h-770c-138.1 0-250-111.9-250-250 0-138.1 111.9-250 250-250z"
          />
          <path
            className="accent-red animate-glow-red"
            d="m1024.3 107.8v-0.1c89.8 0 162.6 72.8 162.6 162.6 0 89.8-72.8 162.6-162.6 162.6-89.8 0-162.5-72.8-162.5-162.6 0-89.8 72.7-162.6 162.5-162.6z"
          />
          <path
            className="accent-green animate-glow-green"
            d="m280.3 106.8v-0.1c89.8 0 162.6 72.8 162.6 162.6 0 89.8-72.8 162.6-162.6 162.6-89.8 0-162.5-72.8-162.5-162.6 0-89.8 72.7-162.6 162.5-162.6z"
          />
          <path
            className="accent-yellow animate-glow-yellow"
            d="m653.5 104.3c91.6 0 165.8 74.3 165.8 165.8 0 91.6-74.2 165.8-165.8 165.8-91.5 0-165.8-74.2-165.8-165.8h0.1c0-91.5 74.2-165.8 165.7-165.8z"
          />
        </g>
      </svg>
    );
  }
);

RobotIcon.displayName = 'RobotIcon';
export default RobotIcon;
