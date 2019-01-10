<?php
require_once("inc/common.inc.php");

$gamer1 = getFromSession("mario1");
$gamer2 = getFromSession("luidzhi");
$winningPlayer = getFromSession("winningPlayer");
$userId = getFromSession("user_id");
$id = dbQueryGetResult(getUserById($userId));
$endTime = time();
$vars = [
    'gamer1' => $gamer1,
    'gamer2' => $gamer2,
    'winningPlayer' => $winningPlayer,
    'user_id' => $id,
    'end_time' => $endTime,
];
$marioScore = getFromSession("marioCounts", $marioCounts);
$luidzhiScore = getFromSession("luidzhiCounts", $luidzhiCounts);

if (!empty($userId)) {
    fromSessionToBD($userId, $marioScore, $luidzhiScore, $gamer1, $gamer2, $endTime);
}

echo getView('end_of_game/end_of_game.html.twig', $vars);