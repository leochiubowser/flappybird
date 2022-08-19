//Basic Setting
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.height = 500;
canvas.width = 410;
const ground = 420;
const gravity = 0.3;
const bg_speed = 0.68;
var touch_ground = false;
var resetmouse = true;
var resetSpace = false;
var pressed = false;
var passDelay = 0;
var score = 0;
var ouchSound = true;
var playdiesound = false;
var dieSound = true;

var situation = {
    ready: true,
    start: false,
    end: false
};

var input = {
    x: canvas.width / 2,
    y: canvas.width / 2,
}


// Create Player

var playerImages_source = ["./image/yellowbird-upflap.png", "./image/yellowbird-midflap.png",
    "./image/yellowbird-downflap.png"];

var playerImages = [];

for (var i = 0; i < 3; i++) {
    playerImages[i] = new Image();
    playerImages[i].src = playerImages_source[i];
}


class Player {
    x = 160;
    y = 250;
    height = 25;
    width = 30;
    gravity = 6;
    velocity = {
        x: 0,
        y: 1
    }
    rotate = 0;
    modeling = 0;
    modeling_up = true;
    rotateSetting = {
        up: 30,
        speed: 4,
        fall: 90,
        time: 0
    }

    time = 0;

    draw() {

        // Collision
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        this.rotateSetting.time += 1;

        ctx.save();

        if (score >= 50) {
            passDelay += 1;
            if (passDelay < 60 * 3) {
                player.velocity.y = -player.gravity;
            }
        }

        if (pressed) {
            if (situation.start && !situation.end) {
                this.rotate = -this.rotateSetting.up;
                this.rotateSetting.time = 0;
            }
        }
        else {
            if (situation.start) {
                if (this.rotate < this.rotateSetting.fall) {
                    if (this.rotateSetting.time > 25) {
                        this.rotate += this.rotateSetting.speed;
                    }
                }
            }
        }


        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotate * Math.PI / 180);

        if (situation.start && !situation.end) {
            this.time += 1;
            switch (this.modeling) {
                case 0:
                    if (this.time > 10) {
                        this.time = 0;
                        this.modeling = 1;
                        this.modeling_up = true;
                    }
                    break;
                case 1:
                    if (this.time > 10) {
                        this.time = 0;
                        if (this.modeling_up) {
                            this.modeling = 2;
                        }
                        else {
                            this.modeling = 0;
                        }
                    }
                case 2:
                    if (this.time > 10) {
                        this.time = 0;
                        this.modeling = 1;
                        this.modeling_up = false;

                    }
            }
            ctx.drawImage(playerImages[this.modeling], -this.width / 2, -this.height / 2);
        }
        else if (!situation.start && !situation.end) {
            ctx.drawImage(playerImages[1], -this.width / 2, -this.height / 2);
        }
        else if (situation.end) {
            ctx.drawImage(playerImages[this.modeling], -this.width / 2, -this.height / 2);
        }

        ctx.restore();

    }
}



// Create Base

class Base {
    constructor(base, x, y) {
        this.x = x;
        this.y = y;
        this.base = base;
    }
    width = 336;
    height = 112;
}



// Add Player
var player = new Player();


//Move & add gravity 

function move() {

    player.x += player.velocity.x;

    if (player.y + player.height + player.velocity.y <= ground) {

        if (pressed) {
            situation.start = true;
            if (player.y >= 0 && !situation.end) {
                if (score < 50) {
                    player.velocity.y = -player.gravity;
                }
            }
        }
        else if (situation.start) {
            player.velocity.y += gravity;
        }

        if (situation.start) {
            player.y += player.velocity.y;
        }
        player.draw();
        playAudio();
        pressed = false;
    }
    else {
        player.velocity.y = 0;
        situation.end = true;
        touch_ground = true;

        if (resetmouse) {
            input.x = 0;
            input.y = 0;
            resetmouse = false;
        }
        playAudio();
        player.draw();
    }

}

// Draw Background

const bg = new Image();
bg.src = "./image/background-day.png";


function drawBackground() {

    // Cloud & City
    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(bg, 288, 0);

}

const base_source = new Image();
base_source.src = "./image/base.png";

var base1 = new Base(base_source, 0, 420);
var base2 = new Base(base_source, base1.x + base1.width, base1.y);
var base3 = new Base(base_source, base2.x + base2.width, base2.y);

var bases = [base1, base2, base3];

function drawBase() {

    //Base

    for (i in bases) {

        if (!situation.end) {

            bases[0].x -= bg_speed;
            if (bases[1].x - bg_speed <= 0) {
                bases[0].x = 0;
            }

            if (i > 0) {
                bases[i].x = bases[i - 1].x + bases[i - 1].width;
            }
            ctx.drawImage(bases[i].base, bases[i].x, bases[i].y);
        }
        else {
            if (i > 0) {
                bases[i].x = bases[i - 1].x + bases[i - 1].width;
            }
            ctx.drawImage(bases[i].base, bases[i].x, bases[i].y)
        }
    }
}

