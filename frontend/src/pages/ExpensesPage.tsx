import { useState, useEffect } from 'react';
import { Receipt, Plus, Calendar, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { dataService } from '../services/api';
import type { Category } from '../schema';

const ExpensesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    payment_method: 'Cash'
  });

  const [budgetInfo, setBudgetInfo] = useState<{ spent: number, limit: number, remaining: number, percentage: number } | null>(null);

  const fetchData = async () => {
    try {
      const cats = await dataService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id || !formData.amount) return;

    setSubmitLoading(true);
    setMessage(null);
    try {
      const res = await dataService.addExpense({
        category_id: Number(formData.category_id),
        amount: Number(formData.amount),
        expense_date: formData.expense_date,
        payment_method: formData.payment_method
      });

      setMessage({ type: 'success', text: 'Expense added successfully!' });
      setBudgetInfo({
        spent: res.category_spent,
        limit: res.category_budget,
        remaining: res.remaining_budget,
        percentage: res.percentage_used
      });
      setFormData({ ...formData, amount: '' });
      // Update global balance in localStorage
      localStorage.setItem('sw_balance', res.balance.toString());
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message || 'Connection error' });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <Layout title="Add Expense"><div className="loader-container"><Loader2 className="spinner" size={32} /></div></Layout>;
  }

  return (
    <Layout title="Record an Expense">
      <div className="expenses-container">
        <div className="card expense-card">
          <form onSubmit={handleAddExpense}>
            <div className="form-grid">
              <div className="form-group">
                <label>Category</label>
                <div className="select-wrap">
                  <Receipt size={18} />
                  <select 
                    value={formData.category_id} 
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Amount (RWF)</label>
                <div className="input-wrap">
                  <span className="currency-prefix">RWF</span>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Date</label>
                <div className="input-wrap">
                  <Calendar size={18} />
                  <input 
                    type="date" 
                    value={formData.expense_date}
                    onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <div className="select-wrap">
                  <CreditCard size={18} />
                  <select 
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  >
                    <option value="Cash">Cash</option>
                    <option value="MTN MoMo">MTN MoMo</option>
                    <option value="Airtel Money">Airtel Money</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="btn btn-primary submit-expense-btn" disabled={submitLoading}>
              {submitLoading ? <Loader2 className="spinner" size={20} /> : <><Plus size={20} /> Add Expense</>}
            </button>
          </form>

          {message && (
            <div className={`message-alert ${message.type}`}>
              {message.type === 'error' && <AlertCircle size={18} />}
              <span>{message.text}</span>
            </div>
          )}
        </div>

        {budgetInfo && (
          <div className="card budget-info-card anim-slide-up">
            <h3>Budget Insight</h3>
            <div className="budget-stats">
              <div className="stat-line">
                <span>Category Spent (Monthly)</span>
                <span className="font-bold">RWF {budgetInfo.spent.toLocaleString()}</span>
              </div>
              <div className="progress-container">
                <div 
                  className={`progress-bar ${budgetInfo.percentage > 100 ? 'danger' : budgetInfo.percentage > 85 ? 'warning' : 'primary'}`} 
                  style={{ width: `${Math.min(budgetInfo.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="stat-footer">
                <span>{budgetInfo.percentage}% of RWF {budgetInfo.limit.toLocaleString()} budget</span>
                <span className={budgetInfo.remaining < 0 ? 'text-error' : 'text-success'}>
                  {budgetInfo.remaining < 0 ? 'Over budget' : `RWF ${budgetInfo.remaining.toLocaleString()} left`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .expenses-container {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 30px;
          align-items: start;
        }

        .expense-card { padding: 40px; }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 30px;
        }

        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--muted);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .select-wrap, .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .select-wrap svg, .input-wrap svg {
          position: absolute;
          left: 16px;
          color: #94a3b8;
          pointer-events: none;
        }

        .currency-prefix {
          position: absolute;
          left: 16px;
          font-weight: 700;
          color: #94a3b8;
          font-size: 0.8rem;
        }

        select, input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border: 1.5px solid var(--border);
          border-radius: 14px;
          font-size: 0.95rem;
          background: var(--white);
          transition: all 0.2s;
        }

        select:focus, input:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .submit-expense-btn {
          width: 100%;
          padding: 16px;
          justify-content: center;
          font-size: 1rem;
        }

        .message-alert {
          margin-top: 24px;
          padding: 14px;
          border-radius: 14px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .message-alert.success { background: #ecfdf5; color: var(--success); border: 1px solid #d1fae5; }
        .message-alert.error { background: #fef2f2; color: var(--error); border: 1px solid #fee2e2; }

        .budget-info-card h3 {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border);
        }

        .budget-stats { display: flex; flex-direction: column; gap: 15px; }
        .stat-line { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--muted); }
        .font-bold { font-weight: 700; color: var(--ink); }

        .progress-container {
          height: 12px;
          background: var(--bg);
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-bar { height: 100%; transition: width 0.5s ease-out; }
        .progress-bar.primary { background: var(--blue); }
        .progress-bar.warning { background: #f59e0b; }
        .progress-bar.danger { background: var(--error); }

        .stat-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .text-error { color: var(--error); }
        .text-success { color: var(--success); }

        .anim-slide-up { animation: slideUp 0.4s ease-out; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 900px) {
          .expenses-container { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </Layout>
  );
};

export default ExpensesPage;
