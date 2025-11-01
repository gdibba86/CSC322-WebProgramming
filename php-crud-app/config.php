<?php
$host       = "localhost";
$username   = "root";
$password   = ""; // leave blank for XAMPP
$dbname     = "test";
$dsn        = "mysql:host=$host;dbname=$dbname";
$options    = array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
);
?>
