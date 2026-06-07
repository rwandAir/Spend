import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { TrendingUp, Mail, Lock, User as UserIcon, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '../services/api';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register') setActiveTab('register');
  }, [searchParams]);

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

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">
          <div className="brand-icon-box">
            <TrendingUp size={28} />
          </div>
          <h1>Spend <span>Wisely</span></h1>
          <p>Smart financial companion</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setError(null); }}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setError(null); }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert success">
            <span>{success}</span>
          </div>
        )}

        {activeTab === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-field">
              <label>Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={18} />
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-field">
              <label>Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} />
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>
            </div>
            <button className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <Loader2 className="spinner" size={20} /> : 'Sign In'}
            </button>
            <p className="auth-switch">
              Don't have an account? <span onClick={() => setActiveTab('register')}>Create one</span>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-field">
              <label>Full Name</label>
              <div className="input-icon-wrap">
                <UserIcon size={18} />
                <input 
                  type="text" 
                  placeholder="Jean Uwimana" 
                  required
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                />
              </div>
            </div>
            <div className="form-field">
              <label>Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={18} />
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  required
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-field">
              <label>Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} />
                <input 
                  type="password" 
                  placeholder="At least 4 characters" 
                  required
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                />
              </div>
            </div>
            <button className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <Loader2 className="spinner" size={20} /> : 'Create Account'}
            </button>
            <p className="auth-switch">
              Already have an account? <span onClick={() => setActiveTab('login')}>Sign in</span>
            </p>
          </form>
        )}
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          padding: 48px 40px;
          border-radius: 32px;
          background: var(--white);
        }

        .auth-brand { text-align: center; margin-bottom: 32px; }
        .brand-icon-box {
          width: 60px; height: 60px;
          background: linear-gradient(135deg, var(--blue), var(--indigo));
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          color: white;
        }

        .auth-brand h1 { font-size: 1.6rem; color: var(--ink); }
        .auth-brand h1 span { color: var(--blue); }
        .auth-brand p { color: var(--muted); font-size: 0.9rem; margin-top: 4px; }

        .auth-tabs {
          display: flex;
          background: var(--blue-light);
          padding: 5px;
          border-radius: 16px;
          margin-bottom: 30px;
        }

        .auth-tab-btn {
          flex: 1;
          padding: 10px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--muted);
          transition: all 0.2s;
        }

        .auth-tab-btn.active {
          background: var(--white);
          color: var(--blue);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
        }

        .auth-alert {
          padding: 14px;
          border-radius: 14px;
          font-size: 0.9rem;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .auth-alert.error { background: #fef2f2; color: var(--error); border: 1px solid #fee2e2; }
        .auth-alert.success { background: #ecfdf5; color: var(--success); border: 1px solid #d1fae5; }

        .form-field { margin-bottom: 20px; }
        .form-field label { display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 8px; color: var(--ink); }

        .input-icon-wrap { position: relative; }
        .input-icon-wrap svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .input-icon-wrap input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border: 1.5px solid var(--border);
          border-radius: 14px;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .input-icon-wrap input:focus { border-color: var(--blue); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }

        .auth-submit { width: 100%; margin-top: 10px; padding: 15px; justify-content: center; }

        .auth-switch { text-align: center; margin-top: 24px; font-size: 0.85rem; color: var(--muted); }
        .auth-switch span { color: var(--blue); font-weight: 700; cursor: pointer; }

        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AuthPage;
