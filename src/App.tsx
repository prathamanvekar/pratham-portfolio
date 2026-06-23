import React, { useState, useRef, useEffect } from 'react'
import TextType from './components/TextType'
import ClickSpark from './components/ClickSpark'
import ibmCert from './assets/ibm full stack developer.pdf'
import resumePdf from './assets/resume.pdf'
import megumiImg from './assets/megumi.jpg'
import MobileMenu from './components/MobileMenu'
import ThemeToggle from './components/ThemeToggle'
import CommandPalette from './components/CommandPalette'
import DiscoveryToast from './components/DiscoveryToast'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  PreviewLinkCard,
  PreviewLinkCardTrigger,
  PreviewLinkCardContent,
  PreviewLinkCardImage,
} from './components/PreviewLinkCard'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  id: string;
  title: string;
  description: React.ReactNode;
  tech: string;
  github: string;
  categories: ('featured' | 'systems/c' | 'go' | 'ai/ml' | 'web')[];
  diagram: React.ReactNode;
}

const PROJECTS: Project[] = [
  {
    id: 'linux-sandbox',
    title: 'linux process isolation engine',
    description: (
      <>
        built a policy-driven c <span className="highlight-term">sandboxing engine</span> using <span className="highlight-term">seccomp-bpf</span> filters to enforce kernel-level syscall restrictions, secure process execution via fork/exec, and log runtime violations with low overhead.
      </>
    ),
    tech: 'c | seccomp-bpf | linux kernel',
    github: 'https://github.com/prathamanvekar/kernel-sandbox',
    categories: ['featured', 'systems/c'],
    diagram: (
      <div className="diagram-body">
        <div><span className="diagram-node">[process]</span> ➔ [fork/exec] ➔ <span className="diagram-node">[sandbox]</span></div>
        <div>{"             │"}</div>
        <div>{"             ▼"}</div>
        <div>{"       [seccomp-bpf]"}</div>
        <div>{"        ├── (block) ──► [violation log]"}</div>
        <div>{"        └── (allow) ──► [linux kernel]"}</div>
      </div>
    )
  },
  {
    id: 'aegis',
    title: 'secure llm proxy server',
    description: (
      <>
        architected a security-first fastapi gateway that secures rag workflows and local <span className="highlight-term">quantized gemma 3</span> inference using a <span className="highlight-term">threat detection pipeline</span> to sanitize pii, block prompt injections, and log telemetry.
      </>
    ),
    tech: 'fastapi | python | gemma 3 | react',
    github: 'https://github.com/prathamanvekar/aegis',
    categories: ['featured', 'ai/ml', 'web'],
    diagram: (
      <div className="diagram-body">
        <div><span className="diagram-node">[user query]</span></div>
        <div>{"      │"}</div>
        <div>{"      ▼"}</div>
        <div><span className="diagram-node">[threat detection]</span> ──► (sanitize PII)</div>
        <div>{"      │"}</div>
        <div>{"      ▼"}</div>
        <div><span className="diagram-node">[gemma 3 model]</span> ──► (local LLM)</div>
        <div>{"      │"}</div>
        <div>{"      ▼"}</div>
        <div><span className="diagram-node">[filtered response]</span></div>
      </div>
    )
  },
  {
    id: 'gator',
    title: 'gator',
    description: (
      <>
        built a concurrent command-line rss feed aggregator to fetch and parse xml feeds, managing user subscriptions and utilizing <span className="highlight-term">sqlc</span> for type-safe <span className="go-text">go</span> and <span className="highlight-term">postgresql</span> database queries.
      </>
    ),
    tech: 'go | postgresql | sqlc',
    github: 'https://github.com/prathamanvekar/gator',
    categories: ['go'],
    diagram: (
      <div className="diagram-body">
        <div><span className="diagram-node">[cli command]</span></div>
        <div>{"      │"}</div>
        <div>{"      ▼"}</div>
        <div><span className="diagram-node">[fetchers]</span> ➔ [xml rss parser]</div>
        <div>{"                   │ (sqlc)"}</div>
        <div>{"                   ▼"}</div>
        <div>{"             [postgresql]"}</div>
      </div>
    )
  },
  {
    id: 'jobs-cli',
    title: 'jobs alert cli',
    description: (
      <>
        developed a terminal-based <span className="go-text">go</span> application with <span className="highlight-term">secure authentication</span> to seamlessly track, retrieve, and alert users of new job postings directly from the command line.
      </>
    ),
    tech: 'go | cli',
    github: 'https://github.com/prathamanvekar/jobs-alert-cli',
    categories: ['go'],
    diagram: (
      <div className="diagram-body">
        <div><span className="diagram-node">[job sources]</span></div>
        <div>{"      │"}</div>
        <div>{"      ▼"}</div>
        <div><span className="diagram-node">[cli scraper]</span> ➔ [auth check]</div>
        <div>{"                     │"}</div>
        <div>{"                     ▼"}</div>
        <div>{"           [stdout / email alerts]"}</div>
      </div>
    )
  },
  {
    id: 'agri-insurance',
    title: 'agri-insurance dapp',
    description: (
      <>
        architected a decentralized crop insurance platform integrating <span className="highlight-term">solidity smart contracts</span> with a python backend, utilizing random forest and <span className="highlight-term">xgboost models</span> to assess weather risks and automate claim settlements.
      </>
    ),
    tech: 'solidity | python | scikit-learn | javascript',
    github: 'https://github.com/prathamanvekar/agri-insurance-dapp-blockchain',
    categories: ['ai/ml', 'web'],
    diagram: (
      <div className="diagram-body">
        <div><span className="diagram-node">[weather metrics]</span> ➔ [random forest]</div>
        <div>{"                        │"}</div>
        <div>{"                        ▼"}</div>
        <div>{"                [risk assessment]"}</div>
        <div>{"                        │ (solidity trigger)"}</div>
        <div>{"                        ▼"}</div>
        <div>{"               [claim auto payout]"}</div>
      </div>
    )
  },
  {
    id: 'cyberbullying-ai',
    title: 'real-time cyberbullying ai',
    description: (
      <>
        engineered a real-time chat application incorporating a custom <span className="highlight-term">decision engine</span> to instantly monitor, classify, and filter toxic messages using <span className="highlight-term">machine learning</span>.
      </>
    ),
    tech: 'python | flask | javascript | sqlite',
    github: 'https://github.com/prathamanvekar/cyberbul-realtime-ai',
    categories: ['ai/ml', 'web'],
    diagram: (
      <div className="diagram-body">
        <div><span className="diagram-node">[chat message]</span></div>
        <div>{"      │"}</div>
        <div>{"      ▼"}</div>
        <div><span className="diagram-node">[decision engine]</span> ➔ [toxic classifier]</div>
        <div>{"                                │"}</div>
        <div>{"                                ▼"}</div>
        <div>{"                       [live block/censor]"}</div>
      </div>
    )
  },
  {
    id: 'cyber-ids',
    title: 'cyber threat intelligence ids',
    description: (
      <>
        built an intrusion detection system leveraging <span className="highlight-term">isolation forest</span> and voting classifier ensemble models to identify network anomalies and classify <span className="highlight-term">cyber threats</span>.
      </>
    ),
    tech: 'python | machine learning | sqlite',
    github: 'https://github.com/prathamanvekar/cyber-threat-intelligence-detection-system-ids',
    categories: ['ai/ml'],
    diagram: (
      <div className="diagram-body">
        <div><span className="diagram-node">[network packets]</span></div>
        <div>{"      │"}</div>
        <div>{"      ▼"}</div>
        <div><span className="diagram-node">[isolation forest]</span> ➔ [anomaly detect]</div>
        <div>{"                                 │"}</div>
        <div>{"                                 ▼"}</div>
        <div>{"                       [telemetry dashboard]"}</div>
      </div>
    )
  },
  {
    id: 'static-gen',
    title: 'static site generator',
    description: (
      <>
        developed a custom <span className="highlight-term">markdown-to-html</span> conversion engine that parses inline and block markdown nodes to automatically generate fully formatted <span className="highlight-term">static websites</span>.
      </>
    ),
    tech: 'python | markdown | html',
    github: 'https://github.com/prathamanvekar/static-site-gen',
    categories: ['web'],
    diagram: (
      <div className="diagram-body">
        <div><span className="diagram-node">[markdown source]</span></div>
        <div>{"      │"}</div>
        <div>{"      ▼"}</div>
        <div><span className="diagram-node">[ast block parser]</span> ➔ [html compiler]</div>
        <div>{"                                 │"}</div>
        <div>{"                                 ▼"}</div>
        <div>{"                        [static html pages]"}</div>
      </div>
    )
  },
  {
    id: 'medical-vision',
    title: 'ai medical vision bot',
    description: (
      <>
        developed a multimodal ai medical chatbot that analyzes patient medical images and responds to real-time voice queries using <span className="highlight-term">elevenlabs audio synthesis</span> and a <span className="highlight-term">gradio interface</span>.
      </>
    ),
    tech: 'python | gradio | vision ai | elevenlabs',
    github: 'https://github.com/prathamanvekar/ai-medical-vision-bot',
    categories: ['ai/ml'],
    diagram: (
      <div className="diagram-body">
        <div><span className="diagram-node">[medical scan]</span> ➔ [vision fine-tuned LLM]</div>
        <div>{"                             │"}</div>
        <div>{"                             ▼"}</div>
        <div>{"                    [elevenlabs audio]"}</div>
        <div>{"                             │ (gradio output)"}</div>
        <div>{"                             ▼"}</div>
        <div>{"                     [voice response]"}</div>
      </div>
    )
  },
  {
    id: 'facial-recog',
    title: 'real-time facial recognition system',
    description: (
      <>
        built a webcam-validated python and <span className="highlight-term">opencv</span> facial recognition system featuring automated <span className="highlight-term">dataset management</span>, image preprocessing, and time-stamped training versioning using haar cascades and lbph.
      </>
    ),
    tech: 'python | opencv | haar cascades | lbph',
    github: 'https://github.com/prathamanvekar/image-personalizer',
    categories: ['ai/ml'],
    diagram: (
      <div className="diagram-body">
        <div><span className="diagram-node">[webcam frame]</span> ➔ [opencv grayscaling]</div>
        <div>{"                           │"}</div>
        <div>{"                           ▼"}</div>
        <div>{"                 [haar cascades check]"}</div>
        <div>{"                           │"}</div>
        <div>{"                           ▼"}</div>
        <div>{"                  [lbph recognition]"}</div>
        <div>{"                           │ (timestamp logger)"}</div>
        <div>{"                           ▼"}</div>
        <div>{"                    [access log db]"}</div>
      </div>
    )
  },
  {
    id: 'video-app',
    title: 'video upload and streaming platform',
    description: (
      <>
        developed a responsive next.js and mongodb video hosting platform featuring <span className="highlight-term">nextauth</span> authentication and a seamless background <span className="highlight-term">video upload pipeline</span> directly to imagekit on file selection.
      </>
    ),
    tech: 'next.js | mongodb | nextauth | imagekit',
    github: 'https://github.com/prathamanvekar/video-app',
    categories: ['featured', 'web'],
    diagram: (
      <div className="diagram-body">
        <div><span className="diagram-node">[video file]</span></div>
        <div>{"      │"}</div>
        <div>{"      ▼"}</div>
        <div><span className="diagram-node">[next.js router]</span> ➔ [upload] ➔ [imagekit]</div>
        <div>{"                                 │"}</div>
        <div>{"                                 ▼"}</div>
        <div>{"                           [mongodb save]"}</div>
      </div>
    )
  }
];

