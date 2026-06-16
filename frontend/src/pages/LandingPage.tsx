import { Link } from 'react-router-dom';
import { TrendingUp, Receipt, Target, PieChart, Smartphone, Shield, FileOutput, Send, Globe, Camera, Briefcase, Code } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <Link to="/" className="logo">
          <TrendingUp className="logo-icon" size={28} />
          <span>Spend <span>Wisely</span></span>
        </Link>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/login" className="btn-auth btn-outline">Sign In</Link>
          <Link to="/login?tab=register" className="btn-auth btn-primary !text-white">Get Started</Link>
        </div>
      </nav>

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

      <section id="features" className="features">
        <div className="section-header">
          <h2>Designed for Your Growth</h2>
          <p>Everything you need to manage your money efficiently in one sleek, secure platform.</p>
        </div>
        <div className="feature-grid">
          <FeatureCard
            icon={<Receipt size={24} />}
            title="Track Expenses"
            description="Log every transaction in seconds. Categorize your spending and see exactly where your money goes."
          />
          <FeatureCard
            icon={<Target size={24} />}
            title="Smart Budgeting"
            description="Set monthly limits for different categories. Get notified when you're close to your limit."
          />
          <FeatureCard
            icon={<PieChart size={24} />}
            title="Visual Analytics"
            description="Beautiful charts and reports help you understand your financial patterns at a glance."
          />
          <FeatureCard
            icon={<Smartphone size={24} />}
            title="Mobile Friendly"
            description="Track your finances on the go. Optimized for all devices, from smartphones to desktops."
          />
          <FeatureCard
            icon={<Shield size={24} />}
            title="Secure & Private"
            description="Your data is encrypted and secure. We prioritize your privacy above everything else."
          />
          <FeatureCard
            icon={<FileOutput size={24} />}
            title="Export Reports"
            description="Need your data for accounting? Export detailed PDF or CSV reports with one click."
          />
        </div>
      </section>

      <section className="stats-strip">
        <div className="stat-box">
          <h3>50K+</h3>
          <p>Active Users</p>
        </div>
        <div className="stat-box">
          <h3>$10M+</h3>
          <p>Expenses Tracked</p>
        </div>
        <div className="stat-box">
          <h3>99%</h3>
          <p>User Satisfaction</p>
        </div>
      </section>

      <footer id="about" className="landing-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <TrendingUp className="logo-icon" size={28} />
              <span>Spend <span>Wisely</span></span>
            </Link>
            <p>Empowering people to take control of their financial destiny with simple, beautiful tools.</p>
            <div className="social-links">
              <a href="#"><Send size={20} /></a>
              <a href="#"><Globe size={20} /></a>
              <a href="#"><Camera size={20} /></a>
              <a href="#"><Briefcase size={20} /></a>
              <a href="#"><Code size={20} /></a>
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
          background-color: var(--bg);
          overflow-x: hidden;
        }

        .landing-nav {
          position: fixed;
          top: 0;
          width: 100%;
          padding: 20px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--glass);
          backdrop-filter: blur(10px);
          z-index: 1000;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--ink);
        }

        .logo span span { color: var(--blue); }
        .logo-icon { color: var(--blue); }

        .nav-links { display: flex; gap: 30px; align-items: center; }
        .nav-links a { font-weight: 600; color: var(--muted); }
        .nav-links a:hover { color: var(--blue); }

        .btn-auth {
          padding: 10px 24px;
          border-radius: 12px;
          font-weight: 700;
        }

        .btn-outline { border: 2px solid var(--blue); color: var(--blue); }
        .btn-outline:hover { background: var(--blue); color: white; }

        .btn-primary { background: linear-gradient(135deg, var(--blue), var(--indigo)); color: white; }

        .hero {
          padding: 180px 5% 100px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent),
                      radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.05), transparent);
        }

        .hero-content { max-width: 600px; }
        .hero-tag {
          display: inline-block;
          padding: 6px 16px;
          background: rgba(37, 99, 235, 0.1);
          color: var(--blue);
          border-radius: 99px;
          font-weight: 700;
          font-size: 0.85rem;
          margin-bottom: 20px;
        }

        .hero h1 { font-size: 3.5rem; line-height: 1.1; margin-bottom: 24px; }
        .hero h1 span { color: var(--blue); }
        .hero p { font-size: 1.2rem; color: var(--muted); margin-bottom: 40px; }

        .hero-btns { display: flex; gap: 20px; }
        .btn-large { padding: 16px 32px; font-size: 1.1rem; }

        .hero-visual {
          width: 500px;
          height: 400px;
          background: linear-gradient(135deg, var(--blue), var(--indigo));
          border-radius: 40px;
          transform: rotate(-3deg);
          box-shadow: 0 40px 80px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .mock-ui {
          background: white;
          width: 85%;
          height: 75%;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          padding: 24px;
          transform: rotate(3deg);
        }

        .mock-header { display: flex; justify-content: space-between; margin-bottom: 24px; }
        .mock-bar { height: 8px; background: #e2e8f0; border-radius: 4px; }
        .mock-bar.md { width: 80px; }
        .mock-bar.sm { width: 40px; }
        .mock-bar.lg { width: 120px; }
        .mock-bar.full { width: 100%; margin-bottom: 12px; }
        .mock-bar.blue { background: var(--blue); opacity: 0.2; }

        .mock-chart {
          height: 120px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          padding: 10px;
        }

        .mock-column { width: 20px; background: var(--blue); border-radius: 4px 4px 0 0; }

        .features { padding: 100px 5%; background: white; }
        .section-header { text-align: center; max-width: 700px; margin: 0 auto 60px; }
        .section-header h2 { font-size: 2.5rem; margin-bottom: 16px; }
        .section-header p { color: var(--muted); font-size: 1.1rem; }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .feature-card-ui {
          padding: 40px;
          background: var(--bg);
          border-radius: 32px;
          transition: all 0.3s;
          border: 1px solid transparent;
        }

        .feature-card-ui:hover {
          transform: translateY(-10px);
          background: white;
          border-color: var(--blue);
          box-shadow: 0 30px 60px rgba(37, 99, 235, 0.1);
        }

        .feature-icon-box {
          width: 64px;
          height: 64px;
          background: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          color: var(--blue);
        }

        .stats-strip {
          padding: 80px 5%;
          background: #0f172a;
          color: white;
          display: flex;
          justify-content: space-around;
          text-align: center;
        }

        .stat-box h3 { font-size: 3rem; color: var(--blue); margin-bottom: 10px; }
        .stat-box p { font-weight: 600; opacity: 0.8; }

        .landing-footer { padding: 80px 5%; background: white; border-top: 1px solid var(--border); }
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 60px; margin-bottom: 60px; }
        .footer-brand { grid-column: span 2; }
        .footer-brand p { color: var(--muted); margin: 24px 0; max-width: 300px; }
        
        .social-links { display: flex; gap: 15px; }
        .social-links a { 
          width: 40px; height: 40px; 
          background: var(--bg); border-radius: 12px; 
          display: flex; align-items: center; justify-content: center; 
          color: var(--blue); 
        }

        .footer-links h4 { margin-bottom: 24px; font-size: 1.1rem; }
        .footer-links ul { list-style: none; }
        .footer-links ul li { margin-bottom: 12px; }
        .footer-links ul li a { color: var(--muted); }
        .footer-links ul li a:hover { color: var(--blue); }

        .footer-bottom { 
          text-align: center; 
          padding-top: 40px; 
          border-top: 1px solid var(--border); 
          color: var(--muted); 
          font-size: 0.9rem; 
        }

        @media (max-width: 1024px) {
          .hero { flex-direction: column; text-align: center; padding-top: 140px; }
          .hero-visual { display: none; }
          .hero-btns { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="feature-card-ui">
    <div className="feature-icon-box">
      {icon}
    </div>
    <h3>{title}</h3>
    <p style={{ color: 'var(--muted)', marginTop: '12px' }}>{description}</p>
  </div>
);

export default LandingPage;
