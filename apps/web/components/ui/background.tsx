'use client';

import React, { useEffect, useMemo, useState } from 'react';

export function OchreBackground({ children }: { children?: React.ReactNode }) {
  const cfg = useMemo(
    () => ({
      greenOpacity: 0.15,
      yellowOpacity: 0.15,
      redOpacity: 0.15,
      dotSize: '40%',
    }),
    []
  );

  const [spots, setSpots] = useState({
    g: { x: 20, y: 30 },
    y: { x: 80, y: 40 },
    r: { x: 50, y: 70 },
  });

  useEffect(() => {
    const rand = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    setSpots({
      g: { x: rand(10, 30), y: rand(20, 40) },
      y: { x: rand(70, 90), y: rand(30, 50) },
      r: { x: rand(40, 60), y: rand(60, 80) },
    });
  }, []);

  const styleVars: React.CSSProperties = {
    '--wf-green-opacity': cfg.greenOpacity,
    '--wf-yellow-opacity': cfg.yellowOpacity,
    '--wf-red-opacity': cfg.redOpacity,
    '--wf-dot-size': cfg.dotSize,
  } as React.CSSProperties;

  const backgroundImage = `
    radial-gradient(circle at ${spots.g.x}% ${spots.g.y}%, hsl(var(--wf-green) / var(--wf-green-opacity)) 0%, transparent var(--wf-dot-size)),
    radial-gradient(circle at ${spots.y.x}% ${spots.y.y}%, hsl(var(--wf-yellow) / var(--wf-yellow-opacity)) 0%, transparent var(--wf-dot-size)),
    radial-gradient(circle at ${spots.r.x}% ${spots.r.y}%, hsl(var(--wf-red) / var(--wf-red-opacity)) 0%, transparent var(--wf-dot-size))
  `;

  return (
    <div style={styleVars} className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          backgroundColor: 'hsl(var(--wf-bg))',
          backgroundImage,
        }}
        aria-hidden
      />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {children}
      </div>
    </div>
  );
}
