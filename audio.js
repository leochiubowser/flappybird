//Auido 


var point = new Audio();
point.src = "./audio/point.wav";

var ouch = new Audio();
ouch.src = "./audio/hit.wav";

var fly = new Audio();
fly.src = "./audio/wing.wav";

var die = new Audio();
die.src = "./audio/die.wav";

var originScore = 0;

function playAudio() {
    if (situation.start && pressed && !situation.end)
        fly.play();

    if (ouchSound && situation.end) {
        ouch.play();
        ouchSound = false;
    }
    if (dieSound && playdiesound) {
        die.play();
        dieSound = false;
    }
    if (score != originScore) {
        point.play();
        originScore = score;
    }
}