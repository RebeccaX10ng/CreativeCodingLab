let angle = 0;
let angleDelta;
let radius;

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent("p5-canvas-container");
  background(0);
  frameRate(500)
  radius = random(20);
  angleDelta = random(1);
}

function draw() {

  let x = width / 2 + cos(angle) * radius;
  let y = height / 2 + sin(angle) * radius;
  stroke(random(255), random(200), map(angle, 0, 2 * PI, 0, 255));
  point(x, y);

  angle += angleDelta;
  radius += 0.01;
}
