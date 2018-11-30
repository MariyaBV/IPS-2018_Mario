import {Vec2} from './vector.js';

// x, y , width, height - в относительных
export const BRICK_LEDGE_ONES = [
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

export const  BRICK_LEDGE = [
    [9, 4, 4, 1],
    [26, 4, 3, 1],
    [33, 7, 2, 2],
    [37, 4, 3, 1],
    [45, 4, 3, 1],
    [63, 8, 3, 1],
    [64, 7, 2, 1],
    [72, 5, 3, 1],
    [86, 3, 2, 1],
    [87, 7, 2, 2],
    [90, 8, 3, 1],
    [90, 7, 2, 1]
];

export const COIN = [
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

export const ENEMY = [
    [20, 8, 1, 1],
    [35, 8, 1, 1],
    [38, 3, 1, 1],
    [48, 8, 1, 1],
    [52, 8, 1, 1],
    [66, 8, 1, 1],
    [85, 8, 1, 1],
    [94, 8, 1, 1]
];

export const BALL = [
    [100, 3, 1, 1]
];

export const STAFF = [
    [100, 7, 1, 1],
    [100, 6, 1, 1],
    [100, 5, 1, 1],
    [100, 4, 1, 1]
];

export const EARTH = [
    [0, 122, 9]
];

export const CASTLE = [
    [109, 5, 4]
];

export {UPDATES_PER_FRAME, MARIO_SIZE, EARTH_LINE, canvas, width, height, ctx, EARTH_TO_SKY, BRICK_SIZE, dx, ANTISPEED_VALUE, AIR_DECELERATION};
export {Earth, Sky, Mario, Game, Window};

const MARIO_SIZE = 50;
const EARTH_LINE = 0.9;
const canvas = document.getElementById('canvas');
const width = canvas.offsetWidth;
const height = canvas.offsetHeight;
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
const EARTH_TO_SKY = 0.1;
const BRICK_SIZE = 50;
const dx = 15;
const ANTISPEED_VALUE = 800;
const AIR_DECELERATION = 0;
const UPDATES_PER_FRAME = 5;
Mario.MAX_SPEED = 200; // для максимальной скорости

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

function Game({
    finished,
    startTime,
    endTime

}) {
    this.finished = finished;
    this.startTime = startTime;
    this.endTime = endTime;
}

function Window(width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
}