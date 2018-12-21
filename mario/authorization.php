<?php
require_once("inc/common.inc.php");

$errorCode = ERR_NONE;
$vars = [
    'error' => getErrorMessage($errorCode),
];

if (isPost()) {
    $email = $_POST["email"] ?? "";
    $password = $_POST["password"] ?? "";
    $registredUsers = dbQueryGetResult(getUserInfoByEmail($email));
    
    authorizationWithCheck($email, $password, $registredUsers, $errorCode, $vars);
}

echo getView('authorization/authorization.html.twig', $vars);