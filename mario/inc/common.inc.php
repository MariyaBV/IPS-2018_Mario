<?php
header("Content-Type: text/html; charset=UTF-8");
require_once("inc/template.inc.php");
require_once("inc/database.inc.php");
require_once("inc/const.inc.php");
require_once("inc/user.inc.php");
require_once("inc/user_registration_info.inc.php");

const DOCUMENT_ROOT_LW5 = 'C:/dev-project/php7';

require_once(DOCUMENT_ROOT_LW5 . '/vendor/autoload.php');
require_once("inc/session.inc.php");

startSession();