import {bottomScreenCollision, collisionWithObject, leftScreenCollision} from './collision_player.js';
import {Vec2} from './vector.js';
import {STAFF} from './objects.js';
import {PLAYER_SIZE} from './const_player.js';
import {enemyCollisionWithWall} from './collision_enemy.js';
import {moveEnemy} from './move_enemy.js';

const ANTISPEED_VALUE = 800;
const FREE_FALL_ACCELERATION = new Vec2(0, 400);

function applyFrictionalForce({playerInfo, dt}) {
    playerInfo.player.applyForce(FREE_FALL_ACCELERATION, dt, false);
    if (!playerInfo.player.run) {
        const normalizedSpeed = playerInfo.player.speed.normalize();
        const antiForce = new Vec2(normalizedSpeed.x, 0).multiplyScalar(-1 * ANTISPEED_VALUE);
        if (antiForce.multiplyScalar(dt).length() >= playerInfo.player.speed.length()) {
            playerInfo.player.speed = new Vec2(0, playerInfo.player.speed.y);
        } else {
            playerInfo.player.applyForce(antiForce, dt);
        }
    }
}

function movePlayer(dt, game, boxHeight) {
    if (game.player.position.x > (STAFF[0][0] * 50 + 50)) {
        game.player.position = new Vec2(game.player.position.x, boxHeight - 2 * PLAYER_SIZE - 0.1);
        const moveDistance = new Vec2(5, 0);
        while (game.player.position.x < 110 * 50) {
            game.player.position = game.player.position.add(moveDistance);
        }
    } else {
        const moveDistance = game.player.speed.multiplyScalar(dt);
        game.player.position = game.player.position.add(moveDistance);
    }
}

function update({boxHeight, dt, game}) {
    enemyCollisionWithWall();
    moveEnemy();
    applyFrictionalForce({
        playerInfo: game.marioInfo,
        dt,
    });
    applyFrictionalForce({
        playerInfo: game.luidzhiInfo,
        dt,
    });
    leftScreenCollision(game.marioInfo);
    bottomScreenCollision(game.marioInfo);
    collisionWithObject(dt, game.marioInfo, game);
    leftScreenCollision(game.luidzhiInfo);
    bottomScreenCollision(game.luidzhiInfo);
    collisionWithObject(dt, game.luidzhiInfo, game);
    movePlayer(dt, game.marioInfo, boxHeight);
    movePlayer(dt, game.luidzhiInfo, boxHeight);
}

export {update};
