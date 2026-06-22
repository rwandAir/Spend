import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Receipt, Target, PieChart, Smartphone, Shield,
  FileOutput, Send, Globe, Camera, Briefcase, Code, Menu, X
} from 'lucide-react';

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const closeMenu = () => setMenuOpen(false);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuOpen && navRef.current && !navRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <div className="landing-page">

      {/* ── Navbar ── */}
      <nav className="landing-nav" ref={navRef}>
        {/* Logo */}
        <Link to="/" className="lp-logo" onClick={closeMenu}>
          <TrendingUp className="lp-logo-icon" size={26} />
          <span className="lp-logo-text">Spend <span className="lp-logo-accent">Wisely</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="lp-nav-links">
          <a href="#features" className="lp-nav-link">Features</a>
          <a href="#about" className="lp-nav-link">About</a>
          <Link to="/login" className="lp-btn-signin">Sign In</Link>
          <Link to="/login?tab=register" className="lp-btn-getstarted">Get Started</Link>
        </div>

        {/* Hamburger — mobile/tablet only */}
        <button
          className={`lp-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="lp-mobile-menu"
        >
          {menuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
        </button>

        {/* Mobile Dropdown */}
        <div
          id="lp-mobile-menu"
          className={`lp-mobile-menu${menuOpen ? ' open' : ''}`}
          aria-hidden={!menuOpen}
        >
          <a href="#features" className="lp-mobile-link" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>Features</a>
          <a href="#about" className="lp-mobile-link" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>About</a>
          <div className="lp-mobile-divider" />
          <Link to="/login" className="lp-mobile-link" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>Sign In</Link>
          <Link
            to="/login?tab=register"
            className="lp-mobile-cta"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            Get Started →
          </Link>
        </div>
      </nav>

      {/* Backdrop */}
      {menuOpen && <div className="lp-backdrop" onClick={closeMenu} aria-hidden="true" />}

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">Smart Money Management</span>
          <h1>Financial Freedom Starts with <span>Wisdom</span></h1>
          <p>Take control of your spending, set ambitious goals, and watch your savings grow with Africa's most intuitive personal finance tracker.</p>
          <div className="hero-btns">
            <Link to="/login?tab=register" className="btn btn-primary btn-large">Start for Free</Link>
            <a href="#features" className="btn btn-outline btn-large">See Features</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="mock-ui">
            <div className="mock-header">
              <div className="mock-bar md"></div>
              <div className="mock-bar sm blue"></div>
            </div>
            <div className="mock-chart">
              <div className="mock-column" style={{ height: '40%' }}></div>
              <div className="mock-column" style={{ height: '70%' }}></div>
              <div className="mock-column" style={{ height: '55%' }}></div>
              <div className="mock-column" style={{ height: '90%' }}></div>
              <div className="mock-column" style={{ height: '65%' }}></div>
            </div>
            <div className="mock-lines">
              <div className="mock-bar md"></div>
              <div className="mock-bar full"></div>
              <div className="mock-bar lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="features">
        <div className="section-header">
          <h2>Designed for Your Growth</h2>
          <p>Everything you need to manage your money efficiently in one sleek, secure platform.</p>
        </div>
        <div className="feature-grid">
          <FeatureCard icon={<Receipt size={24} />} title="Track Expenses" description="Log every transaction in seconds. Categorize your spending and see exactly where your money goes." />
          <FeatureCard icon={<Target size={24} />} title="Smart Budgeting" description="Set monthly limits for different categories. Get notified when you're close to your limit." />
          <FeatureCard icon={<PieChart size={24} />} title="Visual Analytics" description="Beautiful charts and reports help you understand your financial patterns at a glance." />
          <FeatureCard icon={<Smartphone size={24} />} title="Mobile Friendly" description="Track your finances on the go. Optimized for all devices, from smartphones to desktops." />
          <FeatureCard icon={<Shield size={24} />} title="Secure & Private" description="Your data is encrypted and secure. We prioritize your privacy above everything else." />
          <FeatureCard icon={<FileOutput size={24} />} title="Export Reports" description="Need your data for accounting? Export detailed PDF or CSV reports with one click." />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-strip">
        <div className="stat-box"><h3>50K+</h3><p>Active Users</p></div>
        <div className="stat-box"><h3>$10M+</h3><p>Expenses Tracked</p></div>
        <div className="stat-box"><h3>99%</h3><p>User Satisfaction</p></div>
      </section>

      {/* ── Footer ── */}
      <footer id="about" className="landing-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="lp-logo">
              <TrendingUp className="lp-logo-icon" size={26} />
              <span className="lp-logo-text">Spend <span className="lp-logo-accent">Wisely</span></span>
            </Link>
            <p>Empowering people to take control of their financial destiny with simple, beautiful tools.</p>
            <div className="social-links">
              <a href="#"><Send size={18} /></a>
              <a href="#"><Globe size={18} /></a>
              <a href="#"><Camera size={18} /></a>
              <a href="#"><Briefcase size={18} /></a>
              <a href="#"><Code size={18} /></a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Platform</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/login?tab=register">Register</Link></li>
              <li><a href="#">Security</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Spend Wisely. Built with passion for financial freedom.</p>
        </div>
      </footer>

      <style>{`
        .landing-page {
          background-color: #f8fafc;
          overflow-x: hidden;
        }

        /* ═══════════════ NAVBAR ═══════════════ */
        .landing-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 72px;
          padding: 0 clamp(20px, 5%, 80px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 1000;
          border-bottom: 1px solid rgba(226, 232, 240, 0.7);
          box-shadow: 0 1px 8px rgba(15, 23, 42, 0.05);
        }

        /* Logo */
        .lp-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .lp-logo-icon { color: #2563eb; }
        .lp-logo-text {
          font-family: 'Sora', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }
        .lp-logo-accent {
          background: linear-gradient(135deg, #2563eb, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Desktop Links */
        .lp-nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lp-nav-link {
          padding: 8px 14px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.92rem;
          color: #475569;
          transition: background 0.2s, color 0.2s;
        }
        .lp-nav-link:hover { background: #eff6ff; color: #1d4ed8; }

        .lp-btn-signin {
          padding: 9px 18px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          border: 1.5px solid #2563eb;
          color: #1d4ed8;
          transition: background 0.2s;
        }
        .lp-btn-signin:hover { background: #eff6ff; }

        .lp-btn-getstarted {
          padding: 9px 20px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          background: linear-gradient(135deg, #1d4ed8, #6366f1);
          color: #fff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .lp-btn-getstarted:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }

        /* Hamburger — hidden on desktop */
        .lp-hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          color: #0f172a;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .lp-hamburger:hover,
        .lp-hamburger.open {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #2563eb;
        }
        .lp-hamburger:focus-visible {
          outline: 3px solid rgba(37, 99, 235, 0.4);
          outline-offset: 2px;
        }

        /* Mobile Dropdown */
        .lp-mobile-menu {
          display: none;
          flex-direction: column;
          position: absolute;
          top: 72px;
          left: 0;
          right: 0;
          background: #fff;
          border-bottom: 1.5px solid #e2e8f0;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
          padding: 12px 16px 20px;
          gap: 4px;
          opacity: 0;
          transform: translateY(-10px);
          pointer-events: none;
          transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lp-mobile-menu.open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .lp-mobile-link {
          display: block;
          padding: 13px 16px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          color: #334155;
          transition: background 0.2s, color 0.2s;
        }
        .lp-mobile-link:hover { background: #eff6ff; color: #1d4ed8; }

        .lp-mobile-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 8px 0;
        }

        .lp-mobile-cta {
          display: block;
          margin-top: 8px;
          padding: 14px 20px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1d4ed8, #6366f1);
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
          text-align: center;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .lp-mobile-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }

        /* Backdrop */
        .lp-backdrop {
          position: fixed;
          inset: 72px 0 0 0;
          background: rgba(15, 23, 42, 0.18);
          backdrop-filter: blur(2px);
          z-index: 999;
        }

        /* ═══════════════ HERO ═══════════════ */
        .hero {
          padding: 140px 5% 100px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
          background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent),
                      radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.05), transparent);
        }

        .hero-content { max-width: 600px; }
        .hero-tag {
          display: inline-block;
          padding: 6px 16px;
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          border-radius: 99px;
          font-weight: 700;
          font-size: 0.85rem;
          margin-bottom: 20px;
        }

        .hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; margin-bottom: 24px; }
        .hero h1 span { color: #2563eb; }
        .hero p { font-size: clamp(1rem, 2vw, 1.2rem); color: #475569; margin-bottom: 40px; line-height: 1.7; }

        .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }
        .btn-large { padding: 14px 28px; font-size: 1rem; }

        .hero-visual {
          width: 460px;
          height: 380px;
          background: linear-gradient(135deg, #2563eb, #6366f1);
          border-radius: 40px;
          transform: rotate(-3deg);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mock-ui {
          background: white;
          width: 85%;
          height: 75%;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 24px;
          transform: rotate(3deg);
        }

        .mock-header { display: flex; justify-content: space-between; margin-bottom: 24px; }
        .mock-bar { height: 8px; background: #e2e8f0; border-radius: 4px; }
        .mock-bar.md { width: 80px; }
        .mock-bar.sm { width: 40px; }
        .mock-bar.lg { width: 120px; }
        .mock-bar.full { width: 100%; margin-bottom: 12px; }
        .mock-bar.blue { background: #2563eb; opacity: 0.2; }

        .mock-chart {
          height: 110px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          padding: 10px;
        }
        .mock-column { width: 20px; background: #2563eb; border-radius: 4px 4px 0 0; }

        /* ═══════════════ FEATURES ═══════════════ */
        .features { padding: 100px 5%; background: white; }
        .section-header { text-align: center; max-width: 700px; margin: 0 auto 60px; }
        .section-header h2 { font-size: clamp(1.8rem, 4vw, 2.5rem); margin-bottom: 16px; }
        .section-header p { color: #475569; font-size: 1.05rem; }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 28px;
        }
        .feature-card-ui {
          padding: 36px;
          background: #f8fafc;
          border-radius: 28px;
          transition: all 0.3s;
          border: 1px solid transparent;
        }
        .feature-card-ui:hover {
          transform: translateY(-8px);
          background: white;
          border-color: #2563eb;
          box-shadow: 0 24px 48px rgba(37, 99, 235, 0.1);
        }
        .feature-icon-box {
          width: 60px; height: 60px;
          background: white;
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
          color: #2563eb;
        }

        /* ═══════════════ STATS ═══════════════ */
        .stats-strip {
          padding: 80px 5%;
          background: #0f172a;
          color: white;
          display: flex;
          justify-content: space-around;
          text-align: center;
          flex-wrap: wrap;
          gap: 40px;
        }
        .stat-box h3 { font-size: 3rem; color: #2563eb; margin-bottom: 10px; }
        .stat-box p { font-weight: 600; opacity: 0.8; }

        /* ═══════════════ FOOTER ═══════════════ */
        .landing-footer { padding: 80px 5%; background: white; border-top: 1px solid #e2e8f0; }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }
        .footer-brand p { color: #475569; margin: 20px 0; max-width: 300px; line-height: 1.6; }
        .social-links { display: flex; gap: 12px; }
        .social-links a {
          width: 38px; height: 38px;
          background: #f8fafc; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #2563eb;
          transition: background 0.2s, transform 0.2s;
        }
        .social-links a:hover { background: #eff6ff; transform: translateY(-2px); }

        .footer-links h4 { margin-bottom: 20px; font-size: 1rem; color: #0f172a; }
        .footer-links ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .footer-links ul li a { color: #475569; font-size: 0.95rem; transition: color 0.2s; }
        .footer-links ul li a:hover { color: #2563eb; }

        .footer-bottom {
          text-align: center;
          padding-top: 40px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 0.9rem;
        }

        /* Global btn overrides for landing page */
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 12px; font-weight: 700; transition: all 0.25s; white-space: nowrap; border: 2px solid transparent; cursor: pointer; }
        .btn-primary { background: linear-gradient(135deg, #1d4ed8, #6366f1); color: white; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35); }
        .btn-outline { background: transparent; color: #1d4ed8; border: 2px solid #2563eb; }
        .btn-outline:hover { background: #eff6ff; }

        /* ═══════════════ RESPONSIVE ═══════════════ */

        /* Tablet & Mobile: show hamburger, hide desktop links */
        @media (max-width: 768px) {
          .lp-nav-links { display: none; }
          .lp-hamburger { display: flex; }
          .lp-mobile-menu { display: flex; }

          .hero {
            flex-direction: column;
            text-align: center;
            padding: 100px 5% 70px;
            gap: 40px;
          }
          .hero-visual { display: none; }
          .hero-btns { justify-content: center; }

          .features { padding: 70px 5%; }
          .section-header { margin-bottom: 40px; }
          .feature-grid { grid-template-columns: 1fr; gap: 18px; }
          .feature-card-ui { padding: 28px; border-radius: 20px; }

          .stats-strip { padding: 60px 5%; }
          .stat-box h3 { font-size: 2.4rem; }

          .landing-footer { padding: 60px 5%; }
          .footer-grid { grid-template-columns: 1fr; gap: 40px; }
        }

        @media (max-width: 480px) {
          .hero-btns { flex-direction: column; align-items: stretch; gap: 12px; }
          .hero-btns a, .hero-btns .btn { text-align: center; padding: 14px 20px; }
          .stats-strip { flex-direction: column; align-items: center; gap: 32px; }
          .stat-box h3 { font-size: 2rem; }
        }

        /* Reduce animation for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .lp-mobile-menu { transition: none; }
          .feature-card-ui:hover { transform: none; }
          .lp-btn-getstarted:hover { transform: none; }
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="feature-card-ui">
    <div className="feature-icon-box">{icon}</div>
    <h3>{title}</h3>
    <p style={{ color: '#475569', marginTop: '12px', lineHeight: '1.6' }}>{description}</p>
  </div>
);

export default LandingPage;
