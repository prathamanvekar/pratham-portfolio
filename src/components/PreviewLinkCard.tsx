import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

interface PreviewLinkCardContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  followCursor: boolean | 'x' | 'y';
  triggerRef: React.RefObject<HTMLAnchorElement | null>;
  mousePos: { x: number; y: number };
  setMousePos: (pos: { x: number; y: number }) => void;
  href?: string;
}

const PreviewLinkCardContext = createContext<PreviewLinkCardContextType | null>(null);

export interface PreviewLinkCardProps {
  children: React.ReactNode;
  href?: string;
  followCursor?: boolean | 'x' | 'y';
}

export function PreviewLinkCard({ children, href, followCursor = true }: PreviewLinkCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLAnchorElement | null>(null);

  return (
    <PreviewLinkCardContext.Provider
      value={{
        isOpen,
        setIsOpen,
        followCursor,
        triggerRef,
        mousePos,
        setMousePos,
        href,
      }}
    >
      {children}
    </PreviewLinkCardContext.Provider>
  );
}

export interface PreviewLinkCardTriggerProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export function PreviewLinkCardTrigger({ children, className, ...props }: PreviewLinkCardTriggerProps) {
  const context = useContext(PreviewLinkCardContext);
  if (!context) return <>{children}</>;

  const handleMouseEnter = (e: React.MouseEvent) => {
    context.setMousePos({ x: e.clientX, y: e.clientY });
    context.setIsOpen(true);
  };

  const handleMouseLeave = () => {
    context.setIsOpen(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    context.setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <a
      href={context.href || '#'}
      ref={context.triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className={className}
      {...props}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        ...props.style,
      }}
    >
      {children}
    </a>
  );
}

export interface PreviewLinkCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
}

export function PreviewLinkCardContent({
  children,
  className,
  side = 'top',
  sideOffset = 15,
  align = 'center',
  alignOffset = 0,
  ...props
}: PreviewLinkCardContentProps) {
  const context = useContext(PreviewLinkCardContext);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const animatedPos = useRef({ x: 0, y: 0 });
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  const isOpen = context?.isOpen ?? false;
  const followCursor = context?.followCursor ?? true;
  const mousePos = context?.mousePos ?? { x: 0, y: 0 };

  // Sync positions smoothly when open
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const el = contentRef.current;
    
    // Position instantly to start coords
    let startX = 0;
    let startY = 0;

    if (followCursor) {
      startX = mousePos.x;
      startY = mousePos.y;
    } else if (context?.triggerRef.current) {
      const rect = context.triggerRef.current.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top;
    }

    animatedPos.current = { x: startX, y: startY };
    gsap.set(el, {
      left: startX,
      top: startY,
      opacity: 0,
      scale: 0.85,
    });

    // Fade and scale in
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration: 0.2,
      ease: 'power2.out',
    });
  }, [isOpen]);

  // Track cursor movement or trigger bounding box with damping
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const el = contentRef.current;
    let targetX = 0;
    let targetY = 0;

    if (followCursor) {
      targetX = mousePos.x;
      targetY = mousePos.y;
    } else if (context?.triggerRef.current) {
      const rect = context.triggerRef.current.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top;
    }

    gsap.to(animatedPos.current, {
      x: targetX,
      y: targetY,
      duration: 0.25,
      ease: 'power2.out',
      onUpdate: () => {
        if (el) {
          gsap.set(el, {
            left: animatedPos.current.x,
            top: animatedPos.current.y,
          });
        }
      },
    });
  }, [mousePos, isOpen, followCursor]);

  if (!isOpen || !portalTarget) return null;

  const isBottom = side === 'bottom';
  const transformString = isBottom
    ? `translate(-50%, ${sideOffset}px)`
    : `translate(-50%, calc(-100% - ${sideOffset}px))`;

  // Render using portal
  return createPortal(
    <div
      ref={contentRef}
      className={`preview-link-card-content ${className || ''}`}
      {...props}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        // translate based on side option
        transform: transformString,
        zIndex: 10000,
        width: '180px',
        height: '180px',
        backgroundColor: 'var(--bg)',
        border: '1px solid var(--text-h)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        borderRadius: '6px',
        overflow: 'hidden',
        ...props.style,
      }}
    >
      {children}
    </div>,
    portalTarget
  );
}

export interface PreviewLinkCardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
  src?: string;
}

export function PreviewLinkCardImage({ alt, src, className, ...props }: PreviewLinkCardImageProps) {
  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      {...props}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        ...props.style,
      }}
    />
  );
}
