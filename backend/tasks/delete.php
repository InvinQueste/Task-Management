<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
  echo json_encode(["success" => false, "error" => "Unauthorized"]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['id'])) {
  echo json_encode(["success" => false, "error" => "Invalid request"]);
  exit;
}

include('../db/connect.php');

$id = $data['id'];
$user_id = $_SESSION['user_id'];

$query = "DELETE FROM tasks WHERE id = '$id' AND user_id = '$user_id'";

if (!mysqli_query($conn, $query)) {
  echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
} else {
  echo json_encode(["success" => true]);
}

mysqli_close($conn);
