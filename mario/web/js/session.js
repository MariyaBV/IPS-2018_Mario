import {AMOUNT_OF_ENEMIES, AMOUNT_OF_COINS, NUMBER_OF_LIVES} from './collision.js';

function pointsToSession() {
    const points = {
        mario: {
            'coin': AMOUNT_OF_COINS,
            'live': NUMBER_OF_LIVES,
            'goomba': AMOUNT_OF_ENEMIES,
        },
        luidzhi: {
            'coin': AMOUNT_OF_COINS,
            'live': NUMBER_OF_LIVES,
            'goomba': AMOUNT_OF_ENEMIES,
        },
    };

    $.post('info_to_session.php', JSON.stringify(points));
    console.log('pointsToSession', AMOUNT_OF_COINS, NUMBER_OF_LIVES, AMOUNT_OF_ENEMIES);
};

export {pointsToSession};
