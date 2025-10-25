<?php
date_default_timezone_set('UTC');
define('SLASH_PATH', __DIR__);

require_once 'lib/DB.php';
require_once 'lib/SimpleRouter.php';
require_once 'lib/GlobalData.php';


DB::getPDO();

$app = new SimpleRouter();

$app->allowCrossOrigin(); // Allows *

$app->get("/", function() {
	
    return file_get_contents('static/index.html');
});

// $app->addStatic('/css', 'static/css');


include "./controllers/AuthController.php";
$AuthController = new AuthController();

include "./controllers/UserController.php";
$UserController = new UserController();

include "./controllers/IssuanceController.php";
$IssuanceController = new IssuanceController();

include "./controllers/UsageController.php";
$UsageController = new UsageController();


$app->post("/api/credential/add", [$AuthController, 'addCredential']);

$app->get("/api/credential/all/{wallet}", [$AuthController, 'getCredentials']);

$app->post("/api/issue", [$AuthController, 'issue']);
$app->post("/api/verify/{airId}/{keyId}", [$AuthController, 'setVerify']);
$app->get("/api/verify/{wallet}/{keyId}", [$AuthController, 'getVerify']);
$app->get("/api/issues/{airId}", [$AuthController, 'issues']);
$app->get("/api/verifies/{airId}", [$AuthController, 'verifies']);
$app->get("/api/user/{airId}", [$UserController, 'getUser']);
$app->post("/api/user/{airId}", [$UserController, 'setUser']);
$app->get("/api/user_key/{airId}", [$UserController, 'getUserKey']);

$app->get("/api/issuance/{airId}", [$IssuanceController, 'getRows']);
$app->post("/api/issuance/{airId}", [$IssuanceController, 'setData']);
$app->get("/api/published_issuance", [$IssuanceController, 'getAllPublishedRows']);

$app->get("/api/usage/{airId}", [$UsageController, 'getRows']);
$app->post("/api/usage/{airId}", [$UsageController, 'setData']);





$app->dispatch();
