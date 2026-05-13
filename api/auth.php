<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$dbname = 'spend_wisely';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo json_encode(array('success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()));
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if ($input === null) {
    echo json_encode(array('success' => false, 'error' => 'Invalid JSON data'));
    exit;
}

$action = isset($input['action']) ? $input['action'] : '';

// REGISTER
if ($action === 'register') {
    $name = isset($input['name']) ? trim($input['name']) : '';
    $email = isset($input['email']) ? trim($input['email']) : '';
    $password_raw = isset($input['password']) ? $input['password'] : '';

    if (empty($name) || empty($email) || empty($password_raw)) {
        echo json_encode(array('success' => false, 'error' => 'All fields are required.'));
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(array('success' => false, 'error' => 'Invalid email address.'));
        exit;
    }
    
    if (strlen($password_raw) < 4) {
        echo json_encode(array('success' => false, 'error' => 'Password must be at least 4 characters.'));
        exit;
    }

    // Check for existing email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute(array($email));
    if ($stmt->fetch()) {
        echo json_encode(array('success' => false, 'error' => 'An account with this email already exists.'));
        exit;
    }

    try {
        // Start transaction
        $pdo->beginTransaction();
        
        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, balance, is_active, role) VALUES (?, ?, ?, 0, 1, 'user')");
        $stmt->execute(array($name, $email, $password_raw));
        $new_id = $pdo->lastInsertId();

        // Check if user already has categories (should be empty for new user)
        $checkStmt = $pdo->prepare("SELECT COUNT(*) as count FROM user_categories WHERE user_id = ?");
        $checkStmt->execute(array($new_id));
        $count = $checkStmt->fetch();
        
        // Only add default categories if user has none
        if ($count['count'] == 0) {
            // Add default categories using INSERT IGNORE to avoid duplicates
            $catStmt = $pdo->prepare("
                INSERT IGNORE INTO user_categories (user_id, category_id) 
                SELECT ?, id FROM master_categories WHERE is_default = 1
            ");
            $catStmt->execute(array($new_id));
        }
        
        // Commit transaction
        $pdo->commit();

        $_SESSION['user_id'] = $new_id;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_role'] = 'user';
        $_SESSION['user_balance'] = 0;

        echo json_encode(array(
            'success' => true,
            'message' => 'Account created! Welcome, ' . $name . '!',
            'user_id' => $new_id,
            'name' => $name,
            'role' => 'user',
            'balance' => 0
        ));
    } catch (PDOException $e) {
        $pdo->rollBack();
        echo json_encode(array('success' => false, 'error' => 'Registration failed: ' . $e->getMessage()));
    }
    exit;
}

// LOGIN
if ($action === 'login') {
    $email = isset($input['email']) ? trim($input['email']) : '';
    $password_raw = isset($input['password']) ? $input['password'] : '';

    if (empty($email) || empty($password_raw)) {
        echo json_encode(array('success' => false, 'error' => 'Email and password are required.'));
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, name, email, password, balance, is_active, role FROM users WHERE email = ?");
    $stmt->execute(array($email));
    $user = $stmt->fetch();

    if (!$user || $user['password'] !== $password_raw) {
        echo json_encode(array('success' => false, 'error' => 'Invalid email or password.'));
        exit;
    }

    if ($user['is_active'] != 1) {
        echo json_encode(array('success' => false, 'error' => 'Your account has been deactivated. Please contact admin.'));
        exit;
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['user_balance'] = floatval($user['balance']);

    echo json_encode(array(
        'success' => true,
        'message' => 'Welcome back, ' . $user['name'] . '!',
        'user_id' => $user['id'],
        'name' => $user['name'],
        'role' => $user['role'],
        'balance' => floatval($user['balance'])
    ));
    exit;
}

// LOGOUT
if ($action === 'logout') {
    session_destroy();
    echo json_encode(array('success' => true));
    exit;
}

echo json_encode(array('success' => false, 'error' => 'Unknown action. Please specify "login" or "register".'));
?>