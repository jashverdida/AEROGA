import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Key, Gauge, ScrollText, BookOpen, Gift, Github, ExternalLink, ChevronRight,
  Lightbulb, Palette, CheckCircle, Layers,
  Server, Database, Lock, Code2,
  Mail, Linkedin, Phone,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'JWT Authentication',
    description: 'Stateless, secure token-based auth with configurable expiration and role-based access control.',
  },
  {
    icon: Key,
    title: 'API Key Management',
    description: 'Issue, revoke, and monitor API keys per client with a full management dashboard.',
  },
  {
    icon: Gauge,
    title: 'Rate Limiting',
    description: 'Sliding-window rate limiter with 429 responses and Retry-After headers to protect your services.',
  },
  {
    icon: ScrollText,
    title: 'Request Logging',
    description: 'Every request logged with method, path, latency, status, and API key for full observability.',
  },
  {
    icon: BookOpen,
    title: 'OpenAPI / Swagger',
    description: 'Auto-generated live API documentation at /swagger-ui with JWT authorization and live try-out.',
  },
  {
    icon: Gift,
    title: 'Benefits Domain',
    description: 'Built-in REST API for managing employee benefit packages, enrollments, and eligibility rules.',
  },
];

const techStack = ['Java 17', 'Spring Boot 3', 'MongoDB', 'React 18', 'Tailwind CSS', 'Docker', 'Railway', 'Vercel'];

const team = [
  {
    initials: 'JV',
    name: 'Jashmine Verdida',
    title: 'Lead QA & Frontend Engineer',
    description:
      'Responsible for every pixel of the dashboard, component architecture, and making sure AEROGA works as beautifully as it looks.',
  },
  {
    initials: 'EP',
    name: 'Eijay Pepito',
    title: 'Backend Engineer',
    description:
      'Designed the API gateway engine, rate limiter, auth system, and every MongoDB query that powers AEROGA\'s core.',
  },
];

// ── Animated hexagon SVG ───────────────────────────────────────────────────
function HexOutline({ size, opacity, strokeWidth = 1.2 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <polygon points={pts} fill="none" stroke={`rgba(74,222,128,${opacity})`} strokeWidth={strokeWidth} />
    </svg>
  );
}

// ── Single animated team card ───────────────────────────────────────────────
const FLOAT_ANIMS = ['floatA', 'floatB', 'floatC', 'floatD'];

