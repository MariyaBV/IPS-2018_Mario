import {getStartPosition} from './game.js';
import {MARIO_SIZE} from './const_mario.js';
import {PLAYER_SIZE} from './const_player.js';
import {BRICK_LEDGE_ONES, BRICK_LEDGE, COIN, ENEMY} from './objects.js';
import {isFloatEqual} from './compare.js';
import {Vec2} from './vector.js';

const OBJECT_HEIGHT = 50;
const OBJECT_WIDTH = 50;
let AMOUNT_OF_COINS = 0;
let AMOUNT_OF_ENEMIES = 0;
let NUMBER_OF_LIVES = 3;
const objectType = {//OBJECT_TYPE
    barrier: 1, //BARRIER
    coin: 2,
    enemy: 3,
};

// for (const arr of arrs)
// {
//     const [x, y, w, h] = arr;
//     new DisplayObject({
//         x,
//         y,
//         w,
//         h,
//     })
// }


function bottomScreenCollision(game) {
    const mario = game.marioInfo.mario;
    if (mario.position.y > 500 - 2 * MARIO_SIZE) {
        mario.speed = new Vec2(mario.speed.x, 0);
        mario.jump = false;
        mario.position = new Vec2(mario.position.x, 500 - OBJECT_HEIGHT - MARIO_SIZE - 0.1);
        mario.keyUp = false;
    }
}

function leftScreenCollision(game) {
    if (game.marioInfo.mario.position.x <= 0) {
        game.marioInfo.mario.position = new Vec2(0, game.marioInfo.mario.position.y);
        game.marioInfo.mario.speed = game.marioInfo.mario.speed.add(new Vec2(0, 20));
    }
}

function marioPositionXRelativeToObject(marioPosX, object) {
    return ((marioPosX > (object[0] * OBJECT_WIDTH)) && (marioPosX < (object[0] + object[2]) * OBJECT_WIDTH)) ||
        (((marioPosX + MARIO_SIZE) > (object[0] * OBJECT_WIDTH)) &&
        ((marioPosX + MARIO_SIZE) < (object[0] + object[2]) * OBJECT_WIDTH));
}

function marioPositionYRelativeToObject(marioPosY, object) {
    return ((marioPosY > (object[1] * OBJECT_HEIGHT)) && (marioPosY < (object[1] + object[3]) * OBJECT_HEIGHT)) ||
        (((marioPosY + MARIO_SIZE) > (object[1] * OBJECT_HEIGHT)) &&
        ((marioPosY + 50) < (object[1] + object[3]) * OBJECT_HEIGHT));
}

function collisionWithCoin(object, game) {
    for (let i = 0; i < COIN.length; i++) {
        if ((COIN[i][0] == object[0]) && (COIN[i][1] == object[1])) {
            COIN.splice(i, 1);
            AMOUNT_OF_COINS ++;//amountOfCoins для всех переменных в верхн регистре
            game.marioInfo.count.countOfCoin(AMOUNT_OF_COINS);
            console.log('Количество монет = ', AMOUNT_OF_COINS);
        }
    }
}

function collisionWithEnemyWithLosingLife(game) {
    NUMBER_OF_LIVES --;
    game.marioInfo.count.countOfLive(NUMBER_OF_LIVES);
    console.log('Количество ЖИЗНЕЙ = ', NUMBER_OF_LIVES);
    game.marioInfo.mario.position = getStartPosition();
    if (NUMBER_OF_LIVES == 0) {
        alert('GAME OVER!');
        game.finished = true;
    }
}

function collisionAtSideOfBarrier(game, isLeftCollision) {
    const speedY = game.marioInfo.mario.speed.y;
    const speedX = isLeftCollision
        ? Math.max(game.marioInfo.mario.speed.x, 0)
        : Math.min(game.marioInfo.mario.speed.x, 0);
    game.marioInfo.mario.speed = new Vec2(speedX, speedY);
}

