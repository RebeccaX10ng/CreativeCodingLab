let img;
let cam;
let albumName;
let button;
let slider;

let parameter = 0.3;
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
  console.log(parameter);

  background(0);

  cam.loadPixels();
  img.loadPixels();

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;

      let r = cam.pixels[index + 0];
      let g = cam.pixels[index + 1];
      let b = cam.pixels[index + 2];

      let avg = (r + g + b) / 3;
      // let threshold = parameter; // play with this number
      if (avg > 255 * parameter) {

        img.pixels[index + 0] = 4; // R
        img.pixels[index + 1] = 100; // G
        img.pixels[index + 2] = 180; // B
        img.pixels[index + 3] = 255; // A
      } else {
        // black
        img.pixels[index + 0] = 0; // R
        img.pixels[index + 1] = 0; // G
        img.pixels[index + 2] = 0; // B
        img.pixels[index + 3] = 255; // A
      }
    }
  }

  img.updatePixels();
  image(img, 0, 0);
  push()
  stroke(0);
  strokeWeight(160);
  noFill();
  circle(width / 2, height / 2, 780);
  pop();

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
