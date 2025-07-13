<?php
session_start();
$_SESSION = [];
session_destroy();
header("Location: /Task-Management/login");
exit;
