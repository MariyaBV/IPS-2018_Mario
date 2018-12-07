import {BRICK_LEDGE_ONES, BRICK_LEDGE, COIN, ENEMY, BALL, STAFF, EARTH, CASTLE, BRICK_SIZE, dx, MARIO_SIZE} from './const.js';
export {redraw};

let earthImg = new Image();
earthImg.src = "web/img/earth.png";
let marioImg = new Image();
marioImg.src = "web/img/mario.png";
let brickImg = new Image();
brickImg.src = "web/img/brick.png";
let coinImg = new Image();
coinImg.src = "web/img/coin.png";
let enemyImg = new Image();
enemyImg.src = "web/img/enemy.png";
let ballImg = new Image();
ballImg.src = "web/img/ball.png";
let staffImg = new Image();
staffImg.src = "web/img/staff.png";
let castleImg = new Image();
castleImg.src = "web/img/castle.png";

function drawMario({ctx, mario, boxWidth, boxHeight}) {
    ctx.drawImage(marioImg, mario.position.x, mario.position.y , MARIO_SIZE, MARIO_SIZE);
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

function drawMap(mario, ctx, viewPort) {
    let leftEdge, rightEdge;
    if (mario.position.x / 50 <= 10) {
        leftEdge = 0;
        rightEdge = viewPort.width.width;
    } else {
        leftEdge = mario.position.x / 50 - dx;
        rightEdge = mario.position.x / 50 + dx;
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

function drawViewPort(viewPort, ctx, mario) {
    if (viewPort.x !== 0) {
        ctx.translate(viewPort.x, 0);
    }

    drawMap(mario, ctx, viewPort);
}


function drawSky(ctx, boxWidth, boxHeight, sky) {    
    ctx.fillStyle = '#3c78d8';
    ctx.fillRect(sky.x, 0, boxWidth, boxHeight);
}

function redraw({sky, earth, mario, boxWidth, boxHeight, ctx, viewPort}) {
    ctx.resetTransform();
    drawSky(ctx, boxWidth, boxHeight, sky);
    drawViewPort(viewPort, ctx, mario, boxWidth);
    drawMario({ctx, mario, boxWidth, boxHeight});
}