<?php
require_once("inc/common.inc.php");

function getUserInfoByName($name)
{
    $findUserName = 'SELECT user_name FROM  user_table  WHERE user_name = ' . $name;

    return $findUserName;
}

function registerUser($name, $password, $email)
{
    $insertNewUser = 'INSERT INTO  user_table  (pass_hash, user_name,  email) VALUES (' . $password . ', ' . $name . ', ' . $email . ')';

    return $insertNewUser;
}