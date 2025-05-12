<?php
session_start();

include('../db/connect.php');

$username = trim($_POST['username']);
$password = $_POST['password'];

if (empty($username) || empty($password)) {
    die("All fields are required.");
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Check if user exists
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    die("Username or email already exists.");
}

$stmt->close();

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $hashedPassword);

if ($stmt->execute()) {
    echo "Registration successful. <a href='../../frontend/auth/login.html'>Login now</a>";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
