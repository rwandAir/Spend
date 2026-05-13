<?php
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(array('success' => false, 'error' => 'No data received'));
    exit;
}

$amount = isset($data['amount']) ? floatval($data['amount']) : 0;
$description = isset($data['description']) ? trim($data['description']) : 'Income';
$date = isset($data['date']) ? $data['date'] : date('Y-m-d');
$payment_method = isset($data['payment_method']) ? $data['payment_method'] : 'Cash';

if ($amount <= 0) {
    echo json_encode(array('success' => false, 'error' => 'Please enter a valid amount greater than 0'));
    exit;
}

try {
    $pdo->beginTransaction();
    
    // Update user balance (ADD money)
    $stmt = $pdo->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
    $stmt->execute(array($amount, $user_id));
    
    // Get updated balance
    $stmt = $pdo->prepare("SELECT balance FROM users WHERE id = ?");
    $stmt->execute(array($user_id));
    $user = $stmt->fetch();
    $new_balance = $user ? floatval($user['balance']) : 0;
    
    // Log transaction as income
    $stmt = $pdo->prepare("
        INSERT INTO transactions (user_id, category, amount, transaction_type, created_at, payment_method)
        VALUES (?, ?, ?, 'income', ?, ?)
    ");
    $stmt->execute(array($user_id, $description, $amount, $date, $payment_method));
    
    $pdo->commit();
    
    echo json_encode(array(
        'success' => true,
        'message' => 'Income added successfully!',
        'balance' => $new_balance,
        'amount' => $amount
    ));
    
} catch(PDOException $e) {
    $pdo->rollBack();
    echo json_encode(array('success' => false, 'error' => 'Database error: ' . $e->getMessage()));
}
?>