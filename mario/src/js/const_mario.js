import {Vec2} from './vector.js';

const MARIO_SIZE = 50;
Mario.MAX_SPEED = 200; // для максимальной скорости

function Mario({
    position,
    jump,
    run,
    size,
}) {
    this.position = position;
    this.speed = new Vec2(0, 0);
    this.jump = jump;
    this.run = run;
    this.size = size;

    this.applyForce = function(force, dt) {
        this.speed = this.speed.add(force.multiplyScalar(dt));
        //const speedVecLength = this.speed.length();
        if (this.speed.x > Mario.MAX_SPEED) {
            this.speed = new Vec2(Mario.MAX_SPEED, this.speed.y);
        }
    };
}

export {MARIO_SIZE, Mario};