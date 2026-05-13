import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Transaction } from '../schema';

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

const TransactionList = ({ transactions, limit }: TransactionListProps) => {
  const displayList = limit ? transactions.slice(0, limit) : transactions;

  if (displayList.length === 0) {
    return <p className="empty-msg">No transactions found.</p>;
  }

  return (
    <div className="transaction-list-comp">
      {displayList.map((tx) => (
        <div key={tx.id} className="tx-item">
          <div className={`tx-icon-box ${tx.transaction_type}`}>
            {tx.transaction_type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </div>
          <div className="tx-main">
            <p className="tx-name">{tx.category}</p>
            <p className="tx-date">{tx.created_at} • {tx.payment_method}</p>
          </div>
          <p className={`tx-val ${tx.transaction_type}`}>
            {tx.transaction_type === 'income' ? '+' : '-'} RWF {tx.amount.toLocaleString()}
          </p>
        </div>
      ))}

      <style>{`
        .transaction-list-comp { display: flex; flex-direction: column; gap: 12px; }
        .tx-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          border-radius: 16px;
          transition: background 0.2s;
        }
        .tx-item:hover { background: var(--bg); }
        .tx-icon-box {
          width: 40px; height: 40px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .tx-icon-box.income { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .tx-icon-box.expense { background: rgba(239, 68, 68, 0.1); color: var(--error); }
        .tx-main { flex: 1; }
        .tx-name { font-weight: 700; color: var(--ink); font-size: 0.95rem; }
        .tx-date { font-size: 0.8rem; color: var(--muted); margin-top: 2px; }
        .tx-val { font-weight: 800; font-size: 1rem; }
        .tx-val.income { color: var(--success); }
        .tx-val.expense { color: var(--error); }
        .empty-msg { text-align: center; color: var(--muted); padding: 40px 0; }
      `}</style>
    </div>
  );
};

export default TransactionList;
