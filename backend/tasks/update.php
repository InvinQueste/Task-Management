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

if (isset($data['is_completed'])) {
  $is_completed = $data['is_completed'];
  $query = "UPDATE tasks SET is_completed = '$is_completed' WHERE id = '$id' AND user_id = '$user_id'";
} elseif (isset($data['due_date'])) {
  $due_date = $data['due_date'];
  $query = "UPDATE tasks SET due_date = '$due_date' WHERE id = '$id' AND user_id = '$user_id'";
} else {
  echo json_encode(["success" => false, "error" => "No valid field to update"]);
  exit;
}

if (!mysqli_query($conn, $query)) {
  echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
} else {
  echo json_encode(["success" => true]);
}

mysqli_close($conn);
