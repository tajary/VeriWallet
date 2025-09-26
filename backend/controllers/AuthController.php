<?php

class AuthController
{

	private $db = '';
	private $username = '';
	private $password = '';

	private function createPDO()
	{
		try {
			$pdo = new PDO("mysql:host=localhost;dbname={$this->db};charset=utf8mb4", $this->username, $this->password);
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
			return $pdo;
		} catch (PDOException $e) {
			die("Connection failed: " . $e->getMessage());
		}
	}

	private function generateFakeSignature($length = 344)
	{
		$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		$signature = '';

		for ($i = 0; $i < $length; $i++) {
			$signature .= $chars[rand(0, strlen($chars) - 1)];
		}

		if (rand(0, 1)) {
			$signature .= (rand(0, 1) ? '==' : '=');
		}

		return $signature;
	}

	public function addCredential()
	{
		$input = json_decode(file_get_contents('php://input'), true);
		$wallet = $input['wallet'];
		$name = $input['name'];
		$now = date("Y-m-d H:i:s");
		$signature = $this->generateFakeSignature();
		$input['signedcred'] = "wallet $wallet is verified on $name on $now\n\n$signature";
		$pdo = $this->createPDO();
		try {
			$sql = "INSERT INTO veriwallet (name, description, icon, signedcred, wallet) 
                VALUES (:name, :description, :icon, :signedcred, :wallet)";

			$stmt = $pdo->prepare($sql);

			$stmt->bindParam(':name', $input['name']);
			$stmt->bindParam(':description', $input['description']);
			$stmt->bindParam(':icon', $input['icon']);
			$stmt->bindParam(':signedcred', $input['signedcred']);
			$stmt->bindParam(':wallet', $input['wallet']);

			if ($stmt->execute()) {
				return [
					'status' => 'ok'
				];
			} else {
				return [
					'status' => 'nok'
				];
			}
		} catch (PDOException $e) {
			//echo "Error: " . $e->getMessage();
			return [
				'status' => 'nok'
			];
		}
	}

	public function getCredentials($wallet)
	{
		$input = json_decode(file_get_contents('php://input'), true);
		$pdo = $this->createPDO();
		$sql = "SELECT * FROM veriwallet WHERE wallet=:wallet ORDER BY created_date DESC";
		$stmt = $pdo->prepare($sql);
		$stmt->bindParam(':wallet', $wallet);
		$stmt->execute();
		$results = $stmt->fetchAll();
		return $results;
	}
}
