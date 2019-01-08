<?php
require_once("inc/common.inc.php");
$gamer1 = getFromSession("mario1");
$gamer2 = getFromSession("luidzhi");
$winningPlayer = getFromSession("winningPlayer");
$vars = [
    'gamer1' => $gamer1,
    'gamer2' => $gamer2,
    'winningPlayer' => $winningPlayer,
];

echo getView('end_of_game/end_of_game.html.twig', $vars);