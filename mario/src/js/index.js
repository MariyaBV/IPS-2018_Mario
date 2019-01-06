import {redraw} from './draw.js';
import {update} from './update.js';
import {KeyMap, processKeyMapForMario, processKeyMapForLuidzhi} from './key_map.js';
import {showPoint} from './points.js';
import {showGame, getStartPosition, getStartPositionLui} from './game.js';
import {ctx1, ctx2, getCanvasSize} from './canvas.js';
import {pointsToSession, scoreToSession} from './session.js';
const UPDATES_PER_FRAME = 5;

function main() {
    const game = showGame();
    const goombaPointOfMario = document.getElementById('goombaMario');
    const coinPointOfMario = document.getElementById('coinMario');
    const livePointOfMario = document.getElementById('liveMario');
    game.marioInfo.point = showPoint(goombaPointOfMario, coinPointOfMario, livePointOfMario);
    const keyMap = new KeyMap(game);

    const goombaPointOfLuidzhi = document.getElementById('goombaLuidzhi');
    const coinPointOfLuidzhi = document.getElementById('coinLuidzhi');
    const livePointOfLuidzhi = document.getElementById('liveLuidzhi');
    game.luidzhiInfo.point = showPoint(goombaPointOfLuidzhi, coinPointOfLuidzhi, livePointOfLuidzhi);

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
                game.luidzhiInfo.luidzhi.position = getStartPositionLui();
            }
        }

        redraw({
            viewPortWidth: width,
            viewPortHeight: height,
            ctx1,
            ctx2,
            game,
        });

        if (!game.finished) {
            requestAnimationFrame(animateFn);
        } else {
            scoreToSession(game);
            pointsToSession();
            setTimeout(function() {
                document.location.href = '/end_of_game.php';
            }, 10000);
        }
    };
    animateFn();
};

main();
