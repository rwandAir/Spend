import { useState, useCallback } from 'react';
import { dataService } from '../services/api';
import type { Expense, Income } from '../schema';

/**
 * Hook for data operations
 * Provides methods for fetching and manipulating financial data
 */
export const useData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getDashboard();
      return { success: true, data };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch dashboard';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getExpenses();
      return { success: true, data };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch expenses';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = useCallback(async (expenseData: Partial<Expense>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.addExpense(expenseData);
      return { success: true, data: result };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to add expense';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getTransactions();
      return { success: true, data };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch transactions';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const addIncome = useCallback(async (incomeData: Partial<Income>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.addIncome(incomeData);
      return { success: true, data: result };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to add income';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getCategories();
      return { success: true, data };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch categories';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (name: string, budgetLimit: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.addCategory(name, budgetLimit);
      return { success: true, data: result };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to add category';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getBudgetData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getBudgetData();
      return { success: true, data };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch budget data';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getReportData = useCallback(async (month?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getReportData(month);
      return { success: true, data };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch report data';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    getDashboard,
    getExpenses,
    addExpense,
    getTransactions,
    addIncome,
    getCategories,
    addCategory,
    getBudgetData,
    getReportData,
  };
};

export default useData;
