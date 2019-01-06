import {getStartPositionLui} from './game.js';
import {LUIDZHI_SIZE} from './const_luidzhi.js';
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

function bottomScreenCollisionLui(game) {
    if (game.luidzhiInfo.luidzhi.position.y > 500 - 2 * LUIDZHI_SIZE) {
        game.luidzhiInfo.luidzhi.speed = new Vec2(game.luidzhiInfo.luidzhi.speed.x, 0);
        game.luidzhiInfo.luidzhi.jump = false;
        game.luidzhiInfo.luidzhi.position = new Vec2(game.luidzhiInfo.luidzhi.position.x, 500 - OBJECT_HEIGHT - LUIDZHI_SIZE - 0.1);
        game.luidzhiInfo.luidzhi.keyUp = false;
    }
}

function leftScreenCollisionLui(game) {
    if (game.luidzhiInfo.luidzhi.position.x <= 0) {
        game.luidzhiInfo.luidzhi.position = new Vec2(0, game.luidzhiInfo.luidzhi.position.y);
        game.luidzhiInfo.luidzhi.speed = game.luidzhiInfo.luidzhi.speed.add(new Vec2(0, 20));
    }
}

function luidzhiPositionXRelativeToObject(luidzhiPosX, object) {
    return ((luidzhiPosX > (object[0] * OBJECT_WIDTH)) && (luidzhiPosX < (object[0] + object[2]) * OBJECT_WIDTH)) ||
        (((luidzhiPosX + LUIDZHI_SIZE) > (object[0] * OBJECT_WIDTH)) &&
        ((luidzhiPosX + LUIDZHI_SIZE) < (object[0] + object[2]) * OBJECT_WIDTH));
}

function luidzhiPositionYRelativeToObject(luidzhiPosY, object) {
    return ((luidzhiPosY > (object[1] * OBJECT_HEIGHT)) && (luidzhiPosY < (object[1] + object[3]) * OBJECT_HEIGHT)) ||
        (((luidzhiPosY + LUIDZHI_SIZE) > (object[1] * OBJECT_HEIGHT)) &&
        ((luidzhiPosY + 50) < (object[1] + object[3]) * OBJECT_HEIGHT));
}

function collisionWithCoin(object, game) {
    for (let i = 0; i < COIN.length; i++) {
        if ((COIN[i][0] == object[0]) && (COIN[i][1] == object[1])) {
            COIN.splice(i, 1);
            AMOUNT_OF_COINS_LUIDZHI ++;
            game.luidzhiInfo.point.pointOfCoin(AMOUNT_OF_COINS_LUIDZHI);
            console.log('Количество монет Lui = ', AMOUNT_OF_COINS_LUIDZHI);
        }
    }
}

function collisionWithEnemyWithLosingLife(game) {
    NUMBER_OF_LIVES_LUIDZHI --;
    game.luidzhiInfo.point.pointOfLive(NUMBER_OF_LIVES_LUIDZHI);
    console.log('Количество ЖИЗНЕЙ Lui = ', NUMBER_OF_LIVES_LUIDZHI);
    game.luidzhiInfo.luidzhi.position = getStartPositionLui();
    if (NUMBER_OF_LIVES_LUIDZHI == 0) {
        alert('GAME OVER!');
        game.finished = true;
    }
}

function collisionAtSideOfBarrier(game, isLeftCollision) {
    const speedY = game.luidzhiInfo.luidzhi.speed.y;
    const speedX = isLeftCollision
        ? Math.max(game.luidzhiInfo.luidzhi.speed.x, 0)
        : Math.min(game.luidzhiInfo.luidzhi.speed.x, 0);
    game.luidzhiInfo.luidzhi.speed = new Vec2(speedX, speedY);
}

function killEnemy(object, game) {
    for (let j = 0; j < ENEMY.length; j++) {
        if ((ENEMY[j][0] == object[0]) && (ENEMY[j][1] == object[1])) {
            ENEMY.splice(j, 1);
            AMOUNT_OF_ENEMIES_LUIDZHI ++;
            game.luidzhiInfo.point.pointOfGoomba(AMOUNT_OF_ENEMIES_LUIDZHI);
            console.log('Количество убитых ENEMIES Lui = ', AMOUNT_OF_ENEMIES_LUIDZHI);
        }
    }
}

function standOnTheBarrier(game, luidzhiSpeedX, luidzhiPosX, object) {
    game.luidzhiInfo.luidzhi.speed = new Vec2(luidzhiSpeedX, 0);
    game.luidzhiInfo.luidzhi.position = new Vec2(luidzhiPosX, object[1] * OBJECT_WIDTH - LUIDZHI_SIZE - 1.1);
    game.luidzhiInfo.luidzhi.keyUp = false;
    game.luidzhiInfo.luidzhi.jump = false;
}

