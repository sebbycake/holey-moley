let lastHole;
let timeUp = false;
let score = 0;
let bossScore = 0;

// 0 => start, 1 => during game, 3=> bossfight 2 => game over
let gameState = 0

const startPage = document.querySelector('.start-page')
const gamePage = document.querySelector('.game-page')
const bossPage = document.querySelector('.boss-page')
const endPage = document.querySelector('.end-page')

const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const addPoints = document.querySelector('.add-points')
const bossPoints = document.querySelector('.boss-points')
const finalScore = document.querySelector('.final-score');
const finalBossScore = document.querySelector('.boss-score')
const moles = document.querySelectorAll('.mole');
const startGameBtn = document.querySelector('.btn');

const backgroundMusic = new Audio('audio/background_music_2.mp3')
const smack = new Audio('audio/smack.mp3')
const bossMusic = new Audio('audio/boss_music.mp3')
const gameOver = new Audio('audio/game_over.mp3')

// cursor
const cursor = document.querySelector('.cursor')

// boss
const boss1 = document.querySelector('.boss1')
const boss2 = document.querySelector('.boss2')

// Default values of timing
const timeBeforeFirstPartEnds = 62000
const warningTime = 5500

// Mole logic for first part

// Current difficulty
var minAppearTime = 700;
var maxAppearTime = 1500;
// Hardest difficulty possible
const lowestMinAppearTime = 200
const lowestMaxAppearTime = 700
// Difficulty multiplier
const difficultyMultiplier = 0.90

// Logic for second part
var spawnMoleRate = 1000

const lowestMoleRate = 100
const difficultyMultiplierBoss = 0.95

// current speed is 40s
const speedMultiplier = 0.96
const lowestSpeed = 10
var currentSpeed = 40;

var isSpawnMoles = true

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

// function randomMultipleHoles(holes) {
//     // multiple moles can spawn at the same time
//     const maxMoles = Math.floor(Math.random() * holes.length);
//     console.log(maxMoles)
// }

function peep() {
    const time = randomTime(minAppearTime, maxAppearTime);
    const hole = randomHole(holes);

    hole.classList.add('up');
    hole.children[0].style.visibility = "visible";
    setTimeout(() => {
        hole.classList.remove('up');
        hole.children[0].style.visibility = "hidden";
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    gameState = 1
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
        timeUp = true
        removeGamePage()
        showBossPage()
    }, timeBeforeFirstPartEnds)
}

function restartGame() {
    gameState = 1
    backgroundMusic.play()
    scoreBoard.textContent = 0;
    finalScore.textContent = 0;
    finalBossScore.textContent = 0;
    timeUp = false;
    score = 0;
    bossScore = 0
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
        removeEndPage()
        showGamePage()
        startGame()
    }, timeBeforeFirstPartEnds)
}

function startBossFight() {
    document.querySelector('.boss').classList.toggle('hide')
    document.body.classList.add('animate__animated', 'animate__shakeX')
    shakeBackground(0)

    setTimeout(() => {
        const inst = document.createElement('h1')
        inst.style.backgroundColor = 'white'
        inst.style.borderRadius = '10px'
        inst.textContent = "You killed her babies and now the Mole Witch wants revenge! Kill all the moles before you become mole-food!"

        inst.classList.add('boss-page-inst', 'animate__animated', 'animate__fadeIn')

        gameState = 3

        bossPage.append(inst)
        spawnMoles()
        const timer = document.querySelector('.time2');
        timer.classList.remove('hide')
        startTimer(30, timer);

        // End the game after 30s
        setTimeout(() => {
            bossMusic.pause()
            gameOver.play()
            removeBossPage()
            showEndPage()
            stopMoles()
        }, 32000)

    }, 4000)
}

function shakeBackground(iterations) {
    document.body.style.backgroundSize = '102%'
    setTimeout(() => {
        if (iterations < 7) {
            document.body.style.backgroundSize = '100%'
            setTimeout(() => {
                shakeBackground(iterations + 1)
                console.log(iterations)
            }, 50)
        }
    }, 50)
}

