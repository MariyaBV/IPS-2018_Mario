import {bottomScreenCollision, collisionWithObject, leftScreenCollision} from './collision_player.js';
import {bottomScreenCollisionLui, collisionWithObjectLui, leftScreenCollisionLui} from './collision_luidzhi.js';
import {Vec2} from './vector.js';
import {STAFF} from './objects.js';
import {MARIO_SIZE} from './const_mario.js';
import {PLAYER_SIZE} from './const_player.js';
import {LUIDZHI_SIZE} from './const_luidzhi.js';
import {enemyCollisionWithWall} from './collision_enemy.js';
import {moveEnemy} from './move_enemy.js';

const ANTISPEED_VALUE = 800;
const FREE_FALL_ACCELERATION = new Vec2(0, 400);

function applyFrictionalForce({game, dt}) {
    // избавиться от дублирования
    game.marioInfo.mario.applyForce(FREE_FALL_ACCELERATION, dt, false);
    if (!game.marioInfo.mario.run) {
        const normalizedSpeed = game.marioInfo.mario.speed.normalize();
        const antiForce = new Vec2(normalizedSpeed.x, 0).multiplyScalar(-1 * ANTISPEED_VALUE);
        if (antiForce.multiplyScalar(dt).length() >= game.marioInfo.mario.speed.length()) {
            game.marioInfo.mario.speed = new Vec2(0, game.marioInfo.mario.speed.y);
        } else {
            game.marioInfo.mario.applyForce(antiForce, dt);
        }
    }

    game.luidzhiInfo.luidzhi.applyForce(FREE_FALL_ACCELERATION, dt, false);
    if (!game.luidzhiInfo.luidzhi.run) {
        const normalizedSpeedLui = game.luidzhiInfo.luidzhi.speed.normalize();
        const antiForceLui = new Vec2(normalizedSpeedLui.x, 0).multiplyScalar(-1 * ANTISPEED_VALUE);
        if (antiForceLui.multiplyScalar(dt).length() >= game.luidzhiInfo.luidzhi.speed.length()) {
            game.luidzhiInfo.luidzhi.speed = new Vec2(0, game.luidzhiInfo.luidzhi.speed.y);
        } else {
            game.luidzhiInfo.luidzhi.applyForce(antiForceLui, dt);
        }
    }
}

function moveMario({dt, game, boxHeight}) {
    if (game.marioInfo.mario.position.x > (STAFF[0][0] * 50 + 50)) {
        game.marioInfo.mario.position = new Vec2(game.marioInfo.mario.position.x, boxHeight - 2 * MARIO_SIZE - 0.1);
        const moveDistance = new Vec2(5, 0);
        while (game.marioInfo.mario.position.x < 110 * 50) {
            game.marioInfo.mario.position = game.marioInfo.mario.position.add(moveDistance);
        }
    } else {
        const moveDistance = game.marioInfo.mario.speed.multiplyScalar(dt);
        game.marioInfo.mario.position = game.marioInfo.mario.position.add(moveDistance);
    }
}

function moveLuidzhi({dt, game, boxHeight}) {
    if (game.luidzhiInfo.luidzhi.position.x > (STAFF[0][0] * 50 + 50)) {
        game.luidzhiInfo.luidzhi.position = new Vec2(game.luidzhiInfo.luidzhi.position.x, boxHeight - 2 * LUIDZHI_SIZE - 0.1);
        const moveDistance = new Vec2(5, 0);
        while (game.luidzhiInfo.luidzhi.position.x < 110 * 50) {
            game.luidzhiInfo.luidzhi.position = game.luidzhiInfo.luidzhi.position.add(moveDistance);
        }
    } else {
        const moveDistance = game.luidzhiInfo.luidzhi.speed.multiplyScalar(dt);
        game.luidzhiInfo.luidzhi.position = game.luidzhiInfo.luidzhi.position.add(moveDistance);
    }
}

function update({boxHeight, dt, game}) { // rotateCoin сделать
    enemyCollisionWithWall();
    moveEnemy();
    applyFrictionalForce({game, dt, boxHeight});
    
    // избавиться от дублирования
    leftScreenCollision(game);
    bottomScreenCollision(game);
    collisionWithObject(dt, game);
    
    leftScreenCollisionLui(game);
    bottomScreenCollisionLui(game);
    collisionWithObjectLui(dt, game);
    
    moveMario({dt, game, boxHeight});
    moveLuidzhi({dt, game, boxHeight});
}

export {applyFrictionalForce, update};
