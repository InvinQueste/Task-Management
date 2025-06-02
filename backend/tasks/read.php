<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
  echo json_encode([]);
  exit;
}

include('../db/connect.php');

$user_id = $_SESSION['user_id'];
$query = "SELECT id, title, created_at, description, due_date, priority, is_completed FROM tasks WHERE user_id = '$user_id'";
$result = mysqli_query($conn, $query);
$tasks = [];

if ($result) {
  while ($row = mysqli_fetch_assoc($result)) {
    $tasks[] = $row;
  }
  echo json_encode($tasks);
} else {
  echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
}

mysqli_close($conn);
