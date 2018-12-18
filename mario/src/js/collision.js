import {EARTH_LINE} from './const_game.js';
import {MARIO_SIZE} from './const_mario.js';
import {BRICK_LEDGE_ONES, BRICK_LEDGE, COIN, ENEMY} from './objects.js';
import {isFloatEqual} from './compare.js';
import {Vec2} from './vector.js';

const OBJECT_HEIGHT = 50;
const OBJECT_WIDTH = 50;
let AMOUNT_OF_COINS = 0;
let AMOUNT_OF_ENEMIES = 0;
let NUMBER_OF_LIVES = 3;
const objectType = {
    barrier: 1,
    coin: 2,
    enemy: 3,
};

function bottomScreenCollision(game) {
    if (game.mario.position.y > game.viewPort.width.height - 2 * MARIO_SIZE) {
        game.mario.speed = new Vec2(game.mario.speed.x, 0);
        game.mario.jump = false;
        game.mario.position = new Vec2(game.mario.position.x, game.viewPort.width.height - OBJECT_HEIGHT - MARIO_SIZE - 0.1);
        game.mario.keyUp = false;
    }
}

function leftScreenCollision(game) {
    if (game.mario.position.x <= 0) {
        game.mario.position = new Vec2(0, game.mario.position.y);
        game.mario.speed = game.mario.speed.add(new Vec2(0, 20));
    }
}

function topScreenCollision(game) {
    if (game.mario.position.y <= 10) {
        game.mario.position = new Vec2(game.mario.position.x, 10);
        game.mario.speed = game.mario.speed.add(new Vec2(0, 500));
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

function collisionWithCoin(object, point) {
    for (let i = 0; i < COIN.length; i++) {
        if ((COIN[i][0] == object[0]) && (COIN[i][1] == object[1])) {
            COIN.splice(i, 1);
            AMOUNT_OF_COINS ++;
            point.pointOfCoin(AMOUNT_OF_COINS);
            console.log('Количество монет = ', AMOUNT_OF_COINS);
        }
    }
}

function newPositionAfterLosingLife(game) {
    return new Vec2((game.viewPort.width.width - MARIO_SIZE) / 2 - 400, game.viewPort.width.height * EARTH_LINE - MARIO_SIZE - 100);
}

function collisionWithEnemyWithLosingLife(game, point) {
    NUMBER_OF_LIVES --;
    point.pointOfLive(NUMBER_OF_LIVES);
    console.log('Количество ЖИЗНЕЙ = ', NUMBER_OF_LIVES);
    game.mario.position = newPositionAfterLosingLife(game);
    if (NUMBER_OF_LIVES == 0) {
        alert('GAME OVER!');
        game.finished = true;
        //const endTime = Date.now();
        game.mario.position = new Vec2((game.viewPort.width.width - MARIO_SIZE) / 2 - 400, game.viewPort.width.height * EARTH_LINE - MARIO_SIZE);
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
            AMOUNT_OF_ENEMIES ++;
            point.pointOfGoomba(AMOUNT_OF_ENEMIES);
            console.log('Количество убитых ENEMIES = ', AMOUNT_OF_ENEMIES);
        }
    }
}

function standOnTheBarrier(game, marioSpeedX, marioPosX, object) {
    game.mario.speed = new Vec2(marioSpeedX, 0);
    game.mario.position = new Vec2(marioPosX, object[1] * OBJECT_WIDTH - MARIO_SIZE - 1.1);
    game.mario.keyUp = false;
    game.mario.jump = false;
}

function collision(object, objType, dt, game, point) {
    const marioPosX = game.mario.position.x;
    const marioPosY = game.mario.position.y;
    const marioSpeedX = game.mario.speed.x;

    if (marioPositionXRelativeToObject(marioPosX, object)) {
        if (isFloatEqual(marioPosY, (object[1] + object[3]) * OBJECT_HEIGHT, 1)) {
            console.log('sverhu pryamoug');
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
        };

        if (isFloatEqual(marioPosY + MARIO_SIZE, object[1] * OBJECT_HEIGHT, 1)) {
            const moveDistance = game.mario.speed.multiplyScalar(dt);
            game.mario.position = game.mario.position.add(moveDistance);
            console.log('snizu pryamoug');
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
    if (isFloatEqual(marioPosX + MARIO_SIZE, object[0] * OBJECT_WIDTH, 1)) {
        if (marioPositionYRelativeToObject(marioPosY, object)) {
            console.log('sprava');
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
    if (isFloatEqual(marioPosX, (object[0] + object[2]) * OBJECT_WIDTH, 1)) {
        if (marioPositionYRelativeToObject(marioPosY, object)) {
            console.log('sleva');
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

function collisionWithObject(dt, game, width, point) {
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
    if (game.mario.position.x >= (width / 2)) {
        game.viewPort.x = -game.mario.position.x + game.viewPort.width.width / 2;
    } else {
        game.viewPort.x = 0;
    }
};

export {bottomScreenCollision, leftScreenCollision, topScreenCollision, collisionWithObject};