const formatPushedAt = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return 'today';
  if (diffDays < 30) return `${diffDays}d ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}y ago`;
};

function ProjectCard({ project }: { project: Project }) {
  const [stats, setStats] = useState<{ language: string; size: string; pushed: string } | null>(null);

  const handleHover = () => {
    if (stats) return;

    const cacheKey = `github-stats-${project.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 86400000) {
          setStats(parsed.data);
          return;
        }
      } catch (e) {
        // ignore corruption
      }
    }

    const parts = project.github.replace('https://github.com/', '').split('/');
    if (parts.length >= 2) {
      const owner = parts[0];
      const repo = parts[1];
      fetch(`https://api.github.com/repos/${owner}/${repo}`)
        .then(res => {
          if (!res.ok) throw new Error('API Rate Limit or Offline');
          return res.json();
        })
        .then(data => {
          const newStats = {
            language: (data.language || '').toLowerCase(),
            size: data.size < 1024 ? `${data.size}kb` : `${(data.size / 1024).toFixed(1)}mb`,
            pushed: formatPushedAt(data.pushed_at)
          };
          setStats(newStats);
          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: newStats
          }));
        })
        .catch(() => {
          const defaultLang = project.tech.split('|')[0].trim().toLowerCase();
          setStats({
            language: defaultLang,
            size: '—',
            pushed: 'active'
          });
        });
    }
  };

  return (
    <div className="project-item">
      <PreviewLinkCard href={project.github} followCursor={true}>
        <PreviewLinkCardTrigger
          className="project-title-trigger"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={handleHover}
        >
          <div className="project-title">{project.title}</div>
        </PreviewLinkCardTrigger>
        <PreviewLinkCardContent side="top" sideOffset={15} className="diagram-preview-card">
          <div className="diagram-header">
            {project.title}
            {stats ? ` – ${stats.language} | ${stats.size} | ${stats.pushed}` : ' – architecture'}
          </div>
          {project.diagram}
        </PreviewLinkCardContent>
      </PreviewLinkCard>
      <p className="project-description">{project.description}</p>
      <div className="project-tech">{project.tech}</div>
      <div className="project-links">
        <a href={project.github} target="_blank" rel="noopener noreferrer">github</a>
      </div>
    </div>
  );
}

