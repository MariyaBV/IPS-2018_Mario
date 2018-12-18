import {KeyCode} from './keyCode.js';
import {Vec2, Direction} from './vector.js';
import {STAFF} from './objects.js';

Object.freeze(KeyCode);

function KeyMap(game) {
    this._map = {};

    this.onKeyDown = function(keyCode) {
        this._map[keyCode] = true;
    };

    this.onKeyUp = function(keyCode) {
        delete this._map[keyCode];
        game.mario.keyUp = true;
    };

    this.isPressed = function(keyCode) {
        return Boolean(this._map[keyCode]);
    };

    Object.freeze(this);
}

function processKeyMapForMario({keyMap, dt, game}) {
    const MOVE_SPEED = 200;
    let wasProcessed = false;
    let directionForce = Vec2.ZERO;
    game.mario.run = false;

    if (keyMap.isPressed(KeyCode.LEFT_ARROW)) {
        directionForce = directionForce.add(Direction.LEFT);
        wasProcessed = true;
        game.mario.run = true;
    }
    if (keyMap.isPressed(KeyCode.RIGHT_ARROW)) {
        directionForce = directionForce.add(Direction.RIGHT);
        wasProcessed = true;
        game.mario.run = true;
    }
    if ((game.mario.position.x > (STAFF[0][0] * 50 + 50)) && (!game.finished)) {
        wasProcessed = false;
        game.finished = true;
        //const endTime = Date.now();
    }
    if (wasProcessed) {
        game.mario.applyForce(directionForce.normalize().multiplyScalar(MOVE_SPEED), dt);
    }
    if (keyMap.isPressed(KeyCode.UP_ARROW) && !game.mario.jump) {
        game.mario.jump = true;
        game.mario.speed = game.mario.speed.add(new Vec2(0, -500));
        wasProcessed = true;
    }

    return wasProcessed;
}

function processKeyMap({keyMap, dt, game}) {
    processKeyMapForMario({keyMap, dt, game});
}

export {KeyMap, processKeyMap};
