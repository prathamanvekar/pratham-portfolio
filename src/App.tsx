import { useState, useRef, useEffect } from 'react'
import TextType from './components/TextType'
import ClickSpark from './components/ClickSpark'
import ibmCert from './assets/ibm full stack developer.pdf'
import resumePdf from './assets/resume.pdf'
import megumiImg from './assets/megumi.jpg'
import Loader from './components/Loader'
import MobileMenu from './components/MobileMenu'
import gsap from 'gsap'
import {
  PreviewLinkCard,
  PreviewLinkCardTrigger,
  PreviewLinkCardContent,
  PreviewLinkCardImage,
} from './components/PreviewLinkCard'

function App() {
  const [showMoreProjects, setShowMoreProjects] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const contentContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Content stagger animation runs immediately on page mount
    if (contentContainerRef.current) {
      const container = contentContainerRef.current
      const elements = container.querySelectorAll('.desktop-nav, header, section')
      gsap.set(elements, { opacity: 0, y: 15 })
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      })
    }
  }, [])

  return (
    <ClickSpark sparkColor="#0a0a0a" sparkSize={8} sparkRadius={15} sparkCount={8} duration={400}>
      {showLoader && <Loader onComplete={() => setShowLoader(false)} />}
      
      <MobileMenu show={!showLoader} />
      
      <div ref={contentContainerRef}>
        <nav className="desktop-nav">
          <a href="#about">about</a>
          <a href="#experience">experience</a>
          <a href="#projects">projects</a>
          <a href="#certifications">certifications</a>
          <a href="#skills">skills</a>
          <a href="#achievements">achievements</a>
          <a href="#connect">connect</a>
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
            text={["i love backend and ai", "i use arch, btw", "i use neovim, btw"]}
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

        <div className="project-item">
          <div className="project-title">linux process isolation engine</div>
          <p className="project-description">
            built a policy-driven c <span className="highlight-term">sandboxing engine</span> using <span className="highlight-term">seccomp-bpf</span> filters to enforce kernel-level syscall restrictions, secure process execution via fork/exec, and log runtime violations with low overhead.
          </p>
          <div className="project-tech">c | seccomp-bpf | linux kernel</div>
          <div className="project-links">
            <a href="https://github.com/prathamanvekar/kernel-sandbox" target="_blank" rel="noopener noreferrer">github</a>
          </div>
        </div>

        <div className="project-item">
          <div className="project-title">secure llm proxy server</div>
          <p className="project-description">
            architected a security-first fastapi gateway that secures rag workflows and local <span className="highlight-term">quantized gemma 3</span> inference using a <span className="highlight-term">threat detection pipeline</span> to sanitize pii, block prompt injections, and log telemetry.
          </p>
          <div className="project-tech">fastapi | python | gemma 3 | react</div>
          <div className="project-links">
            <a href="https://github.com/prathamanvekar/aegis" target="_blank" rel="noopener noreferrer">github</a>
          </div>
        </div>

        {!showMoreProjects ? (
          <div style={{ marginTop: '8px' }}>
            <button className="toggle-button" onClick={() => setShowMoreProjects(true)}>
              show more projects ↓
            </button>
          </div>
        ) : (
          <div className="expanded-projects">
            <div className="project-item">
              <div className="project-title">gator</div>
              <p className="project-description">
                built a concurrent command-line rss feed aggregator to fetch and parse xml feeds, managing user subscriptions and utilizing <span className="highlight-term">sqlc</span> for type-safe <span className="go-text">go</span> and <span className="highlight-term">postgresql</span> database queries.
              </p>
              <div className="project-tech">go | postgresql | sqlc</div>
              <div className="project-links">
                <a href="https://github.com/prathamanvekar/gator" target="_blank" rel="noopener noreferrer">github</a>
              </div>
            </div>

            <div className="project-item">
              <div className="project-title">jobs alert cli</div>
              <p className="project-description">
                developed a terminal-based <span className="go-text">go</span> application with <span className="highlight-term">secure authentication</span> to seamlessly track, retrieve, and alert users of new job postings directly from the command line.
              </p>
              <div className="project-tech">go | cli</div>
              <div className="project-links">
                <a href="https://github.com/prathamanvekar/jobs-alert-cli" target="_blank" rel="noopener noreferrer">github</a>
              </div>
            </div>

            <div className="project-item">
              <div className="project-title">agri-insurance dapp</div>
              <p className="project-description">
                architected a decentralized crop insurance platform integrating <span className="highlight-term">solidity smart contracts</span> with a python backend, utilizing random forest and <span className="highlight-term">xgboost models</span> to assess weather risks and automate claim settlements.
              </p>
              <div className="project-tech">solidity | python | scikit-learn | javascript</div>
              <div className="project-links">
                <a href="https://github.com/prathamanvekar/agri-insurance-dapp-blockchain" target="_blank" rel="noopener noreferrer">github</a>
              </div>
            </div>

            <div className="project-item">
              <div className="project-title">real-time cyberbullying ai</div>
              <p className="project-description">
                engineered a real-time chat application incorporating a custom <span className="highlight-term">decision engine</span> to instantly monitor, classify, and filter toxic messages using <span className="highlight-term">machine learning</span>.
              </p>
              <div className="project-tech">python | flask | javascript | sqlite</div>
              <div className="project-links">
                <a href="https://github.com/prathamanvekar/cyberbul-realtime-ai" target="_blank" rel="noopener noreferrer">github</a>
              </div>
            </div>

            <div className="project-item">
              <div className="project-title">cyber threat intelligence ids</div>
              <p className="project-description">
                built an intrusion detection system leveraging <span className="highlight-term">isolation forest</span> and voting classifier ensemble models to identify network anomalies and classify <span className="highlight-term">cyber threats</span>.
              </p>
              <div className="project-tech">python | machine learning | sqlite</div>
              <div className="project-links">
                <a href="https://github.com/prathamanvekar/cyber-threat-intelligence-detection-system-ids" target="_blank" rel="noopener noreferrer">github</a>
              </div>
            </div>

            <div className="project-item">
              <div className="project-title">static site generator</div>
              <p className="project-description">
                developed a custom <span className="highlight-term">markdown-to-html</span> conversion engine that parses inline and block markdown nodes to automatically generate fully formatted <span className="highlight-term">static websites</span>.
              </p>
              <div className="project-tech">python | markdown | html</div>
              <div className="project-links">
                <a href="https://github.com/prathamanvekar/static-site-gen" target="_blank" rel="noopener noreferrer">github</a>
              </div>
            </div>

            <div className="project-item">
              <div className="project-title">ai medical vision bot</div>
              <p className="project-description">
                developed a multimodal ai medical chatbot that analyzes patient medical images and responds to real-time voice queries using <span className="highlight-term">elevenlabs audio synthesis</span> and a <span className="highlight-term">gradio interface</span>.
              </p>
              <div className="project-tech">python | gradio | vision ai | elevenlabs</div>
              <div className="project-links">
                <a href="https://github.com/prathamanvekar/ai-medical-vision-bot" target="_blank" rel="noopener noreferrer">github</a>
              </div>
            </div>

            <div className="project-item">
              <div className="project-title">real-time facial recognition system</div>
              <p className="project-description">
                built a webcam-validated python and <span className="highlight-term">opencv</span> facial recognition system featuring automated <span className="highlight-term">dataset management</span>, image preprocessing, and time-stamped training versioning using haar cascades and lbph.
              </p>
              <div className="project-tech">python | opencv | haar cascades | lbph</div>
              <div className="project-links">
                <a href="https://github.com/prathamanvekar/image-personalizer" target="_blank" rel="noopener noreferrer">github</a>
              </div>
            </div>

            <div className="project-item">
              <div className="project-title">video upload and streaming platform</div>
              <p className="project-description">
                developed a responsive next.js and mongodb video hosting platform featuring <span className="highlight-term">nextauth</span> authentication and a seamless background <span className="highlight-term">video upload pipeline</span> directly to imagekit on file selection.
              </p>
              <div className="project-tech">next.js | mongodb | nextauth | imagekit</div>
              <div className="project-links">
                <a href="https://github.com/prathamanvekar/video-app" target="_blank" rel="noopener noreferrer">github</a>
              </div>
            </div>

            <div style={{ marginTop: '8px' }}>
              <button className="toggle-button" onClick={() => setShowMoreProjects(false)}>
                show less projects ↑
              </button>
            </div>
          </div>
        )}
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
            {['docker', 'linux', 'git/github', 'shell scripting', 'grafana', 'prometheus', 'postman'].map(skill => (
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
          <a href="mailto:anvekarprathamesh13@gmail.com" className="connect-link">email</a>
          <a href="https://github.com/prathamanvekar" target="_blank" rel="noopener noreferrer" className="connect-link">github</a>
          <a href="https://www.linkedin.com/in/prathamanvekar/" target="_blank" rel="noopener noreferrer" className="connect-link">linkedin</a>
        </div>
      </section>
      </div>
    </ClickSpark>
  )
}

export default App
