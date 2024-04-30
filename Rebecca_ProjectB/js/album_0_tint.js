let vid;
let w = 128;
let h = 96;
let scl = 8;
let xOff = 0, yOff = 0;
let tintR;
let tintG;
let tintB;
let albumName;
let button;
let frozen;
let checked = false;
function setup() {
  let canvas = createCanvas(640, 640);
  canvas.parent("canvasContainer");

  vid = createCapture(VIDEO, { flipped: true });
  vid.hide();
  vid.size(w, h);

  tintR = random(0.5, 1);
  tintG = random(0.5, 1);
  tintB = random(0.5, 1);
  albumCheckBox = document.getElementById('showName');
  albumCheckBox.addEventListener('change', function () {
    checked = this.checked;
  });
  albumName = new AlbumName();
}

function draw() {
  background(0);
  vid.loadPixels();
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
    push()
    stroke(0);
    strokeWeight(160);
    noFill();
    circle(width / 2, height / 2, 780);
    pop();
  }

  if (checked) {
    albumName.display();
    albumName.update();
  }
}
button = document.getElementById('capture');
button.addEventListener('click', function () {
  if (frozen) {
    loop();
  } else {
    noLoop();
  }
  frozen = !frozen;
  saveCanvas("MyAlbum.png");
});
class AlbumName {
  constructor() {
    this.bounceX = random(width);
    this.bounceY = random(height);
    this.textSpdX = 3;
    this.textSpdY = 3;
    this.nameR = random(255);
    this.nameG = random(255);
    this.nameB = random(255);
    this.albumName = "Album Name";
    this.inputField = document.getElementById("albumName");
    //push added text to albumName
    this.inputField.addEventListener("input", () => {
      this.albumName = this.inputField.value;
    });
  }

  display() {
    textSize(60);
    fill(this.nameR, this.nameG, this.nameB);
    textFont('Courier New');
    let constrainedX = constrain(this.bounceX, 0, width - textWidth(this.albumName));
    let constrainedY = constrain(this.bounceY, 60, height - 30);
    text(this.albumName, constrainedX, constrainedY);
    // text(this.albumName, this.bounceX, this.bounceY);
  }

  update() {
    this.bounceX += this.textSpdX;
    this.bounceY += this.textSpdY;

    if (this.bounceX <= 0 || this.bounceX >= width - textWidth(this.albumName)) {
      this.textSpdX = -this.textSpdX;
      this.nameR = random(255);
      this.nameG = random(255);
      this.nameB = random(255);
    }
    if (this.bounceY <= 0 || this.bounceY >= height - 25) {
      this.textSpdY = -this.textSpdY;
      this.nameR = random(255);
      this.nameG = random(255);
      this.nameB = random(255);
    }
  }
}