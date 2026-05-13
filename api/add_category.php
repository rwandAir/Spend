<?php
require_once 'config.php';

// Add a custom category for the user
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $category_name = isset($input['category_name']) ? trim($input['category_name']) : '';
    $icon = isset($input['icon']) ? $input['icon'] : 'fa-tag';
    
    if (empty($category_name)) {
        echo json_encode(array('success' => false, 'error' => 'Category name is required'));
        exit;
    }
    
    try {
        // Check if category exists in master_categories
        $stmt = $pdo->prepare("SELECT id FROM master_categories WHERE name = ?");
        $stmt->execute(array($category_name));
        $existing = $stmt->fetch();
        
        if ($existing) {
            $category_id = $existing['id'];
            
            // Check if user already has this category
            $checkStmt = $pdo->prepare("SELECT id FROM user_categories WHERE user_id = ? AND category_id = ?");
            $checkStmt->execute(array($user_id, $category_id));
            
            if (!$checkStmt->fetch()) {
                $insertStmt = $pdo->prepare("
                    INSERT INTO user_categories (user_id, category_id, is_custom, budget_limit) 
                    VALUES (?, ?, 1, 0)
                ");
                $insertStmt->execute(array($user_id, $category_id));
                echo json_encode(array('success' => true, 'message' => 'Category added successfully'));
            } else {
                echo json_encode(array('success' => false, 'error' => 'You already have this category'));
            }
        } else {
            // Create new custom category in master_categories
            $insertStmt = $pdo->prepare("
                INSERT INTO master_categories (name, icon, is_default) 
                VALUES (?, ?, 0)
            ");
            $insertStmt->execute(array($category_name, $icon));
            $category_id = $pdo->lastInsertId();
            
            // Add to user's categories
            $userStmt = $pdo->prepare("
                INSERT INTO user_categories (user_id, category_id, is_custom, budget_limit) 
                VALUES (?, ?, 1, 0)
            ");
            $userStmt->execute(array($user_id, $category_id));
            
            echo json_encode(array('success' => true, 'message' => 'Custom category created and added'));
        }
    } catch (PDOException $e) {
        echo json_encode(array('success' => false, 'error' => 'Database error: ' . $e->getMessage()));
    }
    exit;
}

// GET available categories that user can add
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("
            SELECT mc.id, mc.name, mc.icon
            FROM master_categories mc
            WHERE mc.id NOT IN (
                SELECT category_id FROM user_categories WHERE user_id = ?
            )
            ORDER BY mc.name
        ");
        $stmt->execute(array($user_id));
        $availableCategories = $stmt->fetchAll();
        
        echo json_encode(array(
            'success' => true,
            'available_categories' => $availableCategories
        ));
    } catch (PDOException $e) {
        echo json_encode(array('success' => false, 'error' => $e->getMessage()));
    }
    exit;
}
?>