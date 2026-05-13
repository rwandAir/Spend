<?php
$page_title = 'Dashboard';
$active_nav = 'dashboard';
require_once 'admin_guard.php';

// Get total users
$stmt = $pdo->query("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
$total_users_row = $stmt->fetch();
$total_users = $total_users_row['count'];

// Get active users
$stmt = $pdo->query("SELECT COUNT(*) as count FROM users WHERE role = 'user' AND is_active = 1");
$active_users_row = $stmt->fetch();
$active_users = $active_users_row['count'];

$inactive_users = $total_users - $active_users;

// Get total expenses
$stmt = $pdo->query("SELECT COALESCE(SUM(amount),0) as total FROM expenses");
$total_expenses_row = $stmt->fetch();
$total_expenses = $total_expenses_row['total'];

// Get total transactions
$stmt = $pdo->query("SELECT COUNT(*) as count FROM transactions");
$total_transactions_row = $stmt->fetch();
$total_transactions = $total_transactions_row['count'];

// Get recent transactions
$stmt = $pdo->query("
    SELECT t.*, u.name as user_name, u.id as user_id
    FROM transactions t 
    JOIN users u ON u.id = t.user_id 
    ORDER BY t.created_at DESC LIMIT 10
");
$recent = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
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
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 28px; font-weight: bold; color: #2d3748; }
        .stat-label { color: #718096; font-size: 14px; margin-top: 5px; }
        .card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .card h3 { margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f7fafc; font-weight: 600; color: #4a5568; }
        .btn-sm { padding: 4px 10px; border-radius: 4px; text-decoration: none; font-size: 11px; display: inline-block; margin-left: 8px; background: #e53e3e; color: white; }
        .btn-sm:hover { background: #c53030; }
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
            <h1>Dashboard</h1>
            <p>Welcome back, <?php echo htmlspecialchars($_SESSION['user_name']); ?>!</p>
        </div>

        <div class="stat-grid">
            <div class="stat-card"><div class="stat-number"><?php echo $total_users; ?></div><div class="stat-label">Total Users</div></div>
            <div class="stat-card"><div class="stat-number"><?php echo $active_users; ?></div><div class="stat-label">Active Users</div></div>
            <div class="stat-card"><div class="stat-number"><?php echo $inactive_users; ?></div><div class="stat-label">Inactive Users</div></div>
            <div class="stat-card"><div class="stat-number">RWF <?php echo number_format($total_expenses, 0); ?></div><div class="stat-label">Total Expenses</div></div>
            <div class="stat-card"><div class="stat-number"><?php echo number_format($total_transactions); ?></div><div class="stat-label">Transactions</div></div>
        </div>

        <div class="card">
            <h3>Recent Transactions</h3>
            <table>
                <thead><tr><th>User</th><th>Category</th><th>Amount</th><th>Type</th><th>Date</th></tr></thead>
                <tbody>
                    <?php foreach ($recent as $row): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($row['user_name']); ?>
                            <a href="admin_users.php?search=<?php echo urlencode($row['user_name']); ?>" class="btn-sm" title="View User">👤</a>
                        </td>
                        <td><?php echo htmlspecialchars($row['category']); ?></td>
                        <td style="color:<?php echo $row['transaction_type'] == 'expense' ? '#dc2626' : '#10b981'; ?>">RWF <?php echo number_format($row['amount'], 0); ?></td>
                        <td><?php echo ucfirst($row['transaction_type']); ?></td>
                        <td><?php echo date('M d, Y', strtotime($row['created_at'])); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>