const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.height = 500;
canvas.width = 410;
const ground = 450;
const gravity = 1;

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


//Add Gravity

function move() {

    player.x += player.velocity.x;

    if (player.y + player.height + player.velocity.y <= ground) {
        player.y += player.velocity.y;
        player.velocity.y += gravity;
    }
    else {
        player.velocity.y = 0;
    }

}


//Draw

animation();

function animation() {
    requestAnimationFrame(animation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    move();
    player.draw();
}