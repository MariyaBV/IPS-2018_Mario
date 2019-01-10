<?php
require_once("inc/common.inc.php");

$userId = getFromSession("user_id");
$id = dbQueryGetResult(getUserById($userId));
$dataFromBd = dbQueryGetResult(getDataOfScoreByBD($userId));
$vars = [
    'user_id' => $id,
    'datas' => $dataFromBd,
];

echo getView('score_table/score_table.html.twig', $vars);