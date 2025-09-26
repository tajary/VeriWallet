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

$app->post("/api/credential/add", [$AuthController, 'addCredential']);

$app->get("/api/credential/all/{wallet}", [$AuthController, 'getCredentials']);









$app->dispatch();