function App() {
  const [activeFilter, setActiveFilter] = useState<'featured' | 'systems/c' | 'go' | 'ai/ml' | 'web'>('featured')
  const [hasScrolledToProjects, setHasScrolledToProjects] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('about')
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const projectsContainerRef = useRef<HTMLDivElement>(null)

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('portfolio-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
    return 'light'
  })

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [editorTheme, setEditorTheme] = useState<string>(() => {
    return localStorage.getItem('portfolio-editor-theme') || 'default'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark-theme')
    } else {
      root.classList.remove('dark-theme')
    }
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('theme-gruvbox', 'theme-tokyonight', 'theme-nord', 'theme-dracula')
    if (editorTheme !== 'default') {
      root.classList.add(`theme-${editorTheme}`)
    }
    localStorage.setItem('portfolio-editor-theme', editorTheme)
  }, [editorTheme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  // Scroll restoration to top on load & FOUC-prevention mount stagger reveal
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    if (contentContainerRef.current) {
      const container = contentContainerRef.current;
      const elements = container.querySelectorAll('.desktop-nav, header, #about h2, #about p');

      container.classList.add('loading-mount');

      gsap.fromTo(elements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          force3D: true,
          onComplete: () => {
            container.classList.remove('loading-mount');
          }
        }
      );
    }
  }, []);

  // Scroll-Spy active section navigation tracking
  useEffect(() => {
    const sections = ['about', 'experience', 'projects', 'certifications', 'skills', 'achievements', 'connect'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const activeSectionRef = useRef(activeSection);
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  const lastGTimeRef = useRef<number>(0);

  // Global keyboard shortcuts (when not typing in inputs/textareas)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const isTyping = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.isContentEditable
      );

      if (isTyping || isCommandPaletteOpen) return;

      // Theme toggle: 'T'
      if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
      }

      // Smooth scroll section: '1'-'7'
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= 7 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const sections = ['about', 'experience', 'projects', 'certifications', 'skills', 'achievements', 'connect'];
        const targetId = sections[keyNum - 1];
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Vim-key navigation (when not typing, command palette closed, and no modifiers)
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === 'g') {
          const now = Date.now();
          if (now - lastGTimeRef.current < 500) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            lastGTimeRef.current = 0;
          } else {
            lastGTimeRef.current = now;
          }
        } else if (e.key === 'G') {
          e.preventDefault();
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        } else if (e.key === 'j') {
          const sections = ['about', 'experience', 'projects', 'certifications', 'skills', 'achievements', 'connect'];
          const currentIndex = sections.indexOf(activeSectionRef.current);
          if (currentIndex !== -1) {
            const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
            const targetEl = document.getElementById(sections[nextIndex]);
            if (targetEl) {
              e.preventDefault();
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        } else if (e.key === 'k') {
          const sections = ['about', 'experience', 'projects', 'certifications', 'skills', 'achievements', 'connect'];
          const currentIndex = sections.indexOf(activeSectionRef.current);
          if (currentIndex !== -1) {
            const prevIndex = Math.max(currentIndex - 1, 0);
            const targetEl = document.getElementById(sections[prevIndex]);
            if (targetEl) {
              e.preventDefault();
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, isCommandPaletteOpen]);

  // ScrollTrigger Animations registration (runs exactly once on mount)
  useEffect(() => {
    // 2. Experience section (clean vertical slide-up & scale)
    const expItems = document.querySelectorAll('#experience .work-item, #experience h2');
    expItems.forEach(item => {
      gsap.fromTo(item,
        { opacity: 0, y: 25, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // 3. Projects section entrance triggers
    const projectsHeader = document.querySelector('#projects h2');
    const filterPillsElement = document.querySelector('#projects .filter-pills');

    if (projectsHeader) {
      gsap.fromTo(projectsHeader,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: projectsHeader,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    }

    if (filterPillsElement) {
      gsap.fromTo(filterPillsElement,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: filterPillsElement,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    }

    // Single ScrollTrigger to detect when viewport reaches the projects list
    ScrollTrigger.create({
      trigger: '#projects',
      start: 'top 80%',
      toggleActions: 'play none none none',
      onEnter: () => {
        setHasScrolledToProjects(true);
      }
    });

    // 4. Certifications section (slide from right)
    const certItems = document.querySelectorAll('#certifications .certification-item, #certifications h2');
    certItems.forEach(item => {
      gsap.fromTo(item,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // 5. Skills section (stagger scale-in of tags inside groups)
    const skillTitle = document.querySelector('#skills h2');
    if (skillTitle) {
      gsap.fromTo(skillTitle,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: { trigger: skillTitle, start: 'top 85%' }
        }
      );
    }
    const skillGroups = document.querySelectorAll('#skills .skills-group');
    skillGroups.forEach(group => {
      const tags = group.querySelectorAll('.skill-tag');
      gsap.fromTo(tags,
        { opacity: 0, scale: 0.75 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          stagger: 0.04,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: group,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // 6. Achievements section (blur-to-clear fade)
    const achItems = document.querySelectorAll('#achievements .achievement-item, #achievements h2');
    achItems.forEach(item => {
      gsap.fromTo(item,
        { opacity: 0, filter: 'blur(8px)', y: 10 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // 7. Connect section (springy stagger up)
    const connectTitle = document.querySelector('#connect h2');
    if (connectTitle) {
      gsap.fromTo(connectTitle,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: { trigger: connectTitle, start: 'top 88%' }
        }
      );
    }
    const connectLinks = document.querySelectorAll('#connect .connect-link');
    gsap.fromTo(connectLinks,
      { opacity: 0, y: 15, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '#connect',
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );

    // Clean up triggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Filter change transition animation
  const handleFilterChange = (filter: typeof activeFilter) => {
    if (filter === activeFilter) return;

    const cards = projectsContainerRef.current?.querySelectorAll('.project-item');
    if (cards && cards.length > 0) {
      gsap.to(cards, {
        opacity: 0,
        y: -10,
        scale: 0.98,
        duration: 0.15,
        stagger: 0.03,
        ease: 'power2.in',
        onComplete: () => {
          setActiveFilter(filter);
        }
      });
    } else {
      setActiveFilter(filter);
    }
  };

  // Entrance animation for project items (triggered on initial scroll-to or filter change)
  useEffect(() => {
    if (!hasScrolledToProjects || !projectsContainerRef.current) return;

    const cards = projectsContainerRef.current.querySelectorAll('.project-item');
    if (cards.length > 0) {
      gsap.killTweensOf(cards);
      gsap.fromTo(cards,
        { opacity: 0, y: 20, scale: 0.98, rotation: 1 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            ScrollTrigger.refresh();
          }
        }
      );
    }
  }, [hasScrolledToProjects, activeFilter]);

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      e.preventDefault();
      window.open('https://mail.google.com/mail/?view=cm&fs=1&to=anvekarprathamesh13@gmail.com', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <ClickSpark sparkColor={theme === 'dark' ? '#ffffff' : '#0a0a0a'} sparkSize={8} sparkRadius={15} sparkCount={8} duration={400}>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        setIsOpen={setIsCommandPaletteOpen}
        editorTheme={editorTheme}
        setEditorTheme={setEditorTheme}
      />
      <DiscoveryToast />
      <MobileMenu show={true} />

      <div ref={contentContainerRef} className="loading-mount">
        <nav className="desktop-nav">
          {['about', 'experience', 'projects', 'certifications', 'skills', 'achievements', 'connect'].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeSection === id ? 'active' : ''}
            >
              {id}
            </a>
          ))}
        </nav>

        <header style={{ marginBottom: '24px' }}>
          <PreviewLinkCard href="https://github.com/prathamanvekar" followCursor={true}>
            <PreviewLinkCardTrigger>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                <img src={megumiImg} alt="logo" className="site-logo" />
                <h1 style={{ margin: 0, display: 'inline-block' }}>prathamesh anvekar</h1>
              </div>
            </PreviewLinkCardTrigger>
            <PreviewLinkCardContent side="bottom" sideOffset={15}>
              <PreviewLinkCardImage src={megumiImg} alt="megumi" />
            </PreviewLinkCardContent>
          </PreviewLinkCard>
          <div style={{ padding: '8px 0', minHeight: '38px', display: 'flex', alignItems: 'center' }}>
            <TextType
              text={["i love backend and ai", "i use arch, btw", "i use neovim, btw", "try ctrl + k for something cool"]}
              typingSpeed={60}
              deletingSpeed={30}
              pauseDuration={2000}
              showCursor={true}
              cursorCharacter="|"
              style={{
                fontSize: '19px',
                fontWeight: 500,
                color: 'var(--text-h)',
                fontStyle: 'italic'
              }}
            />
          </div>
        </header>

        <section id="about">
          <h2>about</h2>
          <p>
            highly curious about all things <span className="highlight-term">backend and ai</span>. quite proficient in <span className="go-text">go</span> for backend systems. currently building a <span className="highlight-term">custom http server</span> in <span className="go-text">go</span> which lets me dabble all things backend.
          </p>
          <p>
            surprised everyday by what <span className="highlight-term">ai</span> can do, and what i can understand from it and build. quite proficient in python, of course. worked with most things under aiml. currently learning all about <span className="highlight-term">agent harness</span>.
          </p>
          <p>
            final year btech at vit, graduating <span className="highlight-term">'27</span>.
          </p>
          <p>
            and about me, i love music and singing it.
          </p>
          <p style={{ marginTop: '12px', paddingBottom: '30px' }}>
            <a href={resumePdf} target="_blank" rel="noopener noreferrer">resume</a>
          </p>
        </section>

        <section id="experience">
          <h2>experience</h2>
          <div className="work-item">
            <div className="work-header">
              <span className="work-role">machine learning developer</span>
              <span className="work-company">qriocity pvt. ltd. · 2026</span>
            </div>
            <p className="work-desc">
              designed, trained, and deployed end-to-end <span className="highlight-term">deep learning models</span> and scalable <span className="highlight-term">fastapi inference systems</span> for complex multi-domain ai pipelines.
            </p>
          </div>
        </section>

        <section id="projects">
          <h2>projects</h2>

          <div className="filter-pills">
            {(['featured', 'systems/c', 'go', 'ai/ml', 'web'] as const).map(pill => (
              <button
                key={pill}
                onClick={() => handleFilterChange(pill)}
                className={`filter-pill ${activeFilter === pill ? 'active' : ''}`}
              >
                {pill === 'systems/c' ? 'systems/c' : pill === 'ai/ml' ? 'ai/ml' : pill}
              </button>
            ))}
          </div>

          <div ref={projectsContainerRef} className="projects-list">
            {PROJECTS.filter(project => project.categories.includes(activeFilter)).map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section id="certifications">
          <h2>certifications</h2>

          <div className="certification-item">
            <span className="certification-title">ibm full stack developer certificate</span>
            <a href={ibmCert} target="_blank" rel="noopener noreferrer" className="certification-link">view cert</a>
          </div>
        </section>

        <section id="skills">
          <h2>skills</h2>
          <div className="skills-container">
            <div className="skills-group">
              <span className="skills-label">languages:</span>
              {['go', 'python', 'c', 'c++', 'java', 'javascript'].map(skill => (
                <span key={skill} className={`skill-tag ${skill === 'go' ? 'go-tag' : ''}`}>{skill}</span>
              ))}
            </div>
            <div className="skills-group">
              <span className="skills-label">backend:</span>
              {['fastapi', 'node.js', 'express.js', 'reactjs'].map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
            <div className="skills-group">
              <span className="skills-label">ai & ml:</span>
              {['pytorch', 'tensorflow', 'hugging face', 'llm fine-tuning', 'nlp', 'transformers'].map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
            <div className="skills-group">
              <span className="skills-label">databases:</span>
              {['postgresql', 'mongodb', 'mysql'].map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
            <div className="skills-group">
              <span className="skills-label">devops & tools:</span>
              {['docker', 'linux', 'git/github', 'shell scripting', 'grafana', 'prometheus'].map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="achievements">
          <h2>achievements</h2>
          <div className="achievement-item">
            <span className="achievement-title">top 150 – amazon ml challenge 2025</span>
            <p className="achievement-desc" style={{ marginTop: '4px', fontSize: '15px' }}>
              ranked among top 150 out of 80,000+ participants nationwide.
            </p>
          </div>
          <div className="achievement-item">
            <span className="achievement-title">top 4 – google's wow verse hackathon 2025</span>
            <p className="achievement-desc" style={{ marginTop: '4px', fontSize: '15px' }}>
              selected among top 4 teams; presented solution to google developer group (gdg).
            </p>
          </div>
        </section>

        <section id="connect">
          <h2>connect</h2>
          <div className="connect-links">
            <a
              href="mailto:anvekarprathamesh13@gmail.com"
              onClick={handleEmailClick}
              className="connect-link"
            >
              email
            </a>
            <a href="https://github.com/prathamanvekar" target="_blank" rel="noopener noreferrer" className="connect-link">github</a>
            <a href="https://www.linkedin.com/in/prathamanvekar/" target="_blank" rel="noopener noreferrer" className="connect-link">linkedin</a>
            <a href="https://x.com/prathamiscool" target="_blank" rel="noopener noreferrer" className="connect-link">twitter</a>
          </div>
        </section>
      </div>
    </ClickSpark>
  )
}

export default App
