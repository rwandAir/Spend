export type User = {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  balance: number;
  is_active: boolean;
};

export type Category = {
  id: number;
  name: string;
  icon?: string;
  color?: string;
  is_default: boolean;
  budget_limit?: number;
};

export type Expense = {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  expense_date: string;
  payment_method: string;
  category_name?: string;
};

export type Income = {
  id: number;
  user_id: number;
  amount: number;
  description: string;
  income_date: string;
  payment_method: string;
};

export type Transaction = {
  id: number;
  user_id: number;
  category: string;
  amount: number;
  transaction_type: 'expense' | 'income';
  created_at: string;
  payment_method: string;
};

export type Budget = {
  category_id: number;
  category_name: string;
  budget_limit: number;
  total_spent: number;
  remaining: number;
  percentage_used: number;
};

export type DashboardData = {
  total_income: number;
  total_expenses: number;
  current_balance: number;
  recent_transactions: Transaction[];
};

export type ReportData = {
  categories: string[];
  amounts: number[];
  colors: string[];
};
