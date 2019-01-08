const EARTH_LINE = 0.9;
const EARTH_TO_SKY = 0.1;
const dx = 15;

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
    stop,
    finished,
    startTime,
    endTime,
    marioInfo,
    luidzhiInfo,
}) {
    this.stop = stop;
    this.finished = finished;
    this.startTime = startTime;
    this.endTime = endTime;
    this.marioInfo = marioInfo;
    this.luidzhiInfo = luidzhiInfo;
}

function Count({
    countOfCoin,
    countOfLive,
    countOfGoomba,
}) {
    this.countOfCoin = countOfCoin;
    this.countOfLive = countOfLive;
    this.countOfGoomba = countOfGoomba;
}

export {EARTH_LINE, EARTH_TO_SKY, dx};
export {Earth, Game, ViewPort, Count};
