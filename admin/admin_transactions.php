<?php
$page_title = 'Transactions';
$active_nav = 'transactions';
require_once 'admin_guard.php';

$filter_user = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
$where = "";
$params = array();

if ($filter_user > 0) {
    $where = "WHERE t.user_id = ?";
    $params = array($filter_user);
}

$query = "
    SELECT t.*, u.name as user_name 
    FROM transactions t 
    JOIN users u ON u.id = t.user_id 
    $where
    ORDER BY t.created_at DESC
";
$stmt = $pdo->prepare($query);
$stmt->execute($params);
$transactions = $stmt->fetchAll();

// Get users list for filter
$users_stmt = $pdo->query("SELECT id, name FROM users ORDER BY name");
$users_list = $users_stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Transactions</title>
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
        .search-bar { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; }
        .search-bar select { padding: 8px; border: 1px solid #e2e8f0; border-radius: 8px; }
        .btn { padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; display: inline-block; cursor: pointer; border: none; }
        .btn-info { background: #4299e1; color: white; }
        .btn-warning { background: #ed8936; color: white; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f7fafc; font-weight: 600; color: #4a5568; }
        @media (max-width: 768px) { .sidebar { width: 200px; } .main-content { margin-left: 200px; } table { font-size: 12px; } th, td { padding: 8px; } }
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
            <h1>All Transactions</h1>
            <p>Monitor all user transactions (Read-only)</p>
        </div>

        <div class="card">
            <form method="GET" class="search-bar">
                <select name="user_id">
                    <option value="0">All Users</option>
                    <?php foreach ($users_list as $u): ?>
                        <option value="<?php echo $u['id']; ?>" <?php echo $filter_user == $u['id'] ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($u['name']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <button type="submit" class="btn btn-info">Filter</button>
                <?php if ($filter_user > 0): ?>
                    <a href="admin_transactions.php" class="btn btn-warning">Clear</a>
                <?php endif; ?>
            </form>
            
            <table>
                <thead><tr><th>ID</th><th>User</th><th>Category</th><th>Amount</th><th>Type</th><th>Date</th></tr></thead>
                <tbody>
                    <?php foreach ($transactions as $t): ?>
                    <tr>
                        <td><?php echo $t['id']; ?></td>
                        <td><?php echo htmlspecialchars($t['user_name']); ?></td>
                        <td><?php echo htmlspecialchars($t['category']); ?></td>
                        <td style="color:<?php echo $t['transaction_type'] == 'expense' ? '#dc2626' : '#10b981'; ?>">RWF <?php echo number_format($t['amount'], 0); ?></td>
                        <td><?php echo ucfirst($t['transaction_type']); ?></td>
                        <td><?php echo date('M d, Y', strtotime($t['created_at'])); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>