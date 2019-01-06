import {Vec2} from './vector.js';

const LUIDZHI_SIZE = 50;
Luidzhi.MAX_SPEED = 200; // для максимальной скорости

function LuidzhiInfo({
    firstFinish,
    keyMap,
    luidzhi,
    point,
}) {
    this.firstFinish = firstFinish;
    this.keyMap = keyMap;
    this.luidzhi = luidzhi;
    this.point = point;
}

function Luidzhi({
    position,
    jump,
    run,
}) {
    this.position = position;
    this.speed = new Vec2(0, 0);
    this.jump = jump;
    this.run = run;

    this.applyForce = function(force, dt) {
        this.speed = this.speed.add(force.multiplyScalar(dt));
        if (this.speed.x > Luidzhi.MAX_SPEED) {
            this.speed = new Vec2(Luidzhi.MAX_SPEED, this.speed.y);
        }
    };
}

export {LUIDZHI_SIZE, Luidzhi, LuidzhiInfo};
