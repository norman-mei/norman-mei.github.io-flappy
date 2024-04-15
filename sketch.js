let BACKGROUND_SCROLL_SPEED = .5
let BACKGROUND_LOOPING_PT = 413
let GROUND_SCROLL_SPEED = 1
let GROUND_LOOPING_SPEED = 438
let SPACE = 32
let bgScroll = 0
let groundScroll = 0
let spawnTimer = 0
let points = 0
let pipes = []
let gameState = "title"
let count = 3
let timer = 0
let bgImage, groundImage, birdImage, bird, pipeImage, pipe, lastY
let flappyFont, gameFont, explosion, jump, score, hurt, music
function preload() {
    bgImage = loadImage('graphics/background.png')
    groundImage = loadImage('graphics/ground.png')
    birdImage = loadImage('graphics/bird.png')
    pipeImage = loadImage('graphics/pipe.png')
    flappyFont = loadFont('fonts/flappy.ttf')
    gameFont = loadFont('fonts/font.ttf')
    jump = loadSound('sounds/jump.wav')
    score = loadSound('sounds/score.wav')
    explosion = loadSound('sounds/explosion.wav')
    hurt = loadSound('sounds/hurt.wav')
    music = loadSound('sounds/marios_way.mp3')
}
function setup() {
    createCanvas(800, 500);
    bird = new Bird(birdImage, width / (2 * 1.74) - birdImage.width / 2, height / (2 * 1.74) - birdImage.height / 2);
    lastY = random(150, 200)
    music.loop()
}
function title() {
    fill(255)
    textSize(28)
    textAlign(CENTER)
    textFont(flappyFont)
    text("Fifty Bird", width / (2 * 1.74), 100)
    textSize(14)
    text("Press Enter", width / (2 * 1.74), 130)
}
function displayPoints() {
    fill(255);
    textSize(32);
    textFont(flappyFont);
    textAlign(CENTER, TOP);
    text("Score: " + points, width / 10, 10);
}
function draw() {
    scale(1.74);
    noSmooth();
    image(bgImage, -bgScroll, 0);
    bgScroll = (bgScroll + BACKGROUND_SCROLL_SPEED) % BACKGROUND_LOOPING_PT;
    image(groundImage, -groundScroll, height / 1.74 - 16);
    groundScroll = (groundScroll + GROUND_SCROLL_SPEED) % GROUND_LOOPING_SPEED;
    if (gameState == "title") {
        title()
    }
    else if (gameState == "countdown") {
        countdown()
    }
    else if (gameState == "play") {
        play()
    }
    else if (gameState == "done") {
        done()
    }
}
function done() {
    fill(255)
    textSize(28)
    textAlign(CENTER)
    textFont(flappyFont)
    if (points > 0) {
        text("Good job!", width/(2 * 1.74), 100)
    }
    else {
        text("Lost.", width/(2 * 1.74), 100)
    }
    textSize(14)
    text("Score: " + points, width/(2 * 1.74), 150)
    text("Press ENTER to play again", width/(2 * 1.74), 200)
}
function play() {
    bird.display();
    bird.update();
    spawnTimer += 1 / 60;
    if (spawnTimer > 2) {
        let newPipe = new Pipe(pipeImage)
        newPipe.y = constrain(lastY + random(-20, 20), 100, 220);
        lastY = newPipe.y;
        pipes.push(Pipe);
        spawnTimer = 0;
    }
    for (let i = pipes.length - 1; i >= 0; i--) {
        let pipe = pipes[i];
        pipe.display();
        pipe.update();
        if (bird.collides(pipe)) {
            explosion.play()
            hurt.play()
            gameState = "done"
        }
        if (!pipe.scored) {
        if (pipe.x + pipe.width / 2 < bird.x) {
                 points++
                pipes.scored = true
                score.play()
            }
        }
        if (pipe.x + pipe.width < 0) {
            pipes.shift()
        }
    }
    displayPoints()
}
function countdown() {
    fill(255)
    textSize(56)
    textAlign(CENTER, CENTER)
    textFont(flappyFont)
    text(count, width/(2 * 1.74), height/(2 * 1.74))
    if (frameCount % 60 == 0) {
        count--
    }
    if (count == 0) {
        initializeGame();
        pipes = []
        count = 3
        gameState = "play";
    }
}
function initializeGame() {
    bird = new Bird(birdImage, width / (2 * 1.74) - birdImage.width / 2, height / (2 * 1.74) - birdImage.height / 2);
    pipes = [];
    spawnTimer = 0;
    gameState = "play";
}
function play() {
    bird.display();
    bird.update();
    spawnTimer += 1 / 60;
    if (spawnTimer > 2) {
        let newPipe = new Pipe(pipeImage)
        newPipe.y = constrain(lastY + random(-20, 20), 100, 220);
        lastY = newPipe.y;
        pipes.push(newPipe);
        spawnTimer = 0;
    }
    for (let i = pipes.length - 1; i >= 0; i--) {
        let pipe = pipes[i];
        if (pipe) {
            pipe.display();
            pipe.update();
        }
        if (bird.collides(pipe)) {
            explosion.play()
            hurt.play()
            gameState = "done"
        }
        if (!pipe.scored && pipe.x + pipe.width / 2 < bird.x) {
            points++;
            pipe.scored = true;
            score.play();
        }
        if (pipe.x + pipe.width < 0) {
            pipes.shift()
        }
    }
    displayPoints()
}
function keyPressed() {
    if (gameState == "play" && keyCode == SPACE) {
        bird.jump()
        jump.play()
    }
    if (keyCode == ENTER || keyCode == RETURN) {
        if (gameState == "title" || gameState == "done") {
            bird.reset(height / (2 * 1.74) - bird.height / 2)
            points = 0
            gameState = "countdown"
        }
    }
}
