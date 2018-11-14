import {KeyCode} from './keyCode.js';
//import config from './objects.json';

const FLOAT_EQUAL_PRESCISION = 0.01;
function isFloatEqual(f1, f2) {
    return Math.abs(f1 - f2) <= FLOAT_EQUAL_PRESCISION;
}

const  BRICK_LEDGE = [
    [9, 12, 4],
    [33, 34, 8],
    [33, 34, 7],
    [39, 40, 4],
    [45, 46, 4],
    [63, 65, 8],
    [64, 65, 7],
    [86, 87, 3],
    [87, 88, 8],
    [87, 88, 7],
    [90, 92, 8],
    [90, 91, 7]
];

const BRICK_LEDGE_ONES = [
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

const BALL = [100, 3];

const STAFF = [
    [100, 7],
    [100, 6],
    [100, 5],
    [100, 4]
];

const EARTH = [1, 106, 9];

Object.freeze(KeyCode);

const EARTH_TO_SKY = 0.1;
const EARTH_SQUARE_WIDTH = 50;
const EARTH_SQUARE_HEIGHT = 50;
const BRICK_SIZE = 50;
const MARIO_SIZE = 50;
const FREE_FALL_ACCELERATION = new Vec2(0, 20);
const scrollSum = 0;
const dx = 10;
const METER_IN_PX = 300;

const ANTISPEED_VALUE = 48;
const AIR_DECELERATION = 5;

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
}) {
    this.position = position;
    this.speed = new Vec2(0, 0);

    this.applyForce = function(force, dt) {
        this.speed = this.speed.add(force.multiplyScalar(dt));
        const speedVecLength = this.speed.length();
        if (speedVecLength > Mario.MAX_SPEED) {
            this.speed = this.speed.divideScalar(this.speed.length() / Mario.MAX_SPEED);
        }
    }
}

Mario.MAX_SPEED = 140; // для максимальной скорости
Mario.MIN_SPEED = 0; // для минимальной скорости


let keyUp = false;
function KeyMap(mario) {
    this._map = {};
    this.onKeyDown = function(keyCode) {
        if (keyUp && (mario.speed.length() != 0)){
            delete this._map[keyCode];
        } else {
            this._map[keyCode] = true;
            keyUp = false;
        }
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


function drawEarth(earth, ctx, boxWidth, boxHeight) {
    for (earth.x = 0; earth.x <= (boxWidth - EARTH_SQUARE_WIDTH); earth.x+=EARTH_SQUARE_WIDTH)
        ctx.drawImage(earthImg, earth.x, earth.y);
}

function drawMario({ctx, mario, boxWidth, boxHeight}) {
    ctx.drawImage(marioImg, mario.position.x, mario.position.y , MARIO_SIZE, MARIO_SIZE);
}

function moveMario({mario, dt}) {
    const moveDistance = mario.speed.multiplyScalar(dt);
    mario.position = mario.position.add(moveDistance);
}

function applyFrictionalForce({mario, dt, boxHeight}) {
    if (mario.position.y < (boxHeight * (1 - EARTH_TO_SKY) - MARIO_SIZE)){
        const antiForce = mario.speed.normalize().multiplyScalar(-1 * AIR_DECELERATION).add(FREE_FALL_ACCELERATION);
        if (antiForce.multiplyScalar(dt).length() >= mario.speed.length()) {
            mario.speed = new Vec2(0, 20); 
        }
        else {
            mario.applyForce(antiForce, dt);
        }
    } else {
        const antiForce = mario.speed.normalize().multiplyScalar(-1 * ANTISPEED_VALUE);
        if (antiForce.multiplyScalar(dt).length() >= mario.speed.length()) {
            mario.speed = new Vec2(0, 0);
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

function moveWindow (mario, window, dt) {
    moveMario({mario, dt});
    if (mario.position.x / 50 >= 10){
        window.x = -mario.position.x + window.width.width / 2;
    } else {
        window.x = 0;
    }
};

function drawMap(mario, ctx, window){
    let leftEdge, rightEdge;
    if (mario.position.x / 50 <= 10) {
        leftEdge = 0;
        rightEdge = window.width.width;
    } else {
        leftEdge = mario.position.x / 50 - dx;
        rightEdge = mario.position.x / 50 + dx;
    }
    //$.getJSON( "js/objects.json", function(data) {
        for (const coordinate of BRICK_LEDGE){
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)){
                for (let i = coordinate[0]; i <= coordinate[1]; i++){
                    ctx.drawImage(brickImg, BRICK_SIZE * i, BRICK_SIZE * coordinate[2], BRICK_SIZE, BRICK_SIZE);
                }
            }
        }

        for (const coordinate of BRICK_LEDGE_ONES){
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)){
                ctx.drawImage(brickImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE, BRICK_SIZE);
            }
        }

        for (const coordinate of BOX){
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)){
                ctx.drawImage(boxImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE, BRICK_SIZE);
            }
        }

        for (const coordinate of COIN){
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)){
                ctx.drawImage(coinImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE, BRICK_SIZE);
            }
        }

        for (const coordinate of MASHROOM){
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)){
                ctx.drawImage(mushroomImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE, BRICK_SIZE);
            }
        }

        for (const coordinate of BALL){
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)){
                console.log("ball");
                ctx.drawImage(ballImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE, BRICK_SIZE);
            }
        }

        for (const coordinate of STAFF){
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)){
                ctx.drawImage(staffImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE, BRICK_SIZE);
            }
        }
    //})
}

