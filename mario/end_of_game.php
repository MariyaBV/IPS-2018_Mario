<?php
require_once("inc/common.inc.php");
$gamer1 = getFromSession("mario1");
$gamer2 = getFromSession("luidzhi");
$vars = [
    'gamer1' => $gamer1,
    'gamer2' => $gamer2,
];

echo getView('end_of_game/end_of_game.html.twig', $vars);