import {KeyCode} from './keyCode.js';
//import config from './objects.json';

function isFloatEqual(f1, f2, FLOAT_EQUAL_PRESCISION) {
    return Math.abs(f1 - f2) <= FLOAT_EQUAL_PRESCISION;
}

const BRICK_LEDGE = [
    [9, 4],
    [10, 4],
    [11, 4],
    [12, 4],
    [33, 8],
    [34, 8],
    [33, 7],
    [34, 7],
    [39, 4],
    [40, 4],
    [45, 4],
    [46, 4],
    [63, 8],
    [64, 8],
    [65, 8],
    [64, 7],
    [65, 7],
    [86, 3],
    [87, 3],
    [87, 8],
    [88, 8],
    [88, 7],
    [87, 7],
    [90, 8],
    [91, 8],
    [92, 8],
    [90, 7],
    [91, 7],
    [19, 7],
    [19, 8],
    [23, 7],
    [23, 8],
    [26, 4],
    [28, 4],
    [37, 4],
    [51, 8],
    [51, 7],
    [51, 6],
    [54, 8],
    [54, 7],
    [54, 6],
    [65, 6],
    [69, 8],
    [69, 7],
    [72, 5],
    [74, 5],
    [84, 8],
    [84, 7],
    [90, 6],
    [96, 8],
    [96, 7],
    [100, 8]
];

const BOX = [
    [27, 4],
    [38, 4],
    [47, 4],
    [73, 5],
    [88, 3]
];

const COIN = [
    [10, 3],
    [12, 3],
    [27, 3],
    [28, 3],
    [34, 6],
    [45, 3],
    [73, 4],
    [74, 4],
    [86, 2],
    [87, 2]
];

const MASHROOM = [
    [20, 8],
    [35, 8],
    [38, 3],
    [48, 8],
    [52, 8],
    [66, 8],
    [85, 8],
    [94, 8]
];

const BALL = [
    [100, 3]
];

const STAFF = [
    [100, 7],
    [100, 6],
    [100, 5],
    [100, 4]
];

const EARTH = [
    [0, 122, 9]
];

Object.freeze(KeyCode);

const EARTH_TO_SKY = 0.1;
const EARTH_SQUARE_WIDTH = 50;
const EARTH_SQUARE_HEIGHT = 50;
const BRICK_SIZE = 50;
const MARIO_SIZE = 50;
const FREE_FALL_ACCELERATION = new Vec2(0, 400);
const scrollSum = 0;
const dx = 12;
const METER_IN_PX = 300;
const EARTH_LINE = 0.9;

const ANTISPEED_VALUE = 800;
const AIR_DECELERATION = 0;

function Vec2(x, y) {
    this.x = x;
    this.y = y;

    this.add = function(vec) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    };
    this.substract = function(vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    };
    this.multiplyScalar = function(scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    };
    this.multiplyScalar0 = function(scalar) {
        return new Vec2(this.x * scalar, this.y);
    };
    this.divideScalar = function(scalar) {
        return new Vec2(this.x / scalar, this.y / scalar);
    };
    this.length = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    this.normalize = function() {
        const length = this.length();
        return length ? this.divideScalar(this.length()) : new Vec2(0, 0);
    }

    Object.freeze(this);
}
Vec2.ZERO = new Vec2(0, 0);

const Direction = {
    UP: new Vec2(0, -1),
    DOWN: new Vec2(0, 1),
    LEFT: new Vec2(-1, 0),
    RIGHT: new Vec2(1, 0),
}
Object.freeze(Direction);

let earthImg = new Image();
earthImg.src = "img/earth.png";
let marioImg = new Image();
marioImg.src = "img/mario.png";
let brickImg = new Image();
brickImg.src = "img/brick.png";
let boxImg = new Image();
boxImg.src = "img/box.png";
let coinImg = new Image();
coinImg.src = "img/coin.png";
let mushroomImg = new Image();
mushroomImg.src = "img/mashroom.png";
let ballImg = new Image();
ballImg.src = "img/ball.png";
let staffImg = new Image();
staffImg.src = "img/staff.png";

function Earth({
    startX,
    startY,
}) {
    this.x = startX;
    this.y = startY;
}

function Sky({
    startX,
}) {
    this.x = startX;
}

function Mario({
    position,
    jump,
    run
}) {
    this.position = position;
    this.speed = new Vec2(0, 0);
    this.jump = jump;
    this.run = run;

    this.applyForce = function(force, dt) {
        this.speed = this.speed.add(force.multiplyScalar(dt));
        const speedVecLength = this.speed.length();
        if (this.speed.x > Mario.MAX_SPEED) {
            this.speed = new Vec2(Mario.MAX_SPEED, this.speed.y);
        }
    }
}

Mario.MAX_SPEED = 200; // для максимальной скорости
Mario.MIN_SPEED = 0; // для минимальной скорости


