import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obj = { value: 0 };
    gsap.to(obj, {
      value: 100,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        setProgress(Math.floor(obj.value));
      },
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          y: 5,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: onComplete,
        });
      },
    });
  }, [onComplete]);

  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 10005,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'var(--sans)',
        fontSize: '13px',
        color: 'var(--text-muted)',
        pointerEvents: 'none',
      }}
    >
      <svg width="22" height="22" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="11"
          cy="11"
          r={radius}
          fill="transparent"
          stroke="var(--border)"
          strokeWidth="1.8"
        />
        <circle
          cx="11"
          cy="11"
          r={radius}
          fill="transparent"
          stroke="var(--text-h)"
          strokeWidth="1.8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.05s ease-out',
          }}
        />
      </svg>
      <span style={{ textTransform: 'lowercase', letterSpacing: '0.02em' }}>
        loading... {progress}%
      </span>
    </div>
  );
}
