import {getStartPositionLui} from './game.js';
import {LUIDZHI_SIZE} from './const_mario.js';
import {BRICK_LEDGE_ONES, BRICK_LEDGE, COIN, ENEMY} from './objects.js';
import {isFloatEqual} from './compare.js';
import {Vec2} from './vector.js';

const OBJECT_HEIGHT = 50;
const OBJECT_WIDTH = 50;
let AMOUNT_OF_COINS_LUIDZHI = 0;
let AMOUNT_OF_ENEMIES_LUIDZHI = 0;
let NUMBER_OF_LIVES_LUIDZHI = 3;
const objectType = {
    barrier: 1,
    coin: 2,
    enemy: 3,
};

function bottomScreenCollision(game) {
    if (game.mario.position.y > 500 - 2 * LUIDZHI_SIZE) {
        game.mario.speed = new Vec2(game.mario.speed.x, 0);
        game.mario.jump = false;
        game.mario.position = new Vec2(game.mario.position.x, 500 - OBJECT_HEIGHT - LUIDZHI_SIZE - 0.1);
        game.mario.keyUp = false;
    }
}

function leftScreenCollision(game) {
    if (game.mario.position.x <= 0) {
        game.mario.position = new Vec2(0, game.mario.position.y);
        game.mario.speed = game.mario.speed.add(new Vec2(0, 20));
    }
}

function marioPositionXRelativeToObject(marioPosX, object) {
    return ((marioPosX > (object[0] * OBJECT_WIDTH)) && (marioPosX < (object[0] + object[2]) * OBJECT_WIDTH)) ||
        (((marioPosX + LUIDZHI_SIZE) > (object[0] * OBJECT_WIDTH)) &&
        ((marioPosX + LUIDZHI_SIZE) < (object[0] + object[2]) * OBJECT_WIDTH));
}

function marioPositionYRelativeToObject(marioPosY, object) {
    return ((marioPosY > (object[1] * OBJECT_HEIGHT)) && (marioPosY < (object[1] + object[3]) * OBJECT_HEIGHT)) ||
        (((marioPosY + LUIDZHI_SIZE) > (object[1] * OBJECT_HEIGHT)) &&
        ((marioPosY + 50) < (object[1] + object[3]) * OBJECT_HEIGHT));
}

function collisionWithCoin(object, point) {
    for (let i = 0; i < COIN.length; i++) {
        if ((COIN[i][0] == object[0]) && (COIN[i][1] == object[1])) {
            COIN.splice(i, 1);
            AMOUNT_OF_COINS_LUIDZHI ++;
            point.pointOfCoin(AMOUNT_OF_COINS_LUIDZHI);
            console.log('Количество монет = ', AMOUNT_OF_COINS_LUIDZHI);
        }
    }
}

function collisionWithEnemyWithLosingLife(game, point) {
    NUMBER_OF_LIVES_LUIDZHI --;
    point.pointOfLive(NUMBER_OF_LIVES_LUIDZHI);
    console.log('Количество ЖИЗНЕЙ = ', NUMBER_OF_LIVES_LUIDZHI);
    game.mario.position = getStartPositionLui();
    if (NUMBER_OF_LIVES_LUIDZHI == 0) {
        alert('GAME OVER!');
        game.finished = true;
    }
}

function collisionAtSideOfBarrier(game, isLeftCollision) {
    const speedY = game.mario.speed.y;
    const speedX = isLeftCollision
        ? Math.max(game.mario.speed.x, 0)
        : Math.min(game.mario.speed.x, 0);
    game.mario.speed = new Vec2(speedX, speedY);
}

function killEnemy(object, point) {
    for (let j = 0; j < ENEMY.length; j++) {
        if ((ENEMY[j][0] == object[0]) && (ENEMY[j][1] == object[1])) {
            ENEMY.splice(j, 1);
            AMOUNT_OF_ENEMIES_LUIDZHI ++;
            point.pointOfGoomba(AMOUNT_OF_ENEMIES_LUIDZHI);
            console.log('Количество убитых ENEMIES = ', AMOUNT_OF_ENEMIES_LUIDZHI);
        }
    }
}

