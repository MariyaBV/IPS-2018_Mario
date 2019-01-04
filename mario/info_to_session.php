<?php
require_once("inc/common.inc.php");
header('Content-Type: application/json;charset=utf-8');
header('Accept: application/json');

//if (isPost()) {
    //$_POST = json_decode(file_get_contents('php://input'), true);
    $f = fopen('php://input', 'r');
    $data = stream_get_contents($f);
    if ($data) {      
        print_r(json_decode($data));
        $points = json_decode($data);
    }
    //$points = $_POST["points"] ?? "";
    //$coin = $_POST["coin"] ?? ""; 
    //$jsonPoints = json_decode($points, true);
    saveToSession("points", $points);
    saveToSession("coin", $coin);
//}
var_dump($_SESSION);

//saveToSession("coin", $coin);