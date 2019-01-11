<?php
require_once("inc/common.inc.php");

$errorCode = ERR_NONE;
$userId = getFromSession("user_id");
$id = dbQueryGetResult(getUserById($userId));
$userInfo = dbQueryGetResult(getUserInfoByUserId($userId));
$userName = $userInfo[0]['user_name'];
$userEmail = $userInfo[0]['email'];
$userPassword = $userInfo[0]['pass_hash'];

$vars = [
    'user_id' => $id,
    'user_name' => $userName,
    'email' => $userEmail,
];

if (isPost()) {
    $userName = $_POST["user_name"] ?? "";
    $email = $_POST["email"] ?? "";
    $oldPassword = $_POST["old_password"] ?? "";
    $newPassword = $_POST["new_password"] ?? "";
    $reapeatPassword = $_POST["reapeat_password"] ?? "";
    
    dataChange($email, $userName, $userPassword, $oldPassword, $newPassword, $reapeatPassword, $errorCode);
}

echo getView('account/personal_account.html.twig', $vars);