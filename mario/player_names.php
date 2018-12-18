<?php
require_once("inc/common.inc.php");
$vars = [];

saveToSession("mario1", "Mary");  
saveToSession("mario2", "Margarita");

echo getView('player_names/player_names.html.twig', $vars);