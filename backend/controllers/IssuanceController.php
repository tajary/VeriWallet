<?php

class IssuanceController
{

	public function setData($airId)
	{
		$input = json_decode(file_get_contents('php://input'), true);

		$pdo = DB::getPDO();

		try {
			$sql = "INSERT INTO credential_issuance_services 
                (id, air_id, title, category, airkit_schema_id, airkit_schema_name, 
                 airkit_schema_json, airkit_issuance_program_id, airkit_issuer_did, 
                 issuance_url, service_status) 
                VALUES 
                (:id, :air_id, :title, :category, :airkit_schema_id, :airkit_schema_name, 
                 :airkit_schema_json, :airkit_issuance_program_id, :airkit_issuer_did, 
                 :issuance_url, :service_status)";

			$stmt = $pdo->prepare($sql);

			$result = $stmt->execute([
				':id' => $input['id'],
				':air_id' => $airId,
				':title' => $input['title'],
				':category' => $input['category'],
				':airkit_schema_id' => $input['airkit_schema_id'],
				':airkit_schema_name' => $input['airkit_schema_name'],
				':airkit_schema_json' => $input['airkit_schema_json'],
				':airkit_issuance_program_id' => $input['airkit_issuance_program_id'],
				':airkit_issuer_did' => $input['airkit_issuer_did'],
				':issuance_url' => $input['issuance_url'],
				':service_status' => $input['service_status'] ?? 'under review' // Use default if not provided
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
			$sql = "SELECT * FROM credential_issuance_services 
                WHERE air_id = :air_id 
                ORDER BY created_at DESC";

			$stmt = $pdo->prepare($sql);
			$stmt->execute([':air_id' => $airId]);

			$services = $stmt->fetchAll(PDO::FETCH_ASSOC);

			return [
				'success' => true,
				'data' => $services,
				'count' => count($services)
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

	public function getAllPublishedRows()
	{
		$pdo = DB::getPDO();
		try {
			$sql = "SELECT * FROM credential_issuance_services 
                WHERE service_status = :service_status 
                ORDER BY created_at DESC";

			$stmt = $pdo->prepare($sql);
			$stmt->execute([':service_status' => 'published']);

			$services = $stmt->fetchAll(PDO::FETCH_ASSOC);

			return [
				'success' => true,
				'data' => $services,
				'count' => count($services)
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
