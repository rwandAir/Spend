<?php
require_once 'config.php';

$period = isset($_GET['period']) ? $_GET['period'] : 'monthly';
$start_date = isset($_GET['start_date']) ? $_GET['start_date'] : null;
$end_date = isset($_GET['end_date']) ? $_GET['end_date'] : null;

try {
    // Determine date range based on period
    if ($period === 'weekly') {
        $start_date = date('Y-m-d', strtotime('monday this week'));
        $end_date = date('Y-m-d', strtotime('sunday this week'));
    } elseif ($period === 'monthly') {
        $start_date = date('Y-m-01');
        $end_date = date('Y-m-t');
    } elseif ($period === 'yearly') {
        $start_date = date('Y-01-01');
        $end_date = date('Y-12-31');
    } elseif ($period === 'custom' && $start_date && $end_date) {
        // Use provided dates
    } else {
        $start_date = date('Y-m-01');
        $end_date = date('Y-m-t');
    }
    
    // Get total income from transactions table
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(amount), 0) as total_income
        FROM transactions 
        WHERE user_id = ? 
        AND transaction_type = 'income'
        AND DATE(created_at) BETWEEN ? AND ?
    ");
    $stmt->execute(array($user_id, $start_date, $end_date));
    $income = $stmt->fetch();
    
    // Get total expenses from expenses table using master_categories
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(amount), 0) as total_expenses
        FROM expenses 
        WHERE user_id = ? 
        AND expense_date BETWEEN ? AND ?
    ");
    $stmt->execute(array($user_id, $start_date, $end_date));
    $expensesTotal = $stmt->fetch();
    
    // Get expenses by category for the period with percentages
    $stmt = $pdo->prepare("
        SELECT 
            mc.name as category,
            mc.icon,
            COALESCE(SUM(e.amount), 0) as amount,
            COUNT(e.id) as transaction_count
        FROM user_categories uc
        JOIN master_categories mc ON uc.category_id = mc.id
        LEFT JOIN expenses e ON mc.id = e.category_id 
            AND e.user_id = ? 
            AND e.expense_date BETWEEN ? AND ?
        WHERE uc.user_id = ?
        GROUP BY mc.id, mc.name, mc.icon
        HAVING amount > 0
        ORDER BY amount DESC
    ");
    $stmt->execute(array($user_id, $start_date, $end_date, $user_id));
    $categoryExpenses = $stmt->fetchAll();
    
    // Get total budget from user_categories (planned budget for the period)
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(budget_limit), 0) as total_budget
        FROM user_categories 
        WHERE user_id = ?
    ");
    $stmt->execute(array($user_id));
    $totalBudgetResult = $stmt->fetch();
    $totalBudgetAmount = floatval($totalBudgetResult['total_budget']);
    
    // Also check for monthly budgets in category_budgets table
    $currentYear = date('Y', strtotime($start_date));
    $currentMonth = date('n', strtotime($start_date));
    
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(limit_amount), 0) as monthly_total
        FROM category_budgets 
        WHERE user_id = ? AND budget_year = ? AND budget_month = ?
    ");
    $stmt->execute(array($user_id, $currentYear, $currentMonth));
    $monthlyBudgetResult = $stmt->fetch();
    $monthlyBudgetAmount = floatval($monthlyBudgetResult['monthly_total']);
    
    // Use monthly budget if it exists and is greater than 0, otherwise use category budgets
    if ($monthlyBudgetAmount > 0) {
        $totalBudgetAmount = $monthlyBudgetAmount;
    }
    
    // Get user real balance
    $stmt = $pdo->prepare("SELECT balance, name FROM users WHERE id = ?");
    $stmt->execute(array($user_id));
    $user = $stmt->fetch();
    $realBalance = $user ? floatval($user['balance']) : 0;
    $userName = $user ? $user['name'] : 'User';
    
    $totalIncomeAmount = floatval($income['total_income']);
    $totalExpensesAmount = floatval($expensesTotal['total_expenses']);
    $budgetRemaining = $totalBudgetAmount - $totalExpensesAmount;
    if ($budgetRemaining < 0) $budgetRemaining = 0;
    
    // Calculate percentages for each category based on total expenses
    $breakdown = array();
    foreach ($categoryExpenses as $cat) {
        $percentage = $totalExpensesAmount > 0 ? round(($cat['amount'] / $totalExpensesAmount) * 100, 1) : 0;
        $breakdown[] = array(
            'category' => $cat['category'],
            'icon' => $cat['icon'],
            'amount' => floatval($cat['amount']),
            'percentage' => $percentage,
            'transaction_count' => intval($cat['transaction_count'])
        );
    }
    
    echo json_encode(array(
        'success' => true,
        'user_name' => $userName,
        'period' => array(
            'start' => $start_date,
            'end' => $end_date
        ),
        'total_income' => $totalIncomeAmount,
        'total_expenses' => $totalExpensesAmount,
        'total_budget' => $totalBudgetAmount,
        'budget_remaining' => $budgetRemaining,
        'real_balance' => $realBalance,
        'transaction_count' => count($categoryExpenses),
        'breakdown' => $breakdown,
        'categories' => $categoryExpenses
    ));
    
} catch(PDOException $e) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ));
}
?>