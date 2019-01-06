import {AMOUNT_OF_ENEMIES, AMOUNT_OF_COINS, NUMBER_OF_LIVES} from './collision_mario.js';
import {AMOUNT_OF_ENEMIES_LUIDZHI, AMOUNT_OF_COINS_LUIDZHI, NUMBER_OF_LIVES_LUIDZHI} from './collision_luidzhi.js';
import {score} from './points.js';

function pointsToSession() {
    const points = {
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
    };

    $.post('info_to_session.php', JSON.stringify(points));
    //$.post('info_to_session.php', {'coin': AMOUNT_OF_COINS});
    console.log('pointsToSession', points);
};

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

    return [marioScore, luidzhiScore];
}

function scoreToSession(game) {
    console.log(scoreOfPlayers(game));
    $.post('info_to_session.php', scoreOfPlayers(game));
}

export {pointsToSession, scoreToSession};
