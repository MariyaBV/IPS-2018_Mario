import {bottomScreenCollision, collisionWithObject, leftScreenCollision, topScreenCollision} from './collision.js';
import {Vec2} from './vector.js';
import {STAFF} from './objects.js';
const ANTISPEED_VALUE = 800;

const FREE_FALL_ACCELERATION = new Vec2(0, 400);

function applyFrictionalForce({game, dt}) {
    game.mario.applyForce(FREE_FALL_ACCELERATION, dt, false);
    if (!game.mario.run) {
        const normalizedSpeed = game.mario.speed.normalize();
        const antiForce = new Vec2(normalizedSpeed.x, 0).multiplyScalar(-1 * ANTISPEED_VALUE);
        if (antiForce.multiplyScalar(dt).length() >= game.mario.speed.length()) {
            game.mario.speed = new Vec2(0, game.mario.speed.y);
        } else {
            game.mario.applyForce(antiForce, dt);
        }
    }
}

function moveMario({dt, game}) {
    if (game.mario.position.x > (STAFF[0][0] * 50 + 50)) {
        game.mario.position = new Vec2(game.mario.position.x, game.viewPort.width.height - 2 * game.mario.size - 0.1);
        const moveDistance = new Vec2(5, 0);
        while (game.mario.position.x < 110 * 50) {
            game.mario.position = game.mario.position.add(moveDistance);
        }
    } else {
        const moveDistance = game.mario.speed.multiplyScalar(dt);
        game.mario.position = game.mario.position.add(moveDistance);
    }
}

function update({boxWidth, boxHeight, dt, game, point}) {
    applyFrictionalForce({game, dt, boxHeight});
    leftScreenCollision(game);
    topScreenCollision(game);
    bottomScreenCollision(game);
    collisionWithObject(dt, game, boxWidth, point);
    moveMario({dt, game});
}

export {applyFrictionalForce, update};
