let NUM_OF_PARTICLES = 0;
let particles = [];
let ranCharacter = ["!", "@", "#", "$", "%", "*", "+", ""];
let penSize = 40;
let textOffset = 40;
let pointPos = [];
function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < NUM_OF_PARTICLES; i++) {
    particles[i] = new Particle(random(width), random(height));
  }
  for (let i = 0; i <= width; i++) {
    pointPos[i] = [];
    for (let lineY = 60; lineY <= height; lineY += 60) {
      let pointY = noise(0.2 * i) * 3;
      pointPos[i].push(createVector(i, lineY + pointY));
    }
  }
}

function draw() {
  background(255);
  textFont("Courier New");
  for (let i = 0; i < pointPos.length; i++) {
    for (let j = 0; j < pointPos[i].length; j++) {
      let pointCoord = pointPos[i][j];
      point(pointCoord.x, pointCoord.y);

    }
  }
  textSize(penSize);
  // fill()
  textAlign(CENTER);
  text("✒", mouseX, mouseY);
  //check distance
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let tooClose = false;
    for (let j = 0; j < pointPos.length; j++) {
      for (let k = 0; k < pointPos[j].length; k++) {
        let distToPoint = dist(p.x, p.y, pointPos[j][k].x, pointPos[j][k].y);
        if (distToPoint < 5) {
          tooClose = true;
          break;
        }
      }
      if (tooClose) {
        p.controlSpeed();
      }
    }

    p.update();
    p.display();
    if (this.spdX <= 10) {
      p.regrowSpeed();
    }
    if (mouseIsPressed) {
      if (mouseButton === RIGHT) {
        p.controlSpeed();
      }
    }
  }

  if (mouseIsPressed) {
    if (mouseButton === LEFT) {
      particles.push(new Particle(mouseX + textOffset, mouseY));
    }
  }
  // console.log(particles.length);
  if (particles.length >= 300) {
    particles.splice(0, 1);
  }
}

function keyPressed() {
  if (key == " ") {
    penSize++;
    textOffset++;
    for (let i = 0; i < particles.length; i++) {
      particles[i].increaseSize();
    }
  }
  if (keyCode === UP_ARROW) {
    for (let i = 0; i < particles.length; i++) {
      particles[i].moveUpward();
    }
  }
}

class Particle {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.dia = 30;
    this.posX = startX;
    this.posY = startY;
    this.spdX = random(-1, 1);
    this.spdY = random(2);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.size = random(15, 30);
    this.character = ranCharacter[floor(random(ranCharacter.length - 1))];
  }

  controlSpeed() {
    this.spdX *= 0.95;
    this.spdY *= 0.95;
    // console.log(this.spdX);
  }
  moveUpward() {
    this.spdX = 0;
    this.spdY = -1;
  }

  regrowSpeed() {
    if (
      this.posX + this.x >= 0 &&
      this.posY + this.y >= 0 &&
      this.posX + this.x <= width &&
      this.posY + this.y <= height
    ) {
      this.spdX += random(0.5);
      this.spdY += random(0.5);
    }
  }

  increaseSize() {
    this.size *= 1.05;
  }

  update() {
    this.x += this.spdX;
    this.y += this.spdY;
    if (this.x >= width - 10 || this.x <= 10) {
      this.spdX *= -0.95;
      this.spdY *= -0.95;
    }
    if (this.y >= height - 10 || this.y <= 10) {
      this.spdY *= -0.95;
      this.spdX *= -0.95;
    }

  }

  display() {
    push();
    translate(this.x, this.y);
    fill(this.r, this.g, this.b);
    textSize(this.size);
    text(this.character, 0, 0);
    pop();
  }
}
