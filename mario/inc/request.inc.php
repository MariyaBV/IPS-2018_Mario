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

function authorizationWithCheck($email, $password, $registredUsers, $errorCode, $vars)
{
    if (empty($email) || empty($password)) {
        $errorCode = ERR_EMPTY_PARAM;
        pageAuthorizationWithError($errorCode);
    };

    if (empty($registredUsers)) {
        $errorCode = ERR_USER_NOT_EXISTS;
        pageAuthorizationWithError($errorCode);
    };

    $userPassword = compareWithСorrectPassword($email);
    $getUserPassword = $userPassword[0]['pass_hash'];

    if ($password != $getUserPassword) {
        $errorCode = ERR_WRONG_PASS;
        pageAuthorizationWithError($errorCode);
    };

    if ($password == $getUserPassword) {
        header ('Location: /action_choice.php');
        exit;
    }
}

function registrationWithCheck($email, $password, $registredUsers, $repeatPassword, $errorCode, $vars)
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
    
    if ($password != $repeatPassword) {
        $errorCode = ERR_DIFFERENT_PASSWORDS;
        pageRegistrationWithError($errorCode);
    };
    
    if ($errorCode == ERR_NONE) {    
        registerUser($name, $password, $email);
        header ('Location: /authorization.php');
        exit;
    }
}