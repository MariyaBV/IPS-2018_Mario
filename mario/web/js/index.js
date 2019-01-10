import {redraw} from './draw.js';
import {update} from './update.js';
import {KeyMap, processKeyMapForMario, processKeyMapForLuidzhi} from './key_map.js';
import {countToScreen} from './counts.js';
import {createGame, getStartPosition} from './game.js';
import {ctx1, ctx2, getCanvasSize} from './canvas.js';
import {countsToSession} from './session.js';
const UPDATES_PER_FRAME = 5;

function main() {
    const game = createGame();
    const keyMap = new KeyMap(game);
    countToScreen(game.marioInfo, 'goombaMario', 'coinMario', 'liveMario');
    countToScreen(game.luidzhiInfo, 'goombaLuidzhi', 'coinLuidzhi', 'liveLuidzhi');

    document.addEventListener('keydown', (event) => {
        keyMap.onKeyDown(event.keyCode);
    });

    document.addEventListener('keyup', (event) => {
        keyMap.onKeyUp(event.keyCode);
    });

    const {width, height} = getCanvasSize();

    redraw({
        viewPortWidth: width,
        viewPortHeight: height,
        ctx1,
        ctx2,
        game,
    });

    let lastTimestamp = Date.now(); //текущее время в ms
    const animateFn = () => {
        const currentTimeStamp = Date.now();
        const deltaTime = (currentTimeStamp - lastTimestamp) * 0.001; //сколько секунд прошло с прошлого кадра
        lastTimestamp = currentTimeStamp;

        // объединить функции
        game.marioInfo.keyMap = processKeyMapForMario({
            keyMap,
            dt: deltaTime,
            game,
        });

        game.luidzhiInfo.keyMap = processKeyMapForLuidzhi({
            keyMap,
            dt: deltaTime,
            game,
        });

        const {width, height} = getCanvasSize();

        if (!game.stop) {
            for (let i = 0; i < UPDATES_PER_FRAME; ++i) {
                update({
                    boxHeight: 500,
                    dt: deltaTime / UPDATES_PER_FRAME,
                    game,
                });
                if (!game.marioInfo.mario.position) {
                    game.marioInfo.mario.position = getStartPosition();
                }
                if (!game.luidzhiInfo.luidzhi.position) {
                    game.luidzhiInfo.luidzhi.position = getStartPosition();
                }
            }

            redraw({
                viewPortWidth: width,
                viewPortHeight: height,
                ctx1,
                ctx2,
                game,
            });
        }

        if (game.finished) {
            countsToSession(game);
        } else {
            requestAnimationFrame(animateFn);
        }
    };
    animateFn();
};

main();
