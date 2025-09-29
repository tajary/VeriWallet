<?php
date_default_timezone_set('UTC');
define('SLASH_PATH', __DIR__);

require_once 'lib/SimpleRouter.php';
require_once 'lib/GlobalData.php';

$app = new SimpleRouter();

$app->allowCrossOrigin(); // Allows *

$app->get("/", function() {
	
    return file_get_contents('static/index.html');
});

// $app->addStatic('/css', 'static/css');


include "./controllers/AuthController.php";
$AuthController = new AuthController();

$app->post("/api/credential/add", [$AuthController, 'addCredential']);

$app->get("/api/credential/all/{wallet}", [$AuthController, 'getCredentials']);

$app->post("/api/issue", [$AuthController, 'issue']);
$app->post("/api/verify/{airId}/{keyId}", [$AuthController, 'setVerify']);
$app->get("/api/verify/{wallet}/{keyId}", [$AuthController, 'getVerify']);
$app->get("/api/issues/{airId}", [$AuthController, 'issues']);
$app->get("/api/verifies/{airId}", [$AuthController, 'verifies']);







$app->dispatch();
