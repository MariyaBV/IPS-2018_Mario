<?php

function startSession()
{
    session_name("mario");
    session_start();
}

function saveToSession($key, $value)
{
    $_SESSION[$key] = $value;
}

function getFromSession($key)
{
    return $_SESSION[$key] ?? '';
}
