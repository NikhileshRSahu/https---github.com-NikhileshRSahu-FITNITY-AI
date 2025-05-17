
'use client';

import { useState, useEffect } from 'react';

const FOLLOWER_SIZE = 20; // Size of the follower orb in pixels
const INITIAL_OFFSCREEN_POS = -100; // Initial position to hide before first mouse move

export default function CursorFollower() {
  const [position, setPosition] = useState({ x: INITIAL_OFFSCREEN_POS, y: INITIAL_OFFSCREEN_POS });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible]);

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate(${position.x - FOLLOWER_SIZE / 2}px, ${position.y - FOLLOWER_SIZE / 2}px)`,
        width: `${FOLLOWER_SIZE}px`,
        height: `${FOLLOWER_SIZE}px`,
        backgroundColor: 'hsl(var(--accent) / 0.3)',
        borderRadius: '50%',
        boxShadow: '0 0 12px 3px hsl(var(--accent) / 0.7), 0 0 20px 6px hsl(var(--accent) / 0.4)',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'transform 0.1s ease-out, opacity 0.2s ease-out',
        opacity: isVisible ? 1 : 0,
        willChange: 'transform', // Hint for browser optimization
      }}
    />
  );
}
