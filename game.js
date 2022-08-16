const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.height = 500;
canvas.width = 410;
const gravity = 1

// Add Player
var player = new Player();
animation();




//Draw
function animation() {
    requestAnimationFrame(animation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.draw();
}