/**
 * Django Backend API Service
 * 
 * This service provides all API calls to the Django backend
 * Base URL: http://localhost:8000/api (proxied through Vite)
 */

const API_BASE_URL = '/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface ExpenseRequest {
  category: string;
  amount: number;
  description?: string;
  date: string;
}

interface IncomeRequest {
  amount: number;
  source: string;
  date: string;
}

interface CategoryRequest {
  name: string;
  budget_limit?: number;
}

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================

export const authService = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({ email, password } as LoginRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      
      // Store user info in localStorage
      if (data.user) {
        localStorage.setItem('sw_user_id', data.user.id);
        localStorage.setItem('sw_user_name', data.user.name);
        localStorage.setItem('sw_user_role', data.user.role);
        localStorage.setItem('sw_balance', data.user.balance || '0');
      }

      return { success: true, ...data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: (error as Error).message };
    }
  },
  
  /**
   * Register new user
   */
  async register(name: string, email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password } as RegisterRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      const data = await response.json();

      // Store user info in localStorage
      if (data.user) {
        localStorage.setItem('sw_user_id', data.user.id);
        localStorage.setItem('sw_user_name', data.user.name);
        localStorage.setItem('sw_user_role', data.user.role);
        localStorage.setItem('sw_balance', data.user.balance || '0');
      }

      return { success: true, ...data };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      // Clear localStorage
      localStorage.removeItem('sw_user_id');
      localStorage.removeItem('sw_user_name');
      localStorage.removeItem('sw_user_role');
      localStorage.removeItem('sw_balance');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Clear localStorage even if logout fails
      localStorage.removeItem('sw_user_id');
      localStorage.removeItem('sw_user_name');
      localStorage.removeItem('sw_user_role');
      localStorage.removeItem('sw_balance');
      return { success: true };
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const userId = localStorage.getItem('sw_user_id');
      return !!userId;
    } catch {
      return false;
    }
  },
};

// ============================================================================
// DATA SERVICE
// ============================================================================

export const dataService = {
  /**
   * Get dashboard summary data
   */
  async getDashboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard');

      return await response.json();
    } catch (error) {
      console.error('Dashboard error:', error);
      throw error;
    }
  },

  /**
   * Get all expenses
   */
  async getExpenses() {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch expenses');

      return await response.json();
    } catch (error) {
      console.error('Expenses error:', error);
      throw error;
    }
  },

  /**
   * Add new expense
   */
  async addExpense(data: ExpenseRequest) {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add expense');
      }

      return await response.json();
    } catch (error) {
      console.error('Add expense error:', error);
      throw error;
    }
  },

  /**
   * Get all transactions
   */
  async getTransactions() {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch transactions');

      return await response.json();
    } catch (error) {
      console.error('Transactions error:', error);
      throw error;
    }
  },

  /**
   * Add income
   */
  async addIncome(data: IncomeRequest) {
    try {
      const response = await fetch(`${API_BASE_URL}/income/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add income');
      }

      return await response.json();
    } catch (error) {
      console.error('Add income error:', error);
      throw error;
    }
  },

  /**
   * Get all categories
   */
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch categories');

      return await response.json();
    } catch (error) {
      console.error('Categories error:', error);
      throw error;
    }
  },

  /**
   * Get available categories
   */
  async getAvailableCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/available`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch available categories');

      return await response.json();
    } catch (error) {
      console.error('Available categories error:', error);
      throw error;
    }
  },

  /**
   * Add new category
   */
  async addCategory(data: CategoryRequest) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add category');
      }

      return await response.json();
    } catch (error) {
      console.error('Add category error:', error);
      throw error;
    }
  },

  /**
   * Delete category
   */
  async deleteCategory(categoryId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ category_id: categoryId }),
      });

      if (!response.ok) throw new Error('Failed to delete category');

      return await response.json();
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  },

  /**
   * Get budget data
   */
  async getBudgetData() {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch budget data');

      return await response.json();
    } catch (error) {
      console.error('Budget data error:', error);
      throw error;
    }
  },

  /**
   * Get report data
   */
  async getReportData(month?: string) {
    try {
      const url = month 
        ? `${API_BASE_URL}/reports?month=${month}`
        : `${API_BASE_URL}/reports`;

      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch report data');

      return await response.json();
    } catch (error) {
      console.error('Report data error:', error);
      throw error;
    }
  },
};

export default dataService;
