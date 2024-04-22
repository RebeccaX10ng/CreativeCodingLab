

let vid;
let w = 128;
let h = 96;
let scl = 8;
let xOff = 0, yOff = 0;
let bounceX;
let bounceY;
let textSpdX = 3;
let textSpdY = 3;
let tintR;
let tintG;
let tintB;
let inputField;
let albumName = "Album Name";
let button = document.getElementById('capture');
function setup() {
  let canvas = createCanvas(h * scl, h * scl);
  canvas.parent("canvasContainer")
  // vid = createCapture(VIDEO);
  vid = createCapture(VIDEO, { flipped: true });
  vid.hide();
  vid.size(w, h);
  bounceX = random(width);
  bounceY = random(height);
  tintR = random(0.5, 1);
  tintG = random(0.5, 1);
  tintB = random(0.5, 1);
  button.addEventListener('click', function () {
    saveCanvas("MyAlbum.png");
  });
  inputField = document.getElementById("albumName");
  inputField.addEventListener("input", function () {
    albumName = inputField.value;
  })
}

function draw() {
  background(0);
  vid.loadPixels();
  push();
  for (let i = 0; i < vid.width; i++) {
    for (let j = 0; j < vid.height; j++) {
      let index = ((j * vid.width) + i) * 4;
      let r = vid.pixels[index + 0];
      let g = vid.pixels[index + 1];
      let b = vid.pixels[index + 2];
      let a = vid.pixels[index + 3];
      noStroke();
      fill(r * tintR, g * tintG, b * tintB);
      ellipse(i * scl, j * scl, scl, scl);
    }
  }
  pop();

  push();
  xOff = map(mouseX, 0, width, -100, 100);
  strokeWeight(400);
  noFill();
  circle(width / 2, height / 2, 1100);
  pop();

  push();
  fill(0);
  noStroke();
  circle(width / 2, height / 2, 200);
  pop();

  textSize(60);
  fill(255, 0, 0);
  textFont('Courier New');
  text(albumName, bounceX, bounceY);
  text(hour() + ":" + minute() + ":" + second(), 10, height - 20);

  bounceX += textSpdX;
  bounceY += textSpdY;

  if (bounceX <= 0 || bounceX >= width - 200) {
    textSpdX = -textSpdX;
  }
  if (bounceY <= 40 || bounceY >= height - 30) {
    textSpdY = -textSpdY;
  }
}

// function mousePressed() {
//   // saveCanvas();
// }
