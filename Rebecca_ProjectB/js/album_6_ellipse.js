let img;
let cam;
let albumName;

let frozen;

function setup() {
  let canvas = createCanvas(640, 640);
  canvas.parent("canvasContainer");
  // background(220);

  cam = createCapture(VIDEO, { flipped: true });
  cam.size(768, 640);
  cam.hide();
  img = createImage(768, 640); // blank image
  albumName = new AlbumName();
}


function draw() {
  background(0);

  cam.loadPixels();
  img.loadPixels();

  for (let y = 0; y < img.height; y += 10) {
    for (let x = 0; x < img.width; x += 20) {
      let index = (x + y * img.width) * 4;

      let r = cam.pixels[index + 0];
      let g = cam.pixels[index + 1];
      let b = cam.pixels[index + 2];

      let avg = (r + g + b) / 3;
      let imgtTreshold = 0.27;
      if (avg > 255 * imgtTreshold) {
        img.pixels[index + 0] = r; // R
        img.pixels[index + 1] = g; // G
        img.pixels[index + 2] = b; // B
        img.pixels[index + 3] = 255; // A
      } else {
        img.pixels[index + 0] = 0; // R
        img.pixels[index + 1] = 0; // G
        img.pixels[index + 2] = 0; // B
        img.pixels[index + 3] = 255; // A
      }
      noStroke();
      fill(r, g, b);
      ellipse(x, y, 20, map(avg, 0, 255, 0, 10));
    }
    // img.updatePixels();
  }


  if (checked) {
    albumName.display();
    albumName.update();
  }
}

let checked = false;
let albumCheckBox = document.getElementById('showName');
albumCheckBox.addEventListener('change', function () {
  checked = this.checked;
});

let button = document.getElementById('capture');
button.addEventListener('click', function () {
  if (frozen) {
    loop();
  } else {
    saveCanvas("MyAlbum.png");
    noLoop();
  }
  frozen = !frozen;

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