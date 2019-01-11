import {Vec2} from './vector.js';

const PLAYER_SIZE = 50;
Player.MAX_SPEED = 200; // для максимальной скорости

function PlayerInfo({
    firstFinish,
    player,
    manageKeys,
    count,
    score,
}) {
    this.firstFinish = firstFinish;
    this.player = player;
    this.manageKeys = manageKeys;
    this.count = count;
    this.score = score;
}

function Player({
    position,
    jump,
    run,
}) {
    this.position = position;
    this.speed = new Vec2(0, 0);
    this.jump = jump;
    this.run = run;

    this.applyForce = function(force, dt) {
        this.speed = this.speed.add(force.multiplyScalar(dt));
        if (this.speed.x > Player.MAX_SPEED) {
            this.speed = new Vec2(Player.MAX_SPEED, this.speed.y);
        }
    };
}

function ManageKeys({
    LEFT,
    RIGHT,
    UP,
}) {
    this.LEFT = LEFT;
    this.RIGHT = RIGHT;
    this.UP = UP;
}

function Score({
    numberOfLives,
    amountOfCoins,
    amountOfEnemies,
}) {
    this.numberOfLives = numberOfLives;
    this.amountOfCoins = amountOfCoins;
    this.amountOfEnemies = amountOfEnemies;
}

export {PLAYER_SIZE, Player, PlayerInfo, ManageKeys, Score};
