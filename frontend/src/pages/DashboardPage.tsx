import { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, Wallet, PlusCircle, Clock, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import { dataService } from '../services/api';
import type { DashboardData } from '../schema';

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [incomeLoading, setIncomeLoading] = useState(false);
  const [incomeForm, setIncomeForm] = useState({ amount: '', description: '', date: new Date().toISOString().split('T')[0], payment_method: 'Cash' });

  const fetchDashboard = async () => {
    try {
      const res = await dataService.getDashboard();
      setData(res);
      // Update local storage balance to keep navbar in sync
      localStorage.setItem('sw_balance', res.current_balance.toString());
    } catch (error) {
      console.error('Failed to fetch dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.amount || Number(incomeForm.amount) <= 0) return;

    setIncomeLoading(true);
    try {
      const res = await dataService.addIncome({
        amount: Number(incomeForm.amount),
        description: incomeForm.description,
        income_date: incomeForm.date,
        payment_method: incomeForm.payment_method
      });
      if (res.success) {
        setIncomeForm({ amount: '', description: '', date: new Date().toISOString().split('T')[0], payment_method: 'Cash' });
        fetchDashboard();
      }
    } catch (error) {
      console.error('Failed to add income', error);
    } finally {
      setIncomeLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loader-container">
          <Loader2 className="spinner" size={40} />
          <p>Loading your finances...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="welcome-card card">
        <div className="welcome-icon">
          <TrendingUp size={32} />
        </div>
        <div>
          <h2>Welcome back, {localStorage.getItem('sw_user_name')}!</h2>
          <p>You've tracked {data?.recent_transactions.length || 0} activities recently. Here's your financial overview.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard 
          title="Total Income" 
          value={`RWF ${(data?.total_income || 0).toLocaleString()}`} 
          icon={<TrendingUp size={24} />} 
          type="income" 
        />
        <StatsCard 
          title="Total Expenses" 
          value={`RWF ${(data?.total_expenses || 0).toLocaleString()}`} 
          icon={<TrendingDown size={24} />} 
          type="expense" 
        />
        <StatsCard 
          title="Current Balance" 
          value={`RWF ${(data?.current_balance || 0).toLocaleString()}`} 
          icon={<Wallet size={24} />} 
          type="balance" 
        />
      </div>

      <div className="dashboard-grid">
        <div className="card income-section">
          <h3><PlusCircle size={20} className="header-icon income" /> Add Income</h3>
          <form className="horizontal-form" onSubmit={handleAddIncome}>
            <div className="form-group">
              <input 
                type="number" 
                className="form-input"
                placeholder="Amount (RWF)" 
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="text" 
                className="form-input"
                placeholder="Description" 
                value={incomeForm.description}
                onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <select 
                className="form-select"
                value={incomeForm.payment_method}
                onChange={(e) => setIncomeForm({ ...incomeForm, payment_method: e.target.value })}
              >
                <option value="Cash">Cash</option>
                <option value="MTN MoMo">MTN MoMo</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <button className="btn btn-primary" disabled={incomeLoading}>
              {incomeLoading ? <Loader2 className="spinner" size={18} /> : 'Add'}
            </button>
          </form>
        </div>

        <div className="card recent-section">
          <h3><Clock size={20} className="header-icon" /> Recent Transactions</h3>
          <div className="transaction-list">
            {data?.recent_transactions && data.recent_transactions.length > 0 ? (
              data.recent_transactions.map((tx) => (
                <div key={tx.id} className="transaction-item">
                  <div className={`tx-icon ${tx.transaction_type}`}>
                    {tx.transaction_type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </div>
                  <div className="tx-info">
                    <p className="tx-title">{tx.category}</p>
                    <p className="tx-meta">{tx.created_at} • {tx.payment_method}</p>
                  </div>
                  <p className={`tx-amount ${tx.transaction_type}`}>
                    {tx.transaction_type === 'income' ? '+' : '-'} RWF {tx.amount.toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="empty-msg">No recent transactions found.</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .loader-container {
          height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          gap: 16px;
        }

        .welcome-card {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 30px;
          background: linear-gradient(135deg, var(--white) 0%, var(--blue-light) 100%);
          border: 1px solid rgba(37, 99, 235, 0.1);
        }

        .welcome-icon {
          width: 64px;
          height: 64px;
          background: var(--white);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--blue);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }

        .welcome-card h2 { font-size: 1.5rem; color: var(--ink); }
        .welcome-card p { color: var(--muted); margin-top: 4px; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 30px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        h3 {
          font-size: 1.1rem;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border);
        }

        .header-icon { color: var(--blue); }
        .header-icon.income { color: var(--success); }

        .horizontal-form {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .form-group { flex: 1; min-width: 150px; }
        


        .transaction-list { display: flex; flex-direction: column; gap: 16px; }
        
        .transaction-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          border-radius: 16px;
          transition: background 0.2s;
        }
        
        .transaction-item:hover { background: var(--bg); }

        .tx-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }

        .tx-icon.income { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .tx-icon.expense { background: rgba(239, 68, 68, 0.1); color: var(--error); }

        .tx-info { flex: 1; }
        .tx-title { font-weight: 700; color: var(--ink); font-size: 0.95rem; }
        .tx-meta { font-size: 0.8rem; color: var(--muted); margin-top: 2px; }

        .tx-amount { font-weight: 800; font-size: 1rem; }
        .tx-amount.income { color: var(--success); }
        .tx-amount.expense { color: var(--error); }

        .empty-msg { text-align: center; color: var(--muted); padding: 40px 0; }

        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </Layout>
  );
};

export default DashboardPage;
