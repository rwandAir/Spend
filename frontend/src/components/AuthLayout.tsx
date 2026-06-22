import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="auth-container">
      {/* Left Side: Image Section */}
      <div className="auth-image-side">
        <div className="auth-bg-image" />
        <div className="auth-bg-overlay" />
        
        {/* Clickable Logo */}
        <Link to="/" className="auth-logo" aria-label="Go to Homepage">
          <TrendingUp className="logo-icon" size={28} />
          <span>Spend <span className="logo-accent">Wisely</span></span>
        </Link>

        {/* Marketing Content */}
        <div className="auth-marketing-content">
          <h2 className="marketing-headline">Discover Amazing Events</h2>
          <p className="marketing-subtitle">
            Book tickets, manage events, and enjoy unforgettable experiences.
          </p>
        </div>
      </div>

      {/* Right Side: Form Section */}
      <div className="auth-form-side">
        <div className="auth-card-container">
          <h1 className="auth-card-title">{title}</h1>
          {children}
        </div>
      </div>

      <style>{`
        .auth-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          background-color: var(--bg);
        }

        /* Left side image panel */
        .auth-image-side {
          position: relative;
          width: 50%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px;
        }

        .auth-bg-image {
          position: absolute;
          inset: 0;
          background-image: url('https://plus.unsplash.com/premium_photo-1726880595917-c41dafdfb40b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D');
          background-size: cover;
          background-position: center;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
        }

        .auth-image-side:hover .auth-bg-image {
          transform: scale(1.05);
        }

        .auth-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(15, 23, 42, 0.3) 0%,
            rgba(15, 23, 42, 0.75) 100%
          );
          z-index: 2;
        }

        /* Logo styling */
        .auth-logo {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--white);
          font-size: 1.5rem;
          font-weight: 800;
          font-family: 'Sora', sans-serif;
          align-self: flex-start;
          text-decoration: none;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .auth-logo:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        .logo-icon {
          color: var(--white);
        }

        .logo-accent {
          color: #60a5fa; /* A softer light blue for dark background visibility */
        }

        /* Marketing text */
        .auth-marketing-content {
          position: relative;
          z-index: 3;
          margin-top: auto;
          max-width: 520px;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .marketing-headline {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--white);
          line-height: 1.2;
          margin-bottom: 16px;
          font-family: 'Sora', sans-serif;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .marketing-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        /* Right side form panel */
        .auth-form-side {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          overflow-y: auto;
        }

        .auth-card-container {
          width: 100%;
          max-width: 450px;
          background: var(--white);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
          animation: formFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .auth-card-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 8px;
          text-align: center;
          font-family: 'Sora', sans-serif;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes formFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .auth-container {
            flex-direction: column;
          }

          .auth-image-side {
            width: 100%;
            height: 320px;
            padding: 30px;
          }

          .auth-marketing-content {
            max-width: 100%;
          }

          .marketing-headline {
            font-size: 1.8rem;
            margin-bottom: 8px;
          }

          .marketing-subtitle {
            font-size: 0.95rem;
          }

          .auth-form-side {
            width: 100%;
            padding: 40px 20px;
            align-items: flex-start;
          }

          .auth-card-container {
            padding: 30px 24px;
            box-shadow: 0 10px 25px rgba(15, 23, 42, 0.04);
            border-radius: 20px;
          }
        }

        @media (max-width: 480px) {
          .auth-image-side {
            height: 260px;
            padding: 20px;
          }

          .auth-logo {
            font-size: 1.3rem;
          }

          .marketing-headline {
            font-size: 1.5rem;
          }

          .marketing-subtitle {
            font-size: 0.85rem;
          }

          .auth-card-container {
            padding: 24px 16px;
            border-radius: 16px;
          }

          .auth-card-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