let keyUp = false;
function KeyMap(mario) {
    this._map = {};

    this.onKeyDown = function(keyCode) {
        this._map[keyCode] = true;
    }

    this.onKeyUp = function(keyCode) {
        delete this._map[keyCode];
        keyUp = true;
    }

    this.isPressed = function(keyCode) {
        return Boolean(this._map[keyCode]);
    }

    Object.freeze(this);
}

function processKeyMapForMario({mario, keyMap, dt, boxHeight}) {
    const MOVE_SPEED = 200;

    let wasProcessed = false;
    let directionForce = Vec2.ZERO;

    mario.run = false;
    if (keyMap.isPressed(KeyCode.LEFT_ARROW)) {
        directionForce = directionForce.add(Direction.LEFT);
        wasProcessed = true;
        mario.run = true;
    }
    if (keyMap.isPressed(KeyCode.RIGHT_ARROW)) {
        directionForce = directionForce.add(Direction.RIGHT);
        wasProcessed = true;
        mario.run = true;
    }

    if (isFloatEqual(mario.position.x, STAFF[0][0] * 50  + 50, 10)) {
        wasProcessed = false;
        alert("GAME OVER!");
    }

    if (wasProcessed) {
        mario.applyForce(directionForce.normalize().multiplyScalar(MOVE_SPEED), dt);
    }

    if (keyMap.isPressed(KeyCode.UP_ARROW) && !mario.jump) {
            mario.jump = true;
            mario.speed = mario.speed.add(new Vec2(0, -500));
            wasProcessed = true;
    }

    return wasProcessed;
}

function processKeyMap({mario, keyMap, dt, boxHeight}) {
    processKeyMapForMario({mario, keyMap, dt, boxHeight});
}

function drawEarth(earth, ctx, boxWidth, boxHeight) {
    for (earth.x = 0; earth.x <= (boxWidth - EARTH_SQUARE_WIDTH); earth.x+=EARTH_SQUARE_WIDTH)
        ctx.drawImage(earthImg, earth.x, earth.y);
}

function drawMario({ctx, mario, boxWidth, boxHeight}) {
    ctx.drawImage(marioImg, mario.position.x, mario.position.y , MARIO_SIZE, MARIO_SIZE);
}

function moveMario({mario, dt, window}) {
    if (mario.position.x > (STAFF[0][0] * 50  + 50)) {
        mario.position = new Vec2(mario.position.x, window.width.height - 2 * MARIO_SIZE - 0.1);
        const moveDistance = new Vec2(5, 0);
        while (mario.position.x < 110 * 50) {
            mario.position = mario.position.add(moveDistance);
        }
    } else {
        const moveDistance = mario.speed.multiplyScalar(dt);
        mario.position = mario.position.add(moveDistance);
    }
}

function collision(mario, barrier) {
    let marioPosX = mario.position.x;
    let marioPosY = mario.position.y;
    if (((marioPosX > barrier[0] * 50) && (marioPosX < barrier[0] * 50 + 50)) ||
    ((marioPosX + MARIO_SIZE > barrier[0] * 50) && (marioPosX + MARIO_SIZE < barrier[0] * 50 + 50))) {
        if (isFloatEqual(marioPosY, barrier[1] * 50 + 50, 5)) {    
            console.log("сверху");
            let speed = mario.speed.y;
            mario.speed = new Vec2(0, -speed);
        } else if (isFloatEqual(marioPosY + MARIO_SIZE, barrier[1] * 50, 5)) {
            console.log("снизу");
            mario.speed = new Vec2(mario.speed.x, 0);
            mario.position = new Vec2(mario.position.x, barrier[1] * 50 - MARIO_SIZE - 0.1);
            keyUp = false;
            mario.jump = false;
        }
    } else if (isFloatEqual(marioPosX + MARIO_SIZE, barrier[0] * 50, 5)) {
        if (((marioPosY > (barrier[1] * 50 + 1)) && (marioPosY < (barrier[1] * 50 + 50 - 1))) ||
        (((marioPosY + MARIO_SIZE) > (barrier[1] * 50 + 1)) && (marioPosY + MARIO_SIZE < (barrier[1] * 50 + 50 - 1)))) {
            console.log("справа");
            let speed = mario.speed.y;
            mario.speed = new Vec2(0, speed);
        }
        
    } else if (isFloatEqual(marioPosX, barrier[0] * 50 + 50, 5)) {
        if (((marioPosY > (barrier[1] * 50 + 1)) && (marioPosY < (barrier[1] * 50 + 50 - 1))) ||
        (((marioPosY + MARIO_SIZE) > (barrier[1] * 50 + 1)) && ((marioPosY + MARIO_SIZE) < (barrier[1] * 50 + 50 - 1)))) {
            console.log("слева");
            let speed = mario.speed.y;
            mario.speed = new Vec2(0, speed);
        }
    }
}

