import {UPDATES_PER_FRAME, MARIO_SIZE, EARTH_LINE, width, height, ctx, EARTH_TO_SKY} from './const.js';
import {Earth, Sky, Mario, Game, ViewPort} from './const.js';
import {redraw} from './draw.js';
import {Vec2} from './vector.js';
import {update} from './update.js';
import {KeyMap, processKeyMap} from './key_map.js';

function main() {
    const viewPort = new ViewPort({
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

    const point = new PointerEvent({
        pointOfCoin: onCoinCountChange,
        pointOfLive: onLiveCountChange,
        pointOfGumba: onGumbaCountChange,
    })

    const gumbaPoint = document.getElementById('gumba');
    const coinPoint = document.getElementById('coin');
    const livePoint = document.getElementById('live');

    function onCoinCountChange(value) {
        coinPoint.textContent = value;
    }

    function onGumbaCountChange(value) {
        gumbaPoint.textContent = value;
    }

    function onLiveCountChange(value) {
        livePoint.textContent = value;
    }

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
        viewPort
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

        
            for (let i = 0; i < UPDATES_PER_FRAME; ++i) {
                update({
                    mario,
                    boxWidth: width,
                    boxHeight: height,
                    dt: deltaTime / UPDATES_PER_FRAME,
                    ctx,
                    viewPort,
                    game,
                    point
                });
            }
    
    
            redraw({
                sky,
                earth,
                mario,
                boxWidth: width,
                boxHeight: height,
                ctx,
                viewPort
            });

        
       if (!game.finished) {
            requestAnimationFrame(animateFn);
       } else {
        document.location.href = "http://localhost/end_of_game.php";
        //header("Location: http://localhost/web/end_of_game.html"); 
        //exit();
    }
    }
    animateFn();
};


main();