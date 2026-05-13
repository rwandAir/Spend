import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { PieChart, Download, Calendar, Loader2, Info } from 'lucide-react';
import Layout from '../components/Layout';
import { dataService } from '../services/api';
import type { ReportData } from '../schema';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ReportsPage = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await dataService.getReportData(selectedMonth);
      setData(res);
    } catch (error) {
      console.error('Failed to fetch report', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedMonth]);

  const chartData = {
    labels: data?.categories || [],
    datasets: [
      {
        data: data?.amounts || [],
        backgroundColor: data?.colors || [
          '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6', '#ec4899'
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { family: "'DM Sans', sans-serif", size: 12, weight: 600 as const }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context: any) => {
            const val = context.raw as number;
            return ` RWF ${val.toLocaleString()}`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <Layout title="Financial Analytics">
      <div className="reports-header card">
        <div className="month-picker">
          <Calendar size={20} />
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
        <button className="btn btn-outline" onClick={() => window.print()}>
          <Download size={18} /> Export PDF
        </button>
      </div>

      <div className="reports-grid">
        <div className="card chart-container">
          <h3><PieChart size={20} className="header-icon" /> Spending by Category</h3>
          <div className="chart-wrapper">
            {loading ? (
              <div className="chart-placeholder"><Loader2 className="spinner" size={32} /></div>
            ) : data && data.categories.length > 0 ? (
              <Pie data={chartData} options={chartOptions} />
            ) : (
              <div className="chart-placeholder">
                <Info size={32} />
                <p>No spending data found for this period.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card insight-card">
          <h3>Spending Insights</h3>
          {data && data.categories.length > 0 ? (
            <div className="insights-list">
              <div className="insight-item">
                <p className="insight-label">Highest Spending</p>
                <p className="insight-val">{data.categories[0]}</p>
              </div>
              <div className="insight-item">
                <p className="insight-label">Total for {selectedMonth}</p>
                <p className="insight-val">RWF {data.amounts.reduce((a, b) => a + b, 0).toLocaleString()}</p>
              </div>
              <div className="insight-info">
                <Info size={16} />
                <p>This report includes all verified expenses recorded in the selected period. PDF exports are currently generated using your browser's print function.</p>
              </div>
            </div>
          ) : (
            <p className="empty-msg">Select a different month to see insights.</p>
          )}
        </div>
      </div>

      <style>{`
        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 15px 25px;
        }

        .month-picker {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg);
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        .month-picker input { border: none; background: transparent; font-weight: 700; color: var(--ink); }
        .month-picker svg { color: var(--blue); }

        .reports-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 30px;
          align-items: start;
        }

        .chart-container h3, .insight-card h3 {
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border);
        }

        .chart-wrapper {
          height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chart-placeholder {
          text-align: center;
          color: var(--muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .insights-list { display: flex; flex-direction: column; gap: 20px; }
        
        .insight-item {
          padding: 20px;
          background: var(--bg);
          border-radius: 16px;
        }
        
        .insight-label { font-size: 0.85rem; font-weight: 700; color: var(--muted); text-transform: uppercase; margin-bottom: 4px; }
        .insight-val { font-size: 1.2rem; font-weight: 800; color: var(--ink); }

        .insight-info {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: var(--blue-light);
          color: var(--blue);
          border-radius: 16px;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .empty-msg { text-align: center; color: var(--muted); padding: 40px 0; }

        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .reports-grid { grid-template-columns: 1fr; }
        }

        @media print {
          .sidebar, .navbar, .reports-header, .insight-info { display: none !important; }
          .main-content { padding: 0 !important; }
          .card { box-shadow: none !important; border: 1px solid #eee !important; }
          .reports-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
};

export default ReportsPage;