// Pipe

var pipe_source = new Image();
pipe_source.src = "./image/pipe-green.png";

class Pipe {
    constructor(x, flipY, i) {
        this.flipY = flipY;
        this.x = x;
        this.pipe_range = Math.round(Math.random() * (pipeSetting.less - pipeSetting.big) + pipeSetting.big);
        if (flipY) {
            this.y = pipes[i - 1].pipe_range - pipeSetting.pipe_interval;
        }
        else {
            this.y = this.pipe_range;
        }
    }
    addPoint = false;
    height = 320;
    width = 52;
}

var pipes = [];

var pipeSetting = {
    city: 388,
    base: 112,
    less: 370,
    big: 150,
    randomRange: 220,
    pipe_interval: 120,
    pipeX: 1000,
    pipeSpeed: 2,
    pipe_add: 100

}

const pipesInterval = 210;

function createPipe(r) {
    for (var i = r; i < r + pipeSetting.pipe_add; i++) {
        if (i == 0) {
            // The first pipe
            pipes[i] = new Pipe(pipeSetting.pipeX, false, i);
        }
        else {
            if (i % 2 == 0) {
                // 2 ,4 ,6, 8, 10
                pipes[i] = new Pipe(pipes[i - 1].x + pipesInterval, false, i);
            }
            else {
                // 1, 3, 5, 7 ,9
                pipes[i] = new Pipe(pipes[i - 1].x, true, i);
            }
        }
    }
}



createPipe(0);


function drawPipe() {


    if (situation.start && !situation.end) {
        pipeSetting.pipeX -= pipeSetting.pipeSpeed;
    }

    for (let i in pipes) {
        if (i == 0) {
            // The first pipe
            pipes[i].x = pipeSetting.pipeX;
        }
        else {
            if (i % 2 == 0) {
                // 2 ,4 ,6, 8, 10
                pipes[i].x = pipes[i - 1].x + pipesInterval;
            }
            else {
                // 1, 3, 5, 7 ,9
                pipes[i].x = pipes[i - 1].x;
            }
        }
    }


    for (var i = 0; i < pipes.length; i++) {
        if (pipes[i].flipY == false) {
            if (pipes[i].x >= -100 && pipes[i].x <= canvas.width + 100) {
                ctx.drawImage(pipe_source, pipes[i].x, pipes[i].y)
            }
        }
        else {
            if (pipes[i].x >= -100 && pipes[i].x <= canvas.width + 100) {
                ctx.save();
                ctx.scale(1, -1);
                ctx.drawImage(pipe_source, pipes[i].x, -pipes[i].y);
                ctx.restore();
            }
        }
    }
}


// Collision

function collision() {

    for (i in pipes) {
        if (pipes[i].x >= -100 && pipes[i].x <= canvas.width + 100) {
            if (!pipes[i].flipY) {
                if (player.x > pipes[i].x) {
                    if (pipes[i].addPoint == false) {
                        score++;
                        pipes[i].addPoint = true;
                    }
                }
                if (player.x + player.width >= pipes[i].x && player.x <= pipes[i].x + pipes[i].width &&
                    player.y <= pipes[i].y + pipes[i].height && player.y + player.height >= pipes[i].y) {
                    if (score != 50) {
                        situation.end = true;
                        playdiesound = true;
                    }
                }
            }
            else {
                if (player.x + player.width >= pipes[i].x && player.x <= pipes[i].x + pipes[i].width &&
                    player.y <= pipes[i].y) {
                    if (score != 50) {
                        situation.end = true;
                        playdiesound = true;
                    }
                }
            }
        }
    }


}

// End & Restart


var reStartImage = new Image();
reStartImage.src = "./image/gameover.png";
var scoreImage = new Image();
scoreImage.src = "./image/score.png";
var RestartButton = new Image();
RestartButton.src = "./image/restart.png";
function reStart() {
    const resbun = {
        x: 152,
        y: 351,
        width: 214 / 2,
        height: 75 / 2,
    }


    if (situation.end && touch_ground) {
        ctx.drawImage(reStartImage, canvas.width / 2 - reStartImage.width / 2, canvas.height / 2 - 150);
        ctx.drawImage(scoreImage, canvas.width / 2 - scoreImage.width / 3, canvas.height / 2 - scoreImage.height / 3,
            scoreImage.width / 1.5, scoreImage.height / 1.5);
        ctx.drawImage(RestartButton, canvas.width / 2 - reStartImage.width / 4 - 5, canvas.height / 2 - RestartButton.height / 4 + 120,
            RestartButton.width / 2, RestartButton.height / 2);
        if (input.x >= resbun.x && input.x <= resbun.x + resbun.width &&
            input.y >= resbun.y && input.y <= resbun.y + resbun.height || resetSpace) {
            init();
        }
    }

}


