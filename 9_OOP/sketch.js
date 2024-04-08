let balls = [];

function setup() {
  let canvas = createCanvas(500, 400);
  canvas.parent("p5-canvas-container");
  background(220);

  for (let i = 0; i < 100; i++) {
    let x = width / 2;
    let y = height / 2;
    let dia = random(10, 50);
    balls.push(new Ball(x, y, dia));
  }
}

function draw() {
  background(220);

  for (let i = 0; i < balls.length; i++) {
    let b = balls[i]; // each ball
    b.move();
    b.display();
  }
}
//

class Ball {
  constructor(startX, startY, startDia) {
    this.x = startX;
    this.y = startY;
    this.xSpd = random(-3, 3);
    this.ySpd = random(-3, 3);
    this.dia = startDia;
  }
  move() {
    this.x += this.xSpd;
    this.y += this.ySpd;
  }
  display() {
    push();
    circle(this.x, this.y, this.dia);
    pop();
  }
}