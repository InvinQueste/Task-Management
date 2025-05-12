<?php
session_start();

include('../db/connect.php');

if (!isset($_POST['username']) || !isset($_POST['password'])) {
  die("Username and password are required.");
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
        echo "Login successful. <a href='../../frontend/home/home.html'>Continue</a>";
    } else {
        echo "Invalid password.";
    }
} else {
    echo "User not found.";
}

$stmt->close();
$conn->close();
?>
