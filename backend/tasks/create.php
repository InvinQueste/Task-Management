<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
  echo json_encode(["success" => false, "error" => "Unauthorized"]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['title'])) {
  echo json_encode(["success" => false, "error" => "Invalid input"]);
  exit;
}

include('../db/connect.php');

$title = $data['title'];
$description = $data['description'] ?? null;
$due_date = $data['due_date'] ?? null;
$priority = $data['priority'] ?? "Medium";
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("INSERT INTO tasks (user_id, title, description, due_date, priority) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issss", $user_id, $title, $description, $due_date, $priority);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>