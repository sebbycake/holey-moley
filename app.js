let lastHole;
let timeUp = false;
let score = 0;
let atGamePage = false

const startPage = document.querySelector('.start-page')
const gamePage = document.querySelector('.game-page')
const endPage = document.querySelector('.end-page')

const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const addPoints = document.querySelector('.add-points')
const finalScore = document.querySelector('.final-score');
const moles = document.querySelectorAll('.mole');
const startGameBtn = document.querySelector('.btn');

const backgroundMusic = new Audio('audio/background_music_cut.mp3')
const smack = new Audio('audio/smack.mp3')
const gameOver = new Audio('audio/game_over.mp3')

// cursor
const cursor = document.querySelector('.cursor')

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function randomMultipleHoles(holes) {
    // multiple moles can spawn at the same time
    const maxMoles = Math.floor(Math.random() * holes.length);
    console.log(maxMoles)
}

function peep() {
    const time = randomTime(200, 1000);
    const hole = randomHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    atGamePage = true
    // backgroundMusic.play()
    timeUp = false;
    score = 0;
    const displayTime = document.querySelector('.time');
    startTimer(60, displayTime);
    // add delay due to timer delay
    setTimeout(() => peep(), 2000)
    removeStartPage()
    showGamePage()
    setTimeout(() => {
        gameOver.play()
        timeUp = true
        removeGamePage()
        showEndPage()
    }, 2000)
}

function restartGame() {
    // backgroundMusic.play()
    scoreBoard.textContent = 0;
    finalScore.textContent = 0;
    timeUp = false;
    score = 0;
    const displayTime = document.querySelector('.time');
    displayTime.remove()
    const timer = recreateTimer()
    startTimer(60, timer);
    setTimeout(() => peep(), 2000)
    removeEndPage()
    showGamePage()
    setTimeout(() => {
        gameOver.play()
        timeUp = true
        removeGamePage()
        showEndPage()
    }, 62000)
}

function hit(e) {
    if (!e.isTrusted) return; // cheater!
    score += 10;
    this.parentNode.classList.remove('up');
    scoreBoard.textContent = score;
    smack.play();
    addPoints.classList.toggle('hide')
    // gamePage.classList.add('animate__heartBeat')
    setTimeout(() => {
        addPoints.classList.toggle('hide')
        // gamePage.classList.remove('animate__heartBeat')
    }, 700)
    // gamePage.classList.add('animate__animated')
    // gamePage.classList.add('animate__tada')
}

moles.forEach(mole => mole.addEventListener('click', hit));

function removeStartPage() {
    startPage.classList.toggle('hide')
}

function showGamePage() {
    gamePage.classList.toggle('hide')
}

function removeGamePage() {
    gamePage.classList.toggle('hide')
}

function showEndPage() {
    finalScore.textContent = score;
    endPage.classList.toggle('hide')
}

function removeEndPage() {
    endPage.classList.toggle('hide')
}

function recreateTimer() {
    const timer = document.createElement('div')
    timer.textContent = "01:00"
    timer.classList.add('time')
    gamePage.prepend(timer)
    return timer
}

// Set the hammer to follow the mouse
document.body.addEventListener('mousemove', (e) => {
    // Only if game is started
    if (atGamePage) {
        cursor.style.top = e.clientY + 100 + "px";
        cursor.style.left = e.clientX + 100 + "px";
    }
}, false);

// Make it play an animation when clicked
document.body.addEventListener('click', (e) => {
    // cursor.classList.remove('cursor')
    cursor.classList.add('cursor-clicked')
    setTimeout(() => cursor.classList.remove('cursor-clicked'), 100);
}, false);

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}