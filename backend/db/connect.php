<?php

$host = "localhost";
$user = "root";
$pass = "";
$db = "task_management";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    error_log("Database connection failed: " . mysqli_connect_error());
    die("Database connection failed. Please try again later.");
}
