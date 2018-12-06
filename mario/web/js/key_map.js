import {KeyCode} from './keyCode.js';
export {KeyMap, processKeyMap};
import {Vec2, Direction} from './vector.js';
import {STAFF} from './const.js';


Object.freeze(KeyCode);

function KeyMap(mario) {
    this._map = {};

    this.onKeyDown = function(keyCode) {
        this._map[keyCode] = true;
    }

    this.onKeyUp = function(keyCode) {
        delete this._map[keyCode];
        mario.keyUp = true;
    }

    this.isPressed = function(keyCode) {
        return Boolean(this._map[keyCode]);
    }

    Object.freeze(this);
}

function processKeyMapForMario({mario, keyMap, dt, boxHeight, game}) {
    const MOVE_SPEED = 200;

    let wasProcessed = false;
    let directionForce = Vec2.ZERO;

    mario.run = false;
    if (keyMap.isPressed(KeyCode.LEFT_ARROW)) {
        directionForce = directionForce.add(Direction.LEFT);
        wasProcessed = true;
        mario.run = true;
    }
    if (keyMap.isPressed(KeyCode.RIGHT_ARROW)) {
        directionForce = directionForce.add(Direction.RIGHT);
        wasProcessed = true;
        mario.run = true;
    }

    if ((mario.position.x > STAFF[0][0] * 50  + 50) && (!game.finished)) {
        wasProcessed = false;
        game.finished = true;
        const endTime = Date.now();
    }

    if (wasProcessed) {
        mario.applyForce(directionForce.normalize().multiplyScalar(MOVE_SPEED), dt);
    }

    if (keyMap.isPressed(KeyCode.UP_ARROW) && !mario.jump) {
        mario.jump = true;
        mario.speed = mario.speed.add(new Vec2(0, -500));
        wasProcessed = true;
    }

    return wasProcessed;
}

function processKeyMap({mario, keyMap, dt, boxHeight, game}) {
    processKeyMapForMario({mario, keyMap, dt, boxHeight, game});
}