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
            game.marioInfo.mario.keyUp = true;
        }
        if (keyCode == 87) {
            game.luidzhiInfo.luidzhi.keyUp = true;
        }
    };

    this.isPressed = function(keyCode) {
        return Boolean(this._map[keyCode]);
    };

    Object.freeze(this);
}

function processKeyMapForPlayer(dt, game, playerInfo, player) {
    //player = game.marioInfo.mario, playerInfo = game.marioInfo
    const MOVE_SPEED = 200;
    let wasProcessed = false;
    let directionForce = Vec2.ZERO;
    player.run = false;

    if (keyMap.isPressed(KeyCode.LEFT_ARROW)) {
        directionForce = directionForce.add(Direction.LEFT);
        wasProcessed = true;
        player.run = true;
    }
    if (keyMap.isPressed(KeyCode.RIGHT_ARROW)) {
        directionForce = directionForce.add(Direction.RIGHT);
        wasProcessed = true;
        player.run = true;
    }
    if ((player.position.x > (STAFF[0][0] * 50 + 50)) && (!game.finished)) {
        wasProcessed = false;
        game.finished = true;
        playerInfo.firstFinish = true;
        console.log('marioFirstFinish = ', playerInfo.firstFinish);
    }
    if (wasProcessed) {
        player.applyForce(directionForce.normalize().multiplyScalar(MOVE_SPEED), dt);
    }
    if (keyMap.isPressed(KeyCode.UP_ARROW) && !player.jump) {
        player.jump = true;
        player.speed = player.speed.add(new Vec2(0, -500));
        wasProcessed = true;
    }

    return wasProcessed;
}

function processKeyMapForMario({keyMap, dt, game}) {
    const MOVE_SPEED = 200;
    let wasProcessed = false;
    let directionForce = Vec2.ZERO;
    game.marioInfo.mario.run = false;

    if (keyMap.isPressed(KeyCode.LEFT_ARROW)) {
        directionForce = directionForce.add(Direction.LEFT);
        wasProcessed = true;
        game.marioInfo.mario.run = true;
    }
    if (keyMap.isPressed(KeyCode.RIGHT_ARROW)) {
        directionForce = directionForce.add(Direction.RIGHT);
        wasProcessed = true;
        game.marioInfo.mario.run = true;
    }
    if ((game.marioInfo.mario.position.x > (STAFF[0][0] * 50 + 50)) && (!game.finished)) {
        wasProcessed = false;
        game.finished = true;
        game.marioInfo.firstFinish = true;
        console.log('marioFirstFinish = ', game.marioInfo.firstFinish);
        //const endTime = Date.now();
    }
    if (wasProcessed) {
        game.marioInfo.mario.applyForce(directionForce.normalize().multiplyScalar(MOVE_SPEED), dt);
    }
    if (keyMap.isPressed(KeyCode.UP_ARROW) && !game.marioInfo.mario.jump) {
        game.marioInfo.mario.jump = true;
        game.marioInfo.mario.speed = game.marioInfo.mario.speed.add(new Vec2(0, -500));
        wasProcessed = true;
    }

    return wasProcessed;
}

function processKeyMapForLuidzhi({keyMap, dt, game}) {
    const MOVE_SPEED = 200;
    let wasProcessed = false;
    let directionForce = Vec2.ZERO;
    game.luidzhiInfo.luidzhi.run = false;

    if (keyMap.isPressed(KeyCode.KEY_A)) {
        directionForce = directionForce.add(Direction.LEFT);
        wasProcessed = true;
        game.luidzhiInfo.luidzhi.run = true;
    }
    if (keyMap.isPressed(KeyCode.KEY_D)) {
        directionForce = directionForce.add(Direction.RIGHT);
        wasProcessed = true;
        game.luidzhiInfo.luidzhi.run = true;
    }
    if ((game.luidzhiInfo.luidzhi.position.x > (STAFF[0][0] * 50 + 50)) && (!game.finished)) {
        wasProcessed = false;
        game.finished = true;
        game.luidzhiInfo.firstFinish = true;
        console.log('luidzhiFirstFinish = ', game.luidzhiInfo.firstFinish);
        //const endTime = Date.now();
    }
    if (wasProcessed) {
        game.luidzhiInfo.luidzhi.applyForce(directionForce.normalize().multiplyScalar(MOVE_SPEED), dt);
    }
    if (keyMap.isPressed(KeyCode.KEY_W) && !game.luidzhiInfo.luidzhi.jump) {
        game.luidzhiInfo.luidzhi.jump = true;
        game.luidzhiInfo.luidzhi.speed = game.luidzhiInfo.luidzhi.speed.add(new Vec2(0, -500));
        wasProcessed = true;
    }

    return wasProcessed;
}

export {KeyMap, processKeyMapForMario, processKeyMapForLuidzhi};