function applyFrictionalForce({mario, dt, boxHeight}) {
    mario.applyForce(FREE_FALL_ACCELERATION, dt, false);
    if (!mario.run) {
        const normalizedSpeed = mario.speed.normalize();
        const antiForce = new Vec2(normalizedSpeed.x, 0).multiplyScalar(-1 * ANTISPEED_VALUE);
        if (antiForce.multiplyScalar(dt).length() >= mario.speed.length()) {
            mario.speed = new Vec2(0, mario.speed.y);
        }
        else {
            mario.applyForce(antiForce, dt);
        }
    }
}

const map = {
    cols:  106, 
    tsize: 50
};

function Window(width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = map.cols * map.tsize - width;
}

function moveWindow(mario, window, dt) {
    moveMario({mario, dt, window});
    for (const coordinate of BRICK_LEDGE){
        collision(mario, coordinate);
    }
    for (const coordinate of BOX){
        collision(mario, coordinate);
    }
    for (const coordinate of MASHROOM){
        collision(mario, coordinate);
    }
    // for (const coordinate of EARTH){
    //     collision(mario, coordinate);
    // }
    
    if (mario.position.x / 50 >= 10){
        window.x = -mario.position.x + window.width.width / 2;
    } else {
        window.x = 0;
    }
};

function drawMap(mario, ctx, window) {
    let leftEdge, rightEdge;
    if (mario.position.x / 50 <= 10) {
        leftEdge = 0;
        rightEdge = window.width.width;
    } else {
        leftEdge = mario.position.x / 50 - dx;
        rightEdge = mario.position.x / 50 + dx;
    }
    //$.getJSON( "js/objects.json", function(data) {
        for (const coordinate of EARTH) {
            for (let i = coordinate[0]; i <= coordinate[1]; i++) {
                ctx.drawImage(earthImg, BRICK_SIZE * i, BRICK_SIZE * coordinate[2], BRICK_SIZE, BRICK_SIZE);
            }
        }

        for (const coordinate of BRICK_LEDGE) {
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)) {
                ctx.drawImage(brickImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE, BRICK_SIZE);
            }
        }

        for (const coordinate of BOX) {
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)) {
                ctx.drawImage(boxImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE, BRICK_SIZE);
            }
        }

        for (const coordinate of COIN) {
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)) {
                ctx.drawImage(coinImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE, BRICK_SIZE);
            }
        }

        for (const coordinate of MASHROOM) {
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)) {
                ctx.drawImage(mushroomImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE, BRICK_SIZE);
            }
        }

        for (const coordinate of BALL) {
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)) {
                ctx.drawImage(ballImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE, BRICK_SIZE);
            }
        }

        for (const coordinate of STAFF) {
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)) {
                ctx.drawImage(staffImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE, BRICK_SIZE);
            }
        }
    //})
}

function drawWindow(window, ctx, mario) {
    if (window.x !== 0) {
        ctx.translate(window.x, 0);
    }

    drawMap(mario, ctx, window);
}

function update({earth, mario, boxWidth, boxHeight, dt, ctx, window}) {
    leftScreenCollision(mario);
    topScreenCollision(mario, dt);
    bottomScreenCollision(mario, window);
    applyFrictionalForce({mario, dt, boxHeight});
    moveWindow(mario, window, dt);
}

function drawSky(ctx, boxWidth, boxHeight, sky) {    
    ctx.fillStyle = '#3c78d8';
    ctx.fillRect(sky.x, 0, boxWidth, boxHeight);
}

function redraw({sky, earth, mario, boxWidth, boxHeight, ctx, window}) {
    ctx.resetTransform();
    drawSky(ctx, boxWidth, boxHeight, sky);
    //drawEarth(earth, ctx, boxWidth, boxHeight);
    drawWindow(window, ctx, mario, boxWidth);
    drawMario({ctx, mario, boxWidth, boxHeight});
}

function leftScreenCollision(mario)
{
    if (mario.position.x <= 0)
    {
        mario.position = new Vec2(0, mario.position.y);
        mario.speed = mario.speed.add(new Vec2(0, 20));
    }
}

function topScreenCollision(mario, dt)
{
    if (mario.position.y <= 10)
    {
        mario.position = new Vec2(mario.position.x, 10);
        mario.speed = mario.speed.add(new Vec2(0, 500));
    }
}

function bottomScreenCollision(mario, window)
{
    if (mario.position.y >  window.width.height - 2 * MARIO_SIZE) {
        mario.speed = new Vec2(mario.speed.x, 0);
        mario.jump = false;
        mario.position = new Vec2(mario.position.x, window.width.height - 2 * MARIO_SIZE - 0.1);
        console.log("снизу-earth");
        keyUp = false;
    }
}

function main() {
    const canvas = document.getElementById('canvas');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

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
    });
    const keyMap = new KeyMap(mario);

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
            boxHeight: height
        });

        update({
            earth,
            mario,
            boxWidth: width,
            boxHeight: height,
            dt: deltaTime,
            ctx,
            window
        });

        redraw({
            sky,
            earth,
            mario,
            boxWidth: width,
            boxHeight: height,
            ctx,
            window
        });
        requestAnimationFrame(animateFn);
    }
    animateFn();
};


main();