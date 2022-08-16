// Create Player

class Player {
    x = 175;
    y = 250;
    height = 25;
    width = 25;
    velocity = 1;

    draw() {
        ctx.fillRect(this.x, this.y, this.height, this.width);
    }
}

