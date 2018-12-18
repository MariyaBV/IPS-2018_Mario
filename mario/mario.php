<?php
require_once("inc/common.inc.php");
$vars = [];

getFromSession("mario1");
getFromSession("mario2");

echo getView('mario/mario.html.twig', $vars);