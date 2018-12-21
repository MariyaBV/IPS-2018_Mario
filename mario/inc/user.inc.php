<?php
require_once("inc/common.inc.php");

function getUserInfoByEmail($email)
{
    $findUserEmail = 'SELECT email FROM  user_table  WHERE email = \'' . dbQuote($email) . '\'';
    dbQuery($findUserEmail);

    return $findUserEmail;
}

function compareWithСorrectPassword($email)
{
    $findUserPassword = 'SELECT pass_hash FROM  user_table  WHERE email = \'' . dbQuote($email) . '\'';
    $userPassword = dbQueryGetResult($findUserPassword);

    return $userPassword;
}

function registerUser($name, $password, $email)
{
    $insertNewUser = 'INSERT INTO  user_table  (pass_hash, user_name,  email) VALUES (\'' . dbQuote($password) . '\', \'' . dbQuote($name) . '\', \'' . dbQuote($email) . '\')';
    dbQuery($insertNewUser);

    return $insertNewUser;
}