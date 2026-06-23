import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function DiscoveryToast() {
  const [visible, setVisible] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show toast after 10 seconds of usage
    const timer = setTimeout(() => {
      setVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (visible && toastRef.current) {
      // Clean slide-up + spring pop entry animation using GSAP
      gsap.fromTo(
        toastRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }
      );

      // Auto close after 6 seconds
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, 6000);

      return () => clearTimeout(autoCloseTimer);
    }
  }, [visible]);

  const handleClose = () => {
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setVisible(false),
      });
    }
  };

  if (!visible) return null;

  return (
    <div ref={toastRef} className="discovery-toast" style={{ opacity: 0 }}>
      <span className="discovery-toast-text">try ctrl + k for something cool</span>
      <button
        onClick={handleClose}
        className="discovery-toast-close"
        aria-label="Dismiss toast"
      >
        ✕
      </button>
    </div>
  );
}
