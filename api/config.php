<?php
// config.php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'localhost';
$dbname = 'spend_wisely';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die(json_encode(array('error' => 'Database connection failed: ' . $e->getMessage())));
}

// Get user_id from session, or default to 1 for testing
$user_id = isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : 1;

// Also set user_name for display
$user_name = isset($_SESSION['user_name']) ? $_SESSION['user_name'] : 'Guest';
?>