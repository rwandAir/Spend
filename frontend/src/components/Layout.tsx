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
          background: #f8fafc;
        }
        
        .layout-body {
          display: flex;
          flex: 1;
          min-height: 0;
        }
        
        .main-content {
          flex: 1;
          padding: clamp(20px, 4vw, 36px) clamp(16px, 4vw, 36px);
          overflow-y: auto;
          min-width: 0;
        }
        
        .content-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        
        .page-title {
          font-size: clamp(1.4rem, 3vw, 1.9rem);
          margin-bottom: 28px;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        @media (max-width: 767px) {
          .page-title { margin-bottom: 20px; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