// Show Score 

const score_path = ["./image/0.png", "./image/1.png", "./image/2.png", "./image/3.png", "./image/4.png"
    , "./image/5.png", "./image/6.png", "./image/7.png", "./image/8.png", "./image/9.png"];
var score_nums = [];

for (let i = 0; i < 10; i++) {
    score_nums[i] = new Image();
    score_nums[i].src = score_path[i];
}





function showscore() {
    if (situation.start && !situation.end) {
        if (score < 10) {
            ctx.drawImage(score_nums[score], canvas.width / 2 - score_nums[score].width / 2, canvas.height / 10);
        }
        else {
            var ten = score.toString();
            ten = ten.substring(0, 1);
            ten = parseInt(ten);
            var one = score.toString();
            one = one.substring(1);
            one = parseInt(one);
            ctx.drawImage(score_nums[ten], canvas.width / 2 - score_nums[ten].width / 2 - 13, canvas.height / 10);
            ctx.drawImage(score_nums[one], canvas.width / 2 - score_nums[one].width / 2 + 13, canvas.height / 10);

        }
    }
    else if (situation.end && touch_ground) {
        //end score
        if (score < 10) {
            ctx.drawImage(score_nums[score], canvas.width / 2 - score_nums[score].width / 3, canvas.height / 2 - 30,
                score_nums[score].width / 1.5, score_nums[score].height / 1.5);
        }
        else {
            ten = score.toString();
            ten = ten.substring(0, 1);
            ten = parseInt(ten);
            one = score.toString();
            one = one.substring(1);
            one = parseInt(one);
            ctx.drawImage(score_nums[ten], canvas.width / 2 - score_nums[ten].width / 3 - 10, canvas.height / 2 - 30,
                score_nums[ten].width / 1.5, score_nums[ten].height / 1.5);
            ctx.drawImage(score_nums[one], canvas.width / 2 - score_nums[one].width / 3 + 10, canvas.height / 2 - 30,
                score_nums[one].width / 1.5, score_nums[one].height / 1.5);
        }

        //best score
        var bestScore = localStorage.getItem("bestscore");
        if (bestScore == null || bestScore == NaN) {
            localStorage.setItem("bestscore", score.toString());
            bestScore = score;
        }
        else if (score > bestScore) {
            bestScore = parseInt(bestScore);
            bestScore = score;
            localStorage.setItem("bestscore", bestScore);
        }
        else if (score <= bestScore) {
            bestScore = parseInt(bestScore);
        }


        if (bestScore < 10) {
            ctx.drawImage(score_nums[bestScore], canvas.width / 2 - score_nums[bestScore].width / 3, canvas.height / 2 + 30,
                score_nums[bestScore].width / 1.5, score_nums[bestScore].height / 1.5);
        }
        else {
            ten = bestScore.toString();
            ten = ten.substring(0, 1);
            ten = parseInt(ten);
            one = bestScore.toString();
            one = one.substring(1);
            one = parseInt(one);
            ctx.drawImage(score_nums[ten], canvas.width / 2 - score_nums[ten].width / 3 - 10, canvas.height / 2 + 30,
                score_nums[ten].width / 1.5, score_nums[ten].height / 1.5);
            ctx.drawImage(score_nums[one], canvas.width / 2 - score_nums[one].width / 3 + 10, canvas.height / 2 + 30,
                score_nums[one].width / 1.5, score_nums[one].height / 1.5);
        }
    }
}




//initlization game

function init() {
    situation = {
        ready: true,
        start: false,
        end: false
    }
    player.x = 175;
    player.y = 250;

    player.velocity = {
        x: 0,
        y: 1
    }
    player.modeling = 0;
    player.modeling_up = true;
    player.time = 0;
    player.rotate = 0;
    pipes = [];
    pipeSetting.pipeX = 1000;
    touch_ground = false;
    resetmouse = true;
    resetSpace = false;
    score = 0;
    passDelay = 0;
    ouchSound = true;
    dieSound = true;
    playdiesound = false;
    originScore = 0;
    createPipe(0);
}


animation();

function animation() {
    requestAnimationFrame(animation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawPipe();
    drawBase();
    move();
    collision();
    reStart();
    showscore();
}

// Detect pressed space or click the mouse
document.querySelector("body").addEventListener("click", (e) => {
    fly.play();
    input.x = e.offsetX;
    input.y = e.offsetY;
    pressed = true;
})
document.querySelector("body").addEventListener("keydown", () => {
    pressed = true;

    if (touch_ground) {
        resetSpace = true;
    }
})

