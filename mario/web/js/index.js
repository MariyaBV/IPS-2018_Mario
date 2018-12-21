import {redraw} from './draw.js';
import {update} from './update.js';
import {KeyMap, processKeyMap} from './key_map.js';
import {showPoint} from './points.js';
import {showGame} from './game.js';
import {ctx, width, height} from './canvas.js';
import {pointsToSession} from './session.js';
const UPDATES_PER_FRAME = 5;

function main() {
    const game = showGame();
    const goombaPoint = document.getElementById('goomba');
    const coinPoint = document.getElementById('coin');
    const livePoint = document.getElementById('live');
    const point = showPoint(goombaPoint, coinPoint, livePoint);
    const keyMap = new KeyMap(game);

    document.addEventListener('keydown', (event) => {
        keyMap.onKeyDown(event.keyCode);
    });

    document.addEventListener('keyup', (event) => {
        keyMap.onKeyUp(event.keyCode);
    });

    redraw({
        width,
        height,
        ctx,
        game,
    });

    let lastTimestamp = Date.now(); //текущее время в ms
    const animateFn = () => {
        const currentTimeStamp = Date.now();
        const deltaTime = (currentTimeStamp - lastTimestamp) * 0.001; //сколько секунд прошло с прошлого кадра
        lastTimestamp = currentTimeStamp;

        processKeyMap({
            keyMap,
            dt: deltaTime,
            boxHeight: height,
            game,
        });

        for (let i = 0; i < UPDATES_PER_FRAME; ++i) {
            update({
                boxWidth: width,
                boxHeight: height,
                dt: deltaTime / UPDATES_PER_FRAME,
                ctx,
                game,
                point,
            });
        }

        redraw({
            boxWidth: width,
            boxHeight: height,
            ctx,
            game,
        });

        if (!game.finished) {
            requestAnimationFrame(animateFn);
        } else {
            pointsToSession();
            document.location.href = '/end_of_game.php';
        }
    };
    animateFn();
};

main();
