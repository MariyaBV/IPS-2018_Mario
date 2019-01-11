<?php
require_once("inc/common.inc.php");

function isPost()
{
    return ($_SERVER['REQUEST_METHOD'] == 'POST');
}

function isGet()
{
    return ($_SERVER['REQUEST_METHOD'] == 'GET');
}

function pageAuthorizationWithError($errorCode)
{
    $vars = [
        'error' => getErrorMessage($errorCode),
    ];

    echo getView('authorization/authorization.html.twig', $vars);
    exit;
}

function pageRegistrationWithError($errorCode)
{
    $vars = [
        'error' => getErrorMessage($errorCode),
    ];

    echo getView('registration/registration.html.twig', $vars);
    exit;
}

function pageChangeInfoWithError($errorCode, $email, $userName)
{
    $vars = [
        'error' => getErrorMessage($errorCode),
        'user_name' => $userName,
        'email' => $email,
    ];

    echo getView('account/personal_account.html.twig', $vars);
    exit;
}

function authorizationWithCheck($email, $password, $registredUsers, $errorCode)
{
    if (empty($email) || empty($password)) {
        $errorCode = ERR_EMPTY_PARAM;
        pageAuthorizationWithError($errorCode);
    };

    if (empty($registredUsers)) {
        $errorCode = ERR_USER_NOT_EXISTS;
        pageAuthorizationWithError($errorCode);
    };

    $getUserPassword = $registredUsers[0]['pass_hash'];

    if (!password_verify($password, $getUserPassword)) {
        $errorCode = ERR_WRONG_PASS;
        pageAuthorizationWithError($errorCode);
    };

    if (password_verify($password, $getUserPassword)) {
        $userId = $registredUsers[0]['user_id'];
        saveToSession("user_id", $userId);
        header ('Location: /action_choice.php');
        exit;
    }
}

function registrationWithCheck($email, $password, $registredUsers, $repeatPassword, $errorCode)
{
    $name = $_POST["username"] ?? "";

    if (empty($email) || empty($password) || empty($repeatPassword)) {
        $errorCode = ERR_EMPTY_PARAM;
        pageRegistrationWithError($errorCode);
    };

    if (!empty($registredUsers)) {
        $errorCode = ERR_USER_EXISTS;
        pageRegistrationWithError($errorCode);
    };
    
    if (strlen($password) < 6) {
        $errorCode = ERR_SHORT_PASSWORD;
        pageRegistrationWithError($errorCode);
    };

    if ($password != $repeatPassword) {
        $errorCode = ERR_DIFFERENT_PASSWORDS;
        pageRegistrationWithError($errorCode);
    };
    
    if ($errorCode == ERR_NONE) {
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);  
        registerUser($name, $passwordHash, $email);
        header ('Location: /authorization.php');
        exit;
    }
}

function dataChange($email, $userName, $userPassword, $oldPassword, $newPassword, $reapeatPassword, $errorCode) 
{
    if (!password_verify($oldPassword, $userPassword)) {
        $errorCode = ERR_WRONG_OLD_PASSWORD;
        pageChangeInfoWithError($errorCode, $email, $userName);
    };

    if (empty($newPassword) && empty($reapeatPassword) && !empty($userName) && ($errorCode == ERR_NONE)) {
        changeUserName($userName, $email);
        header ('Location: /action_choice.php');
        exit;
    }

    if ($newPassword != $reapeatPassword && !empty($newPassword)) {
        $errorCode = ERR_DIFFERENT_PASSWORDS;
        pageChangeInfoWithError($errorCode, $email, $userName);
    };

    if (strlen($newPassword) < 6 && !empty($newPassword)) {
        $errorCode = ERR_SHORT_PASSWORD;
        pageChangeInfoWithError($errorCode, $email, $userName);
    };

    if ($errorCode == ERR_NONE) {
        $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);  
        changeUserInfo($userName, $passwordHash, $email);
        header ('Location: /action_choice.php');
        exit;
    }
};