function TeamCard({ photo, initials, name, title, description, icons, email, phone, linkedin }) {
  const [hovered, setHovered] = useState(false);

  const iconPositions = [
    { top: '8px',  left:  '6%'  },
    { top: '8px',  right: '6%'  },
    { top: '44%',  left:  '-4%' },
    { top: '44%',  right: '-4%' },
  ];

  return (
    <div
      style={{ position: 'relative', paddingTop: '140px', cursor: 'default', display: 'flex', flexDirection: 'column', height: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Rotating hexagon rings ── */}
      <div style={{
        position: 'absolute', top: '-10px', left: '50%',
        width: '220px', height: '220px',
        animationName: hovered ? 'hexSpin' : 'none',
        animationDuration: '12s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 400ms ease',
        pointerEvents: 'none',
        zIndex: 3,
      }}>
        <HexOutline size={220} opacity={0.45} strokeWidth={1.5} />
      </div>
      <div style={{
        position: 'absolute', top: '14px', left: '50%',
        width: '172px', height: '172px',
        animationName: hovered ? 'hexSpinReverse' : 'none',
        animationDuration: '18s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 500ms ease',
        pointerEvents: 'none',
        zIndex: 3,
      }}>
        <HexOutline size={172} opacity={0.25} strokeWidth={1} />
      </div>

      {/* ── Floating icons ── */}
      {icons.map(({ Icon }, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...iconPositions[i],
          zIndex: 4,
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transition: `opacity 300ms ease ${i * 60}ms`,
          animationName: hovered ? FLOAT_ANIMS[i] : 'none',
          animationDuration: `${3.2 + i * 0.4}s`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          animationDelay: `${i * 0.35}s`,
        }}>
          <div style={{
            width: '38px', height: '38px',
            background: 'rgba(7,25,18,0.85)',
            border: '1px solid rgba(74,222,128,0.3)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(74,222,128,0.25), 0 0 28px rgba(34,197,94,0.12)',
          }}>
            <Icon style={{ width: '17px', height: '17px', color: '#4ade80' }} />
          </div>
        </div>
      ))}

      {/* ── Photo ── */}
      <img
        src={photo}
        alt={name}
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: hovered
            ? 'translateX(-50%) translateY(-22px) scale(1.08)'
            : 'translateX(-50%) translateY(0px) scale(1)',
          height: '190px',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'top',
          transition: 'transform 420ms cubic-bezier(0.34,1.56,0.64,1), filter 400ms ease',
          filter: hovered
            ? 'drop-shadow(0 0 18px rgba(74,222,128,0.65)) drop-shadow(0 0 40px rgba(34,197,94,0.35))'
            : 'drop-shadow(0 0 6px rgba(74,222,128,0.2))',
          zIndex: 5,
        }}
      />

      {/* ── Card body ── */}
      <div style={{
        background: 'rgba(8,18,11,0.85)',
        border: hovered ? '1px solid rgba(74,222,128,0.28)' : '1px solid rgba(34,197,94,0.1)',
        borderRadius: '18px',
        backdropFilter: 'blur(12px)',
        paddingTop: '80px',
        paddingBottom: '24px',
        paddingLeft: '24px',
        paddingRight: '24px',
        animationName: hovered ? 'cardGlow' : 'none',
        animationDuration: '2.4s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        transition: 'border-color 400ms ease',
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Avatar + name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
            boxShadow: hovered ? '0 0 18px rgba(34,197,94,0.5)' : '0 0 10px rgba(34,197,94,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 800, color: 'white',
            transition: 'box-shadow 400ms ease',
          }}>
            {initials}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '15px', color: 'white', lineHeight: 1.2 }}>{name}</p>
            <p style={{
              fontSize: '11.5px', fontWeight: 600, color: '#4ade80', marginTop: '3px',
              textShadow: hovered ? '0 0 12px rgba(74,222,128,0.6)' : 'none',
              transition: 'text-shadow 400ms ease',
            }}>{title}</p>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.65 }}>{description}</p>

        {/* ── Contact section ── */}
        <div style={{ marginTop: 'auto', paddingTop: '18px' }}>
          {/* Pill action buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {email && (
              <a
                href={`mailto:${email}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '999px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontSize: '12px', fontWeight: 600, color: '#cbd5e1',
                  textDecoration: 'none', transition: 'all 200ms ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(74,222,128,0.5)'; e.currentTarget.style.color = '#4ade80'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#cbd5e1'; }}
              >
                <Mail style={{ width: '12px', height: '12px', flexShrink: 0 }} />
                Email
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '999px',
                  background: 'rgba(74,222,128,0.15)',
                  border: '1px solid rgba(74,222,128,0.35)',
                  fontSize: '12px', fontWeight: 600, color: '#4ade80',
                  textDecoration: 'none', transition: 'all 200ms ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(74,222,128,0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(74,222,128,0.15)'; }}
              >
                <Linkedin style={{ width: '12px', height: '12px', flexShrink: 0 }} />
                LinkedIn
              </a>
            )}
          </div>

          {/* Contact detail rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              email    && { href: `mailto:${email}`,    Icon: Mail,     label: email,                   external: false },
              phone    && { href: `tel:${phone}`,        Icon: Phone,    label: phone,                   external: false },
              linkedin && { href: linkedin,              Icon: Linkedin, label: name,                    external: true  },
            ].filter(Boolean).map(({ href, Icon, label, external }, i) => (
              <a
                key={i}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 0',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  textDecoration: 'none',
                  color: '#4ade80',
                  fontSize: '12.5px',
                  transition: 'color 200ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#86efac'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#4ade80'; }}
              >
                <span style={{
                  width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                  background: 'rgba(74,222,128,0.1)',
                  border: '1px solid rgba(74,222,128,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon style={{ width: '13px', height: '13px', color: '#4ade80' }} />
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/AEROGA.png"
              alt="AEROGA"
              style={{
                width: '44px', height: '44px', objectFit: 'contain', flexShrink: 0,
                filter: 'drop-shadow(0 0 10px rgba(74,222,128,0.8)) drop-shadow(0 0 22px rgba(34,197,94,0.35))',
              }}
            />
            <span className="text-white font-bold text-lg tracking-tight">AEROGA</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Log in</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34,197,94,0.12) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
            The intelligent gateway<br />
            for your{' '}
            <span className="text-aeroga-400">benefits ecosystem</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            AEROGA routes, protects, and observes every API call across your employee rewards platform —
            giving your teams control, visibility, and speed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link to="/register" className="btn-primary flex items-center gap-2 justify-center text-base px-6 py-3">
              Get Started Free <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href="http://localhost:8080/swagger-ui/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost flex items-center gap-2 justify-center text-base px-6 py-3 border border-slate-700"
            >
              View API Docs <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-14">
            {['JWT Auth', 'Rate Limiting', 'Request Logging', 'OpenAPI Docs'].map((pill) => (
              <span
                key={pill}
                className="bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full"
              >
                {pill}
              </span>
            ))}
          </div>

          {/* Code block */}
          <div className="max-w-xl mx-auto rounded-xl bg-slate-900 border border-slate-700/50 overflow-hidden text-left shadow-2xl">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-amber-500/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-xs text-slate-500 font-mono">aeroga-api</span>
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-slate-300 overflow-x-auto">
              <span className="text-aeroga-400">POST</span>{' '}
              <span className="text-slate-200">/api/auth/login HTTP/1.1</span>{'\n'}
              <span className="text-slate-500">X-API-Key: </span>
              <span className="text-emerald-400">ak_4f9a2c1d8e3b</span>{'\n'}
              <span className="text-slate-500">Content-Type: </span>
              <span className="text-slate-300">application/json</span>{'\n\n'}
              <span className="text-slate-500">{'{'} </span>
              <span className="text-amber-400">"email"</span>
              <span className="text-slate-300">: </span>
              <span className="text-emerald-400">"admin@aeroga.dev"</span>
              <span className="text-slate-500">,</span>{'\n'}
              {'  '}
              <span className="text-amber-400">"password"</span>
              <span className="text-slate-300">: </span>
              <span className="text-emerald-400">"••••••••"</span>
              {' '}
              <span className="text-slate-500">{'}'}</span>{'\n\n'}
              <span className="text-emerald-400">→ 200 OK</span>
              <span className="text-slate-500">  |  </span>
              <span className="text-aeroga-300">12ms</span>
              <span className="text-slate-500">  |  JWT issued</span>
            </pre>
          </div>
        </div>
      </section>

      {/* Name Story */}
      <section className="py-24 bg-slate-900/50 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-10">Why AEROGA?</h2>
          <blockquote className="border-l-4 border-aeroga-500 pl-6 text-left">
            <p className="text-lg text-slate-300 leading-relaxed italic">
              "In aviation, aeroga refers to the invisible but essential systems that keep everything
              in the air connected — navigation, routing, control. We borrowed that spirit. AEROGA is
              the invisible connective layer of your benefits infrastructure. It routes, protects,
              observes, and orchestrates — so your teams can focus on what matters: building remarkable
              experiences for the employees who depend on them."
            </p>
          </blockquote>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Everything you need to run a secure API layer</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Enterprise-grade gateway features, built from scratch in Spring Boot and deployed in minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="glass-card p-6 hover:border-aeroga-700/50 transition-colors">
                <div className="w-10 h-10 bg-aeroga-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-aeroga-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6 bg-slate-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-6">Built with</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="bg-slate-800/60 border border-slate-700/50 text-slate-300 text-sm font-medium px-4 py-2 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-white mb-3">Built by VERPTO</h2>
            <p className="text-slate-400">Two engineers. One gateway. Zero compromises.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <TeamCard
              photo="/jash.png"
              initials="JV"
              name="Jashmine Verdida"
              title="Lead QA & Frontend Engineer"
              description="Responsible for every pixel of the dashboard, component architecture, and making sure AEROGA works as beautifully as it looks."
              icons={[
                { Icon: Lightbulb },
                { Icon: Palette },
                { Icon: Layers },
                { Icon: CheckCircle },
              ]}
              email="JashmineVerdida08@gmail.com"
              phone="0956 950 5102"
              linkedin="https://www.linkedin.com/in/jashmine-verdida-820a56352/"
            />
            <TeamCard
              photo="/eijay.png"
              initials="EP"
              name="Eijay Pepito"
              title="Backend Engineer"
              description="Designed the API gateway engine, rate limiter, auth system, and every MongoDB query that powers AEROGA's core."
              icons={[
                { Icon: Server },
                { Icon: Database },
                { Icon: Lock },
                { Icon: Code2 },
              ]}
              email="eijay.pepito8@gmail.com"
              phone="0993 266 2346"
              linkedin="https://www.linkedin.com/in/eijay-pepito-98b538355/"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/AEROGA.png"
              alt="AEROGA"
              style={{
                width: '34px', height: '34px', objectFit: 'contain', flexShrink: 0,
                filter: 'drop-shadow(0 0 8px rgba(74,222,128,0.7))',
              }}
            />
            <span className="text-white font-bold text-sm">AEROGA</span>
          </div>
          <p className="text-sm text-slate-500">© 2025 VERPTO. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href="http://localhost:8080/swagger-ui/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              API Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