function objectOnTop(luidzhiPosX, luidzhiPosY, object, objType, objectType, game) {
    if (luidzhiPositionXRelativeToObject(luidzhiPosX, object)) {
        if (isFloatEqual(luidzhiPosY, (object[1] + object[3]) * OBJECT_HEIGHT, 1)) {
            //console.log('sverhu pryamoug');
            if (objType == objectType.barrier) {
                const speed = game.luidzhiInfo.luidzhi.speed.y;
                game.luidzhiInfo.luidzhi.speed = new Vec2(0, -speed);
            };
            if (objType == objectType.coin) {
                collisionWithCoin(object, game);
            }
            if (objType == objectType.enemy) {
                collisionWithEnemyWithLosingLife(game);
            }
        }
    }
}

function objectOnDown(luidzhiPosX, luidzhiPosY, object, objType, objectType, game, luidzhiSpeedX, dt) {
    if (luidzhiPositionXRelativeToObject(luidzhiPosX, object)) {
        if (isFloatEqual(luidzhiPosY + LUIDZHI_SIZE, object[1] * OBJECT_HEIGHT, 1)) {
            const moveDistance = game.luidzhiInfo.luidzhi.speed.multiplyScalar(dt);
            game.luidzhiInfo.luidzhi.position = game.luidzhiInfo.luidzhi.position.add(moveDistance);
            //console.log('snizu pryamoug');
            if (objType == objectType.barrier) {
                standOnTheBarrier(game, luidzhiSpeedX, luidzhiPosX, object);
            }
            if (objType == objectType.coin) {
                collisionWithCoin(object, game);
            }
            if (objType == objectType.enemy) {
                killEnemy(object, game);
            }
        }
    }
}

function objectOnRight(luidzhiPosX, luidzhiPosY, object, objType, objectType, game) {
    if (isFloatEqual(luidzhiPosX + LUIDZHI_SIZE, object[0] * OBJECT_WIDTH, 1)) {
        if (luidzhiPositionYRelativeToObject(luidzhiPosY, object)) {
            //console.log('sprava');
            if (objType == objectType.barrier) {
                collisionAtSideOfBarrier(game, false);
            }
            if (objType == objectType.coin) {
                collisionWithCoin(object, game);
            }
            if (objType == objectType.enemy) {
                collisionWithEnemyWithLosingLife(game);
            }
        }
    }
}

function objectOnLeft(luidzhiPosX, luidzhiPosY, object, objType, objectType, game) {
    if (isFloatEqual(luidzhiPosX, (object[0] + object[2]) * OBJECT_WIDTH, 1)) {
        if (luidzhiPositionYRelativeToObject(luidzhiPosY, object)) {
            //console.log('sleva');
            if (objType == objectType.barrier) {
                collisionAtSideOfBarrier(game, true);
            }
            if (objType == objectType.coin) {
                collisionWithCoin(object, game);
            }
            if (objType == objectType.enemy) {
                collisionWithEnemyWithLosingLife(game);
            }
        }
    }
}

function collision(object, objType, dt, game) {
    const luidzhiPosX = game.luidzhiInfo.luidzhi.position.x;
    const luidzhiPosY = game.luidzhiInfo.luidzhi.position.y;
    const luidzhiSpeedX = game.luidzhiInfo.luidzhi.speed.x;

    if (objectOnTop(luidzhiPosX, luidzhiPosY, object, objType, objectType, game));
    if (objectOnDown(luidzhiPosX, luidzhiPosY, object, objType, objectType, game, luidzhiSpeedX, dt));
    if (objectOnRight(luidzhiPosX, luidzhiPosY, object, objType, objectType, game));
    if (objectOnLeft(luidzhiPosX, luidzhiPosY, object, objType, objectType, game));
}

function collisionWithObjectLui(dt, game) {
    for (const coordinate of BRICK_LEDGE_ONES) {
        collision(coordinate, objectType.barrier, dt, game);
    }
    for (const coordinate of ENEMY) {
        collision(coordinate, objectType.enemy, dt, game);
    }
    for (const coordinate of BRICK_LEDGE) {
        collision(coordinate, objectType.barrier, dt, game);
    }
    for (const coordinate of COIN) {
        collision(coordinate, objectType.coin, dt, game);
    }
};

export {
    bottomScreenCollisionLui,
    leftScreenCollisionLui,
    collisionWithObjectLui,
    AMOUNT_OF_ENEMIES_LUIDZHI,
    AMOUNT_OF_COINS_LUIDZHI,
    NUMBER_OF_LIVES_LUIDZHI,
};
