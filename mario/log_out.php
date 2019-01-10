<?php
require_once("inc/common.inc.php");

if (isset($_SESSION)) {
    endOfSession();
    header("Location: /index.php");
    exit;
}