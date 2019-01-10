<?php
require_once("inc/common.inc.php");
$error = ERR_NONE;
$gamer1 = getFromSession("mario1");
$gamer2 = getFromSession("luidzhi");
$userId = getFromSession("user_id");
$id = dbQueryGetResult(getUserById($userId));
$vars = [
    'gamer1' => $gamer1,
    'gamer2' => $gamer2,
    'user_id' => $id,
];

if (isPost()) {
    $marioCounts = $_POST["mario"] ?? "";
    $luidzhiCounts = $_POST["luidzhi"] ?? "";
    $playerScore = $_POST['playersCounts'] ?? "";
    if ($playerScore) {
        $luidzhiScore = $playerScore['luidzhiScore'];
        $marioScore = $playerScore['marioScore'];
    }
    saveToSession("marioScore", $marioScore);
    saveToSession("luidzhiScore", $luidzhiScore);
    $winningPlayer = compareScore($marioScore, $luidzhiScore, $gamer1, $gamer2);

    saveToSession("winningPlayer", $winningPlayer);
    saveToSession("marioCounts", $marioCounts);
    saveToSession("luidzhiCounts", $luidzhiCounts);

    $error = ERR_DATA_TRANSFERRED;
    echo (json_encode($error));
    exit;
}

echo getView('mario/mario.html.twig', $vars);