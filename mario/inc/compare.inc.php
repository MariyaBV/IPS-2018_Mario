<?php
function compareScore($marioScore, $luidzhiScore, $gamer1, $gamer2) {
    if ($marioScore > $luidzhiScore) {
        $winningPlayer = $gamer1;
    } elseif ($marioScore < $luidzhiScore) {
        $winningPlayer = $gamer2;
    } elseif ($marioScore == $luidzhiScore) {
        $winningPlayer = 'Ничья';
    }

    return $winningPlayer;
}