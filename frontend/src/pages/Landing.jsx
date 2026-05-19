import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Key, Gauge, ScrollText, BookOpen, Gift, Zap, Github, ExternalLink, ChevronRight } from 'lucide-react';

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
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-aeroga-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
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
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Built by VERPTO</h2>
            <p className="text-slate-400">Two engineers. One gateway. Zero compromises.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map(({ initials, name, title: memberTitle, description }) => (
              <div key={name} className="glass-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-aeroga-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{name}</p>
                    <p className="text-xs text-aeroga-400 font-medium">{memberTitle}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-aeroga-600 rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
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
