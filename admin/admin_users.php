<?php
$page_title = 'Users';
$active_nav = 'users';
require_once 'admin_guard.php';

$msg = '';
$msg_type = '';

// Toggle user active status (Activate/Deactivate)
if (isset($_GET['toggle']) && isset($_GET['id'])) {
    $uid = intval($_GET['toggle']);
    
    // Get current status
    $stmt = $pdo->prepare("SELECT is_active FROM users WHERE id = ?");
    $stmt->execute(array($uid));
    $current = $stmt->fetch();
    
    if ($current) {
        $new = $current['is_active'] == 1 ? 0 : 1;
        $stmt = $pdo->prepare("UPDATE users SET is_active = ? WHERE id = ?");
        if ($stmt->execute(array($new, $uid))) {
            $msg = "User status updated successfully.";
            $msg_type = "success";
        } else {
            $msg = "Error updating user status.";
            $msg_type = "error";
        }
    }
}

// Delete user
if (isset($_GET['delete']) && isset($_GET['id'])) {
    $uid = intval($_GET['delete']);
    
    // Check if user is admin (cannot delete admin)
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute(array($uid));
    $user_check = $stmt->fetch();
    
    if (!$user_check) {
        $msg = "User not found.";
        $msg_type = "error";
    } elseif ($user_check['role'] === 'admin') {
        $msg = "Cannot delete admin users!";
        $msg_type = "error";
    } else {
        try {
            // Start transaction
            $pdo->beginTransaction();
            
            // Delete user's expenses
            $stmt = $pdo->prepare("DELETE FROM expenses WHERE user_id = ?");
            $stmt->execute(array($uid));
            
            // Delete user's transactions
            $stmt = $pdo->prepare("DELETE FROM transactions WHERE user_id = ?");
            $stmt->execute(array($uid));
            
            // Delete user's category budgets
            $stmt = $pdo->prepare("DELETE FROM category_budgets WHERE user_id = ?");
            $stmt->execute(array($uid));
            
            // Delete user's budgets
            $stmt = $pdo->prepare("DELETE FROM budgets WHERE user_id = ?");
            $stmt->execute(array($uid));
            
            // Delete user's activity log
            $stmt = $pdo->prepare("DELETE FROM activity_log WHERE user_id = ?");
            $stmt->execute(array($uid));
            
            // Delete user's category associations
            $stmt = $pdo->prepare("DELETE FROM user_categories WHERE user_id = ?");
            $stmt->execute(array($uid));
            
            // Finally delete the user
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute(array($uid));
            
            // Commit transaction
            $pdo->commit();
            
            $msg = "User deleted successfully! All associated data has been removed.";
            $msg_type = "success";
        } catch (Exception $e) {
            $pdo->rollBack();
            $msg = "Error deleting user: " . $e->getMessage();
            $msg_type = "error";
        }
    }
}

// Search
$search = isset($_GET['search']) ? $_GET['search'] : '';
$where = "";
$params = array();

if (!empty($search)) {
    $where = "WHERE name LIKE ? OR email LIKE ?";
    $params = array("%$search%", "%$search%");
}

