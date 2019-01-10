<?php
require_once("inc/common.inc.php");

$userId = getFromSession("user_id");
$id = dbQueryGetResult(getUserById($userId));
$vars = [
    'user_id' => $id,
];

echo getView('action_choice/action_choice.html.twig', $vars);