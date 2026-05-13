<?php
require_once 'config.php';

try {
    $currentMonthStart = date('Y-m-01');
    $currentMonthEnd   = date('Y-m-t');
    
    // Get total expenses for current month
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(amount), 0) as total_expenses
        FROM expenses 
        WHERE user_id = ? AND expense_date BETWEEN ? AND ?
    ");
    $stmt->execute(array($user_id, $currentMonthStart, $currentMonthEnd));
    $monthlyExpenses = $stmt->fetch();
    
    // Get total income from transactions (all time)
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(amount), 0) as total_income
        FROM transactions 
        WHERE user_id = ? AND transaction_type = 'income'
    ");
    $stmt->execute(array($user_id));
    $totalIncome = $stmt->fetch();
    
    // Get total budget (sum of all category budgets)
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(budget_limit), 0) as total_budget
        FROM user_categories 
        WHERE user_id = ?
    ");
    $stmt->execute(array($user_id));
    $totalBudget = $stmt->fetch();
    
    // Get user balance and name
    $stmt = $pdo->prepare("SELECT balance, name FROM users WHERE id = ?");
    $stmt->execute(array($user_id));
    $user = $stmt->fetch();
    
    $balance = floatval($user['balance']);
    $totalExpenses = floatval($monthlyExpenses['total_expenses']);
    $totalBudgetAmount = floatval($totalBudget['total_budget']);
    $totalIncomeAmount = floatval($totalIncome['total_income']);
    
    // Calculate budget remaining
    $budgetRemaining = $totalBudgetAmount - $totalExpenses;
    
    // Calculate budget percentage used
    $budgetPercentage = $totalBudgetAmount > 0 ? round(($totalExpenses / $totalBudgetAmount) * 100) : 0;
    
    echo json_encode(array(
        'success' => true,
        'user_name' => $user['name'],
        'balance' => $balance,
        'total_income' => $totalIncomeAmount,
        'total_expenses' => $totalExpenses,
        'total_budget' => $totalBudgetAmount,
        'budget_remaining' => $budgetRemaining,
        'budget_percentage' => $budgetPercentage,
        'monthly_spent' => $totalExpenses
    ));
    
} catch(PDOException $e) {
    echo json_encode(array(
        'success' => false,
        'error' => $e->getMessage()
    ));
}
?>