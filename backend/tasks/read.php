<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
  echo json_encode([]);
  exit;
}

include('../db/connect.php');

$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT id, title, created_at, description, due_date, priority, is_completed FROM tasks WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$tasks = [];

while ($row = $result->fetch_assoc()) {
  $tasks[] = $row;
}

echo json_encode($tasks);

$stmt->close();
$conn->close();
?>
