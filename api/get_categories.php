<?php
require_once 'config.php';

try {
    // Get categories for this user
    $stmt = $pdo->prepare("
        SELECT 
            mc.id as category_id,
            mc.name,
            mc.icon
        FROM user_categories uc
        JOIN master_categories mc ON uc.category_id = mc.id
        WHERE uc.user_id = ?
        ORDER BY mc.name
    ");
    $stmt->execute(array($user_id));
    $categories = $stmt->fetchAll();

    echo json_encode(array(
        'success' => true,
        'categories' => $categories
    ));

} catch(PDOException $e) {
    echo json_encode(array(
        'success' => false,
        'error' => $e->getMessage()
    ));
}
?>