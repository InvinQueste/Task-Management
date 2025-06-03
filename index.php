<?php
session_start();

if (isset($_SESSION['user_id'])) {
    header("Location: frontend/home/home.html");
} else {
    header("Location: frontend/auth/login.html");
}
exit;
