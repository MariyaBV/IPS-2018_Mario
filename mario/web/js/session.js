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
    //$.post('info_to_session.php', {'coin': AMOUNT_OF_COINS});
    console.log('pointsToSession', points);
};

export {pointsToSession};
