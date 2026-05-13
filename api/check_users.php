<?php
// check_users.php - Check what's in your users table
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'spend_wisely';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get table structure
    $stmt = $pdo->query("DESCRIBE users");
    $structure = $stmt->fetchAll();
    
    // Get all users
    $stmt = $pdo->query("SELECT id, name, email, password, balance FROM users");
    $users = $stmt->fetchAll();
    
    echo json_encode(array(
        'success' => true,
        'table_structure' => $structure,
        'users' => $users
    ), JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    echo json_encode(array(
        'success' => false,
        'error' => $e->getMessage()
    ));
}
?>