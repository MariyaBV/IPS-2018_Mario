<?php
require_once("inc/common.inc.php");

function getUserInfoByEmail($email)
{
    $userInfo = 'SELECT user_id, pass_hash, user_name, email FROM  user_table  WHERE email = \'' . dbQuote($email) . '\'';
    dbQuery($userInfo);

    return $userInfo;
}

function registerUser($name, $password, $email)
{
    $insertNewUser = 'INSERT INTO  `user_table` (pass_hash, user_name,  email) VALUES (\'' . dbQuote($password) . '\', \'' . dbQuote($name) . '\', \'' . dbQuote($email) . '\')';
    dbQuery($insertNewUser);

    return $insertNewUser;
}

function getUserById($id)
{
    $userId = 'SELECT user_id FROM  user_table  WHERE user_id = \'' . dbQuote($id) . '\'';
    dbQuery($userId);

    return $userId;
}

function getUserInfoByUserId($id)
{
    $userInfo = 'SELECT user_id, pass_hash, user_name, email FROM  user_table  WHERE user_id = \'' . dbQuote($id) . '\'';
    dbQuery($userInfo);

    return $userInfo;
}

function changeUserInfo($userName, $passwordHash, $email)
{
    $changeInfo = 'UPDATE user_table SET user_name = \'' . dbQuote($userName) . '\', pass_hash = \'' . dbQuote($passwordHash) . '\' WHERE email = \'' . dbQuote($email) . '\'';
    dbQuery($changeInfo);

    return $changeInfo;
};

function fromSessionToBD($userId, $marioScore, $luidzhiScore, $gamer1, $gamer2, $endTime)
{

}