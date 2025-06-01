<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
  echo json_encode(["success" => false, "error" => "Unauthorized"]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['id'])) {
  echo json_encode(["success" => false, "error" => "Missing task ID"]);
  exit;
}

include('../db/connect.php');

$id = $data['id'];
$user_id = $_SESSION['user_id'];

// Update completion status
if (isset($data['is_completed'])) {
  $is_completed = $data['is_completed'];
  $stmt = $conn->prepare("UPDATE tasks SET is_completed = ? WHERE id = ? AND user_id = ?");
  $stmt->bind_param("iii", $is_completed, $id, $user_id);
} 
// Update due date
elseif (isset($data['due_date'])) {
  $due_date = $data['due_date'];
  $stmt = $conn->prepare("UPDATE tasks SET due_date = ? WHERE id = ? AND user_id = ?");
  $stmt->bind_param("sii", $due_date, $id, $user_id);
} 
else {
  echo json_encode(["success" => false, "error" => "No valid field to update"]);
  exit;
}

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>