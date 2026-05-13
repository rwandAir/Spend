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
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <style>{`
        .sidebar {
          width: 240px;
          background: var(--white);
          border-right: 1px solid var(--border);
          height: calc(100vh - 70px);
          position: sticky;
          top: 70px;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
        }
        
        .sidebar-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 24px;
          color: var(--muted);
          font-weight: 600;
          transition: all 0.2s;
          margin: 4px 12px;
          border-radius: 12px;
        }
        
        .nav-item:hover {
          background: var(--blue-light);
          color: var(--blue);
        }
        
        .nav-item.active {
          background: var(--blue-light);
          color: var(--blue);
        }
        
        .logout-btn {
          width: calc(100% - 24px);
          color: var(--error);
          margin-top: auto;
        }
        
        .logout-btn:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none; /* Mobile menu logic can be added later */
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
