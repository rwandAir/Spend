<?php
// admin_guard.php - Security check for all admin pages
session_start();

// Check if user is logged in AND has admin role
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: ../login.html');
    exit();
}

// Database connection using PDO (same as your other files)
$host = 'localhost';
$dbname = 'spend_wisely';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

$page_title = isset($page_title) ? $page_title : 'Admin';
$active_nav = isset($active_nav) ? $active_nav : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title); ?> - Admin Panel</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: #f0f2f5;
        }
        .admin-header {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: white;
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
        }
        .logo h1 { font-size: 24px; }
        .logo span { color: #00e5a0; }
        .admin-info { display: flex; align-items: center; gap: 20px; }
        .logout-btn {
            background: rgba(255,255,255,0.1);
            padding: 8px 15px;
            border-radius: 5px;
            color: white;
            text-decoration: none;
        }
        .logout-btn:hover { background: rgba(255,255,255,0.2); }
        .sidebar {
            position: fixed;
            top: 60px;
            left: 0;
            width: 260px;
            height: calc(100% - 60px);
            background: white;
            box-shadow: 2px 0 5px rgba(0,0,0,0.05);
        }
        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 20px;
            color: #4a5568;
            text-decoration: none;
            border-left: 3px solid transparent;
        }
        .nav-item:hover, .nav-item.active {
            background: #f7fafc;
            border-left-color: #00e5a0;
            color: #00e5a0;
        }
        .main-content {
            margin-left: 260px;
            margin-top: 60px;
            padding: 30px;
            min-height: calc(100vh - 60px);
        }
        .page-header { margin-bottom: 25px; }
        .page-header h1 { font-size: 28px; color: #2d3748; }
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-number { font-size: 28px; font-weight: bold; color: #2d3748; }
        .stat-label { color: #718096; font-size: 14px; margin-top: 5px; }
        .card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .card h3 { margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f7fafc; font-weight: 600; }
        .badge {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            display: inline-block;
        }
        .badge-active { background: #c6f6d5; color: #22543d; }
        .badge-inactive { background: #fed7d7; color: #742a2a; }
        .badge-admin { background: #bee3f8; color: #2c5282; }
        .badge-user { background: #e2e8f0; color: #4a5568; }
        .btn {
            padding: 6px 12px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 12px;
            display: inline-block;
            margin: 0 2px;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }
        .btn-warning { background: #ed8936; color: white; }
        .btn-danger { background: #fc8181; color: white; }
        .btn-info { background: #4299e1; color: white; }
        .btn-sm { padding: 4px 10px; font-size: 11px; }
        .action-buttons { display: flex; gap: 5px; flex-wrap: wrap; }
        .confirm-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        .confirm-modal.active { display: flex; }
        .confirm-content {
            background: white;
            border-radius: 12px;
            padding: 25px;
            max-width: 400px;
            width: 90%;
            text-align: center;
        }
        .confirm-content h3 { margin-bottom: 15px; color: #2d3748; }
        .confirm-buttons { display: flex; gap: 10px; justify-content: center; }
        .confirm-yes { background: #e53e3e; color: white; }
        .confirm-no { background: #cbd5e0; color: #4a5568; }
        .alert { padding: 12px; border-radius: 8px; margin-bottom: 20px; position: relative; }
        .alert-success { background: #c6f6d5; color: #22543d; border: 1px solid #9ae6b4; }
        .alert-error { background: #fed7d7; color: #742a2a; border: 1px solid #fc8181; }
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
        <a href="admin_dashboard.php" class="nav-item <?php echo $active_nav === 'dashboard' ? 'active' : ''; ?>">
            <i class="fas fa-tachometer-alt"></i> Dashboard
        </a>
        <a href="admin_users.php" class="nav-item <?php echo $active_nav === 'users' ? 'active' : ''; ?>">
            <i class="fas fa-users"></i> Users
        </a>
        <a href="admin_transactions.php" class="nav-item <?php echo $active_nav === 'transactions' ? 'active' : ''; ?>">
            <i class="fas fa-exchange-alt"></i> Transactions
        </a>
    </div>
    
    <main class="main-content">