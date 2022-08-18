//Basic Setting
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.height = 500;
canvas.width = 410;
const ground = 420;
const gravity = 0.3;
const bg_speed = 0.8;
var pressed = false;

var situation = {
    ready: true,
    start: false,
    end: false
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
    x = 175;
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
        up : 45,
        speed: 2,
        fall: 90
    }

    time = 0;

    draw() {

        // Collision
        // ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.save();

        if (situation.start && !situation.end) {
            if (pressed) {
                this.rotate = -this.rotateSetting.up;
            }
            else {
                if (this.rotate <= this.rotateSetting.fall)
                    this.rotate += this.rotateSetting.speed;
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
                player.velocity.y = -player.gravity;
            }
        }
        else if (situation.start) {
            player.velocity.y += gravity;
        }

        if (situation.start) {
            player.y += player.velocity.y;
        }
        player.draw();
        pressed = false;
    }
    else {
        player.velocity.y = 0;
        situation.end = true;
        player.draw();
    }

}

// Draw Background

const bg = document.getElementById("bg");


function drawBackground() {

    // Cloud & City
    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(bg, 288, 0);

}

const base_source = document.getElementById("base");

var base1 = new Base(base_source, 0, 420);
var base2 = new Base(base_source, base1.x + base1.width, base1.y);
var base3 = new Base(base_source, base2.x + base2.width, base2.y);

var bases = [base1, base2, base3];

function drawBase() {

    //Base

    for (i in bases) {

        if (!situation.end) {

            bases[0].x -= bg_speed;
            if (bases[1].x <= 0) {
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


// Draw

animation();

function animation() {
    requestAnimationFrame(animation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawBase();
    move();

}

// Detect pressed space or click the mouse
document.getElementById("body").addEventListener("click", () => {
    pressed = true;
})
document.getElementById("body").addEventListener("keydown", (e) => {
    if (e.keyCode = "32") {
        pressed = true;
    }
})