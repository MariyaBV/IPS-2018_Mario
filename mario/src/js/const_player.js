import {Vec2} from './vector.js';

const PLAYER_SIZE = 50;
Player.MAX_SPEED = 200; // для максимальной скорости

function PlayerInfo({
    firstFinish,
    keyMap,
    player,
    count,
}) {
    this.firstFinish = firstFinish;
    this.keyMap = keyMap;
    this.player = player;
    this.count = count;
}

function Player({
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
        //const speedVecLength = this.speed.length();
        if (this.speed.x > Player.MAX_SPEED) {
            this.speed = new Vec2(Player.MAX_SPEED, this.speed.y);
        }
    };
}

export {PLAYER_SIZE, Player, PlayerInfo};
