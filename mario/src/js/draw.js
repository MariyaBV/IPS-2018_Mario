import {dx, ViewPort} from './const_game.js';
import {MARIO_SIZE} from './const_mario.js';
import {LUIDZHI_SIZE} from './const_luidzhi.js';
import {BRICK_LEDGE_ONES, BRICK_LEDGE, COIN, ENEMY, BALL, STAFF, EARTH, CASTLE} from './objects.js';
const BRICK_SIZE = 50;

const earthImg = new Image();
earthImg.src = 'web/img/earth.png';
const marioImg = new Image();
marioImg.src = 'web/img/mario.png';
const luidzhiImg = new Image();
luidzhiImg.src = 'web/img/luidzhi.png';
const brickImg = new Image();
brickImg.src = 'web/img/brick.png';
const coinImg = new Image();
coinImg.src = 'web/img/coin.png';
const enemyImg = new Image();
enemyImg.src = 'web/img/enemy.png';
const ballImg = new Image();
ballImg.src = 'web/img/ball.png';
const staffImg = new Image();
staffImg.src = 'web/img/staff.png';
const castleImg = new Image();
castleImg.src = 'web/img/castle.png';

function drawMario({ctx, game}) {
    ctx.drawImage(marioImg, game.marioInfo.mario.position.x, game.marioInfo.mario.position.y, MARIO_SIZE, MARIO_SIZE);
}

function drawLuidzhi({ctx, game}) {
    ctx.drawImage(luidzhiImg, game.luidzhiInfo.luidzhi.position.x, game.luidzhiInfo.luidzhi.position.y, LUIDZHI_SIZE, LUIDZHI_SIZE);
}

function drawObject(object, objectSize, objectImg, rightEdge, leftEdge, ctx) {
    for (const coordinate of object) {
        for (let i = coordinate[0]; i < (coordinate[0] + coordinate[2]); i++) {
            for (let j = coordinate[1]; j < (coordinate[1] + coordinate[3]); j++) {
                if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)) {
                    ctx.drawImage(objectImg, objectSize * i, objectSize * j, objectSize, objectSize);
                }
            }
        }
    }
}

function drawMap(ctx, game, viewPort) {
    let leftEdge;
    let rightEdge;
    if (ctx == canvas2.getContext('2d')) {
        if (game.marioInfo.mario.position.x / 50 <= 10) {
            leftEdge = 0;
            rightEdge = viewPort.width;
        } else {
            leftEdge = game.marioInfo.mario.position.x / 50 - dx;
            rightEdge = game.marioInfo.mario.position.x / 50 + dx;
        }
    } else if (ctx == canvas1.getContext('2d')) {
        if (game.luidzhiInfo.luidzhi.position.x / 50 <= 10) {
            leftEdge = 0;
            rightEdge = viewPort.width;
        } else {
            leftEdge = game.luidzhiInfo.luidzhi.position.x / 50 - dx;
            rightEdge = game.luidzhiInfo.luidzhi.position.x / 50 + dx;
        }
    };

    drawObject(BRICK_LEDGE, BRICK_SIZE, brickImg, rightEdge, leftEdge, ctx);
    drawObject(BRICK_LEDGE_ONES, BRICK_SIZE, brickImg, rightEdge, leftEdge, ctx);
    drawObject(COIN, BRICK_SIZE, coinImg, rightEdge, leftEdge, ctx);
    drawObject(ENEMY, BRICK_SIZE, enemyImg, rightEdge, leftEdge, ctx);
    drawObject(BALL, BRICK_SIZE, ballImg, rightEdge, leftEdge, ctx);
    drawObject(STAFF, BRICK_SIZE, staffImg, rightEdge, leftEdge, ctx);

    for (const coordinate of CASTLE) {
        ctx.drawImage(castleImg, BRICK_SIZE * coordinate[0], BRICK_SIZE * coordinate[1], BRICK_SIZE * coordinate[2], BRICK_SIZE * coordinate[2]);
    }

    for (const coordinate of EARTH) {
        for (let i = coordinate[0]; i <= coordinate[1]; i++) {
            for (let j = coordinate[2]; j < coordinate[3]; j++) {
                ctx.drawImage(earthImg, BRICK_SIZE * i, BRICK_SIZE * j, BRICK_SIZE, BRICK_SIZE);
            }
        }
    }
}

function drawViewPort(game, ctx, viewPort) {
    const x = Math.min(0, -viewPort.x); //min - 0, max - worldWidth
    let y;
    let windowHeight = window.innerHeight;
    if (windowHeight > 1030) {
        y = Math.max(200, -viewPort.y);
    } else if (windowHeight > 930) {
        y = Math.max(100, -viewPort.y);
    } else if (windowHeight > 830) {
        y = Math.max(0, -viewPort.y);
    } else if (windowHeight > 730) {
        y = Math.max(-100, -viewPort.y);
    } else if (windowHeight > 630) {
        y = Math.max(-200, -viewPort.y);
    } else {
        y = Math.max(-150, -viewPort.y);
    };
    ctx.translate(x, y);

    drawMap(ctx, game, viewPort);
}


function drawSky(ctx, boxWidth, boxHeight) {
    ctx.fillStyle = '#3c78d8';
    ctx.fillRect(0, 0, boxWidth, boxHeight);
}

function redraw({viewPortWidth, viewPortHeight, ctx1, ctx2, game}) {
    const viewPort1 = new ViewPort({
        x: game.luidzhiInfo.luidzhi.position.x + LUIDZHI_SIZE / 2 - viewPortWidth / 2,
        y: game.luidzhiInfo.luidzhi.position.y + LUIDZHI_SIZE / 2 - viewPortHeight / 2,
        width: viewPortWidth,
        height: viewPortHeight,
    });
    redrawImpl({
        viewPortWidth,
        viewPortHeight,
        ctx: ctx1,
        game,
        viewPort: viewPort1,
    });
    const viewPort2 = new ViewPort({
        x: game.marioInfo.mario.position.x + MARIO_SIZE / 2 - viewPortWidth / 2,
        y: game.marioInfo.mario.position.y + MARIO_SIZE / 2 - viewPortHeight / 2,
        width: viewPortWidth,
        height: viewPortHeight,
    });
    redrawImpl({
        viewPortWidth,
        viewPortHeight,
        ctx: ctx2,
        game,
        viewPort: viewPort2,
    });
}

function redrawImpl({viewPortWidth, viewPortHeight, ctx, game, viewPort}) {
    ctx.resetTransform();
    drawSky(ctx, viewPortWidth, viewPortHeight);
    drawViewPort(game, ctx, viewPort);
    drawMario({ctx, game});
    drawLuidzhi({ctx, game});
}

export {redraw};
