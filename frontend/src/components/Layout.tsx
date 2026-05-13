import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const [userName, setUserName] = useState('User');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const storedName = localStorage.getItem('sw_user_name');
    const storedBalance = localStorage.getItem('sw_balance');
    if (storedName) setUserName(storedName);
    if (storedBalance) setBalance(Number(storedBalance));
  }, []);

  return (
    <div className="layout">
      <Navbar userName={userName} balance={balance} />
      <div className="layout-body">
        <Sidebar />
        <main className="main-content">
          <div className="content-container">
            {title && <h1 className="page-title">{title}</h1>}
            {children}
          </div>
        </main>
      </div>

      <style>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .layout-body {
          display: flex;
          flex: 1;
        }
        
        .main-content {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
        }
        
        .content-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        
        .page-title {
          font-size: 1.8rem;
          margin-bottom: 30px;
          color: var(--ink);
        }

        @media (max-width: 768px) {
          .main-content { padding: 20px; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
