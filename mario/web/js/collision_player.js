import {getStartPosition} from './game.js';
import {PLAYER_SIZE} from './const_player.js';
import {BRICK_LEDGE_ONES, BRICK_LEDGE, COIN, ENEMY} from './objects.js';
import {isFloatEqual} from './compare.js';
import {Vec2} from './vector.js';

const OBJECT_HEIGHT = 50;
const OBJECT_WIDTH = 50;
const OBJECT_TYPE = {
    BARRIER: 1,
    COIN: 2,
    ENEMY: 3,
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


function bottomScreenCollision(playerInfo) {
    const player = playerInfo.player;
    if (player.position.y > 500 - 2 * PLAYER_SIZE) {
        player.speed = new Vec2(player.speed.x, 0);
        player.jump = false;
        player.position = new Vec2(player.position.x, 500 - OBJECT_HEIGHT - PLAYER_SIZE - 0.1);
        player.keyUp = false;
    }
}

function leftScreenCollision(playerInfo) {
    if (playerInfo.player.position.x <= 0) {
        playerInfo.player.position = new Vec2(0, playerInfo.player.position.y);
        playerInfo.player.speed = playerInfo.player.speed.add(new Vec2(0, 20));
    }
}

function playerPositionXRelativeToObject(playerPosX, object) {
    return ((playerPosX > (object[0] * OBJECT_WIDTH)) && (playerPosX < (object[0] + object[2]) * OBJECT_WIDTH)) ||
        (((playerPosX + PLAYER_SIZE) > (object[0] * OBJECT_WIDTH)) &&
        ((playerPosX + PLAYER_SIZE) < (object[0] + object[2]) * OBJECT_WIDTH));
}

function playerPositionYRelativeToObject(playerPosY, object) {
    return ((playerPosY > (object[1] * OBJECT_HEIGHT)) && (playerPosY < (object[1] + object[3]) * OBJECT_HEIGHT)) ||
        (((playerPosY + PLAYER_SIZE) > (object[1] * OBJECT_HEIGHT)) &&
        ((playerPosY + 50) < (object[1] + object[3]) * OBJECT_HEIGHT));
}

function collisionWithCoin(object, playerInfo) {
    for (let i = 0; i < COIN.length; i++) {
        if ((COIN[i][0] == object[0]) && (COIN[i][1] == object[1])) {
            COIN.splice(i, 1);
            playerInfo.score.amountOfCoins ++;
            playerInfo.count.countOfCoin(playerInfo.score.amountOfCoins);
        }
    }
}

function collisionWithEnemyWithLosingLife(playerInfo, game) {
    playerInfo.score.numberOfLives --;
    playerInfo.count.countOfLive(playerInfo.score.numberOfLives);
    playerInfo.player.position = getStartPosition();
    if (playerInfo.score.numberOfLives == 0) {
        game.finished = true;
    }
}

function collisionAtSideOfBarrier(playerInfo, isLeftCollision) {
    const speedY = playerInfo.player.speed.y;
    const speedX = isLeftCollision
        ? Math.max(playerInfo.player.speed.x, 0)
        : Math.min(playerInfo.player.speed.x, 0);
    playerInfo.player.speed = new Vec2(speedX, speedY);
}

function killEnemy(object, playerInfo) {
    for (let j = 0; j < ENEMY.length; j++) {
        if ((ENEMY[j][0] == object[0]) && (ENEMY[j][1] == object[1])) {
            ENEMY.splice(j, 1);
            playerInfo.score.amountOfEnemies ++;
            playerInfo.count.countOfGoomba(playerInfo.score.amountOfEnemies);
        }
    }
}

function standOnTheBarrier(playerInfo, playerSpeedX, playerPosX, object) {
    playerInfo.player.speed = new Vec2(playerSpeedX, 0);
    playerInfo.player.position = new Vec2(playerPosX, object[1] * OBJECT_WIDTH - PLAYER_SIZE - 1.1);
    playerInfo.player.keyUp = false;
    playerInfo.player.jump = false;
}

function objectOnTop(playerPosX, playerPosY, object, objType, OBJECT_TYPE, playerInfo, game) {
    if (playerPositionXRelativeToObject(playerPosX, object)) {
        if (isFloatEqual(playerPosY, (object[1] + object[3]) * OBJECT_HEIGHT, 1)) {
            if (objType == OBJECT_TYPE.BARRIER) {
                const speed = playerInfo.player.speed.y;
                playerInfo.player.speed = new Vec2(0, -speed);
            };
            if (objType == OBJECT_TYPE.COIN) {
                collisionWithCoin(object, playerInfo);
            }
            if (objType == OBJECT_TYPE.ENEMY) {
                collisionWithEnemyWithLosingLife(playerInfo, game);
            }
        }
    }
}

function objectOnDown(playerPosX, playerPosY, object, objType, OBJECT_TYPE, playerInfo, playerSpeedX, dt) {
    if (playerPositionXRelativeToObject(playerPosX, object)) {
        if (isFloatEqual(playerPosY + PLAYER_SIZE, object[1] * OBJECT_HEIGHT, 1)) {
            const moveDistance = playerInfo.player.speed.multiplyScalar(dt);
            playerInfo.player.position = playerInfo.player.position.add(moveDistance);
            if (objType == OBJECT_TYPE.BARRIER) {
                standOnTheBarrier(playerInfo, playerSpeedX, playerPosX, object);
            }
            if (objType == OBJECT_TYPE.COIN) {
                collisionWithCoin(object, playerInfo);
            }
            if (objType == OBJECT_TYPE.ENEMY) {
                killEnemy(object, playerInfo);
            }
        }
    }
}

function objectOnRight(playerPosX, playerPosY, object, objType, OBJECT_TYPE, playerInfo, game) {
    if (isFloatEqual(playerPosX + PLAYER_SIZE, object[0] * OBJECT_WIDTH, 1)) {
        if (playerPositionYRelativeToObject(playerPosY, object)) {
            if (objType == OBJECT_TYPE.BARRIER) {
                collisionAtSideOfBarrier(playerInfo, false);
            }
            if (objType == OBJECT_TYPE.COIN) {
                collisionWithCoin(object, playerInfo);
            }
            if (objType == OBJECT_TYPE.ENEMY) {
                collisionWithEnemyWithLosingLife(playerInfo, game);
            }
        }
    }
}

function objectOnLeft(playerPosX, playerPosY, object, objType, OBJECT_TYPE, playerInfo, game) {
    if (isFloatEqual(playerPosX, (object[0] + object[2]) * OBJECT_WIDTH, 1)) {
        if (playerPositionYRelativeToObject(playerPosY, object)) {
            if (objType == OBJECT_TYPE.BARRIER) {
                collisionAtSideOfBarrier(playerInfo, true);
            }
            if (objType == OBJECT_TYPE.COIN) {
                collisionWithCoin(object, playerInfo);
            }
            if (objType == OBJECT_TYPE.ENEMY) {
                collisionWithEnemyWithLosingLife(playerInfo, game);
            }
        }
    }
}

function collision(object, objType, dt, playerInfo, game) {
    const playerPosX = playerInfo.player.position.x;
    const playerPosY = playerInfo.player.position.y;
    const playerSpeedX = playerInfo.player.speed.x;

    objectOnTop(playerPosX, playerPosY, object, objType, OBJECT_TYPE, playerInfo, game);
    objectOnDown(playerPosX, playerPosY, object, objType, OBJECT_TYPE, playerInfo, playerSpeedX, dt, game);
    objectOnRight(playerPosX, playerPosY, object, objType, OBJECT_TYPE, playerInfo, game);
    objectOnLeft(playerPosX, playerPosY, object, objType, OBJECT_TYPE, playerInfo, game);
}

function collisionWithObject(dt, playerInfo, game) {
    for (const coordinate of BRICK_LEDGE_ONES) {
        collision(coordinate, OBJECT_TYPE.BARRIER, dt, playerInfo, game);
    }
    for (const coordinate of BRICK_LEDGE) {
        collision(coordinate, OBJECT_TYPE.BARRIER, dt, playerInfo, game);
    }
    for (const coordinate of COIN) {
        collision(coordinate, OBJECT_TYPE.COIN, dt, playerInfo, game);
    }
    for (const coordinate of ENEMY) {
        collision(coordinate, OBJECT_TYPE.ENEMY, dt, playerInfo, game);
    }
};

export {
    bottomScreenCollision,
    leftScreenCollision,
    collisionWithObject,
    OBJECT_HEIGHT,
    OBJECT_WIDTH,
    OBJECT_TYPE,
    playerPositionYRelativeToObject,
};
