let cam;
let img;
let fillColor = "#000000";
let fillColorBackground = "#FFFFFF";
let frozen = false;
let checked = false;

function setup() {
  let canvas = createCanvas(640, 640);
  canvas.parent("canvasContainer");
  // background(220);

  cam = createCapture(VIDEO, { flipped: true });
  cam.size(768, 640);
  cam.hide();
  img = createImage(768, 640); // blank image
  albumCheckBox = document.getElementById('showName');
  albumCheckBox.addEventListener('change', function () {
    checked = this.checked;
  });

  albumName = new AlbumName();
}

function draw() {

  background(fillColorBackground);

  //image(cam, 0, 0);
  cam.loadPixels();
  img.loadPixels();
  // now we can access the cam.pixels and img.pixels arrays!
  for (let y = 0; y < cam.height; y += 5) {
    for (let x = 0; x < cam.width; x += 5) {
      // access each pixel!
      let index = (x + y * cam.width) * 4;

      let r = cam.pixels[index + 0];
      let g = cam.pixels[index + 1];
      let b = cam.pixels[index + 2];
      let a = cam.pixels[index + 3];

      img.pixels[index + 0] = r * 1.0;
      img.pixels[index + 1] = g * 1.0;
      img.pixels[index + 2] = b * 1.0;
      img.pixels[index + 3] = 255;

      let meanValue = (r + g + b) / 3;
      if (meanValue >= 0) {
        fill(fillColor);
        noStroke();
        circle(x, y, 5 - map(meanValue, 0, 150, 0, 5))

        // let mappedValue = map(meanValue, 0, 255, 0, 6);
        // let mappedFloorValue = floor(mappedValue);
        // textSize(5);
        // text(mappedFloorValue, x, y);
      }
      // fill(255, g, b, a);
      // noStroke();
      // ellipse(x, y, 1);
    }
  }
  img.updatePixels();

  // image(img, 0, 0);
  if (checked) {
    albumName.display();
    albumName.update();
  }
}

let button = document.getElementById('capture');
button.addEventListener('click', function () {
  if (frozen) {
    loop();
  } else {
    noLoop();
  }
  frozen = !frozen;
  saveCanvas("MyAlbum.png");
});
const colorPicker = document.getElementById("color-picker");
colorPicker.addEventListener("input", function (event) {
  fillColor = this.value;
});
const colorPickerBackground = document.getElementById("color-picker-background");
colorPickerBackground.addEventListener("input", function (event) {
  fillColorBackground = this.value;
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
