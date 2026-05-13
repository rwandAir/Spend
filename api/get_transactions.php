<?php
require_once 'config.php';

try {
    $stmt = $pdo->prepare("
        SELECT 
            id,
            DATE_FORMAT(created_at, '%Y-%m-%d') as transaction_date,
            category as description,
            category,
            amount,
            'expense' as type,
            'Cash' as payment_method
        FROM transactions 
        WHERE user_id = ? AND transaction_type = 'expense'
        ORDER BY created_at DESC
    ");
    $stmt->execute(array($user_id));
    $transactions = $stmt->fetchAll();

    $stmt = $pdo->prepare("SELECT balance FROM users WHERE id = ?");
    $stmt->execute(array($user_id));
    $user = $stmt->fetch();
    $balance = $user ? floatval($user['balance']) : 0;

    echo json_encode(array(
        'success' => true,
        'transactions' => $transactions,
        'balance' => $balance
    ));

} catch(PDOException $e) {
    echo json_encode(array(
        'success' => false,
        'error' => $e->getMessage()
    ));
}
?>