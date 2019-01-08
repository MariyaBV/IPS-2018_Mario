import {Vec2} from './vector.js';
import {EARTH_LINE, Game} from './const_game.js';
import {MARIO_SIZE, Mario, MarioInfo} from './const_mario.js';
import {Luidzhi, LuidzhiInfo} from './const_luidzhi.js';
import {KeyCode} from './key_сode.js';

function createGame() {
    const game = new Game({
        stop: false,
        finished: false,
        startTime: Date.now(),
        endTime: null,
        marioInfo: new MarioInfo({
            firstFinish: false,
            mario: new Mario({
                position: getStartPosition(),
                jump: false,
                run: false,
                keyUp: false,
            }),
            manageKeys: {
                LEFT: KeyCode.LEFT_ARROW,
                RIGHT: KeyCode.RIGHT_ARROW,
                UP: KeyCode.UP_ARROW,
            },
        }),
        luidzhiInfo: new LuidzhiInfo({
            firstFinish: false,
            luidzhi: new Luidzhi({
                position: getStartPosition(),
                jump: false,
                run: false,
                keyUp: false,
            }),
            manageKeys: {
                LEFT: KeyCode.KEY_A,
                RIGHT: KeyCode.KEY_D,
                UP: KeyCode.KEY_W,
            },
        }),
    });

    return game;
}

function getStartPosition() {
    return new Vec2((200 - MARIO_SIZE) / 2 - 400, 500 * EARTH_LINE - MARIO_SIZE - 100);
}

export {createGame, getStartPosition};
