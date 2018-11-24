import {KeyCode} from './keyCode.js';

function isFloatEqual(f1, f2, FLOAT_EQUAL_PRESCISION) {
    return Math.abs(f1 - f2) <= FLOAT_EQUAL_PRESCISION;
}

// x, y , width, height - в относительных
const BRICK_LEDGE_ONES = [
    [19, 7, 1, 2],
    [23, 7, 1, 2],
    [51, 6, 1, 3],
    [54, 6, 1, 3],
    [65, 6, 1, 1],
    [69, 7, 1, 2],
    [84, 7, 1, 2],
    [90, 6, 1, 1],
    [96, 7, 1, 2],
    [100, 8, 1, 1]
];

const  BRICK_LEDGE = [
    [9, 4, 4, 1],
    [26, 4, 2, 1],
    [33, 7, 2, 2],
    [38, 4, 3, 1],
    [45, 4, 2, 1],
    [63, 8, 3, 1],
    [64, 7, 2, 1],
    [72, 5, 2, 1],
    [86, 3, 2, 1],
    [87, 7, 2, 2],
    [90, 8, 3, 1],
    [90, 7, 2, 1]
];

const BOX = [
    [28, 4, 1, 1],
    [37, 4, 1, 1],
    [47, 4, 1, 1],
    [74, 5, 1, 1],
    [88, 3, 1, 1]
];

const COIN = [
    [10, 3, 1, 1],
    [12, 3, 1, 1],
    [27, 3, 1, 1],
    [28, 3, 1, 1],
    [34, 6, 1, 1],
    [45, 3, 1, 1],
    [73, 4, 1, 1],
    [74, 4, 1, 1],
    [86, 2, 1, 1],
    [87, 2, 1, 1]
];

