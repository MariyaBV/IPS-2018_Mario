<?php
const ERR_NONE = 0;
const ERR_DIFFERENT_PASSWORDS = 1;
const ERR_EMPTY_PARAM = 2;
const ERR_INCORRECT_NUMBER_OF_PARAM = 3;
const ERR_USER_EXISTS = 4;
const ERR_USER_NOT_EXISTS = 5;
const ERR_WRONG_PASS = 6;
const ERR_DATA_TRANSFERRED = 7;

function getErrorMessage($errorCode)
{
    $errArr = [
        0 => "",
        1 => "Пароли не совпадают.",
        2 => "Пустой параметр(ы). Введите, пожалуйста, все обязательные параметры.",
        3 => "Передано неверное количество параметров.",
        4 => "Пользователь с таким email уже существует.",
        5 => "Пользователя с таким email еще нет.",
        6 => "Не верный пароль.",
        7 => "Данные переданы.",
    ];

    return $errArr[$errorCode];
}