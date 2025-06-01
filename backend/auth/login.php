<?php
session_start();

include('../db/connect.php');

if (!isset($_POST['username']) || !isset($_POST['password'])) {
  echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
  exit;
}

$username = trim($_POST['username']);
$password = $_POST['password'];

$stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
  if (password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    echo json_encode(['success' => true, 'message' => 'Login successful.']);
  } else {
    echo json_encode(['success' => false, 'message' => 'Invalid password.']);
  }
} else {
  echo json_encode(['success' => false, 'message' => 'User not found.']);
}

$stmt->close();
$conn->close();
