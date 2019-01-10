<?php
require_once("inc/common.inc.php");

$gamer1 = getFromSession("mario1");
$gamer2 = getFromSession("luidzhi");
$userId = getFromSession("user_id");
$id = dbQueryGetResult(getUserById($userId));
$endTime = date('Y-m-d H:i:s');
$marioScore = getFromSession("marioCounts");
$luidzhiScore = getFromSession("luidzhiCounts");
$marioSumScore = getFromSession("marioScore");
$luidzhiSumScore = getFromSession("luidzhiScore");
$vars = [
    'user_id' => $id,
];

if (!empty($userId) && (!empty($marioScore) || !empty($luidzhiScore)) && (!empty($marioSumScore) || !empty($luidzhiSumScore))) {
    saveGameId($endTime);
    $gameId = dbGetLastInsertId();
    fromSessionToBD($userId, $marioScore, $gamer1, $gameId, $marioSumScore);
    fromSessionToBD($userId, $luidzhiScore, $gamer2, $gameId, $luidzhiSumScore);

    unset($_SESSION['marioCounts']);
    unset($_SESSION['luidzhiCounts']);
    unset($_SESSION['marioScore']);
    unset($_SESSION['luidzhiScore']);
    unset($_SESSION['playerScore']);
    unset($_SESSION['winningPlayer']);
}

echo getView('action_choice/action_choice.html.twig', $vars);