<?php

class UsageController
{

	public function setData($airId)
	{
		$input = json_decode(file_get_contents('php://input'), true);

		$pdo = DB::getPDO();

		try {
			$sql = "INSERT INTO credential_perks 
                (id, air_id, title, category, url, perk_status, 
                 credential_requirements, global_operator) 
                VALUES 
                (:id, :air_id, :title, :category, :url, :perk_status, 
                 :credential_requirements, :global_operator)";

			$stmt = $pdo->prepare($sql);

			$result = $stmt->execute([
				':id' => $input['id'],
				':air_id' => $airId,
				':title' => $input['title'],
				':category' => $input['category'],
				':url' => $input['url'],
				':perk_status' => $input['perk_status'] ?? 'under review', // Use default if not provided
				':credential_requirements' => $input['credential_requirements'],
				':global_operator' => $input['global_operator'] ?? 'AND' // Use default if not provided
			]);

			if ($result) {
				return [
					'status' => 'ok'
				];
			} else {
				return [
					'status' => 'nok'
				];
			}
		} catch (PDOException $e) {
			return [
				'status' => 'nok'
			];
		}
	}

	public function getRows($airId)
	{
		$pdo = DB::getPDO();
		try {
			$sql = "SELECT * FROM credential_perks 
                WHERE air_id = :air_id";

			$params = [':air_id' => $airId];

			$sql .= " ORDER BY created_at DESC";

			$stmt = $pdo->prepare($sql);
			$stmt->execute($params);

			$perks = $stmt->fetchAll(PDO::FETCH_ASSOC);

			return [
				'success' => true,
				'data' => $perks,
				'count' => count($perks)
			];
		} catch (PDOException $e) {
			return [
				'success' => false,
				'message' => 'Database error: ' . $e->getMessage(),
				'data' => [],
				'count' => 0
			];
		}
	}
}
