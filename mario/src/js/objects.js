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
    [100, 8, 1, 1],
];


const BRICK_LEDGE = [
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
    [90, 7, 2, 1],
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
    [87, 2, 1, 1],
];

const ENEMY = [
    [20, 8, 1, 1],
    [35, 8, 1, 1],
    [38, 3, 1, 1],
    [48, 8, 1, 1],
    [52, 8, 1, 1],
    [66, 8, 1, 1],
    [85, 8, 1, 1],
    [94, 8, 1, 1],
];

const BALL = [
    [100, 3, 1, 1],
];

const STAFF = [
    [100, 7, 1, 1],
    [100, 6, 1, 1],
    [100, 5, 1, 1],
    [100, 4, 1, 1],
];

const EARTH = [
    [0, 122, 9],
];

const CASTLE = [
    [109, 5, 4],
];

export {CASTLE, EARTH, STAFF, BALL, ENEMY, COIN, BRICK_LEDGE_ONES, BRICK_LEDGE};
