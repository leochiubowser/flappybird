//Basic Setting

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.height = 500;
canvas.width = 410;
const ground = 450;
const gravity = 0.5;
var pressed = false;

var situation = {
    ready: true,
    start: false,
}

// Create Player

class Player {
    x = 175;
    y = 250;
    height = 25;
    width = 25;
    velocity = {
        x: 0,
        y: 1
    }

    draw() {
        ctx.fillRect(this.x, this.y, this.height, this.width);
    }
}





// Add Player
var player = new Player();


//Move & add gravity 

function move() {

    player.x += player.velocity.x;

    if (player.y + player.height + player.velocity.y <= ground) {

        if (pressed) {
            situation.ready = false;
            situation.start = true;
            if (player.y >= 0) {
                player.velocity.y = -8;
            }
        }
        else {
            player.velocity.y += gravity;
        }
        if (situation.start) {
            player.y += player.velocity.y;
        }
        pressed = false;
    }
    else {
        player.velocity.y = 0;
    }

}


//Draw

animation();

function animation() {
    requestAnimationFrame(animation);
    console.log(pressed);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    move();
    player.draw();
}

window.addEventListener("click", () => {
    pressed = true;
})