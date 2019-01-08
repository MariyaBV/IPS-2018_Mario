import {Count} from './const_game.js';

function createCount(goombaCount, coinCount, liveCount) {
    const onCoinCountChange = (value) => {
        coinCount.textContent = value;
    };

    const onGoombaCountChange = (value) => {
        goombaCount.textContent = value;
    };

    const onLiveCountChange = (value) => {
        liveCount.textContent = value;
    };

    const count = new Count({
        countOfCoin: onCoinCountChange,
        countOfLive: onLiveCountChange,
        countOfGoomba: onGoombaCountChange,
    });

    return count;
}

function score(goombaCount, coinCount, liveCount) {
    const score = goombaCount * 30 + coinCount * 15 + liveCount * 50;
    return score;
}

function countToScreen(playerInfo, idCountOfGoomba, idCountOfCoin, idCountOfLive) {
    const countOfGoomba = document.getElementById(idCountOfGoomba); // переименовать
    const countOfCoin = document.getElementById(idCountOfCoin); // переименовать
    const countOfLive = document.getElementById(idCountOfLive); // переименовать
    playerInfo.count = createCount(countOfGoomba, countOfCoin, countOfLive);
}

export {createCount, score, countToScreen};
