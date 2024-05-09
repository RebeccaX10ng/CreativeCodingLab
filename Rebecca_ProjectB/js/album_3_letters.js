let cam;
let img;
let character;
let textscale = 15;
let albumName;
let parameter = 1;

//2024.5.3 Modified Version
let frozenImage;
let frozen = false;
let rotationAngle = 0;
let clickCount = 0;

let recordButton;
let playButton;
let saveButton;
let mic;
let recorder;
let soundFile;
let isRecording = false;
function setup() {
  let canvas = createCanvas(640, 640);
  canvas.parent("canvasContainer");
  // background(220);

  cam = createCapture(VIDEO, { flipped: true });
  cam.size(768, 640);
  cam.hide();
  img = createImage(768, 640); // blank image


  albumName = new AlbumName();

  //2024.5.6 Modified version
  mic = new p5.AudioIn();
  mic.start();

  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  soundFile = new p5.SoundFile();
}

slider = document.getElementById("slider");
slider.addEventListener("input", updateVariable, false);

function draw() {
  background(0);
  //image(cam, 0, 0);
  cam.loadPixels();
  img.loadPixels();
  // now we can access the cam.pixels and img.pixels arrays!
  textFont('Courier New');
  for (let y = 0; y < cam.height; y += 12) {
    for (let x = 0; x < cam.width; x += 8) {
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
      textSize(textscale * 0.9 * parameter);
      if (meanValue <= 60) {
        character = ".";
      } else if (meanValue > 60 && meanValue <= 120) {
        character = "1";
      } else if (meanValue > 120 && meanValue <= 150) {
        character = "0";
      } else if (meanValue > 150 && meanValue <= 255) {
        character = "&";
      }
      text(character, 0, 0);
      pop()

      // }
      // fill(255, g, b, a);
      // noStroke();
      // ellipse(x, y, 1);

    }
  }
  push()
  stroke(0);
  strokeWeight(160);
  noFill();
  circle(width / 2, height / 2, 780);
  pop();
  img.updatePixels();

  // image(img, 0, 0);
  if (checked) {
    albumName.display();
    albumName.update();
  }
  if (frozen) {
    rotateCanvas();
  }
}

button = document.getElementById('capture');
button.addEventListener('click', function () {
  clickCount++;
  if (clickCount % 2 === 1) {
    frozenImage = get();
    frozen = true;
    saveCanvas("MyAlbum.png");
  }
  else {

    frozen = false;
    rotationAngle = 0;
  }

});
function rotateCanvas() {
  translate(width / 2, height / 2);
  rotate(rotationAngle);
  background(0);
  image(frozenImage, -width / 2, -height / 2);
  rotationAngle += 0.01;
}

let checked = false;
let albumCheckBox = document.getElementById('showName');
albumCheckBox.addEventListener('change', function () {
  checked = this.checked;
});

function updateVariable() {
  parameter = slider.value;
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
function startRecording() {
  if (!isRecording) {
    isRecording = true;
    userStartAudio();
    console.log("start recording")
    recorder.record(soundFile);
  } else {
    isRecording = false;
    console.log("stop recording")
    recorder.stop();
  }
}


function playRecording() {
  if (soundFile.isPlaying()) {
    soundFile.stop();
  } else {
    soundFile.play();
  }
}


function saveAudioRecording() {
  saveSound(soundFile, 'myRecording.wav');
}
