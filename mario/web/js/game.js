import {Vec2} from './vector.js';
import {EARTH_LINE, Game} from './const_game.js';
import {PLAYER_SIZE} from './const_player.js';
import {KeyCode} from './key_сode.js';
import {PlayerInfo, Player, ManageKeys, Score} from './const_player.js';

function createGame() {
    const game = new Game({
        stop: false,
        finished: false,
        startTime: Date.now(),
        endTime: null,
        marioInfo: new PlayerInfo({
            firstFinish: false,
            player: new Player({
                position: getStartPosition(),
                jump: false,
                run: false,
                keyUp: false,
            }),
            manageKeys: new ManageKeys({
                LEFT: KeyCode.LEFT_ARROW,
                RIGHT: KeyCode.RIGHT_ARROW,
                UP: KeyCode.UP_ARROW,
            }),
            score: new Score({
                numberOfLives: 3,
                amountOfCoins: 0,
                amountOfEnemies: 0,
            }),
        }),
        luidzhiInfo: new PlayerInfo({
            firstFinish: false,
            player: new Player({
                position: getStartPosition(),
                jump: false,
                run: false,
                keyUp: false,
            }),
            manageKeys: new ManageKeys({
                LEFT: KeyCode.KEY_A,
                RIGHT: KeyCode.KEY_D,
                UP: KeyCode.KEY_W,
            }),
            score: new Score({
                numberOfLives: 3,
                amountOfCoins: 0,
                amountOfEnemies: 0,
            }),
        }),
    });

    return game;
}

function getStartPosition() {
    return new Vec2((200 - PLAYER_SIZE) / 2 - 400, 500 * EARTH_LINE - PLAYER_SIZE - 100);
}

export {createGame, getStartPosition};
