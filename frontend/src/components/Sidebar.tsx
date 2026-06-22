import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, ArrowLeftRight, Tags, PieChart, LogOut } from 'lucide-react';
import { authService } from '../services/api';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Budget', path: '/budget', icon: Tags },
    { name: 'Reports', path: '/reports', icon: PieChart },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <nav className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-item-icon"><Icon size={18} strokeWidth={2} /></span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-btn-icon"><LogOut size={18} strokeWidth={2} /></span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <style>{`
        .sidebar {
          width: 240px;
          background: #fff;
          border-right: 1.5px solid #e2e8f0;
          height: calc(100vh - 72px);
          position: sticky;
          top: 72px;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
        
        .sidebar-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
          overflow-y: auto;
        }
        
        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 8px;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          color: #64748b;
          font-weight: 700;
          font-size: 0.9rem;
          transition: background 0.2s, color 0.2s, transform 0.2s;
          border-radius: 12px;
          text-decoration: none;
          border: 1.5px solid transparent;
        }
        
        .nav-item:hover {
          background: #eff6ff;
          color: #1d4ed8;
          transform: translateX(2px);
        }
        
        .nav-item.active {
          background: #eff6ff;
          color: #1d4ed8;
          border-color: #bfdbfe;
          box-shadow: 0 2px 8px rgba(37,99,235,0.06);
        }
        
        .nav-item-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .nav-item.active .nav-item-icon,
        .nav-item:hover .nav-item-icon {
          background: #dbeafe;
        }

        .sidebar-footer {
          padding: 8px;
        }
        
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          color: #dc2626;
          font-weight: 700;
          font-size: 0.9rem;
          border-radius: 12px;
          background: transparent;
          border: 1.5px solid transparent;
          transition: background 0.2s, border-color 0.2s;
        }
        
        .logout-btn:hover {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .logout-btn-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #fef2f2;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @media (max-width: 1023px) {
          .sidebar { display: none; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
