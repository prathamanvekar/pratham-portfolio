import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  snippet?: string;
  action: 'cli' | 'help' | 'scroll' | 'scroll-element' | 'theme';
  element?: HTMLElement;
}

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean | ((prev: boolean) => boolean)) => void;
  editorTheme: string;
  setEditorTheme: (theme: string | ((prev: string) => string)) => void;
}

export default function CommandPalette({ isOpen, setIsOpen, editorTheme, setEditorTheme }: CommandPaletteProps) {
  const [mode, setMode] = useState<'menu' | 'terminal'>('menu');
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // Terminal States
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "welcome to prathamesh's shell. type 'help' for options.",
  ]);
  const [termInput, setTermInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const termInputRef = useRef<HTMLInputElement>(null);
  const termEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Initial portal binding
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // Keyboard navigation item auto-scroll
  useEffect(() => {
    if (mode === 'menu' && isOpen && listRef.current) {
      const activeEl = listRef.current.querySelector('.cmd-item.active');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, mode, isOpen]);

  // Shortcut binding: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [setIsOpen]);

  // Set focus, reset modes, and animate overlay
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setMode('menu');
      setSearch('');
      setActiveIndex(0);

      // Simple GSAP spring animation on modal entrance
      if (backdropRef.current && modalRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'power2.out' }
        );
        gsap.fromTo(
          modalRef.current,
          { scale: 0.9, y: -20, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.2)' }
        );
      }

      // Small timeout to guarantee DOM is rendered before focusing
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Scroll terminal to bottom on outputs
  useEffect(() => {
    if (mode === 'terminal') {
      termEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLines, mode]);

  // Preloaded static actions
  const preloadedItems: CommandItem[] = useMemo(() => [
    { id: 'cli', label: 'cli', description: 'open interactive command line shell', action: 'cli' },
    { id: 'help', label: 'help', description: 'show keyboard navigation shortcuts', action: 'help' },
    { id: 'theme', label: 'theme', description: 'cycle developer code-editor themes (gruvbox, tokyonight, nord, dracula)', action: 'theme' },
    { id: 'about', label: 'about', description: 'jump to about details', action: 'scroll' },
    { id: 'experience', label: 'experience', description: 'jump to work experience', action: 'scroll' },
    { id: 'projects', label: 'projects', description: 'jump to project showcase', action: 'scroll' },
    { id: 'certifications', label: 'certifications', description: 'jump to certifications', action: 'scroll' },
    { id: 'skills', label: 'skills', description: 'jump to technical skills', action: 'scroll' },
    { id: 'achievements', label: 'achievements', description: 'jump to awards & achievements', action: 'scroll' },
    { id: 'connect', label: 'connect', description: 'jump to contact information', action: 'scroll' },
  ], []);

  // Live DOM full text search query scanner
  const searchDOMResults = (query: string): CommandItem[] => {
    if (!query || query.trim().length < 2) return [];
    const q = query.toLowerCase().trim();
    const results: CommandItem[] = [];

    // Traverse visible text tags on portfolio
    const elements = document.querySelectorAll(
      'section p, section .project-title, section .project-description, section .work-role, section .work-company, section .achievement-title, section .certification-title, section .skill-tag'
    );

    elements.forEach((el, idx) => {
      const htmlEl = el as HTMLElement;
      const text = htmlEl.innerText || htmlEl.textContent || '';
      const lowerText = text.toLowerCase();
      const matchIdx = lowerText.indexOf(q);

      if (matchIdx !== -1) {
        // Construct visual text snippet around matched term
        const start = Math.max(0, matchIdx - 15);
        const end = Math.min(text.length, matchIdx + q.length + 25);
        let snippet = text.slice(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';

        const parentSection = htmlEl.closest('section, header') || htmlEl;
        const sectionName = parentSection.id || 'portfolio';

        results.push({
          id: `dom-search-${idx}`,
          label: `find in "${sectionName}"`,
          description: `match: "${q}"`,
          snippet: snippet.trim(),
          action: 'scroll-element',
          element: htmlEl,
        });
      }
    });

    return results.slice(0, 10);
  };

  // Compile matching entries list
  const filteredResults = useMemo(() => {
    if (!search.trim()) return preloadedItems;

    const query = search.toLowerCase().trim();
    const staticMatches = preloadedItems.filter(
      item => item.label.includes(query) || item.description.includes(query)
    );
    const liveMatches = searchDOMResults(search);

    return [...staticMatches, ...liveMatches];
  }, [search, preloadedItems]);

  // Keep selection bounds normalized
  useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  // Close animation wrapper
  const closePalette = () => {
    if (backdropRef.current && modalRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.95,
        y: -15,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setIsOpen(false);
          setMode('menu');
        },
      });
    } else {
      setIsOpen(false);
      setMode('menu');
    }
  };

  // Handle item actions
  const handleSelect = (item: CommandItem) => {
    if (item.action === 'cli') {
      setMode('terminal');
      setTimeout(() => termInputRef.current?.focus(), 50);
    } else if (item.action === 'help') {
      setTerminalLines([
        "help manual",
        "-----------",
        "[↑ / ↓] or [ctrl+j / ctrl+k] - navigate list",
        "[j / k] - navigate list when search box is empty",
        "[enter] - select active item",
        "[esc] - close palette overlay",
        "",
        "commands manual",
        "---------------",
        "typing 'cli' takes you to a terminal shell.",
        "type [tab] inside terminal to autocomplete commands.",
        "type 'theme [skin]' to change theme directly.",
        "type a non-matching text to invoke instant page-content search."
      ]);
      setMode('terminal');
    } else if (item.action === 'theme') {
      const skins = ['default', 'gruvbox', 'tokyonight', 'nord', 'dracula'];
      const nextTheme = skins[(skins.indexOf(editorTheme) + 1) % skins.length];
      setEditorTheme(nextTheme);
      closePalette();
    } else if (item.action === 'scroll') {
      const section = document.getElementById(item.id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
      closePalette();
    } else if (item.action === 'scroll-element') {
      if (item.element) {
        item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the matched item briefly
        const originalBg = item.element.style.backgroundColor;
        const originalTransition = item.element.style.transition;
        item.element.style.transition = 'background-color 0.2s ease';
        item.element.style.backgroundColor = 'rgba(255, 221, 0, 0.3)';
        setTimeout(() => {
          if (item.element) {
            item.element.style.backgroundColor = originalBg;
            setTimeout(() => {
              if (item.element) item.element.style.transition = originalTransition;
            }, 200);
          }
        }, 1200);
      }
      closePalette();
    }
  };

  // Handle modal list navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const itemsLength = filteredResults.length;

    if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'j') || (search === '' && e.key === 'j')) {
      e.preventDefault();
      if (itemsLength > 0) {
        setActiveIndex(prev => (prev + 1) % itemsLength);
      }
    } else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'k') || (search === '' && e.key === 'k')) {
      e.preventDefault();
      if (itemsLength > 0) {
        setActiveIndex(prev => (prev - 1 + itemsLength) % itemsLength);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (itemsLength > 0 && filteredResults[activeIndex]) {
        handleSelect(filteredResults[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    }
  };

  // CLI Command processor
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmdStr = termInput.trim();
    if (!cmdStr) return;

    const lines = [...terminalLines, `guest@portfolio:~$ ${cmdStr}`];
    setCommandHistory(prev => [cmdStr, ...prev.filter(c => c !== cmdStr)]);
    setHistoryIndex(-1);
    setTermInput('');

    const tokens = cmdStr.split(' ');
    const cmd = tokens[0].toLowerCase();

    if (cmd === 'clear') {
      setTerminalLines([]);
      return;
    }

    if (cmd === 'exit' || cmd === ':q') {
      setMode('menu');
      setSearch('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      return;
    }

    let output = '';
    switch (cmd) {
      case 'help':
        output = `available commands:
  ls       - list codebase directories
  pwd      - show current path
  neofetch - print system information
  nvim     - start neovim text editor
  theme    - cycle or set editor theme (e.g., 'theme gruvbox')
  clear    - clear screen outputs
  exit     - exit shell (or type :q)`;
        break;
      case 'neofetch':
        output = `      /\\\\          guest@portfolio
     /  \\\\         ---------------
    /\\\\  /\\\\        os: arch linux btw
   /  \\\\/  \\\\       shell: zsh
  /   ||   \\\\      editor: neovim
  /    ||    \\\\     theme: ${editorTheme === 'default' ? 'neobrutalist' : editorTheme}
/____/\\\\____/\\\\    status: looking for backend roles`;
        break;
      case 'ls':
        output = `src/     public/     eslint.config.js     index.html
package.json     vite.config.ts     tsconfig.json     README.md`;
        break;
      case 'pwd':
        output = `under ur desk`;
        break;
      case 'nvim':
      case 'neovim':
        output = `already running neovim btw... type :q to exit this terminal`;
        break;
      case 'theme':
        const skins = ['default', 'gruvbox', 'tokyonight', 'nord', 'dracula'];
        if (tokens.length === 1) {
          const nextTheme = skins[(skins.indexOf(editorTheme) + 1) % skins.length];
          setEditorTheme(nextTheme);
          output = `cycled editor theme to: ${nextTheme}`;
        } else {
          const targetSkin = tokens[1].toLowerCase();
          let matchedTheme = '';
          if (targetSkin === 'default') matchedTheme = 'default';
          else if (targetSkin === 'gruvbox') matchedTheme = 'gruvbox';
          else if (targetSkin === 'tokyo' || targetSkin === 'tokyonight') matchedTheme = 'tokyonight';
          else if (targetSkin === 'nord') matchedTheme = 'nord';
          else if (targetSkin === 'dracula') matchedTheme = 'dracula';

          if (matchedTheme) {
            setEditorTheme(matchedTheme);
            output = `set editor theme to: ${matchedTheme}`;
          } else {
            output = `unknown theme skin: ${targetSkin}. available: default, gruvbox, tokyo, nord, dracula`;
          }
        }
        break;
      default:
        output = `shell: command not found: ${cmd}. type 'help' for options.`;
    }

    setTerminalLines([...lines, output]);
  };

  // Command input history recall
  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const val = termInput.trim().toLowerCase();
      if (val) {
        const matches = ['ls', 'pwd', 'clear', 'nvim', 'exit', 'neofetch', 'theme'].filter(c => c.startsWith(val));
        if (matches.length === 1) {
          setTermInput(matches[0]);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < commandHistory.length) {
          setHistoryIndex(nextIdx);
          setTermInput(commandHistory[nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = historyIndex - 1;
      if (nextIdx >= 0) {
        setHistoryIndex(nextIdx);
        setTermInput(commandHistory[nextIdx]);
      } else {
        setHistoryIndex(-1);
        setTermInput('');
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    }
  };

  if (!isOpen || !portalTarget) return null;

  return createPortal(
    <div
      ref={backdropRef}
      className="cmd-backdrop"
      onClick={(e) => e.target === backdropRef.current && closePalette()}
    >
      <div ref={modalRef} className="cmd-modal" style={{ opacity: 0 }}>
        {mode === 'menu' ? (
          <>
            <div className="cmd-input-container">
              <span className="cmd-prompt-char">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                className="cmd-input"
                placeholder="type a command, section, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={40}
              />
            </div>

            <div ref={listRef} className="cmd-list">
              {filteredResults.length > 0 ? (
                filteredResults.map((item, idx) => (
                  <button
                    key={item.id}
                    className={`cmd-item ${idx === activeIndex ? 'active' : ''}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <span>
                      {item.label}
                      <span className="cmd-item-desc"> — {item.description}</span>
                    </span>
                    {item.snippet && (
                      <span className="cmd-search-snippet">{item.snippet}</span>
                    )}
                  </button>
                ))
              ) : (
                <div style={{ padding: '20px 18px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  no matches found for "{search}"
                </div>
              )}
            </div>

            <div className="cmd-footer">
              <span>[↑↓ / jk] navigate  ·  [enter] select</span>
              <span>[esc] close</span>
            </div>
          </>
        ) : (
          <div className="cmd-terminal">
            <div className="cmd-term-history">
              {terminalLines.map((line, idx) => (
                <div key={idx} className="cmd-term-line">
                  {line}
                </div>
              ))}
              <div ref={termEndRef} />
            </div>

            <form onSubmit={handleTerminalSubmit} className="cmd-term-input-row">
              <span className="cmd-term-prompt">guest@portfolio:~$</span>
              <input
                ref={termInputRef}
                type="text"
                className="cmd-term-input"
                value={termInput}
                onChange={(e) => setTermInput(e.target.value)}
                onKeyDown={handleTerminalKeyDown}
                autoFocus
                maxLength={50}
              />
            </form>
          </div>
        )}
      </div>
    </div>,
    portalTarget
  );
}
