const EARTH_LINE = 0.9;
const EARTH_TO_SKY = 0.1;
const dx = 15;
//const AIR_DECELERATION = 0;

function Earth({
    startX,
    startY,
}) {
    this.x = startX;
    this.y = startY;
}

function ViewPort({x, y, width, height}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

function Game({
    finished,
    startTime,
    endTime,
    mario,
}) {
    this.finished = finished;
    this.startTime = startTime;
    this.endTime = endTime;
    this.mario = mario;
}

function Point({
    pointOfCoin,
    pointOfLive,
    pointOfGoomba,
}) {
    this.pointOfCoin = pointOfCoin;
    this.pointOfLive = pointOfLive;
    this.pointOfGoomba = pointOfGoomba;
}

export {EARTH_LINE, EARTH_TO_SKY, dx};
export {Earth, Game, ViewPort, Point};
