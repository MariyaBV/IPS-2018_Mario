<?php
error_reporting(-1);

header("Content-Type: text/html; charset=UTF-8");
require_once("inc/template.inc.php");
require_once("inc/database.inc.php");
require_once("inc/const.inc.php");
require_once("inc/user.inc.php");
require_once("inc/request.inc.php");
require_once("inc/error_constants.inc.php");
require_once("inc/compare.inc.php");

const DOCUMENT_ROOT_LW5 = 'C:/dev-project/php7';

require_once(DOCUMENT_ROOT_LW5 . '/vendor/autoload.php');
require_once("inc/session.inc.php");
//require_once("info_to_session.php");

dbInitialConnect();
startSession();