function killEnemy(object, game) {
    for (let j = 0; j < ENEMY.length; j++) {
        if ((ENEMY[j][0] == object[0]) && (ENEMY[j][1] == object[1])) {
            ENEMY.splice(j, 1);
            AMOUNT_OF_ENEMIES ++;
            game.marioInfo.count.countOfGoomba(AMOUNT_OF_ENEMIES);
            console.log('Количество убитых ENEMIES = ', AMOUNT_OF_ENEMIES);
        }
    }
}

function standOnTheBarrier(game, marioSpeedX, marioPosX, object) {// где можно сделать типа mario = game.marioInfo.mario
    game.marioInfo.mario.speed = new Vec2(marioSpeedX, 0);
    game.marioInfo.mario.position = new Vec2(marioPosX, object[1] * OBJECT_WIDTH - MARIO_SIZE - 1.1);
    game.marioInfo.mario.keyUp = false;
    game.marioInfo.mario.jump = false;
}

function objectOnTop(marioPosX, marioPosY, object, objType, objectType, game) {
    if (marioPositionXRelativeToObject(marioPosX, object)) {
        if (isFloatEqual(marioPosY, (object[1] + object[3]) * OBJECT_HEIGHT, 1)) {
            //console.log('sverhu pryamoug');
            if (objType == objectType.barrier) {
                const speed = game.marioInfo.mario.speed.y;
                game.marioInfo.mario.speed = new Vec2(0, -speed);
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

function objectOnDown(marioPosX, marioPosY, object, objType, objectType, game, marioSpeedX, dt) {
    if (marioPositionXRelativeToObject(marioPosX, object)) {
        if (isFloatEqual(marioPosY + MARIO_SIZE, object[1] * OBJECT_HEIGHT, 1)) {
            const moveDistance = game.marioInfo.mario.speed.multiplyScalar(dt);
            game.marioInfo.mario.position = game.marioInfo.mario.position.add(moveDistance);
            //console.log('snizu pryamoug');
            if (objType == objectType.barrier) {
                standOnTheBarrier(game, marioSpeedX, marioPosX, object);
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

function objectOnRight(marioPosX, marioPosY, object, objType, objectType, game) {
    if (isFloatEqual(marioPosX + MARIO_SIZE, object[0] * OBJECT_WIDTH, 1)) {
        if (marioPositionYRelativeToObject(marioPosY, object)) {
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

function objectOnLeft(marioPosX, marioPosY, object, objType, objectType, game) {
    if (isFloatEqual(marioPosX, (object[0] + object[2]) * OBJECT_WIDTH, 1)) {
        if (marioPositionYRelativeToObject(marioPosY, object)) {
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
    const marioPosX = game.marioInfo.mario.position.x;
    const marioPosY = game.marioInfo.mario.position.y;
    const marioSpeedX = game.marioInfo.mario.speed.x;

    objectOnTop(marioPosX, marioPosY, object, objType, objectType, game);
    objectOnDown(marioPosX, marioPosY, object, objType, objectType, game, marioSpeedX, dt);
    objectOnRight(marioPosX, marioPosY, object, objType, objectType, game);
    objectOnLeft(marioPosX, marioPosY, object, objType, objectType, game);
}

function collisionWithObject(dt, game) {
    for (const coordinate of BRICK_LEDGE_ONES) {
        collision(coordinate, objectType.barrier, dt, game);
    }
    for (const coordinate of BRICK_LEDGE) {
        collision(coordinate, objectType.barrier, dt, game);
    }
    for (const coordinate of COIN) {
        collision(coordinate, objectType.coin, dt, game);
    }
    for (const coordinate of ENEMY) {
        collision(coordinate, objectType.enemy, dt, game);
    }
};

export {
    bottomScreenCollision,
    leftScreenCollision,
    collisionWithObject,
    AMOUNT_OF_ENEMIES,
    AMOUNT_OF_COINS,
    NUMBER_OF_LIVES,
    OBJECT_HEIGHT,
    OBJECT_WIDTH,
    objectType,
    marioPositionYRelativeToObject,
};