function hit(e) {
    if (!e.isTrusted) return; // cheater!
    score += 10;
    // Difficulty increase wrt to how many moles you hit
    minAppearTime = (minAppearTime - lowestMinAppearTime) * difficultyMultiplier + lowestMinAppearTime
    maxAppearTime = (maxAppearTime - lowestMaxAppearTime) * difficultyMultiplier + lowestMaxAppearTime
    // console.log(minAppearTime, maxAppearTime)

    this.classList.add('animate__zoomOutDown')
    setTimeout(() => {
        this.style.visibility = "hidden";
        this.parentNode.classList.remove('up');
        this.classList.remove('animate__zoomOutDown');
    }, 1500)

    scoreBoard.textContent = score;
    smack.cloneNode(true).play();
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

    // Warning comes here
    const warning = new Audio('audio/megaman_warning.mp3')
    backgroundMusic.pause()

    // wait for 2s and play warning sound
    setTimeout(() => {
        warning.play()
        document.querySelector('.warning').classList.toggle('hide')

        // After 4s, fade out the warning screen
        setTimeout(() => {
            warning.pause()
            document.querySelector('.warning').classList.add('animate__fadeOut')
            // display enraged boss
            setTimeout(() => {
                startBossFight()
                bossMusic.play()


            }, 2000)
        }, warningTime)
    }, 2000)


}

function stopMoles() {
    // clear all moles and stop them from spawning
    document.querySelectorAll('.mini-mole').forEach(mole => mole.remove())
    isSpawnMoles = false
}

function removeBossPage() {
    bossPage.classList.toggle('hide')
}

function showEndPage() {
    finalScore.textContent = score;
    finalBossScore.textContent = bossScore;
    endPage.classList.toggle('hide')
    gameState = 2
}

function removeEndPage() {
    endPage.classList.toggle('hide')
}

function recreateTimer(content = "01:00") {
    const timer = document.createElement('div')
    timer.textContent = content
    timer.classList.add('time')
    gamePage.prepend(timer)
    return timer
}

// Set the hammer to follow the mouse
window.addEventListener('mousemove', (e) => {
    // Only if game is started
    if (gameState === 1 || gameState === 3) {
        cursor.classList.remove('hide')
        cursor.style.top = e.clientY - 140 + "px";
        cursor.style.left = e.clientX + "px";
        document.body.style.cursor = "crosshair";
        cursor.style.visibility = "visible";
    } else {
        document.body.style.cursor = "inherit";
        cursor.style.visibility = "hidden";
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

        // if game state is 3 (at boss fight) then adjust difficulty every second
        if (gameState === 3) {
            adjustBossFightDifficulty()
        }
    }, 1000);
}

function adjustBossFightDifficulty() {
    spawnMoleRate = (spawnMoleRate ) * difficultyMultiplierBoss 

    var rs = getComputedStyle(root);
    const speed = rs.getPropertyValue('--speed')
    const speedInt = parseInt(speed.slice(0, -1))
    // console.log(speedInt);
    currentSpeed = (currentSpeed - lowestSpeed) * speedMultiplier + lowestSpeed
    const speedCss = currentSpeed + 's'
    // console.log(speedCss)

    root.style.setProperty('--speed', speedCss)

}

let root = document.querySelector(':root')

function bossMoleHit() {
    // play smack audio
    smack.cloneNode(true).play();
    // increase boss score
    bossScore += 100
    // display boss score as moles are hit
    bossPoints.textContent = bossScore
    bossPoints.classList.toggle('hide')
    setTimeout(() => {
        bossPoints.classList.toggle('hide')
    }, 300)
}


function createMole() {
    const divMole = document.createElement('div')
    divMole.classList.add('mini-mole', 'zoom-in-zoom-out')
    const topPosition = Math.random() * 100
    const leftPosition = Math.random() * 100
    divMole.style.top = topPosition + "%"
    divMole.style.left = leftPosition + "%"
    divMole.onclick = () => {
        divMole.remove()
        bossMoleHit()
    }
    document.body.append(divMole)
}

function spawnMoles() {
    setTimeout(() => {
        if (isSpawnMoles) {
            createMole()
            spawnMoles()
            console.log(spawnMoleRate)
        }
    }, spawnMoleRate)
}