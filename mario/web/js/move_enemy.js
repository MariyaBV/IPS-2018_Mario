import {ENEMY} from './objects.js';

const ENEMY_SIZE = 50;
const ENEMY_STEP = 0.005;

function moveEnemy() {
    for (let j = 0; j < ENEMY.length; j++) {
        if (ENEMY[j][4] == 0) {
            ENEMY[j][0] += ENEMY_STEP;
        } else if (ENEMY[j][4] == 1) {
            ENEMY[j][0] -= ENEMY_STEP;
        }
    }
}

export {ENEMY_SIZE, ENEMY_STEP, moveEnemy};
