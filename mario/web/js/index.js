import {redraw} from './draw.js';
import {update} from './update.js';
import {KeyMap, processKeyMapForPlayer} from './key_map.js';
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
    const pause = document.getElementById('windowPause');
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
        processKeyMapForPlayer({
            dt: deltaTime,
            keyMap,
            game,
            playerInfo: game.marioInfo,
        });
        processKeyMapForPlayer({
            dt: deltaTime,
            keyMap,
            game,
            playerInfo: game.luidzhiInfo,
        });

        const {width, height} = getCanvasSize();

        if (!game.stop) {
            pause.style.display = 'none';
            for (let i = 0; i < UPDATES_PER_FRAME; ++i) {
                update({
                    boxHeight: 500,
                    dt: deltaTime / UPDATES_PER_FRAME,
                    game,
                });
                if (!game.marioInfo.player.position) {
                    game.marioInfo.player.position = getStartPosition();
                }
                if (!game.luidzhiInfo.player.position) {
                    game.luidzhiInfo.player.position = getStartPosition();
                }
            }

            redraw({
                viewPortWidth: width,
                viewPortHeight: height,
                ctx1,
                ctx2,
                game,
            });
        } else {
            pause.style.display = 'block';
        }

        if (game.finished) {
            countsToSession(game);
        } else {
            requestAnimationFrame(animateFn);
        }
    };
    animateFn();
};

window.onload = () => {
    document.body.addEventListener('click', () => {
        document.getElementById('audio').play();
    }, false);
};

main();
