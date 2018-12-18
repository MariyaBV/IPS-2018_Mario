import {Game, ViewPort} from './const_game.js';
import {Vec2} from './vector.js';
import {EARTH_LINE} from './const_game.js';
import {MARIO_SIZE, Mario} from './const_mario.js';
import {width, height} from './canvas.js';

function showGame() {
    const game = new Game({
        finished: false,
        startTime: Date.now(),
        endTime: null,
        viewPort: new ViewPort({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        }),
        mario: new Mario({
            position: new Vec2((width - MARIO_SIZE) / 2 - 400, height * EARTH_LINE - MARIO_SIZE - 100),
            jump: false,
            run: false,
            keyUp: false,
        }),
    });

    return game;
}

export {showGame};
