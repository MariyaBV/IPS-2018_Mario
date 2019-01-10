import {AMOUNT_OF_ENEMIES, AMOUNT_OF_COINS, NUMBER_OF_LIVES} from './collision_player.js';
import {AMOUNT_OF_ENEMIES_LUIDZHI, AMOUNT_OF_COINS_LUIDZHI, NUMBER_OF_LIVES_LUIDZHI} from './collision_luidzhi.js';
import {score} from './counts.js';

function scoreOfPlayers(game) {
    let marioScore;
    let luidzhiScore;
    if (NUMBER_OF_LIVES == 0) {
        marioScore = 0;
    } else if (game.marioInfo.firstFinish == true) {
        marioScore = score(AMOUNT_OF_ENEMIES, AMOUNT_OF_COINS, NUMBER_OF_LIVES) * 1.5;
    } else {
        marioScore = score(AMOUNT_OF_ENEMIES, AMOUNT_OF_COINS, NUMBER_OF_LIVES);
    }
    if (NUMBER_OF_LIVES_LUIDZHI == 0) {
        luidzhiScore = 0;
    } else if (game.luidzhiInfo.firstFinish == true) {
        luidzhiScore = score(AMOUNT_OF_ENEMIES_LUIDZHI, AMOUNT_OF_COINS_LUIDZHI, NUMBER_OF_LIVES_LUIDZHI) * 1.5;
    } else {
        luidzhiScore = score(AMOUNT_OF_ENEMIES_LUIDZHI, AMOUNT_OF_COINS_LUIDZHI, NUMBER_OF_LIVES_LUIDZHI);
    }

    const playersCounts = {
        'marioScore': marioScore,
        'luidzhiScore': luidzhiScore,
    };
    return playersCounts;
}

function countsToSession(game) {
    const playersCounts = scoreOfPlayers(game);
    const counts = {
        mario: {
            'coin': AMOUNT_OF_COINS,
            'live': NUMBER_OF_LIVES,
            'goomba': AMOUNT_OF_ENEMIES,
        },
        luidzhi: {
            'coin': AMOUNT_OF_COINS_LUIDZHI,
            'live': NUMBER_OF_LIVES_LUIDZHI,
            'goomba': AMOUNT_OF_ENEMIES_LUIDZHI,
        },
        playersCounts,
    };

    $.post('mario.php', counts, function(data) {
        onComplete(data);
    });
    console.log('countsToSession', counts);
};

function onComplete(response) {
    if (response == 7) {
        window.location = 'end_of_game.php';
    } else {
        console.log('данные не передались');
    }
}

export {countsToSession};
