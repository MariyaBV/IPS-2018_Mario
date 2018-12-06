import {EARTH_LINE, MARIO_SIZE} from './const.js';
import {BRICK_LEDGE_ONES, BRICK_LEDGE, COIN, ENEMY} from './const.js';
import {isFloatEqual} from './compare.js';
import {Vec2} from './vector.js';
export {bottomScreenCollision, leftScreenCollision, topScreenCollision, collisionWithObject}

const OBJECT_HEIGHT = 50;
const OBJECT_WIDTH = 50;
let AMOUNT_OF_COINS = 0;
let AMOUNT_OF_ENEMIES = 0;
let NUMBER_OF_LIVES = 3;
const objectType = {
    barrier: 1,
    coin: 2,
    enemy: 3
}

function bottomScreenCollision(mario, window) {
    if (mario.position.y >  window.width.height - 2 * MARIO_SIZE) {
        mario.speed = new Vec2(mario.speed.x, 0);
        mario.jump = false;
        mario.position = new Vec2(mario.position.x, window.width.height - OBJECT_HEIGHT - MARIO_SIZE - 0.1);
        mario.keyUp = false;
    }
}

function leftScreenCollision(mario) {
    if (mario.position.x <= 0)
    {
        mario.position = new Vec2(0, mario.position.y);
        mario.speed = mario.speed.add(new Vec2(0, 20));
    }
}

function topScreenCollision(mario, dt) {
    if (mario.position.y <= 10)
    {
        mario.position = new Vec2(mario.position.x, 10);
        mario.speed = mario.speed.add(new Vec2(0, 500));
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
        ((marioPosY + 50) < (object[1] + object[3]) * OBJECT_HEIGHT))
}

function collisionWithCoin(object) {
    for (let i = 0; i < COIN.length; i++) {
        if ((COIN[i][0] == object[0]) && (COIN[i][1] == object[1])) {
            COIN.splice(i, 1);
            AMOUNT_OF_COINS ++;
            document.getElementById('coin').innerHTML = AMOUNT_OF_COINS; //html('<span>' + AMOUNT_OF_COINS + '</span>');
            console.log("Количество монет = ", AMOUNT_OF_COINS);
        }
    }
}

function newPositionAfterLosingLife(window) {
    return new Vec2((window.width.width - MARIO_SIZE) / 2 - 400 , window.width.height * EARTH_LINE - MARIO_SIZE - 100);
}

function collisionWithEnemyWithLosingLife(mario, window, game) {
    NUMBER_OF_LIVES --;
    //document.getElementById('live').value = NUMBER_OF_LIVES;
    document.getElementById('live').innerHTML = NUMBER_OF_LIVES;
    console.log("Количество ЖИЗНЕЙ = ", NUMBER_OF_LIVES);
    mario.position = newPositionAfterLosingLife(window);
    if (NUMBER_OF_LIVES == 0) {
        alert ("GAME OVER!");
        game.finished = true;
        endTime = Date.now();
        mario.position = new Vec2((window.width.width - MARIO_SIZE) / 2 - 400 , window.width.height * EARTH_LINE - MARIO_SIZE);
    }
}

function collisionAtSideOfBarrier(mario, isLeftCollision) {
    const speedY = mario.speed.y;
    const speedX = isLeftCollision
        ? Math.max(mario.speed.x, 0)
        : Math.min(mario.speed.x, 0);
    mario.speed = new Vec2(speedX, speedY);
}

function killEnemy(object) {
    for (let j = 0; j < ENEMY.length; j++) {
        if ((ENEMY[j][0] == object[0]) && (ENEMY[j][1] == object[1])) {
            ENEMY.splice(j, 1);
            AMOUNT_OF_ENEMIES ++;
            //document.getElementById('gumba').value = AMOUNT_OF_ENEMIES;
            document.getElementById('gumba').innerHTML = AMOUNT_OF_ENEMIES;
            console.log("Количество убитых ENEMIES = ", AMOUNT_OF_ENEMIES);
        }
    }
}

function standOnTheBarrier(mario, marioSpeedX, marioPosX, object) {
    mario.speed = new Vec2(marioSpeedX, 0);
    mario.position = new Vec2(marioPosX, object[1] * OBJECT_WIDTH - MARIO_SIZE - 1.1);
    mario.keyUp = false;
    mario.jump = false;
}

function collision(mario, object, objType, window, dt, game) {
    let marioPosX = mario.position.x;
    let marioPosY = mario.position.y;
    let marioSpeedX = mario.speed.x;

    if (marioPositionXRelativeToObject(marioPosX, object)) {
        if (isFloatEqual(marioPosY, (object[1] + object[3]) * OBJECT_HEIGHT, 1)) { 
            console.log("sverhu pryamoug");
            if (objType == objectType.barrier) {
                let speed = mario.speed.y;
                mario.speed = new Vec2(0, -speed);
            };
            if (objType == objectType.coin) {
                collisionWithCoin(object);
            }
            if (objType == objectType.enemy) {
                collisionWithEnemyWithLosingLife(mario, window, game)
            }
        };
        
        if (isFloatEqual(marioPosY + MARIO_SIZE, object[1] * OBJECT_HEIGHT, 1)) {
            const moveDistance = mario.speed.multiplyScalar(dt);
            mario.position = mario.position.add(moveDistance);
            let newMarioPositionX = mario.position.x;
            let newMarioPositionY = mario.position.y;
            console.log("snizu pryamoug");
            if (objType == objectType.barrier) {
                standOnTheBarrier(mario, marioSpeedX, marioPosX, object);
            }
            if (objType == objectType.coin) {
                collisionWithCoin(object);
            }
            if (objType == objectType.enemy) {
                killEnemy(object);
            }
        }
    } 
    if (isFloatEqual(marioPosX + MARIO_SIZE, object[0] *  OBJECT_WIDTH, 1)) {
        if (marioPositionYRelativeToObject(marioPosY, object)) {
            console.log("sprava");
            if (objType == objectType.barrier) {
                collisionAtSideOfBarrier(mario, false);
            }
            if (objType == objectType.coin) {
                collisionWithCoin(object);
            }
            if (objType == objectType.enemy) {
                collisionWithEnemyWithLosingLife(mario, window, game)
            }
        }
        
    }
    if (isFloatEqual(marioPosX, (object[0] + object[2]) * OBJECT_WIDTH, 1)) {
        if (marioPositionYRelativeToObject(marioPosY, object)) {
            console.log("sleva");
            if (objType == objectType.barrier) {
                collisionAtSideOfBarrier(mario, true)
            }
            if (objType == objectType.coin) {
                collisionWithCoin(object);
            }
            if (objType == objectType.enemy) {
                collisionWithEnemyWithLosingLife(mario, window, game)
            }
        }
    }
}

function collisionWithObject(mario, window, dt, game, boxWidth) {
    for (const coordinate of BRICK_LEDGE_ONES){
        collision(mario, coordinate, objectType.barrier, window, dt, game);
    }
    for (const coordinate of ENEMY){
        collision(mario, coordinate, objectType.enemy, window, dt, game);
    }
    for (const coordinate of BRICK_LEDGE) {
        collision(mario, coordinate, objectType.barrier, window, dt, game);
    }
    for (const coordinate of COIN) {
        collision(mario, coordinate, objectType.coin, window, dt, game);
    }
    if (mario.position.x >= (boxWidth / 2)) {
        window.x = -mario.position.x + window.width.width / 2;
    } else {
        window.x = 0;
    }
};