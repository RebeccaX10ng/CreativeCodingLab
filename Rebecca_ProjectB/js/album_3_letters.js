let cam;
let img;
let character;
let textscale = 10;
let albumName;
function setup() {
  let canvas = createCanvas(640, 640);
  canvas.parent("canvasContainer");
  // background(220);

  cam = createCapture(VIDEO, { flipped: true });
  cam.size(768, 640);
  cam.hide();
  img = createImage(768, 640); // blank image

  button = document.getElementById('capture');
  button.addEventListener('click', function () {
    saveCanvas("MyAlbum.png");
  });

  albumName = new AlbumName();
}


function draw() {
  background(0);
  //image(cam, 0, 0);
  cam.loadPixels();
  img.loadPixels();
  // now we can access the cam.pixels and img.pixels arrays!
  for (let y = 0; y < cam.height; y += textscale) {
    for (let x = 0; x < cam.width; x += textscale * 0.5) {
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
      // if (meanValue >= 75) {
      push()
      translate(x, y);

      fill(0, 255, 115);
      // noStroke();
      // triangle(-1.73, -1, 0, 1.73, 1.73, -1)
      // circle(x, y, 5 - map(meanValue, 0, 150, 0, 5))

      let mappedValue = map(meanValue, 0, 255, 0, 1);
      let mappedFloorValue = floor(mappedValue);
      textSize(textscale * 0.9);
      if (meanValue <= 60) {
        character = "*";
      } else if (meanValue > 60 && meanValue <= 120) {
        character = "1";
      } else if (meanValue > 120 && meanValue <= 180) {
        character = "0";
      }
      text(character, 0, 0);
      pop()
      // }
      // fill(255, g, b, a);
      // noStroke();
      // ellipse(x, y, 1);

    }
  }
  img.updatePixels();
  albumName.display();
  albumName.update();

  // image(img, 0, 0);
}
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