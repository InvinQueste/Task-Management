<?php
session_start();

if (isset($_SESSION['user_id'])) {
    header("Location: /Task-Management/dashboard");
} else {
    header("Location: /Task-Management/login");
}
exit;
