<?php
require_once 'config.php';
 
$data = json_decode(file_get_contents('php://input'), true);
 
if (!$data) {
    echo json_encode(array('success' => false, 'error' => 'No data received'));
    exit;
}
 
$category_id    = isset($data['category_id'])   ? intval($data['category_id'])   : 0;
$amount         = isset($data['amount'])         ? floatval($data['amount'])       : 0;
$date           = isset($data['expense_date'])   ? $data['expense_date']           : date('Y-m-d');
$payment_method = isset($data['payment_method']) ? $data['payment_method']         : 'Cash';
 
if ($category_id <= 0) {
    echo json_encode(array('success' => false, 'error' => 'Invalid category selected. Please select a category.'));
    exit;
}
 
if ($amount <= 0) {
    echo json_encode(array('success' => false, 'error' => 'Please enter a valid amount greater than 0.'));
    exit;
}
 
try {
    $pdo->beginTransaction();
 
    $stmt = $pdo->prepare(
        "INSERT INTO expenses (user_id, category_id, amount, expense_date, payment_method) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute(array($user_id, $category_id, $amount, $date, $payment_method));
 
    $stmt = $pdo->prepare(
        "UPDATE users SET balance = balance - ? WHERE id = ?"
    );
    $stmt->execute(array($amount, $user_id));
 
    $stmt = $pdo->prepare("SELECT name FROM master_categories WHERE id = ?");
    $stmt->execute(array($category_id));
    $category = $stmt->fetch();
    $category_name = $category ? $category['name'] : 'Unknown';
 
    $stmt = $pdo->prepare(
        "INSERT INTO transactions (user_id, category, amount, transaction_type, created_at, payment_method)
         VALUES (?, ?, ?, 'expense', ?, ?)"
    );
    $stmt->execute(array($user_id, $category_name, $amount, $date, $payment_method));
 
    $pdo->commit();
 
    $stmt = $pdo->prepare("SELECT balance FROM users WHERE id = ?");
    $stmt->execute(array($user_id));
    $user = $stmt->fetch();
    $new_balance = $user ? floatval($user['balance']) : 0;
    
    $currentMonthStart = date('Y-m-01');
    $currentMonthEnd   = date('Y-m-t');
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(amount), 0) as total_spent
        FROM expenses 
        WHERE user_id = ? AND category_id = ? AND expense_date BETWEEN ? AND ?
    ");
    $stmt->execute(array($user_id, $category_id, $currentMonthStart, $currentMonthEnd));
    $spent = $stmt->fetch();
    
    $stmt = $pdo->prepare("
        SELECT budget_limit FROM user_categories 
        WHERE user_id = ? AND category_id = ?
    ");
    $stmt->execute(array($user_id, $category_id));
    $budget_limit = $stmt->fetch();
    $budget = $budget_limit ? floatval($budget_limit['budget_limit']) : 0;
    
    $remaining_budget = $budget - floatval($spent['total_spent']);
    
    echo json_encode(array(
        'success' => true,
        'message' => 'Expense added successfully',
        'balance' => $new_balance,
        'category_id' => $category_id,
        'category_spent' => floatval($spent['total_spent']),
        'category_budget' => $budget,
        'remaining_budget' => $remaining_budget,
        'percentage_used' => $budget > 0 ? round(($spent['total_spent'] / $budget) * 100) : 0
    ));
 
} catch(PDOException $e) {
    $pdo->rollBack();
    echo json_encode(array('success' => false, 'error' => 'Database error: ' . $e->getMessage()));
}
?>