import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: string;
  type?: 'income' | 'expense' | 'balance';
}

const StatsCard = ({ title, value, icon, trend, type = 'balance' }: StatsCardProps) => {
  const getIconBg = () => {
    switch (type) {
      case 'income': return 'rgba(16, 185, 129, 0.1)';
      case 'expense': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(37, 99, 235, 0.1)';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'income': return 'var(--success)';
      case 'expense': return 'var(--error)';
      default: return 'var(--blue)';
    }
  };

  return (
    <div className="card stat-card">
      <div className="stat-icon" style={{ backgroundColor: getIconBg(), color: getIconColor() }}>
        {icon}
      </div>
      <div className="stat-content">
        <p className="stat-label">{title}</p>
        <h3 className="stat-value">{value}</h3>
        {trend && <p className="stat-trend">{trend}</p>}
      </div>

      <style>{`
        .stat-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
        }
        
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .stat-label {
          color: var(--muted);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        
        .stat-value {
          font-size: 1.5rem;
          color: var(--ink);
        }
        
        .stat-trend {
          font-size: 0.8rem;
          margin-top: 4px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default StatsCard;
