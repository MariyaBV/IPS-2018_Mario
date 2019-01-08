<?php
require_once("inc/common.inc.php");
$error = ERR_NONE;
$gamer1 = getFromSession("mario1");
$gamer2 = getFromSession("luidzhi");
$vars = [
    'gamer1' => $gamer1,
    'gamer2' => $gamer2,
];

if (isPost()) {
    $marioCounts = $_POST["mario"] ?? "";
    $luidzhiCounts = $_POST["luidzhi"] ?? "";
    $playerScore = $_POST['playersCounts'] ?? "";
    if ($playerScore) {
        $luidzhiScore = $playerScore['luidzhiScore'];
        $marioScore = $playerScore['marioScore'];
    }
    $winningPlayer = compareScore($marioScore, $luidzhiScore, $gamer1, $gamer2);

    saveToSession("winningPlayer", $winningPlayer);
    saveToSession("marioCounts", $marioCounts);
    saveToSession("luidzhiCounts", $luidzhiCounts);

    $error = ERR_DATA_TRANSFERRED;
    echo (json_encode($error));
    // header('Location: /end_of_game.php', true, 302);
    exit;
}

echo getView('mario/mario.html.twig', $vars);