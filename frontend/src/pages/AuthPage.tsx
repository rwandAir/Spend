import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/api';
import AuthLayout from '../components/AuthLayout';

// Social Icon Components


const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Remember me state
  const [rememberMe, setRememberMe] = useState(false);

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setError(null);
    setSuccess(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    navigate(`/auth?tab=${tab}`, { replace: true });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(loginData.email, loginData.password);
      if (data.success) {
        localStorage.setItem('sw_user_id', String(data.user_id));
        localStorage.setItem('sw_user_name', String(data.name));
        localStorage.setItem('sw_user_role', String(data.role));
        localStorage.setItem('sw_balance', String(data.balance ?? 0));
        setSuccess(`Welcome back, ${data.name}! Redirecting...`);
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err: any) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Frontend validations
    if (regData.password !== regData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!regData.acceptTerms) {
      setError("You must agree to the Terms & Conditions.");
      setLoading(false);
      return;
    }

    try {
      const data = await authService.register(regData.name, regData.email, regData.password);
      if (data.success) {
        localStorage.setItem('sw_user_id', String(data.user_id));
        localStorage.setItem('sw_user_name', String(data.name));
        localStorage.setItem('sw_user_role', String(data.role));
        localStorage.setItem('sw_balance', String(data.balance ?? 0));
        setSuccess('Account created! Welcome!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err: any) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = activeTab === 'login' ? 'Welcome Back' : 'Create Your Account';

  return (
    <AuthLayout title={pageTitle}>
      {/* Alert display */}
      {error && (
        <div className="auth-alert error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="auth-alert success" role="alert">
          <span>{success}</span>
        </div>
      )}


      <div className="auth-divider">
        <span>Use email</span>
      </div>

      {activeTab === 'login' ? (
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="auth-options">
            <label className="remember-me-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="forgot-password-link"
              onClick={() => setError("Password recovery is currently unavailable. Please contact support.")}
            >
              Forgot password?
            </button>
          </div>

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : 'Sign In'}
          </button>

          <p className="auth-switch">
            Don't have an account? <span onClick={() => handleTabChange('register')}>Create one</span>
          </p>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>
            <div className="input-wrapper">
              <UserIcon className="input-icon" size={18} />
              <input
                id="register-name"
                type="text"
                placeholder="Jean Uwimana"
                required
                value={regData.name}
                onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                required
                value={regData.email}
                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 4 characters"
                required
                value={regData.password}
                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-confirm-password">Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                required
                value={regData.confirmPassword}
                onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <label className="terms-checkbox">
            <input
              type="checkbox"
              checked={regData.acceptTerms}
              onChange={(e) => setRegData({ ...regData, acceptTerms: e.target.checked })}
              required
            />
            <span>
              I agree to the <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service"); }} className="terms-link">Terms & Conditions</a>
            </span>
          </label>

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : 'Create Account'}
          </button>

          <p className="auth-switch">
            Already have an account? <span onClick={() => handleTabChange('login')}>Sign in</span>
          </p>
        </form>
      )}

      <style>{`
        /* Alert Banners */
        .auth-alert {
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: alertSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .auth-alert.error {
          background: #fef2f2;
          color: var(--error);
          border: 1px solid #fee2e2;
        }

        .auth-alert.success {
          background: #ecfdf5;
          color: var(--success);
          border: 1px solid #d1fae5;
        }

        @keyframes alertSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Social Auth Layout */
        .social-auth-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 16px;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          background-color: var(--white);
          color: var(--ink);
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .social-btn:hover {
          background-color: var(--bg);
          border-color: #cbd5e1;
          transform: translateY(-1.5px);
        }

        .social-btn:active {
          transform: translateY(0);
        }

        /* Divider with text */
        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 20px 0;
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1.5px solid var(--border);
        }

        .auth-divider span {
          padding: 0 12px;
        }

        /* Input Form styling */
        .auth-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--ink);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper .input-icon {
          position: absolute;
          left: 16px;
          color: #94a3b8;
          pointer-events: none;
        }

        .input-wrapper input {
          width: 100%;
          padding: 12px 48px 12px 48px; /* symmetric padding on both sides to account for icon and toggle */
          border: 1.5px solid var(--border);
          border-radius: 12px;
          background-color: var(--bg);
          color: var(--ink);
          font-size: 0.95rem;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .input-wrapper input:focus {
          border-color: var(--blue);
          background-color: var(--white);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .input-wrapper input::placeholder {
          color: #94a3b8;
        }

        .password-toggle-btn {
          position: absolute;
          right: 12px;
          padding: 4px;
          color: #94a3b8;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s, background-color 0.2s;
        }

        .password-toggle-btn:hover {
          color: var(--ink);
          background-color: rgba(15, 23, 42, 0.05);
        }

        /* Remember Me & Forgot Password link container */
        .auth-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          font-size: 0.85rem;
        }

        .remember-me-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--muted);
          font-weight: 600;
          cursor: pointer;
        }

        .remember-me-checkbox input[type="checkbox"] {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1.5px solid var(--border);
          accent-color: var(--blue);
          cursor: pointer;
        }

        .forgot-password-link {
          color: var(--blue);
          font-weight: 700;
          transition: opacity 0.2s;
        }

        .forgot-password-link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        /* Terms and conditions signup checkbox */
        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 24px;
          font-size: 0.85rem;
          color: var(--muted);
          font-weight: 600;
          cursor: pointer;
          line-height: 1.4;
        }

        .terms-checkbox input[type="checkbox"] {
          width: 16px;
          height: 16px;
          margin-top: 2px;
          border-radius: 4px;
          border: 1.5px solid var(--border);
          accent-color: var(--blue);
          cursor: pointer;
        }

        .terms-link {
          color: var(--blue);
          font-weight: 700;
          text-decoration: none;
        }

        .terms-link:hover {
          text-decoration: underline;
        }

        /* Action and Switcher buttons */
        .auth-submit {
          width: 100%;
          padding: 14px;
          justify-content: center;
          font-size: 1rem;
        }

        .auth-submit:active {
          transform: translateY(0) scale(0.985);
        }

        .auth-switch {
          text-align: center;
          margin-top: 20px;
          font-size: 0.85rem;
          color: var(--muted);
        }

        .auth-switch span {
          color: var(--blue);
          font-weight: 700;
          cursor: pointer;
        }

        .auth-switch span:hover {
          text-decoration: underline;
        }

        /* Spinner for loading state */
        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 400px) {
          .social-auth-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AuthLayout>
  );
};

export default AuthPage;
