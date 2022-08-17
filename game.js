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

class Player {
    x = 175;
    y = 250;
    height = 25;
    width = 25;
    gravity = 6;
    velocity = {
        x: 0,
        y: 1
    }

    draw() {
        ctx.fillRect(this.x, this.y, this.height, this.width);
    }
}

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
        pressed = false;
    }
    else {
        player.velocity.y = 0;
        situation.end = true;
    }

}

// Draw Background

const bg = document.getElementById("bg");
const base_source = document.getElementById("base");

var base1 = new Base(base_source, 0, 420);
var base2 = new Base(base_source, base1.x + base1.width, base1.y);
var base3 = new Base(base_source, base2.x + base2.width, base2.y);

var bases = [base1, base2, base3];


function drawBackground() {

    // Cloud & City
    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(bg, 288, 0);

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

    move();
    drawBackground();
    player.draw();

}

document.getElementById("body").addEventListener("click", () => {
    pressed = true;
})
document.getElementById("body").addEventListener("keydown", (e) => {
    if (e.keyCode = "32") {
        pressed = true;
    }
})