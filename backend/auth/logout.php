<?php
session_start();

// Unset all session variables
$_SESSION = [];

// Destroy the session
session_destroy();

// Redirect to login page (or send JSON if API)
header("Location: ../../fronend/auth/login.html");
exit;
?>
