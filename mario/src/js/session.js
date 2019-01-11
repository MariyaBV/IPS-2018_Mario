import {score} from './counts.js';

function scoreOfPlayers(game) {
    let marioScore;
    let luidzhiScore;
    const mario = game.marioInfo.score;
    const luidzhi = game.luidzhiInfo.score;
    if (mario.numberOfLives == 0) {
        marioScore = 0;
    } else if (game.marioInfo.firstFinish == true) {
        marioScore = score(mario.amountOfEnemies, mario.amountOfCoins, mario.numberOfLives) * 1.5;
    } else {
        marioScore = score(mario.amountOfEnemies, mario.amountOfCoins, mario.numberOfLives);
    }
    if (luidzhi.numberOfLives == 0) {
        luidzhiScore = 0;
    } else if (game.luidzhiInfo.firstFinish == true) {
        luidzhiScore = score(luidzhi.amountOfEnemies, luidzhi.amountOfCoins, luidzhi.numberOfLives) * 1.5;
    } else {
        luidzhiScore = score(luidzhi.amountOfEnemies, luidzhi.amountOfCoins, luidzhi.numberOfLives);
    }

    const playersCounts = {
        'marioScore': marioScore,
        'luidzhiScore': luidzhiScore,
    };
    return playersCounts;
}

function countsToSession(game) {
    const playersCounts = scoreOfPlayers(game);
    const counts = {
        mario: {
            'coin': game.marioInfo.score.amountOfCoins,
            'live': game.marioInfo.score.numberOfLives,
            'goomba': game.marioInfo.score.amountOfEnemies,
        },
        luidzhi: {
            'coin': game.luidzhiInfo.score.amountOfCoins,
            'live': game.luidzhiInfo.score.numberOfLives,
            'goomba': game.luidzhiInfo.score.amountOfEnemies,
        },
        playersCounts,
    };

    $.post('mario.php', counts, function(data) {
        onComplete(data);
    });
};

function onComplete(response) {
    if (response == 7) {
        window.location = 'end_of_game.php';
    } else {
        console.log('данные не передались');
    }
}

export {countsToSession};
