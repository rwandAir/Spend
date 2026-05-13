import { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, Search, Calendar, Filter, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import { dataService } from '../services/api';
import type { Transaction } from '../schema';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await dataService.getTransactions();
      setTransactions(res);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(tx => 
    tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.transaction_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Transaction History">
      <div className="card filters-card">
        <div className="search-box">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search by category, method, or type..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-actions">
          <button className="btn-filter"><Calendar size={18} /> Date</button>
          <button className="btn-filter"><Filter size={18} /> Filter</button>
        </div>
      </div>

      <div className="card table-card">
        {loading ? (
          <div className="table-loader">
            <Loader2 className="spinner" size={32} />
            <p>Fetching history...</p>
          </div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Type</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div className="tx-activity">
                        <div className={`tx-dot ${tx.transaction_type}`}></div>
                        <span>{tx.category}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${tx.transaction_type}`}>
                        {tx.transaction_type === 'income' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td>{tx.payment_method}</td>
                    <td className="text-muted">{tx.created_at}</td>
                    <td className={`text-right font-bold ${tx.transaction_type}`}>
                      {tx.transaction_type === 'income' ? '+' : '-'} RWF {tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="empty-row">No transactions found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .filters-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          padding: 15px 25px;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg);
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .search-box svg { color: var(--muted); }
        .search-box input {
          width: 100%;
          background: transparent;
          border: none;
          font-size: 0.95rem;
          color: var(--ink);
        }

        .filter-actions { display: flex; gap: 12px; }
        .btn-filter {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--muted);
          transition: all 0.2s;
        }
        .btn-filter:hover { border-color: var(--blue); color: var(--blue); }

        .table-card { padding: 0; overflow: hidden; }
        
        .tx-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .tx-table th {
          padding: 18px 24px;
          background: #fcfdfe;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted);
          border-bottom: 1px solid var(--border);
        }

        .tx-table td {
          padding: 18px 24px;
          border-bottom: 1px solid #f8fafc;
          font-size: 0.95rem;
          color: var(--ink);
        }

        .tx-activity { display: flex; align-items: center; gap: 12px; font-weight: 600; }
        .tx-dot { width: 8px; height: 8px; border-radius: 50%; }
        .tx-dot.income { background: var(--success); }
        .tx-dot.expense { background: var(--error); }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: capitalize;
        }

        .badge.income { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .badge.expense { background: rgba(239, 68, 68, 0.1); color: var(--error); }

        .text-right { text-align: right; }
        .text-muted { color: var(--muted); }
        .font-bold { font-weight: 700; }
        
        .income { color: var(--success); }
        .expense { color: var(--error); }

        .table-loader { text-align: center; padding: 60px 0; color: var(--muted); }
        .empty-row { text-align: center; padding: 60px 0; color: var(--muted); }

        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .filters-card { flex-direction: column; align-items: stretch; }
          .tx-table th:nth-child(3), .tx-table td:nth-child(3) { display: none; }
        }
      `}</style>
    </Layout>
  );
};

export default TransactionsPage;
