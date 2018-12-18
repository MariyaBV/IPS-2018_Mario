<?php
require_once("inc/common.inc.php");

dbInitialConnect();
$email = dbQuote($_POST["email"] ?? "");
$name = dbQuote($_POST["username"] ?? "");
$password = dbQuote($_POST["password"] ?? "");
$repeatPassword = dbQuote($_POST["repeat_password"] ?? "");

$registredUsers = dbQueryGetResult(getUserInfoByName($email));

if (!empty($registredUsers)) {
    echo json_encode(['error_code' => 7]);
    echo 'пользователь уже существует';
    return;
}

$result = dbQuery(registerUser($name, $password, $email));
echo $result;
