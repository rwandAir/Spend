<?php
require_once 'config.php';

try {
    $stmt = $pdo->prepare("
        SELECT
            e.id,
            DATE_FORMAT(e.expense_date, '%Y-%m-%d') as expense_date,
            mc.name as category_name,
            e.category_id,
            e.amount,
            e.payment_method
        FROM expenses e
        JOIN master_categories mc ON mc.id = e.category_id
        WHERE e.user_id = ?
        ORDER BY e.expense_date DESC, e.id DESC
    ");
    $stmt->execute(array($user_id));
    $expenses = $stmt->fetchAll();

    $stmt = $pdo->prepare("SELECT balance FROM users WHERE id = ?");
    $stmt->execute(array($user_id));
    $user = $stmt->fetch();
    $balance = $user ? floatval($user['balance']) : 0;

    echo json_encode(array(
        'success'  => true,
        'expenses' => $expenses,
        'balance'  => $balance
    ));

} catch(PDOException $e) {
    echo json_encode(array(
        'success' => false,
        'error'   => $e->getMessage()
    ));
}
?>