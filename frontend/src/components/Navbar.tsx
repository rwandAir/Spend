import { Link } from 'react-router-dom';
import { TrendingUp, Wallet, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  userName: string;
  balance: number;
}

const Navbar = ({ userName, balance }: NavbarProps) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="logo">
          <TrendingUp className="logo-icon" size={28} />
          <span>Spend <span>Wisely</span></span>
        </Link>
        
        <div className="user-section">
          <div className="balance-pill">
            <Wallet size={16} />
            <span>RWF {balance.toLocaleString()}</span>
          </div>
          <div className="user-profile">
            <div className="avatar">
              <UserIcon size={18} />
            </div>
            <span className="user-name">{userName}</span>
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          height: 70px;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
        }
        
        .navbar-container {
          width: 100%;
          padding: 0 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--ink);
        }
        
        .logo-icon {
          color: var(--blue);
        }
        
        .logo span span {
          color: var(--blue);
        }
        
        .user-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .balance-pill {
          background: var(--blue-light);
          color: var(--blue);
          padding: 8px 16px;
          border-radius: 99px;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .user-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .avatar {
          width: 36px;
          height: 36px;
          background: var(--bg);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          border: 1px solid var(--border);
        }
        
        .user-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--ink);
        }

        @media (max-width: 600px) {
          .user-name { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
