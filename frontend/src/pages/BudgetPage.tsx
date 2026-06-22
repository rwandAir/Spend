import { useState, useEffect } from 'react';
import { Tags, Plus, Search, Loader2, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout';
import { dataService } from '../services/api';
import type { Budget } from '../schema';

const BudgetPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', limit: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchBudgets = async () => {
    try {
      const res = await dataService.getBudgetData();
      // Backend returns { categories: [{id, name, icon, budget, spent}], ... }
      const raw: any[] = Array.isArray(res.categories) ? res.categories : [];
      const mapped: Budget[] = raw.map((c) => {
        const limit = Number(c.budget) || 0;
        const spent = Number(c.spent) || 0;
        return {
          category_id: c.id,
          category_name: c.name,
          budget_limit: limit,
          total_spent: spent,
          remaining: limit - spent,
          percentage_used: limit > 0 ? Math.round((spent / limit) * 100) : 0,
        };
      });
      setBudgets(mapped);
    } catch (error) {
      console.error('Failed to fetch budget data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name || !newCat.limit) return;

    setSubmitLoading(true);
    try {
      const res = await dataService.addCategory(newCat.name, Number(newCat.limit));
      if (res.success) {
        setNewCat({ name: '', limit: '' });
        setShowAddModal(false);
        fetchBudgets();
      }
    } catch (error) {
      console.error('Failed to add category', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Layout title="Budget Management">
      <div className="budget-header-actions">
        <div className="search-box budget-search">
          <Search size={18} />
          <input type="text" placeholder="Filter categories..." />
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} /> New Category
        </button>
      </div>

      {loading ? (
        <div className="loader-container"><Loader2 className="spinner" size={32} /></div>
      ) : (
        <div className="budget-grid">
          {budgets.map((budget) => (
            <BudgetCard key={budget.category_id} budget={budget} />
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h3>Add New Category</h3>
            <p className="modal-sub">Create a new spending category and set its monthly limit.</p>
            <form onSubmit={handleAddCategory}>
              <div className="form-field" style={{ marginBottom: '20px' }}>
                <label className="form-label">Category Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g., Entertainment, Gym" 
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  required 
                />
              </div>
              <div className="form-field" style={{ marginBottom: '20px' }}>
                <label className="form-label">Monthly Limit (RWF)</label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="e.g., 50000" 
                  value={newCat.limit}
                  onChange={(e) => setNewCat({ ...newCat, limit: e.target.value })}
                  required 
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                  {submitLoading ? <Loader2 className="spinner" size={20} /> : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .budget-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .budget-search {
          max-width: 400px;
        }

        .budget-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 24px;
        }

        /* Budget Card Styles */
        .budget-card { padding: 24px; transition: transform 0.2s; }
        .budget-card:hover { transform: translateY(-4px); }

        .budget-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .cat-title { display: flex; align-items: center; gap: 12px; }
        .cat-icon { 
          width: 40px; height: 40px; 
          background: var(--blue-light); 
          color: var(--blue); 
          border-radius: 12px; 
          display: flex; align-items: center; justify-content: center; 
        }
        .cat-name { font-weight: 700; color: var(--ink); font-size: 1.1rem; }

        .budget-status-pill {
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .status-ok { background: #ecfdf5; color: var(--success); }
        .status-warn { background: #fffbeb; color: #d97706; }
        .status-danger { background: #fef2f2; color: var(--error); }

        .budget-usage-info { margin-bottom: 15px; }
        .usage-text { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 8px; }
        .usage-amt { font-weight: 700; color: var(--ink); }
        .limit-amt { color: var(--muted); }

        .progress-track { height: 10px; background: var(--bg); border-radius: 5px; overflow: hidden; }
        .progress-fill { height: 100%; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }

        .budget-footer-meta { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; }
        .remaining-text { color: var(--muted); }
        .over-text { color: var(--error); }
        .under-text { color: var(--success); }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          width: 90%;
          max-width: 460px;
          padding: 40px;
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-sub { color: var(--muted); font-size: 0.9rem; margin: 8px 0 24px; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; }
        


        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </Layout>
  );
};

const BudgetCard = ({ budget }: { budget: Budget }) => {
  const isDanger = budget.percentage_used >= 100;
  const isWarning = budget.percentage_used >= 85 && budget.percentage_used < 100;

  const getStatus = () => {
    if (isDanger) return <span className="budget-status-pill status-danger"><AlertCircle size={12}/> Overspent</span>;
    if (isWarning) return <span className="budget-status-pill status-warn"><AlertTriangle size={12}/> Critical</span>;
    return <span className="budget-status-pill status-ok"><CheckCircle2 size={12}/> Healthy</span>;
  };

  return (
    <div className="card budget-card">
      <div className="budget-card-header">
        <div className="cat-title">
          <div className="cat-icon"><Tags size={20} /></div>
          <span className="cat-name">{budget.category_name}</span>
        </div>
        {getStatus()}
      </div>

      <div className="budget-usage-info">
        <div className="usage-text">
          <span className="usage-amt">RWF {budget.total_spent.toLocaleString()}</span>
          <span className="limit-amt">of RWF {budget.budget_limit.toLocaleString()}</span>
        </div>
        <div className="progress-track">
          <div 
            className={`progress-fill ${isDanger ? 'status-danger' : isWarning ? 'status-warn' : 'status-ok'}`} 
            style={{ width: `${Math.min(budget.percentage_used, 100)}%`, backgroundColor: isDanger ? 'var(--error)' : isWarning ? '#f59e0b' : 'var(--blue)' }}
          ></div>
        </div>
      </div>

      <div className="budget-footer-meta">
        <span className="remaining-text">{budget.percentage_used}% used</span>
        <span className={budget.remaining < 0 ? 'over-text' : 'under-text'}>
          {budget.remaining < 0 ? `Over by RWF ${Math.abs(budget.remaining).toLocaleString()}` : `RWF ${budget.remaining.toLocaleString()} left`}
        </span>
      </div>
    </div>
  );
};

export default BudgetPage;