function drawWindow(window, ctx, mario){
    if (window.x !== 0){
        ctx.translate(window.x, 0);
    }

    drawMap(mario, ctx, window);
}

function update({earth, mario, boxWidth, boxHeight, dt, ctx, window}) {
    leftScreenCollision(mario);
    topScreenCollision(mario, dt);
    bottomScreenCollision(mario, earth, boxHeight);
    applyFrictionalForce({mario, dt, boxHeight});
    moveWindow(mario, window, dt);
}

function processKeyMapForMario({mario, keyMap, dt}) {
    const MOVE_SPEED = 100;

    let wasProcessed = false;
    let directionForce = Vec2.ZERO;

    if (keyMap.isPressed(KeyCode.LEFT_ARROW)) {
        directionForce = directionForce.add(Direction.LEFT);
        wasProcessed = true;
    }
    if (keyMap.isPressed(KeyCode.RIGHT_ARROW)) {
        directionForce = directionForce.add(Direction.RIGHT);
        wasProcessed = true;
    }
    if (keyMap.isPressed(KeyCode.UP_ARROW)) {
            directionForce = directionForce.add(Direction.UP);
            wasProcessed = true;
            mario.jump = true; 
    }
    if (keyMap.isPressed(KeyCode.DOWN_ARROW)) {
        directionForce = directionForce.add(Direction.DOWN);
        wasProcessed = true;
    }

    if (wasProcessed) {
        mario.applyForce(directionForce.normalize().multiplyScalar(MOVE_SPEED), dt);
    }

    return wasProcessed;
}

function processKeyMap({mario, keyMap, dt}) {
    processKeyMapForMario({mario, keyMap, dt});
}

function drawSky(ctx, boxWidth, boxHeight, sky) {    
    ctx.fillStyle = '#3c78d8';
    ctx.fillRect(sky.x, 0, boxWidth, boxHeight);
}

function redraw({sky, earth, mario, boxWidth, boxHeight, ctx, window}) {
    ctx.resetTransform();
    drawSky(ctx, boxWidth, boxHeight, sky);
    drawEarth(earth, ctx, boxWidth, boxHeight);
    drawWindow(window, ctx, mario, boxWidth);
    drawMario({ctx, mario, boxWidth, boxHeight});
}

function leftScreenCollision(mario)
{
    if (mario.position.x <= 0)
    {
        mario.speed = new Vec2(1, 20); 
    }
}

function topScreenCollision(mario, dt)
{
    if (mario.position.y <= 10)
    {
        let speed = mario.speed;
        mario.speed = new Vec2(0, 20).add(speed);
    }
}

function bottomScreenCollision(mario, earth, boxHeight)
{
    if (mario.position.y > (earth.y - MARIO_SIZE))
    {
        mario.speed = new Vec2(0, 0);
        mario.position = new Vec2(mario.position.x, boxHeight * (1 - EARTH_TO_SKY) - MARIO_SIZE);
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
        position: new Vec2((width - MARIO_SIZE) / 2 , height * (1 - EARTH_TO_SKY) - MARIO_SIZE),
        jump: false
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