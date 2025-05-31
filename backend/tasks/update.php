<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
  echo json_encode(["success" => false, "error" => "Unauthorized"]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['id']) || !isset($data['is_completed'])) {
  echo json_encode(["success" => false, "error" => "Missing data"]);
  exit;
}

include('../db/connect.php');

$id = $data['id'];
$is_completed = $data['is_completed'];
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("UPDATE tasks SET is_completed = '$is_completed' WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $id,  $user_id);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
