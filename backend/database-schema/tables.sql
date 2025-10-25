CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    air_id VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    organization VARCHAR(255),
    website VARCHAR(255),
    x_username VARCHAR(100),
    telegram_username VARCHAR(100),
    discord_username VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user (air_id)
);

CREATE TABLE credential_issuance_services (
    id VARCHAR(255) PRIMARY KEY,
    air_id VARCHAR(500) NOT NULL,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    airkit_schema_id VARCHAR(255) NOT NULL,
    airkit_schema_name VARCHAR(500) NOT NULL,
    airkit_schema_json JSON NOT NULL,
    airkit_issuance_program_id VARCHAR(255) NOT NULL,
    airkit_issuer_did VARCHAR(500) NOT NULL,
    issuance_url VARCHAR(1000) NOT NULL,
    service_status VARCHAR(100) NOT NULL DEFAULT 'under review',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_service_status (service_status),
    INDEX idx_category (category),
    INDEX idx_air_id (air_id),
    INDEX idx_created_at (created_at)
);

CREATE TABLE credential_perks (
    id VARCHAR(255) PRIMARY KEY,
    air_id VARCHAR(500) NOT NULL,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    perk_status VARCHAR(100) NOT NULL DEFAULT 'under review',
    credential_requirements JSON NOT NULL,
    global_operator ENUM('AND', 'OR') DEFAULT 'AND',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_perk_status (perk_status),
    INDEX idx_category (category),
    INDEX idx_air_id (air_id),
    INDEX idx_created_at (created_at)
);


CREATE TABLE `veri` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `air_id` varchar(255) NOT NULL,
  `air_wallet` varchar(255) NOT NULL,
  `real_wallet` varchar(255) NOT NULL,
  `key_id` varchar(255) NOT NULL,
  `issued` int(11) NOT NULL DEFAULT 0,
  `issue_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `verified` int(11) NOT NULL DEFAULT 0,
  `verify_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `idx_air_id` (`air_id`),
  KEY `idx_real_wallet` (`real_wallet`),
  KEY `idx_key_id` (`key_id`),
  KEY `idx_issued` (`issued`),
  KEY `idx_issue_date` (`issue_date`)
);


CREATE TABLE `veriwallet` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(30) NOT NULL,
  `signedcred` text NOT NULL,
  `wallet` varchar(200) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
);
