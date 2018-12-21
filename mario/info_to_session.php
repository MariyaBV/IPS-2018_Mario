<?php
require_once("inc/common.inc.php");

if (isPost()) {
    echo " POST ";
    $points = $_POST["points"] ?? "";
    $json = json_decode($points, true);
    print_r($json);
    // $coin = $_POST["coin"] ?? 0;
    // $goomba = $_POST["goomba"] ?? 0;
    // $live = $_POST["live"] ?? 0;

    // if(isset($_SESSION['coin'])) {
    //     saveToSession("coin", $coin);
    // }
}


//saveToSession("coin", $coin);


//var_dump($_SESSION);