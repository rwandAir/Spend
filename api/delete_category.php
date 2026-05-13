<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['category_id'])) {
        echo json_encode(array('success' => false, 'error' => 'Category ID is required'));
        exit;
    }
    
    $category_id = intval($input['category_id']);
    
    try {
        // Check if this is a custom category or default category
        $stmt = $pdo->prepare("
            SELECT is_custom, mc.is_default 
            FROM user_categories uc
            JOIN master_categories mc ON uc.category_id = mc.id
            WHERE uc.user_id = ? AND uc.category_id = ?
        ");
        $stmt->execute(array($user_id, $category_id));
        $category = $stmt->fetch();
        
        if (!$category) {
            echo json_encode(array('success' => false, 'error' => 'Category not found'));
            exit;
        }
        
        // Check if there are any expenses for this category
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as count FROM expenses 
            WHERE user_id = ? AND category_id = ?
        ");
        $stmt->execute(array($user_id, $category_id));
        $expenseCount = $stmt->fetch();
        
        if ($expenseCount['count'] > 0) {
            echo json_encode(array(
                'success' => false, 
                'error' => 'Cannot delete category with existing expenses. Please delete or reassign expenses first.'
            ));
            exit;
        }
        
        // Delete the user's category association
        $stmt = $pdo->prepare("DELETE FROM user_categories WHERE user_id = ? AND category_id = ?");
        $stmt->execute(array($user_id, $category_id));
        
        // If it's a custom category (not default), also remove from master_categories
        if ($category['is_custom'] == 1 && $category['is_default'] == 0) {
            $stmt = $pdo->prepare("DELETE FROM master_categories WHERE id = ?");
            $stmt->execute(array($category_id));
        }
        
        echo json_encode(array(
            'success' => true,
            'message' => 'Category deleted successfully'
        ));
        
    } catch (PDOException $e) {
        echo json_encode(array('success' => false, 'error' => 'Database error: ' . $e->getMessage()));
    }
    exit;
}

echo json_encode(array('success' => false, 'error' => 'Invalid request method'));
?>