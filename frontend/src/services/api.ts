import axios from 'axios';
import type { DashboardData, Expense, Income, Transaction, Budget, ReportData, Category } from '../schema';

const API_BASE_URL = 'http://localhost/spend_wisely/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for PHP sessions
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('auth.php', { action: 'login', email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('auth.php', { action: 'register', name, email, password });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('auth.php', { action: 'logout' });
    return response.data;
  }
};

export const dataService = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('get_dashboard.php');
    return response.data;
  },
  addExpense: async (data: Partial<Expense>) => {
    const response = await api.post('add_expenses.php', data);
    return response.data;
  },
  getExpenses: async (): Promise<Expense[]> => {
    const response = await api.get('get_expenses.php');
    return response.data;
  },
  addIncome: async (data: Partial<Income>) => {
    const response = await api.post('add_income.php', data);
    return response.data;
  },
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get('get_transactions.php');
    return response.data;
  },
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('get_categories.php');
    return response.data;
  },
  getBudgetData: async (): Promise<Budget[]> => {
    const response = await api.get('get_budget_data.php');
    return response.data;
  },
  addCategory: async (name: string, budgetLimit: number) => {
    const response = await api.post('add_category.php', { name, budget_limit: budgetLimit });
    return response.data;
  },
  getReportData: async (month?: string): Promise<ReportData> => {
    const response = await api.get('get_report.php', { params: { month } });
    return response.data;
  }
};

export default api;
