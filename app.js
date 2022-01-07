let lastHole;
let timeUp = false;
let score = 0;
let atGameStart = true;
let atGamePage = false;
let atGameOver = false;

const startPage = document.querySelector('.start-page')
const gamePage = document.querySelector('.game-page')
const bossPage = document.querySelector('.boss-page')
const endPage = document.querySelector('.end-page')

const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const addPoints = document.querySelector('.add-points')
const finalScore = document.querySelector('.final-score');
const moles = document.querySelectorAll('.mole');
const startGameBtn = document.querySelector('.btn');

const backgroundMusic = new Audio('audio/background_music_2.mp3')
const smack = new Audio('audio/smack.mp3')
const gameOver = new Audio('audio/game_over.mp3')

// cursor
const cursor = document.querySelector('.cursor')

// boss
const boss1 = document.querySelector('.boss1')
const boss2 = document.querySelector('.boss2')

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
    const time = randomTime(500, 1500);
    const hole = randomHole(holes);

    hole.classList.add('up');
    hole.children[0].style.visibility = "visible";
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    atGameStart = false
    atGamePage = true
    atGameOver = false
    backgroundMusic.play()
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
        atGamePage = false
        atGameOver = true
        removeGamePage()
        showBossPage()
    }, 1000)
}

function restartGame() {
    atGamePage = true
    atGameOver = false
    backgroundMusic.play()
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
        atGamePage = false
        atGameOver = true
        gameOver.play()
        timeUp = true
        removeGamePage()
        showEndPage()
    }, 62000)
}

function hit(e) {
    if (!e.isTrusted) return; // cheater!
    score += 10;
    this.classList.add('animate__zoomOutDown')
    setTimeout(() => {
        this.style.visibility = "hidden";
        this.parentNode.classList.remove('up');
        this.classList.remove('animate__zoomOutDown');
    }, 1500)

    scoreBoard.textContent = score;
    smack.play();
    addPoints.classList.toggle('hide')
    setTimeout(() => {
        addPoints.classList.toggle('hide')
    }, 700)
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

function showBossPage() {
    bossPage.classList.toggle('hide')
    // setTimeout(() => {
    //     removeBossPage()
    //     showEndPage()
    // }, 10000)
}

function removeBossPage() {
    bossPage.classList.toggle('hide')
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
window.addEventListener('mousemove', (e) => {
    // Only if game is started
    if (atGamePage) {
        cursor.style.top = e.clientY - 140 + "px";
        cursor.style.left = e.clientX + "px";
        document.body.style.cursor = "crosshair";
    }

    if (atGameOver || atGameStart) {
        cursor.style.visibility = "hidden";
    } else {
        cursor.style.visibility = "visible";
    }

}, false);

// Make it play an animation when clicked
document.body.addEventListener('click', (e) => {
    cursor.classList.add('cursor-clicked')
    setTimeout(() => cursor.classList.remove('cursor-clicked'), 50);
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
