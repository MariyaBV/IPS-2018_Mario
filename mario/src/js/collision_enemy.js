import {isFloatEqual} from './compare.js';
import {OBJECT_WIDTH, playerPositionYRelativeToObject, OBJECT_TYPE} from './collision_player.js';
import {ENEMY_STEP, ENEMY_SIZE} from './move_enemy.js';
import {BRICK_LEDGE_ONES, BRICK_LEDGE, ENEMY} from './objects.js';

const objType = 1;

function objectOnRightFromEnemy(ENEMY, object, objType, OBJECT_TYPE) {
    if (isFloatEqual(ENEMY[0] * ENEMY_SIZE + ENEMY_SIZE, object[0] * OBJECT_WIDTH, 1)) {
        if (playerPositionYRelativeToObject(ENEMY[1] * ENEMY_SIZE, object)) {
            if (objType == OBJECT_TYPE.BARRIER) {
                ENEMY[4] = 1;
                ENEMY[0] -= ENEMY_STEP;
            }
        }
    }
}

function objectOnLeftFromEnemy(ENEMY, object, objType, OBJECT_TYPE) {
    if (isFloatEqual(ENEMY[0] * ENEMY_SIZE, (object[0] + object[2]) * OBJECT_WIDTH, 1)) {
        if (playerPositionYRelativeToObject(ENEMY[1] * ENEMY_SIZE, object)) {
            if (objType == OBJECT_TYPE.BARRIER) {
                ENEMY[4] = 0;
                ENEMY[0] += ENEMY_STEP;
            }
        }
    }
}

function enemyLeftScreenCollision(ENEMY) {
    if (ENEMY[0] <= 0) {
        ENEMY[0] += ENEMY_STEP;
        ENEMY[4] = 0;
    }
}

function allEnemyCollision(ENEMY, object, objType, OBJECT_TYPE) {
    for (let j = 0; j < ENEMY.length; j++) {
        enemyLeftScreenCollision(ENEMY[j]);
        objectOnRightFromEnemy(ENEMY[j], object, objType, OBJECT_TYPE);
        objectOnLeftFromEnemy(ENEMY[j], object, objType, OBJECT_TYPE);
    }
}

function enemyCollisionWithWall() {
    for (const object of BRICK_LEDGE_ONES) {
        allEnemyCollision(ENEMY, object, objType, OBJECT_TYPE);
    }
    for (const object of BRICK_LEDGE) {
        allEnemyCollision(ENEMY, object, objType, OBJECT_TYPE);
    }
}

export {enemyCollisionWithWall};
