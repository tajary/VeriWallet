<?php

class AuthController {
	
	public function createNonce($wallet){
		return [
			"nonce" => "sampleNounceasg for $wallet is <".sha1($wallet).">. at ".date('Y-m-d H:i:s'),
		];
	}
	
	public function verifyNounce(){
		$input = json_decode(file_get_contents('php://input'), true);
		return [
			"input" => $input,
			"token" => "salme token",
			"hasCredential" => true,
			"verifyingCriteria" => GlobalData::$verifyingCriteria,
			"userVerifications" => $this->getUserVerifications(),
		];
	}
	
	public function getPublicCredential($criteria, $address){
		// search the database for criteria+address 
		return[
			"credential" => "user with wallet $address got the $criteria verification on 2025-10-10 12:11:10 -- signature",
		];
	}
	
    private function getUserVerifications(){
		return [
			[
				"id" => "joined_elite_community",
				"verification_date" => "2025-10-10 12:11:09",
				"tx_hash" => "0x121212",
				"is_public" => 1,
				"public_address" => "0z273862376237c623-sdfsdhsd-sdfdsf",
				
				"credential" => "user with wallet 0x111 got the joined_elite_community verification on 2025-10-10 12:11:10 -- signature",
			]
		];
	}
}