$query = "SELECT * FROM users $where ORDER BY id DESC";
$stmt = $pdo->prepare($query);
$stmt->execute($params);
$users = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - User Management</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f0f2f5; }
        .admin-header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; position: fixed; top: 0; left: 0; right: 0; z-index: 100; }
        .logo h1 { font-size: 24px; }
        .logo span { color: #00e5a0; }
        .admin-info { display: flex; align-items: center; gap: 20px; }
        .logout-btn { background: rgba(255,255,255,0.1); padding: 8px 15px; border-radius: 5px; color: white; text-decoration: none; }
        .logout-btn:hover { background: rgba(255,255,255,0.2); }
        .sidebar { position: fixed; top: 60px; left: 0; width: 260px; height: calc(100% - 60px); background: white; box-shadow: 2px 0 5px rgba(0,0,0,0.05); }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 14px 20px; color: #4a5568; text-decoration: none; border-left: 3px solid transparent; }
        .nav-item:hover, .nav-item.active { background: #f7fafc; border-left-color: #00e5a0; color: #00e5a0; }
        .main-content { margin-left: 260px; margin-top: 60px; padding: 30px; min-height: calc(100vh - 60px); }
        .page-header { margin-bottom: 25px; }
        .page-header h1 { font-size: 28px; color: #2d3748; }
        .card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .search-bar { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
        .search-bar input { flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; min-width: 200px; }
        .alert { padding: 12px; border-radius: 8px; margin-bottom: 20px; }
        .alert-success { background: #c6f6d5; color: #22543d; border: 1px solid #9ae6b4; }
        .alert-error { background: #fed7d7; color: #742a2a; border: 1px solid #fc8181; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f7fafc; font-weight: 600; color: #4a5568; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; display: inline-block; }
        .badge-active { background: #c6f6d5; color: #22543d; }
        .badge-inactive { background: #fed7d7; color: #742a2a; }
        .badge-admin { background: #bee3f8; color: #2c5282; }
        .badge-user { background: #e2e8f0; color: #4a5568; }
        .btn { padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; display: inline-block; margin: 0 2px; cursor: pointer; border: none; transition: all 0.2s; }
        .btn-warning { background: #ed8936; color: white; }
        .btn-danger { background: #fc8181; color: white; }
        .btn-info { background: #4299e1; color: white; }
        .btn-sm { padding: 4px 10px; font-size: 11px; }
        .action-buttons { display: flex; gap: 5px; flex-wrap: wrap; }
        .confirm-modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; }
        .confirm-modal.active { display: flex; }
        .confirm-content { background: white; border-radius: 12px; padding: 25px; max-width: 400px; width: 90%; text-align: center; }
        .confirm-content h3 { margin-bottom: 15px; color: #2d3748; }
        .confirm-content p { margin-bottom: 20px; color: #718096; }
        .confirm-buttons { display: flex; gap: 10px; justify-content: center; }
        .confirm-yes { background: #e53e3e; color: white; }
        .confirm-no { background: #cbd5e0; color: #4a5568; }
        @media (max-width: 768px) {
            .sidebar { width: 200px; }
            .main-content { margin-left: 200px; }
            table { font-size: 12px; }
            th, td { padding: 8px; }
            .action-buttons { flex-direction: column; gap: 5px; }
            .btn { text-align: center; }
        }
    </style>
</head>
<body>
    <div class="admin-header">
        <div class="logo"><h1>Spend <span>Wisely</span> <small>Admin Panel</small></h1></div>
        <div class="admin-info">
            <span><i class="fas fa-user-shield"></i> <?php echo htmlspecialchars($_SESSION['user_name']); ?></span>
            <a href="admin_logout.php" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </div>
    
    <div class="sidebar">
        <a href="admin_dashboard.php" class="nav-item <?php echo $active_nav === 'dashboard' ? 'active' : ''; ?>"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
        <a href="admin_users.php" class="nav-item <?php echo $active_nav === 'users' ? 'active' : ''; ?>"><i class="fas fa-users"></i> Users</a>
        <a href="admin_transactions.php" class="nav-item <?php echo $active_nav === 'transactions' ? 'active' : ''; ?>"><i class="fas fa-exchange-alt"></i> Transactions</a>
    </div>
    
    <div class="main-content">
        <div class="page-header">
            <h1>User Management</h1>
            <p>Manage all registered users - Activate/Deactivate or Delete accounts</p>
        </div>

        <?php if ($msg): ?>
            <div class="alert alert-<?php echo $msg_type; ?>"><?php echo $msg; ?></div>
        <?php endif; ?>

        <div class="card">
            <form method="GET" class="search-bar">
                <input type="text" name="search" placeholder="Search by name or email..." value="<?php echo htmlspecialchars($search); ?>">
                <button type="submit" class="btn btn-info">Search</button>
                <?php if ($search): ?><a href="admin_users.php" class="btn btn-warning">Clear</a><?php endif; ?>
            </form>
            
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr><th>ID</th><th>Name</th><th>Email</th><th>Balance</th><th>Role</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        <?php if (count($users) > 0): ?>
                            <?php foreach ($users as $user): ?>
                            <tr>
                                <td><?php echo $user['id']; ?></td>
                                <td><?php echo htmlspecialchars($user['name'] ? $user['name'] : 'No name'); ?></td>
                                <td><?php echo htmlspecialchars($user['email']); ?></td>
                                <td>RWF <?php echo number_format($user['balance'], 0); ?></td>
                                <td><span class="badge badge-<?php echo $user['role']; ?>"><?php echo ucfirst($user['role']); ?></span></td>
                                <td><span class="badge badge-<?php echo $user['is_active'] ? 'active' : 'inactive'; ?>"><?php echo $user['is_active'] ? 'Active' : 'Inactive'; ?></span></td>
                                <td class="action-buttons">
                                    <?php if ($user['role'] !== 'admin'): ?>
                                        <a href="?toggle=<?php echo $user['id']; ?>&search=<?php echo urlencode($search); ?>" class="btn btn-warning btn-sm" onclick="return confirm('Toggle user status? This will activate or deactivate the account.')">
                                            <i class="fas fa-toggle-on"></i> <?php echo $user['is_active'] ? 'Deactivate' : 'Activate'; ?>
                                        </a>
                                        <button onclick="showDeleteModal(<?php echo $user['id']; ?>, '<?php echo htmlspecialchars($user['name']); ?>')" class="btn btn-danger btn-sm">
                                            <i class="fas fa-trash-alt"></i> Delete
                                        </button>
                                    <?php else: ?>
                                        <span class="badge" style="background:#cbd5e0; padding:4px 10px;">Protected</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr><td colspan="7" style="text-align:center; padding:40px;">No users found</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div id="deleteModal" class="confirm-modal">
    <div class="confirm-content">
        <h3><i class="fas fa-exclamation-triangle" style="color: #e53e3e;"></i> Confirm Delete</h3>
        <p id="deleteMessage">Are you sure you want to delete this user?</p>
        <p style="font-size: 12px; color: #e53e3e; margin-top: 5px;">⚠️ This will also delete all expenses, transactions, and budgets for this user!</p>
        <div class="confirm-buttons">
            <button class="confirm-yes" id="confirmDeleteBtn">Yes, Delete</button>
            <button class="confirm-no" id="cancelDeleteBtn">Cancel</button>
        </div>
    </div>
</div>

<script>
    var deleteUserId = null;
    var deleteUserName = '';
    var currentSearch = '<?php echo addslashes($search); ?>';

    function showDeleteModal(userId, userName) {
        deleteUserId = userId;
        deleteUserName = userName;
        document.getElementById('deleteMessage').innerHTML = 'Are you sure you want to delete user <strong>' + userName + '</strong>?';
        document.getElementById('deleteModal').classList.add('active');
    }

    function closeDeleteModal() {
        document.getElementById('deleteModal').classList.remove('active');
        deleteUserId = null;
    }

    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        if (deleteUserId) {
            window.location.href = '?delete=' + deleteUserId + '&search=' + encodeURIComponent(currentSearch);
        }
    });

    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    
    document.getElementById('deleteModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDeleteModal();
        }
    });
</script>
</body>
</html>