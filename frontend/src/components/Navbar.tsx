import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  TrendingUp,
  Wallet,
  User as UserIcon,
  Menu,
  X,
  LayoutDashboard,
  Receipt,
  ArrowLeftRight,
  Tags,
  PieChart,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { authService } from '../services/api';

interface NavbarProps {
  userName: string;
  balance: number;
}

const Navbar = ({ userName, balance }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const navItems = [
    { name: 'Dashboard',    path: '/dashboard',    icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
    { name: 'Expenses',     path: '/expenses',     icon: Receipt },
    { name: 'Budget',       path: '/budget',       icon: Tags },
    { name: 'Reports',      path: '/reports',      icon: PieChart },
  ];

  const handleLogout = async () => {
    try { await authService.logout(); } catch (_) {}
    localStorage.clear();
    window.location.href = '/';
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Close menu on Escape key press
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Focus the close button when the drawer opens
  useEffect(() => {
    if (isMenuOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isMenuOpen]);

  const initial = userName?.trim().charAt(0).toUpperCase() || '';

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/dashboard" className="nav-logo" onClick={closeMenu}>
            <div className="nav-logo-icon">
              <TrendingUp size={20} strokeWidth={2.5} />
            </div>
            <span className="nav-logo-text">
              Spend<span className="nav-logo-accent"> Wisely</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="nav-desktop-links" aria-label="Main Navigation">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-desktop-link${active ? ' active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="nav-right">
            {/* Balance pill */}
            <div className="nav-balance" aria-label={`Balance: RWF ${balance.toLocaleString()}`}>
              <div className="nav-balance-icon">
                <Wallet size={13} strokeWidth={2.5} />
              </div>
              <span>RWF {balance.toLocaleString()}</span>
            </div>

            {/* User chip — desktop only */}
            <div className="nav-user">
              <div className="nav-avatar" aria-hidden="true">
                {initial || <UserIcon size={14} strokeWidth={2.5} />}
              </div>
              <span className="nav-username">{userName}</span>
            </div>

            {/* Hamburger */}
            <button
              className={`nav-hamburger${isMenuOpen ? ' is-open' : ''}`}
              onClick={() => setIsMenuOpen(o => !o)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <div
        id="mobile-menu"
        className={`mobile-backdrop${isMenuOpen ? ' visible' : ''}`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      >
        <div
          className={`mobile-drawer${isMenuOpen ? ' open' : ''}`}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-label="Navigation menu"
        >
          {/* Drawer header */}
          <div className="drawer-header">
            <div className="drawer-avatar-ring">
              <div className="drawer-avatar">
                {initial || <UserIcon size={18} strokeWidth={2.5} />}
              </div>
            </div>
            <div className="drawer-user-info">
              <span className="drawer-name">{userName}</span>
              <span className="drawer-sub">Personal Account</span>
            </div>
            <button
              ref={closeButtonRef}
              className="drawer-close"
              onClick={closeMenu}
              aria-label="Close menu"
              tabIndex={isMenuOpen ? 0 : -1}
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Balance row */}
          <div className="drawer-balance">
            <span className="drawer-balance-label">Current Balance</span>
            <span className="drawer-balance-val">RWF {balance.toLocaleString()}</span>
          </div>

          <div className="drawer-divider" />

          {/* Nav links */}
          <nav className="drawer-nav">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`drawer-link${active ? ' active' : ''}`}
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={closeMenu}
                  tabIndex={isMenuOpen ? 0 : -1}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="drawer-link-icon">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <span className="drawer-link-text">{item.name}</span>
                  {active && <span className="drawer-link-dot" aria-hidden="true" />}
                  {!active && <ChevronRight size={14} className="drawer-link-chevron" />}
                </Link>
              );
            })}
          </nav>

          <div className="drawer-divider" />

          {/* Logout */}
          <button
            className="drawer-logout"
            onClick={handleLogout}
            tabIndex={isMenuOpen ? 0 : -1}
          >
            <LogOut size={18} strokeWidth={2} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <style>{`
        /* ─── Navbar Shell ─────────────────────────────── */
        .navbar {
          height: 72px;
          background: #fff;
          border-bottom: 1.5px solid #e2e8f0;
          box-shadow: 0 1px 4px rgba(15,23,42,0.04);
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
        }

        .navbar-inner {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 40px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* ─── Logo ─────────────────────────────────────── */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .nav-logo-icon {
          width: 36px;
          height: 36px;
          background: #eff6ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          transition: background 0.25s, transform 0.25s;
          flex-shrink: 0;
        }
        .nav-logo:hover .nav-logo-icon {
          background: linear-gradient(135deg, #2563eb, #6366f1);
          color: #fff;
          transform: rotate(8deg) scale(1.05);
        }

        .nav-logo-text {
          font-family: 'Sora', sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }
        .nav-logo-accent {
          background: linear-gradient(135deg, #2563eb, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* ─── Right Section ─────────────────────────────── */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Balance pill */
        .nav-balance {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #eff6ff;
          color: #1d4ed8;
          border: 1.5px solid #bfdbfe;
          border-radius: 999px;
          padding: 7px 14px;
          font-weight: 700;
          font-size: 0.84rem;
          white-space: nowrap;
          transition: background 0.2s, border-color 0.2s;
        }
        .nav-balance:hover {
          background: #dbeafe;
          border-color: #93c5fd;
        }
        .nav-balance-icon {
          width: 22px;
          height: 22px;
          background: #2563eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }

        /* User chip — desktop only */
        .nav-user {
          display: flex;
          align-items: center;
          gap: 9px;
          cursor: default;
        }
        .nav-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .nav-username {
          font-weight: 700;
          font-size: 0.9rem;
          color: #0f172a;
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Desktop Navigation Links */
        .nav-desktop-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-desktop-link {
          padding: 8px 16px;
          border-radius: 10px;
          color: #64748b;
          font-weight: 700;
          font-size: 0.9rem;
          transition: background 0.2s, color 0.2s, transform 0.15s;
          border: 1.5px solid transparent;
          text-decoration: none;
        }
        .nav-desktop-link:hover {
          background: #eff6ff;
          color: #1d4ed8;
        }
        .nav-desktop-link.active {
          background: #eff6ff;
          color: #1d4ed8;
          border-color: #bfdbfe;
        }
        .nav-desktop-link:focus-visible {
          outline: 3px solid rgba(37,99,235,0.4);
          outline-offset: 2px;
        }

        /* Hamburger */
        .nav-hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          color: #0f172a;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .nav-hamburger:hover,
        .nav-hamburger.is-open {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #2563eb;
        }

        /* ─── Mobile Backdrop ───────────────────────────── */
        .mobile-backdrop {
          display: none;
          position: fixed;
          inset: 72px 0 0 0;
          background: rgba(15,23,42,0.25);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 99;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .mobile-backdrop.visible {
          opacity: 1;
          pointer-events: auto;
        }

        /* ─── Drawer ────────────────────────────────────── */
        .mobile-drawer {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 20px 48px rgba(15,23,42,0.14);
          transform: translateY(-16px) scale(0.97);
          opacity: 0;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s;
          pointer-events: none;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }
        .mobile-drawer.open {
          transform: translateY(0) scale(1);
          opacity: 1;
          pointer-events: auto;
        }

        /* Drawer header */
        .drawer-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 20px 16px;
        }
        .drawer-avatar-ring {
          padding: 2px;
          background: linear-gradient(135deg, #2563eb, #6366f1);
          border-radius: 50%;
          flex-shrink: 0;
        }
        .drawer-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          font-weight: 800;
          font-size: 1rem;
        }
        .drawer-user-info {
          flex: 1;
          min-width: 0;
        }
        .drawer-name {
          display: block;
          font-weight: 700;
          font-size: 0.95rem;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .drawer-sub {
          font-size: 0.76rem;
          color: #64748b;
          font-weight: 600;
        }
        .drawer-close {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          flex-shrink: 0;
          transition: background 0.2s, color 0.2s;
        }
        .drawer-close:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

        /* Balance row */
        .drawer-balance {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 16px 16px;
          padding: 14px 16px;
          background: #eff6ff;
          border: 1.5px solid #bfdbfe;
          border-radius: 14px;
        }
        .drawer-balance-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .drawer-balance-val {
          font-size: 1rem;
          font-weight: 800;
          color: #1d4ed8;
        }

        /* Divider */
        .drawer-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 0;
        }

        /* Nav links */
        .drawer-nav {
          display: flex;
          flex-direction: column;
          padding: 10px 10px;
          gap: 2px;
        }
        .drawer-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 14px;
          border-radius: 12px;
          color: #64748b;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          position: relative;
          transition: background 0.2s, color 0.2s, transform 0.2s;
          animation: drawerLinkIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
          opacity: 0;
        }
        @keyframes drawerLinkIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .drawer-link { animation: none; opacity: 1; }
        }
        .drawer-link:hover {
          background: #eff6ff;
          color: #1d4ed8;
        }
        .drawer-link.active {
          background: #eff6ff;
          color: #1d4ed8;
        }
        .drawer-link-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .drawer-link.active .drawer-link-icon,
        .drawer-link:hover .drawer-link-icon {
          background: #dbeafe;
        }
        .drawer-link-text { flex: 1; }
        .drawer-link-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2563eb;
          box-shadow: 0 0 8px rgba(37,99,235,0.5);
        }
        .drawer-link-chevron {
          color: #94a3b8;
          flex-shrink: 0;
        }

        /* Logout */
        .drawer-logout {
          display: flex;
          align-items: center;
          gap: 12px;
          width: calc(100% - 20px);
          margin: 10px;
          padding: 13px 14px;
          border-radius: 12px;
          color: #dc2626;
          font-weight: 700;
          font-size: 0.92rem;
          background: transparent;
          border: 1.5px solid transparent;
          transition: background 0.2s, border-color 0.2s;
        }
        .drawer-logout:hover {
          background: #fef2f2;
          border-color: #fecaca;
        }

        /* ─── Responsive Breakpoints ────────────────────── */

        /* ≤ 1023px: show hamburger, hide user chip, balance pill, and desktop links */
        @media (max-width: 1023px) {
          .nav-hamburger { display: flex; }
          .nav-user      { display: none; }
          .nav-balance   { display: none; }
          .nav-desktop-links { display: none; }
          .mobile-backdrop { display: block; }
        }

        /* ≤ 767px: smaller balance pill */
        @media (max-width: 767px) {
          .navbar { height: 64px; }
          .mobile-backdrop { top: 64px; }
          .nav-balance { padding: 6px 12px; font-size: 0.8rem; gap: 6px; }
          .nav-balance-icon { width: 20px; height: 20px; }
        }

        /* ≤ 479px: hide logo text, keep only icon */
        @media (max-width: 479px) {
          .nav-logo-text { display: none; }
          .nav-right     { gap: 8px; }
          .nav-balance   { padding: 6px 10px; font-size: 0.76rem; gap: 5px; }
        }

        /* ≤ 359px: simplest layout */
        @media (max-width: 359px) {
          .navbar-inner { padding: 0 12px; }
          .nav-balance  { display: none; }
        }

        /* Ultra-wide (≥ 1440px): max width cap already handled by navbar-inner */
      `}</style>
    </>
  );
};

export default Navbar;
