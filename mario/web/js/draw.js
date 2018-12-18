import {dx} from './const_game.js';
import {MARIO_SIZE} from './const_mario.js';
import {BRICK_LEDGE_ONES, BRICK_LEDGE, COIN, ENEMY, BALL, STAFF, EARTH, CASTLE} from './objects.js';
const BRICK_SIZE = 50;

const earthImg = new Image();
earthImg.src = 'web/img/earth.png';
const marioImg = new Image();
marioImg.src = 'web/img/mario.png';
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
    ctx.drawImage(marioImg, game.mario.position.x, game.mario.position.y, MARIO_SIZE, MARIO_SIZE);
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

function drawMap(ctx, game) {
    let leftEdge; let rightEdge;
    if (game.mario.position.x / 50 <= 10) {
        leftEdge = 0;
        rightEdge = game.viewPort.width.width;
    } else {
        leftEdge = game.mario.position.x / 50 - dx;
        rightEdge = game.mario.position.x / 50 + dx;
    }
    //$.getJSON( "js/objects.json", function(data) {
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
            ctx.drawImage(earthImg, BRICK_SIZE * i, BRICK_SIZE * coordinate[2], BRICK_SIZE, BRICK_SIZE);
        }
    }

    //})
}

function drawViewPort(game, ctx) {
    if (game.viewPort.x !== 0) {
        ctx.translate(game.viewPort.x, 0);
    }

    drawMap(ctx, game);
}


function drawSky(ctx, boxWidth, boxHeight) {
    ctx.fillStyle = '#3c78d8';
    ctx.fillRect(0, 0, boxWidth, boxHeight);
}

function redraw({boxWidth, boxHeight, ctx, game}) {
    ctx.resetTransform();
    drawSky(ctx, boxWidth, boxHeight);
    drawViewPort(game, ctx);
    drawMario({ctx, game});
}

export {redraw};
