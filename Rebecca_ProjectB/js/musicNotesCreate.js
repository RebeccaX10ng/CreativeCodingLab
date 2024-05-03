let notes = [];
let particleNum = 10;
let audioFiles = [];
function preload() {
    noteImg = loadImage("WhiteNotes.PNG")
    audioFiles[0] = loadSound("assets/Do.m4a")
    audioFiles[1] = loadSound("assets/Re.m4a")
    audioFiles[2] = loadSound("assets/Mi.m4a")
    audioFiles[3] = loadSound("assets/Fa.m4a")
    audioFiles[4] = loadSound("assets/So.m4a")
    audioFiles[5] = loadSound("assets/Ra.m4a")
    audioFiles[6] = loadSound("assets/Ti.m4a")
}
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("fullScreenContainer")
    for (let i = 0; i <= particleNum; i++) {
        notes[i] = new Notes(random(windowWidth), random(windowHeight))
    }

}

function draw() {
    clear();
    for (let i = 0; i <= particleNum; i++) {
        notes[i].display();
        notes[i].update();
    }

}

class Notes {
    constructor(startX, startY) {
        this.noteX = startX;
        this.noteY = startY;
        this.noteSpeedX = random(-10, 10);
        this.noteSpeedY = random(-10, 10);
        this.fillR = random(255);
        this.fillG = random(255);
        this.fillB = random(255);
        this.noteImage = noteImg;
        this.noteScale = random(0.05, 0.1);

        this.randomIndex = 0;
    }

    display() {
        push();
        translate(this.noteX, this.noteY);
        tint(this.fillR, this.fillG, this.fillB);
        image(this.noteImage, 0, 0, 519 * this.noteScale, 713 * this.noteScale)
        pop();
    }

    update() {
        this.noteX += this.noteSpeedX;
        this.noteY += this.noteSpeedY;


        if (this.noteX < 0 || this.noteX > width - this.noteImage.width * this.noteScale) {
            this.randomIndex = floor(random(audioFiles.length));
            if (audioFiles[this.randomIndex].isLoaded()) {
                audioFiles[this.randomIndex].play();
            }
            this.noteSpeedX *= -1;
        }
        if (this.noteY < 0 || this.noteY > height - this.noteImage.height * this.noteScale) {
            this.randomIndex = floor(random(audioFiles.length));
            if (audioFiles[this.randomIndex].isLoaded()) {
                audioFiles[this.randomIndex].play();
            }
            this.noteSpeedY *= -1;
        }
    }
}
function activateP5() {
    new p5();
}