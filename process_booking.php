<?php
header('Content-Type: application/json');

// Database configuration
$db_host = 'localhost';
$db_name = 'pondy_taxi';
$db_user = 'root';
$db_pass = 'root';

// Connect to MySQL database
try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Get the POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$requiredFields = ['name', 'phone', 'email', 'date', 'time', 'pickupLocation', 'dropLocation', 'vehicleType'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        echo json_encode(['success' => false, 'message' => "$field is required"]);
        exit;
    }
}

// Generate booking ID if not provided