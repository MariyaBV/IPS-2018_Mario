import {KeyCode} from './key_сode.js';
import {Vec2, Direction} from './vector.js';
import {STAFF} from './objects.js';

Object.freeze(KeyCode);

function KeyMap(game) {
    this._map = {};

    this.onKeyDown = function(keyCode) {
        this._map[keyCode] = true;
        if ((keyCode == 32) && (!game.stop)) {
            game.stop = true;
        } else if ((keyCode == 32) && (game.stop)) {
            game.stop = false;
        }
    };

    this.onKeyUp = function(keyCode) {
        delete this._map[keyCode];
        if (keyCode == 38) {
            game.marioInfo.player.keyUp = true;
        }
        if (keyCode == 87) {
            game.luidzhiInfo.player.keyUp = true;
        }
    };

    this.isPressed = function(keyCode) {
        return Boolean(this._map[keyCode]);
    };

    Object.freeze(this);
}

function processKeyMapForPlayer({dt, keyMap, game, playerInfo}) {
    const MOVE_SPEED = 200;
    let wasProcessed = false;
    let directionForce = Vec2.ZERO;
    playerInfo.player.run = false;

    if (keyMap.isPressed(playerInfo.manageKeys.LEFT)) {
        directionForce = directionForce.add(Direction.LEFT);
        wasProcessed = true;
        playerInfo.player.run = true;
    }
    if (keyMap.isPressed(playerInfo.manageKeys.RIGHT)) {
        directionForce = directionForce.add(Direction.RIGHT);
        wasProcessed = true;
        playerInfo.player.run = true;
    }
    if ((playerInfo.player.position.x > (STAFF[0][0] * 50 + 50)) && (!game.finished)) {
        wasProcessed = false;
        game.finished = true;
        playerInfo.firstFinish = true;
    }
    if (wasProcessed) {
        playerInfo.player.applyForce(directionForce.normalize().multiplyScalar(MOVE_SPEED), dt);
    }
    if (keyMap.isPressed(playerInfo.manageKeys.UP) && !playerInfo.player.jump) {
        playerInfo.player.jump = true;
        playerInfo.player.speed = playerInfo.player.speed.add(new Vec2(0, -500));
        wasProcessed = true;
    }

    return wasProcessed;
}

export {KeyMap, processKeyMapForPlayer};
