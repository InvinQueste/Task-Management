<?php
session_start();
header('Content-Type: application/json');

include('../db/connect.php');

$username = trim($_POST['username']);
$password = $_POST['password'];

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$query = "SELECT id FROM users WHERE username = '$username'";
$result = mysqli_query($conn, $query);

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Query error: ' . mysqli_error($conn)]);
    mysqli_close($conn);
    exit;
}

if (mysqli_num_rows($result) > 0) {
    echo json_encode(['success' => false, 'message' => 'Username already exists.']);
    mysqli_close($conn);
    exit;
}

$inquery = "INSERT INTO users (username, password) VALUES ('$username', '$hashedPassword')";
if (mysqli_query($conn, $inquery)) {
    echo json_encode(['success' => true, 'message' => 'Registration successful. You can now log in.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($conn)]);
}

mysqli_close($conn);
