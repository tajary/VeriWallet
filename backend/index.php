<?php
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

$app->post("/api/auth/nonce/{wallet}", [$AuthController, 'createNonce']);

$app->post("/api/auth/verify", [$AuthController, 'verifyNounce']);
$app->get("/api/wallet/{criteria}/{address}", [$AuthController, 'getPublicCredential']);










$app->dispatch();
