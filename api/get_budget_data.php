<?php
require_once 'config.php';

// Helper function to get month name
function getMonthName($monthNum) {
    $months = array(1 => 'January', 2 => 'February', 3 => 'March', 4 => 'April', 
                    5 => 'May', 6 => 'June', 7 => 'July', 8 => 'August',
                    9 => 'September', 10 => 'October', 11 => 'November', 12 => 'December');
    return $months[$monthNum];
}

// POST: save / update a category budget limit for specific month/year
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['category_id']) || !isset($input['limit_amount'])) {
        echo json_encode(array('success' => false, 'error' => 'Missing category_id or limit_amount'));
        exit;
    }

    $category_id = intval($input['category_id']);
    $limit_amount = floatval($input['limit_amount']);
    $selected_month = isset($input['month']) ? intval($input['month']) : date('n');
    $selected_year = isset($input['year']) ? intval($input['year']) : date('Y');

    try {
        // Check if budget record exists for this category and month/year
        $stmt = $pdo->prepare("
            SELECT id FROM category_budgets 
            WHERE user_id = ? AND category_id = ? AND budget_month = ? AND budget_year = ?
        ");
        $stmt->execute(array($user_id, $category_id, $selected_month, $selected_year));
        $exists = $stmt->fetch();

        if ($exists) {
            // Update existing
            $stmt = $pdo->prepare("
                UPDATE category_budgets 
                SET limit_amount = ? 
                WHERE user_id = ? AND category_id = ? AND budget_month = ? AND budget_year = ?
            ");
            $stmt->execute(array($limit_amount, $user_id, $category_id, $selected_month, $selected_year));
        } else {
            // Insert new
            $stmt = $pdo->prepare("
                INSERT INTO category_budgets (user_id, category_id, limit_amount, budget_month, budget_year) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute(array($user_id, $category_id, $limit_amount, $selected_month, $selected_year));
        }

        echo json_encode(array(
            'success' => true,
            'message' => 'Budget updated successfully',
            'category_id' => $category_id,
            'limit_amount' => $limit_amount,
            'month' => $selected_month,
            'year' => $selected_year
        ));
    } catch (PDOException $e) {
        echo json_encode(array('success' => false, 'error' => $e->getMessage()));
    }
    exit;
}

// GET: return budget data for selected month/year
try {
    $selected_month = isset($_GET['month']) ? intval($_GET['month']) : date('n');
    $selected_year = isset($_GET['year']) ? intval($_GET['year']) : date('Y');
    
    $currentMonthStart = date('Y-m-01', strtotime("$selected_year-$selected_month-01"));
    $currentMonthEnd = date('Y-m-t', strtotime("$selected_year-$selected_month-01"));

    // Get all categories that belong to this user
    $stmt = $pdo->prepare("
        SELECT
            mc.id,
            mc.name,
            mc.icon,
            COALESCE(uc.budget_limit, 0) AS budget,
            COALESCE(SUM(e.amount), 0) AS spent
        FROM user_categories uc
        JOIN master_categories mc ON uc.category_id = mc.id
        LEFT JOIN expenses e ON mc.id = e.category_id AND e.user_id = ? 
            AND e.expense_date BETWEEN ? AND ?
        WHERE uc.user_id = ?
        GROUP BY mc.id, mc.name, mc.icon, uc.budget_limit
        ORDER BY mc.name
    ");
    $stmt->execute(array($user_id, $currentMonthStart, $currentMonthEnd, $user_id));
    $categories = $stmt->fetchAll();

    // Get monthly budgets from category_budgets table
    $stmt = $pdo->prepare("
        SELECT category_id, limit_amount
        FROM category_budgets
        WHERE user_id = ? AND budget_month = ? AND budget_year = ?
    ");
    $stmt->execute(array($user_id, $selected_month, $selected_year));
    $monthlyBudgets = $stmt->fetchAll();
    
    // Create a map of monthly budgets
    $budgetMap = array();
    foreach ($monthlyBudgets as $mb) {
        $budgetMap[$mb['category_id']] = floatval($mb['limit_amount']);
    }

    // Calculate total budget for the selected month
    $totalBudget = 0;
    $formattedCategories = array();
    
    foreach ($categories as $cat) {
        // Use monthly budget if exists, otherwise use default budget from user_categories
        $budgetAmount = isset($budgetMap[$cat['id']]) ? $budgetMap[$cat['id']] : floatval($cat['budget']);
        $totalBudget += $budgetAmount;
        
        $formattedCategories[] = array(
            'id' => intval($cat['id']),
            'name' => $cat['name'],
            'icon' => $cat['icon'],
            'budget' => $budgetAmount,
            'spent' => floatval($cat['spent'])
        );
    }
    
    // Get total spent this month
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(amount), 0) as total_spent
        FROM expenses 
        WHERE user_id = ? AND expense_date BETWEEN ? AND ?
    ");
    $stmt->execute(array($user_id, $currentMonthStart, $currentMonthEnd));
    $total_spent = $stmt->fetch();
    
    // Get total income from transactions (all time)
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(amount), 0) as total_income
        FROM transactions 
        WHERE user_id = ? AND transaction_type = 'income'
    ");
    $stmt->execute(array($user_id));
    $total_income = $stmt->fetch();

    // Get user balance
    $stmt = $pdo->prepare("SELECT balance FROM users WHERE id = ?");
    $stmt->execute(array($user_id));
    $user = $stmt->fetch();
    $balance = $user ? floatval($user['balance']) : 0;

    // Calculate remaining
    $remaining = $totalBudget - floatval($total_spent['total_spent']);

    echo json_encode(array(
        'success' => true,
        'remaining_balance' => $balance,
        'total_budget' => $totalBudget,
        'total_spent' => floatval($total_spent['total_spent']),
        'total_income' => floatval($total_income['total_income']),
        'remaining' => $remaining,
        'selected_month' => $selected_month,
        'selected_year' => $selected_year,
        'month_name' => getMonthName($selected_month),
        'categories' => $formattedCategories
    ));

} catch (PDOException $e) {
    echo json_encode(array('success' => false, 'error' => $e->getMessage()));
}
?>