function standOnTheBarrier(game, marioSpeedX, marioPosX, object) {
    game.mario.speed = new Vec2(marioSpeedX, 0);
    game.mario.position = new Vec2(marioPosX, object[1] * OBJECT_WIDTH - LUIDZHI_SIZE - 1.1);
    game.mario.keyUp = false;
    game.mario.jump = false;
}

function objectOnTop(marioPosX, marioPosY, object, objType, objectType, game, point) {
    if (marioPositionXRelativeToObject(marioPosX, object)) {
        if (isFloatEqual(marioPosY, (object[1] + object[3]) * OBJECT_HEIGHT, 1)) {
            //console.log('sverhu pryamoug');
            if (objType == objectType.barrier) {
                const speed = game.mario.speed.y;
                game.mario.speed = new Vec2(0, -speed);
            };
            if (objType == objectType.coin) {
                collisionWithCoin(object, point);
            }
            if (objType == objectType.enemy) {
                collisionWithEnemyWithLosingLife(game, point);
            }
        }
    }
}

function objectOnDown(marioPosX, marioPosY, object, objType, objectType, game, point, marioSpeedX, dt) {
    if (marioPositionXRelativeToObject(marioPosX, object)) {
        if (isFloatEqual(marioPosY + LUIDZHI_SIZE, object[1] * OBJECT_HEIGHT, 1)) {
            const moveDistance = game.mario.speed.multiplyScalar(dt);
            game.mario.position = game.mario.position.add(moveDistance);
            //console.log('snizu pryamoug');
            if (objType == objectType.barrier) {
                standOnTheBarrier(game, marioSpeedX, marioPosX, object);
            }
            if (objType == objectType.coin) {
                collisionWithCoin(object, point);
            }
            if (objType == objectType.enemy) {
                killEnemy(object, point);
            }
        }
    }
}

function objectOnRight(marioPosX, marioPosY, object, objType, objectType, point, game) {
    if (isFloatEqual(marioPosX + LUIDZHI_SIZE, object[0] * OBJECT_WIDTH, 1)) {
        if (marioPositionYRelativeToObject(marioPosY, object)) {
            //console.log('sprava');
            if (objType == objectType.barrier) {
                collisionAtSideOfBarrier(game, false);
            }
            if (objType == objectType.coin) {
                collisionWithCoin(object, point);
            }
            if (objType == objectType.enemy) {
                collisionWithEnemyWithLosingLife(game, point);
            }
        }
    }
}

function objectOnLeft(marioPosX, marioPosY, object, objType, objectType, point, game) {
    if (isFloatEqual(marioPosX, (object[0] + object[2]) * OBJECT_WIDTH, 1)) {
        if (marioPositionYRelativeToObject(marioPosY, object)) {
            //console.log('sleva');
            if (objType == objectType.barrier) {
                collisionAtSideOfBarrier(game, true);
            }
            if (objType == objectType.coin) {
                collisionWithCoin(object, point);
            }
            if (objType == objectType.enemy) {
                collisionWithEnemyWithLosingLife(game, point);
            }
        }
    }
}

function collision(object, objType, dt, game, point) {
    const marioPosX = game.mario.position.x;
    const marioPosY = game.mario.position.y;
    const marioSpeedX = game.mario.speed.x;

    if (objectOnTop(marioPosX, marioPosY, object, objType, objectType, game, point));
    if (objectOnDown(marioPosX, marioPosY, object, objType, objectType, game, point, marioSpeedX, dt));
    if (objectOnRight(marioPosX, marioPosY, object, objType, objectType, point, game));
    if (objectOnLeft(marioPosX, marioPosY, object, objType, objectType, point, game));
}

function collisionWithObject(dt, game, point) {
    for (const coordinate of BRICK_LEDGE_ONES) {
        collision(coordinate, objectType.barrier, dt, game, point);
    }
    for (const coordinate of ENEMY) {
        collision(coordinate, objectType.enemy, dt, game, point);
    }
    for (const coordinate of BRICK_LEDGE) {
        collision(coordinate, objectType.barrier, dt, game, point);
    }
    for (const coordinate of COIN) {
        collision(coordinate, objectType.coin, dt, game, point);
    }
};

export {
    bottomScreenCollision,
    leftScreenCollision,
    collisionWithObject,
    AMOUNT_OF_ENEMIES_LUIDZHI,
    AMOUNT_OF_COINS_LUIDZHI,
    NUMBER_OF_LIVES_LUIDZHI,
};
