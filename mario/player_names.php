<?php
require_once("inc/common.inc.php");
$vars = [];

$mario = $_POST["mario1"] ?? "";
$luidzhi = $_POST["luidzhi"] ?? "";

saveToSession("mario1", $mario);  
saveToSession("luidzhi", $luidzhi);

if (isPost()) {
    header("Location: /mario.php");
    exit;
}

echo getView('player_names/player_names.html.twig', $vars);