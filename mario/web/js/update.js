export {applyFrictionalForce, update};
import {bottomScreenCollision, collisionWithObject, leftScreenCollision, topScreenCollision} from './collision.js';
import {Vec2} from './vector.js';
import {ANTISPEED_VALUE, STAFF, MARIO_SIZE} from './const.js';

const FREE_FALL_ACCELERATION = new Vec2(0, 400);

function applyFrictionalForce({mario, dt}) {
    mario.applyForce(FREE_FALL_ACCELERATION, dt, false);
    if (!mario.run) {
        const normalizedSpeed = mario.speed.normalize();
        const antiForce = new Vec2(normalizedSpeed.x, 0).multiplyScalar(-1 * ANTISPEED_VALUE);
        if (antiForce.multiplyScalar(dt).length() >= mario.speed.length()) {
            mario.speed = new Vec2(0, mario.speed.y);
        }
        else {
            mario.applyForce(antiForce, dt);
        }
    }
}

function moveMario({mario, dt, viewPort}) {
    if (mario.position.x > (STAFF[0][0] * 50  + 50)) {
        mario.position = new Vec2(mario.position.x, viewPort.width.height - 2 * MARIO_SIZE - 0.1);
        const moveDistance = new Vec2(5, 0);
        while (mario.position.x < 110 * 50) {
            mario.position = mario.position.add(moveDistance);
        }
    } else {
        const moveDistance = mario.speed.multiplyScalar(dt);
        mario.position = mario.position.add(moveDistance);
    }
}

function update({mario, boxWidth, boxHeight, dt, ctx, viewPort, game, point}) {
    applyFrictionalForce({mario, dt, boxHeight});
    leftScreenCollision(mario);
    topScreenCollision(mario, dt);
    bottomScreenCollision(mario, viewPort);
    collisionWithObject(mario, viewPort, dt, game, boxWidth, point);
    moveMario({mario, dt, viewPort});
}