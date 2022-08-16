const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.height = 500;
canvas.width = 410;
const ground = 450;
const gravity = 1;

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