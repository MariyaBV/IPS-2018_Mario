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

function saveGameId($endTime)
{
    $createGame = 'INSERT INTO  `game` (created_at) VALUES (\'' . dbQuote($endTime) . '\')';
    dbQuery($createGame);

    return $createGame;
}

function getPlayerId($id)
{
    $playerId = 'SELECT player_id FROM  player  WHERE user_id = \'' . dbQuote($id) . '\'';
    dbQuery($playerId);

    return $playerId;
}

function insertPlayerInfo($gamer, $userId)
{
    $insertPlayer = 'INSERT INTO  `player` (player_name, user_id) VALUES (\'' . dbQuote($gamer) . '\', \'' . dbQuote($userId) . '\')';
    dbQuery($insertPlayer);

    return $insertPlayer;
}

function fromSessionToBD($userId, $playerScore, $gamer, $gameId, $playerSumScore)
{
    insertPlayerInfo($gamer, $userId);
    $playerId = dbGetLastInsertId();
    $insertScore = 'INSERT INTO  `score` (player_id, lifes, goomba, coins, points, game_id) 
    VALUES (\'' . dbQuote($playerId) . '\', \'' . dbQuote($playerScore['live']) . '\', \'' . dbQuote($playerScore['goomba']) . '\', \'' . dbQuote($playerScore['coin']) . '\', \'' . dbQuote($playerSumScore) . '\', \'' . dbQuote($gameId) . '\')';
    dbQuery($insertScore);
    
    return $insertScore;
}