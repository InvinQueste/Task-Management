<?php

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "task_management";

$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error);
    http_response_code(500);
    die("Database connection failed.");
}

$conn->query("CREATE DATABASE IF NOT EXISTS $dbname");
$conn->select_db($dbname);


$usersTableExists = $conn->query("SHOW TABLES LIKE 'users'")->num_rows > 0;
if (!$usersTableExists) {
    $createUsers = $conn->query("CREATE TABLE users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    if (!$createUsers) {
        error_log("Failed to create users table: " . $conn->error);
        http_response_code(500);
        die("Failed to create users table.");
    }
}


$tasksTableExists = $conn->query("SHOW TABLES LIKE 'tasks'")->num_rows > 0;
if (!$tasksTableExists) {
    $createTasks = $conn->query("CREATE TABLE tasks(
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date DATE,
        priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");
    if (!$createTasks) {
        error_log("Failed to create tasks table: " . $conn->error);
        http_response_code(500);
        die("Failed to create tasks table.");
    }
}