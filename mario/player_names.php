<?php
require_once("inc/common.inc.php");

$userId = getFromSession("user_id");
$id = dbQueryGetResult(getUserById($userId));
$vars = [
    'user_id' => $id,
];
$mario = $_POST["mario1"] ?? "";
$luidzhi = $_POST["luidzhi"] ?? "";

if (empty($luidzhi)) {
    $mario = "игрок 1";
};
if (empty($mario)) {
    $mario = "игрок 2";
};

saveToSession("mario1", $mario);  
saveToSession("luidzhi", $luidzhi);

if (isPost()) {
    header("Location: /mario.php");
    exit;
}

echo getView('player_names/player_names.html.twig', $vars);