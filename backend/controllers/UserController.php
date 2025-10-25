<?php

class UserController
{

	public function setUser($airId)
	{
		$input = json_decode(file_get_contents('php://input'), true);

		$pdo = DB::getPDO();
		try {
			$sql = "REPLACE INTO users (air_id, name, organization, website, x_username, telegram_username, discord_username, email) 
            VALUES (:air_id, :name, :organization, :website, :x_username, :telegram_username, :discord_username, :email)";

			$stmt = $pdo->prepare($sql);
			$stmt->execute([
				':air_id' => $airId,
				':name' => $input['name'] ?? null,
				':organization' => $input['organization'] ?? null,
				':website' => $input['website'] ?? null,
				':x_username' => $input['x_username'] ?? null,
				':telegram_username' => $input['telegram_username'] ?? null,
				':discord_username' => $input['discord_username'] ?? null,
				':email' => $input['email'] ?? null
			]);

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

	public function getUser($airId)
	{
		$pdo = DB::getPDO();
		$sql = "SELECT * FROM users WHERE air_id=:air_id limit 0, 1";
		$stmt = $pdo->prepare($sql);
		$stmt->bindParam(':air_id', $airId);
		$stmt->execute();
		$results = $stmt->fetchAll();
		return $results[0];
	}

	public function getUserKey($airId){
		return sha1($airId);
	}
}
