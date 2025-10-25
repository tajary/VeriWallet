<?php

class DB{
	private static $db = '';
	private static $username = '';
	private static $password = '';
    private static $pdo = null;

    public static function getPDO(){
        if(self::$pdo) return self::$pdo;
        $db = self::$db;
        $username = self::$username;
        $password = self::$password;
        try {
			self::$pdo = new PDO("mysql:host=localhost;dbname={$db};charset=utf8mb4", $username, $password);
			self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
			return self::$pdo;
		} catch (PDOException $e) {
			die("Connection failed: " . $e->getMessage());
		}
    }
}