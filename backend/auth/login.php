<?php
session_start();

include('../db/connect.php');

if (!isset($_POST['username']) || !isset($_POST['password'])) {
  echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
  exit;
}

$username = trim($_POST['username']);
$password = $_POST['password'];

$query = "SELECT id, username, password FROM users WHERE username = '$username'";
$result = mysqli_query($conn, $query);

if ($user = mysqli_fetch_assoc($result)) {
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

mysqli_close($conn);
