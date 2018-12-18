import {Point} from './const_game.js';

function showPoint(goombaPoint, coinPoint, livePoint) {
    const onCoinCountChange = (value) => {
        coinPoint.textContent = value;
    };

    const onGoombaCountChange = (value) => {
        goombaPoint.textContent = value;
    };

    const onLiveCountChange = (value) => {
        livePoint.textContent = value;
    };

    const point = new Point({
        pointOfCoin: onCoinCountChange,
        pointOfLive: onLiveCountChange,
        pointOfGoomba: onGoombaCountChange,
    });

    return point;
}

export {showPoint};