const ENEMY = [
    [20, 8, 1, 1],
    [35, 8, 1, 1],
    [38, 3, 1, 1],
    [48, 8, 1, 1],
    [52, 8, 1, 1],
    [66, 8, 1, 1],
    [85, 8, 1, 1],
    [94, 8, 1, 1]
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

const CASTLE = [
    [109, 5, 4]
];


const objectType = {
    barrier: 1,
    coin: 2,
    enemy: 3
}

Object.freeze(KeyCode);

const EARTH_TO_SKY = 0.1;
const BRICK_SIZE = 50;
const MARIO_SIZE = 50;
const FREE_FALL_ACCELERATION = new Vec2(0, 400);
const dx = 15;
const METER_IN_PX = 300;
const EARTH_LINE = 0.9;
const OBJECT_HEIGHT = 50;
const OBJECT_WIDTH = 50;

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
let enemyImg = new Image();
enemyImg.src = "img/enemy.png";
let ballImg = new Image();
ballImg.src = "img/ball.png";
let staffImg = new Image();
staffImg.src = "img/staff.png";
let castleImg = new Image();
castleImg.src = "img/castle.png";

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

function collision(mario, object, objType) {
    let marioPosX = mario.position.x;
    let marioPosY = mario.position.y;
    
    if (((marioPosX > (object[0] * OBJECT_WIDTH)) && (marioPosX < (object[0] + object[2]) * OBJECT_WIDTH)) ||
    (((marioPosX + MARIO_SIZE) > (object[0] * OBJECT_WIDTH)) && ((marioPosX + MARIO_SIZE) < (object[0] + object[2]) * OBJECT_WIDTH))) {
        console.log("VNUTRI ");
        console.log("objectType = ", objType, objectType.barrier);
        if (isFloatEqual(marioPosY, (object[1] + object[3]) * OBJECT_HEIGHT, 1)) { 
            console.log("sverhu prymougolnik", "objectTypeVec = ", objectType);
            if (objType == objectType.barrier) {
                let speed = mario.speed.y;
                mario.speed = new Vec2(0, -speed);
            }
            if (objType == objectType.coin) {
                console.log("coin 2a ");
                for (const coordinate of COIN) {
                    console.log("coin 2b ");
                    if ((coordinate[0] == object[0]) && (coordinate[1] == object[1])) {
                        console.log("coin 2c ");
                        delete COIN[coordinate];
                    }
                }
            }
        } 
        if (isFloatEqual(marioPosY + MARIO_SIZE, object[1] * OBJECT_HEIGHT, 1)) {
            console.log("snizu pryamoug");
            if (objType == objectType.barrier) {
                mario.speed = new Vec2(mario.speed.x, 0);
                mario.position = new Vec2(mario.position.x, object[1] * OBJECT_WIDTH - MARIO_SIZE - 1.1);
                keyUp = false;
                mario.jump = false;
            }
            if (objType == objectType.coin) {
                console.log("coin 1a ");
                for (const coordinate of COIN) {
                    console.log("coin 1b ");
                    if ((coordinate[0] == object[0]) && (coordinate[1] == object[1])) {
                        delete COIN[coordinate];
                        console.log("coin 1c ");
                    }
                }
            }
        }
    } 
    if (isFloatEqual(marioPosX + MARIO_SIZE, object[0] *  OBJECT_WIDTH, 1)) {
        if (((marioPosY > (object[1] * OBJECT_HEIGHT)) && (marioPosY < (object[1] + object[3]) * OBJECT_HEIGHT)) ||
        (((marioPosY + MARIO_SIZE) > (object[1] * OBJECT_HEIGHT)) && ((marioPosY + 50) < (object[1] + object[3]) * OBJECT_HEIGHT))) {
            console.log("sprava");
            if (objType == objectType.barrier) {
                let speed = mario.speed.y;
                mario.speed = new Vec2(0, speed);
            }
            if (objType == objectType.coin) {
                console.log("coin 3a ");
                for (const coordinate of COIN) {
                    console.log("coin 3b ");
                    if ((coordinate[0] == object[0]) && (coordinate[1] == object[1])) {
                        console.log("coin 3c ");
                        delete COIN[coordinate];
                    }
                }
            }
        }
        
    }
    if (isFloatEqual(marioPosX, (object[0] + object[2]) * OBJECT_WIDTH, 1)) {
        if (((marioPosY > (object[1] * OBJECT_HEIGHT)) && (marioPosY < (object[1] + object[3]) * OBJECT_HEIGHT)) ||
        (((marioPosY + MARIO_SIZE) > (object[1] * OBJECT_HEIGHT)) && ((marioPosY + 50) < (object[1] + object[3]) * OBJECT_HEIGHT))) {
            console.log("sleva");
            if (objType == objectType.barrier) {
                let speed = mario.speed.y;
                mario.speed = new Vec2(0, speed);
            }
            if (objType == objectType.coin) {
                console.log("coin 4a ");
                for (const coordinate of COIN) {
                    console.log("coin 4b ");
                    if ((coordinate[0] == object[0]) && (coordinate[1] == object[1])) {
                        console.log("coin 4c ");
                        delete COIN[coordinate];
                    }
                }
            }
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

function collisionWithObject(mario, window, dt) {
    for (const coordinate of BRICK_LEDGE_ONES){
        collision(mario, coordinate, objectType.barrier);
    }
    for (const coordinate of BOX){
        collision(mario, coordinate, objectType.barrier);
    }
    for (const coordinate of ENEMY){
        collision(mario, coordinate, objectType.enemy);
    }
    for (const coordinate of BRICK_LEDGE) {
        collision(mario, coordinate, objectType.barrier);
    }
    for (const coordinate of COIN) {
        collision(mario, coordinate, objectType.coin);
    }
    if (mario.position.x >= 525){
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
            for (let i = coordinate[0]; i < (coordinate[0] + coordinate[2]); i++) {
                for (let j = coordinate[1]; j < (coordinate[1] + coordinate[3]); j++) {
                    if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)) {
                        ctx.drawImage(brickImg, BRICK_SIZE * i, BRICK_SIZE * j, BRICK_SIZE, BRICK_SIZE);
                    }
                }
            }
        }

        for (const coordinate of BRICK_LEDGE_ONES) {
            for (let i = coordinate[1]; i < (coordinate[1] + coordinate[3]); i++) {
                if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)) {
                    ctx.drawImage(brickImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * i, BRICK_SIZE, BRICK_SIZE);
                }
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

        for (const coordinate of ENEMY) {
            if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)) {
                ctx.drawImage(enemyImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE, BRICK_SIZE);
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

        for (const coordinate of CASTLE) {
            ctx.drawImage(castleImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE * coordinate[2], BRICK_SIZE * coordinate[2]);
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
    applyFrictionalForce({mario, dt, boxHeight});
    leftScreenCollision(mario);
    topScreenCollision(mario, dt);
    bottomScreenCollision(mario, window);
    collisionWithObject(mario, window, dt);
    moveMario({mario, dt, window});
}

function drawSky(ctx, boxWidth, boxHeight, sky) {    
    ctx.fillStyle = '#3c78d8';
    ctx.fillRect(sky.x, 0, boxWidth, boxHeight);
}

function redraw({sky, earth, mario, boxWidth, boxHeight, ctx, window}) {
    ctx.resetTransform();
    drawSky(ctx, boxWidth, boxHeight, sky);
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
        mario.position = new Vec2(mario.position.x, window.width.height - OBJECT_HEIGHT - MARIO_SIZE - 0.1);
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

        const UPDATES_PER_FRAME = 5;

        for (let i = 0; i < UPDATES_PER_FRAME; ++i) {
            update({
                earth,
                mario,
                boxWidth: width,
                boxHeight: height,
                dt: deltaTime / UPDATES_PER_FRAME,
                ctx,
                window
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
        requestAnimationFrame(animateFn);
    }
    animateFn();
};


main();