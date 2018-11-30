import {UPDATES_PER_FRAME, MARIO_SIZE, EARTH_LINE, width, height, ctx, EARTH_TO_SKY} from './const.js';
import {Earth, Sky, Mario, Game, Window} from './const.js';
import {redraw} from './draw.js';
import {Vec2} from './vector.js';
import {update} from './update.js';
import {KeyMap, processKeyMap} from './key_map.js';

function main() {
    const window = new Window({
        startX: 0,
        startY: 0,
        width: width,
        height: height
    })

    const earth = new Earth({
        startX: 0,
        startY: (1 - EARTH_TO_SKY) * height
    });

    const sky = new Sky({
        startX: 0,
        startY: 0
    })

    const mario = new Mario({
        position: new Vec2((width - MARIO_SIZE) / 2 - 400 , height * EARTH_LINE - MARIO_SIZE - 100),
        jump: false,
        run: false,
        keyUp: false
    });
    const keyMap = new KeyMap(mario);

    const game = new Game({
        finished: false,
        startTime: Date.now(),
        endTime: null,
    })

    document.addEventListener("keydown", (event) => {
        keyMap.onKeyDown(event.keyCode);
    });

    document.addEventListener("keyup", (event) => {
        keyMap.onKeyUp(event.keyCode);
    });

    redraw({
        sky,
        earth,
        mario,
        width, 
        height, 
        ctx,
        window
    });

    let lastTimestamp = Date.now(); //текущее время в ms
    const animateFn = () => {
        const currentTimeStamp = Date.now();
        const deltaTime = (currentTimeStamp - lastTimestamp) * 0.001; //сколько секунд прошло с прошлого кадра
        lastTimestamp = currentTimeStamp;

        processKeyMap({
            mario,
            keyMap,
            dt: deltaTime,
            boxHeight: height,
            game
        });

        if (!game.finished) {
            for (let i = 0; i < UPDATES_PER_FRAME; ++i) {
                update({
                    mario,
                    boxWidth: width,
                    boxHeight: height,
                    dt: deltaTime / UPDATES_PER_FRAME,
                    ctx,
                    window,
                    game
                });
            }
    
    
            redraw({
                sky,
                earth,
                mario,
                boxWidth: width,
                boxHeight: height,
                ctx,
                window
            });
        }
       
        requestAnimationFrame(animateFn);
    }
    animateFn();
};


main();