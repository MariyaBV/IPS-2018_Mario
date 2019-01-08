import {isFloatEqual} from './compare.js';
import {OBJECT_WIDTH, marioPositionYRelativeToObject, objectType} from './collision_player.js';
import {ENEMY_STEP, ENEMY_SIZE} from './move_enemy.js';
import {BRICK_LEDGE_ONES, BRICK_LEDGE, ENEMY} from './objects.js';

const objType = 1;

function objectOnRightFromEnemy(ENEMY, object, objType, objectType) {
    if (isFloatEqual(ENEMY[0] * ENEMY_SIZE + ENEMY_SIZE, object[0] * OBJECT_WIDTH, 1)) {
        if (marioPositionYRelativeToObject(ENEMY[1] * ENEMY_SIZE, object)) {
            if (objType == objectType.barrier) {
                ENEMY[4] = 1;
                ENEMY[0] -= ENEMY_STEP;
            }
        }
    }
}

function objectOnLeftFromEnemy(ENEMY, object, objType, objectType) {
    if (isFloatEqual(ENEMY[0] * ENEMY_SIZE, (object[0] + object[2]) * OBJECT_WIDTH, 1)) {
        if (marioPositionYRelativeToObject(ENEMY[1] * ENEMY_SIZE, object)) {
            if (objType == objectType.barrier) {
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

function allEnemyCollision(ENEMY, object, objType, objectType) {
    for (let j = 0; j < ENEMY.length; j++) {
        enemyLeftScreenCollision(ENEMY[j]);
        objectOnRightFromEnemy(ENEMY[j], object, objType, objectType);
        objectOnLeftFromEnemy(ENEMY[j], object, objType, objectType);
    }
}

function enemyCollisionWithWall() {
    for (const object of BRICK_LEDGE_ONES) {
        allEnemyCollision(ENEMY, object, objType, objectType);
    }
    for (const object of BRICK_LEDGE) {
        allEnemyCollision(ENEMY, object, objType, objectType);
    }
}

export {enemyCollisionWithWall};
