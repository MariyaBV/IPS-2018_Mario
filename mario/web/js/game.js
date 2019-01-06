import {Vec2} from './vector.js';
import {EARTH_LINE, Game} from './const_game.js';
import {MARIO_SIZE, Mario, MarioInfo} from './const_mario.js';
import {LUIDZHI_SIZE, Luidzhi, LuidzhiInfo} from './const_luidzhi.js';

function showGame() {
    const game = new Game({
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
        }),
        luidzhiInfo: new LuidzhiInfo({
            firstFinish: false,
            luidzhi: new Luidzhi({
                position: getStartPositionLui(),
                jump: false,
                run: false,
                keyUp: false,
            }),
        }),
    });

    return game;
}

function getStartPosition() {
    return new Vec2((200 - MARIO_SIZE) / 2 - 400, 500 * EARTH_LINE - MARIO_SIZE - 100);
}

function getStartPositionLui() {
    return new Vec2((200 - LUIDZHI_SIZE) / 2 - 300, 500 * EARTH_LINE - LUIDZHI_SIZE - 100);
}

export {showGame, getStartPosition, getStartPositionLui};
