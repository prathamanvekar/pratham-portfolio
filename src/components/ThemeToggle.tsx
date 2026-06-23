import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  const containerRef = useRef<HTMLLabelElement>(null);

  // Mount entry animation for a cute pop-in effect
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', delay: 0.15 }
      );
    }
  }, []);

  return (
    <label
      ref={containerRef}
      className="switch"
      style={{ opacity: 0 }}
      title={`switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <input
        type="checkbox"
        checked={theme === 'dark'}
        onChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <span className="slider"></span>
    </label>
  );
}
