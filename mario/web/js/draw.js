import {dx, ViewPort} from './const_game.js';
import {PLAYER_SIZE} from './const_player.js';
import {ENEMY_SIZE} from './move_enemy.js';
import {BRICK_LEDGE_ONES, BRICK_LEDGE, COIN, ENEMY, BALL, STAFF, EARTH, CASTLE, CLOUD, BUSH} from './objects.js';
const BRICK_SIZE = 50;

const EARTH_IMG = new Image();
EARTH_IMG.src = 'web/img/earth.png';
const MARIO_IMG = new Image();
MARIO_IMG.src = 'web/img/mario.png';
const MARIO_IMG_LEFT = new Image();
MARIO_IMG_LEFT.src = 'web/img/mario_left.png';
const LUIDZHI_IMG = new Image();
LUIDZHI_IMG.src = 'web/img/luidzhi.png';
const LUIDZHI_IMG_LEFT = new Image();
LUIDZHI_IMG_LEFT.src = 'web/img/luidzhi_left.png';
const BRICK_IMG = new Image();
BRICK_IMG.src = 'web/img/brick.png';
const COIN_IMG = new Image();
COIN_IMG.src = 'web/img/coin.png';
const ENEMY_IMG = new Image();
ENEMY_IMG.src = 'web/img/enemy.png';
const BALL_IMG = new Image();
BALL_IMG.src = 'web/img/ball.png';
const STAFF_IMG = new Image();
STAFF_IMG.src = 'web/img/staff.png';
const CASTLE_IMG = new Image();
CASTLE_IMG.src = 'web/img/castle.png';
const BUSH_IMG = new Image();
BUSH_IMG.src = 'web/img/bush.png';
const CLOUD_IMG = new Image();
CLOUD_IMG.src = 'web/img/cloud.png';

function drawPlayer(ctx, game, playerImg) {
    ctx.drawImage(
        playerImg,
        game.player.position.x,
        game.player.position.y,
        PLAYER_SIZE,
        PLAYER_SIZE
    );
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

function drawBigObject(object, objectSize, objectXSize, objectYSize, objectImg, rightEdge, leftEdge, ctx) {
    for (const coordinate of object) {
        if ((coordinate[0] <= rightEdge) && (coordinate[0] >= leftEdge)) {
            ctx.drawImage(objectImg, objectSize * coordinate[0], objectSize * coordinate[1], objectXSize, objectYSize);
        }
    }
}

function drawBigSquareObject(ctx, object, objectImg) {
    for (const coordinate of object) {
        ctx.drawImage(
            objectImg,
            BRICK_SIZE * coordinate[0],
            BRICK_SIZE * coordinate[1],
            BRICK_SIZE * coordinate[2],
            BRICK_SIZE * coordinate[2]
        );
    }
}

function drawMap(ctx, game, viewPort) {
    let leftEdge;
    let rightEdge;
    if (ctx == canvas2.getContext('2d')) {
        if (game.marioInfo.player.position.x / 50 <= 10) {
            leftEdge = 0;
            rightEdge = viewPort.width;
        } else {
            leftEdge = game.marioInfo.player.position.x / 50 - dx;
            rightEdge = game.marioInfo.player.position.x / 50 + dx;
        }
    } else if (ctx == canvas1.getContext('2d')) {
        if (game.luidzhiInfo.player.position.x / 50 <= 10) {
            leftEdge = 0;
            rightEdge = viewPort.width;
        } else {
            leftEdge = game.luidzhiInfo.player.position.x / 50 - dx;
            rightEdge = game.luidzhiInfo.player.position.x / 50 + dx;
        }
    };
    drawBigObject(CLOUD, BRICK_SIZE, BRICK_SIZE * 2, BRICK_SIZE * 2, CLOUD_IMG, rightEdge, leftEdge, ctx);
    drawBigObject(BUSH, BRICK_SIZE, BRICK_SIZE * 3, BRICK_SIZE, BUSH_IMG, rightEdge, leftEdge, ctx);
    drawObject(BRICK_LEDGE, BRICK_SIZE, BRICK_IMG, rightEdge, leftEdge, ctx);
    drawObject(BRICK_LEDGE_ONES, BRICK_SIZE, BRICK_IMG, rightEdge, leftEdge, ctx);
    drawObject(COIN, BRICK_SIZE, COIN_IMG, rightEdge, leftEdge, ctx);
    drawObject(ENEMY, ENEMY_SIZE, ENEMY_IMG, rightEdge, leftEdge, ctx);
    drawObject(BALL, BRICK_SIZE, BALL_IMG, rightEdge, leftEdge, ctx);
    drawObject(STAFF, BRICK_SIZE, STAFF_IMG, rightEdge, leftEdge, ctx);
    drawBigSquareObject(ctx, CASTLE, CASTLE_IMG);

    for (const coordinate of EARTH) {
        for (let i = coordinate[0]; i <= coordinate[1]; i++) {
            for (let j = coordinate[2]; j < coordinate[3]; j++) {
                ctx.drawImage(EARTH_IMG, BRICK_SIZE * i, BRICK_SIZE * j, BRICK_SIZE, BRICK_SIZE);
            }
        }
    }
}

function drawViewPort(game, ctx, viewPort) {
    const x = Math.min(0, -viewPort.x); //min - 0, max - worldWidth
    let y;
    const windowHeight = window.innerHeight;
    if (windowHeight > 1030) {
        y = Math.max(250, -viewPort.y);
    } else if (windowHeight > 930) {
        y = Math.max(200, -viewPort.y);
    } else if (windowHeight > 830) {
        y = Math.max(150, -viewPort.y);
    } else if (windowHeight > 730) {
        y = Math.max(50, -viewPort.y);
    } else if (windowHeight > 630) {
        y = Math.max(-90, -viewPort.y);
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
        x: game.luidzhiInfo.player.position.x + PLAYER_SIZE / 2 - viewPortWidth / 2,
        y: game.luidzhiInfo.player.position.y + PLAYER_SIZE / 2 - viewPortHeight / 2,
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
        x: game.marioInfo.player.position.x + PLAYER_SIZE / 2 - viewPortWidth / 2,
        y: game.marioInfo.player.position.y + PLAYER_SIZE / 2 - viewPortHeight / 2,
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
    drawPlayer(ctx, game.marioInfo, MARIO_IMG);
    drawPlayer(ctx, game.luidzhiInfo, LUIDZHI_IMG);
}

export {redraw};
