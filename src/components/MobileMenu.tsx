import { useState, useEffect, useRef } from 'react';

interface MobileMenuProps {
  show: boolean;
}

export default function MobileMenu({ show }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks outside of the menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className={`mobile-menu-container ${show ? 'visible' : ''}`}>
      {/* Dropdown Menu links list */}
      <div className={`mobile-dropdown ${isOpen ? 'open' : ''}`}>
        <a href="#about" onClick={() => setIsOpen(false)}>about</a>
        <a href="#experience" onClick={() => setIsOpen(false)}>experience</a>
        <a href="#projects" onClick={() => setIsOpen(false)}>projects</a>
        <a href="#certifications" onClick={() => setIsOpen(false)}>certifications</a>
        <a href="#skills" onClick={() => setIsOpen(false)}>skills</a>
        <a href="#achievements" onClick={() => setIsOpen(false)}>achievements</a>
        <a href="#connect" onClick={() => setIsOpen(false)}>connect</a>
      </div>

      {/* Floating Action Blob button */}
      <button 
        className={`mobile-menu-blob ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
      >
        {isOpen ? 'close' : 'nav'}
      </button>
    </div>
  );
}
