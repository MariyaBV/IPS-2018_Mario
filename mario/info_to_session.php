<?php
require_once("inc/common.inc.php");
header('Content-Type: application/json;charset=utf-8');
header('Accept: application/json');

function writelog($msg) {
    $fo = @fopen("debug.log", "a");
    if ($fo) {
        fputs($fo, $msg . "\n");
        fclose($fo);
    }
}