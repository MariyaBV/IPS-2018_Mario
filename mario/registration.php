<?php
require_once("inc/common.inc.php");
$errorCode = ERR_NONE;
$vars = [
    'error' => getErrorMessage($errorCode),
];

if (isPost()) {
    $email = $_POST["email"] ?? "";
    $password = $_POST["password"] ?? "";
    $repeatPassword = $_POST["repeat_password"] ?? "";
    $registredUsers = dbQueryGetResult(getUserInfoByEmail($email));

    registrationWithCheck($email, $password, $registredUsers, $repeatPassword, $errorCode);
}

echo getView('registration/registration.html.twig', $vars);