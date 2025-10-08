let vid;
let frozenImage;
let frozen = false;
let clickCount = 0;
let rotationAngle = 0;
let mic, recorder, soundFile, isRecording = false;
let albumName, checked = false;
let oswald;
let tintR, tintG, tintB;
let tintScl = 8;

function preload() {
  oswald = loadFont('assets/oswald.ttf');
  mask = loadImage('assets/cover.png');
}

function setup() {
  let canvas = createCanvas(640, 640);
  canvas.parent("canvasContainer");

  vid = createCapture(VIDEO, { flipped: true });
  vid.hide();
  vid.size(128, 96);

  tintR = random(0.5, 1);
  tintG = random(0.5, 1);
  tintB = random(0.5, 1);

  getAudioContext().suspend();
  mic = new p5.AudioIn();
  mic.start();
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  soundFile = new p5.SoundFile();
  albumName = new AlbumName();
  document.getElementById('showName').addEventListener('change', (e) => checked = e.target.checked);
}

function draw() {
  if (frozen) {
    rotateCanvas();
    return;
  }
  background(0);
  vid.loadPixels();
  for (let i = 0; i < vid.width; i++) {
    for (let j = 0; j < vid.height; j++) {
      let index = (i + j * vid.width) * 4;
      let r = vid.pixels[index], g = vid.pixels[index + 1], b = vid.pixels[index + 2];
      noStroke();
      fill(r * tintR, g * tintG, b * tintB);
      ellipse(i * tintScl, j * tintScl, tintScl, tintScl);
    }
  }
  push();
  stroke(150, 255, 210);
  strokeWeight(160);
  noFill();
  circle(width / 2, height / 2, 780);
  pop();

  if (checked) {
    albumName.display();
    albumName.update();
  }
}


function toggleFreeze() {
  clickCount++;
  const button = document.getElementById("capture");
  if (clickCount % 2 === 1) {
    frozenImage = createCircularTransparentImage();
    frozen = true;
    button.innerHTML = "Resume";
  } else {
    frozen = false;
    rotationAngle = 0;
    frozenImage = null;
    button.innerHTML = "Freeze Image";
  }
}
function createCircularTransparentImage() {
  let currentCanvasImage = get();
  // currentCanvasImage.mask(mask);
  return currentCanvasImage;
}
function rotateCanvas() {
  //add a rotating record in the background
  let recordRotate = sin(millis() / 100) / 50;
  background(150, 255, 210);
  fill(50);
  circle(width / 2, height / 2, 640);
  fill(70);
  arc(width / 2, height / 2, 640, 640, 0 + recordRotate, PI / 6 + recordRotate);
  arc(width / 2, height / 2, 640, 640, PI + recordRotate, PI * 7 / 6 + recordRotate);
  fill(200);
  arc(width / 2, height / 2, 640, 640, PI / 20 + recordRotate, PI / 10 + recordRotate);
  arc(width / 2, height / 2, 640, 640, PI + PI / 20 + recordRotate, PI + PI / 10 + recordRotate);
  push();
  scale(1 + sin(millis() / 100) / 500);
  stroke(0); noFill();
  circle(width / 2, height / 2, 570);
  circle(width / 2, height / 2, 550);
  circle(width / 2, height / 2, 450);
  circle(width / 2, height / 2, 400);
  fill(50);
  circle(width / 2, height / 2, 320);
  pop();
  //draw the frozen image in the center with rotation
  push();
  imageMode(CENTER);
  translate(width / 2, height / 2);
  rotate(rotationAngle);
  scale(0.5);
  // let newImage = frozenImage.mask(mask);
  image(frozenImage, 0, 0);
  rotationAngle += 0.01;
  pop();
}


function saveLocalImage() {
  if (frozenImage) { save(frozenImage, "MyAlbum.png"); }
  else { alert("Please freeze an image first!"); }
}

function startRecording() {
  userStartAudio();
  const recordButton = document.getElementById('record');
  if (!isRecording) {
    recordButton.disabled = true;
    recordButton.innerHTML = "Starting...";
    setTimeout(() => {
      recorder.record(soundFile);
      isRecording = true;
      recordButton.innerHTML = "Stop Recording";
      setTimeout(() => recordButton.disabled = false, 900);
    }, 100);
  } else {
    recorder.stop();
    isRecording = false;
    recordButton.innerHTML = "Record Audio";
  }
}

function playRecording() {
  if (soundFile.isPlaying()) { soundFile.stop(); }
  else { soundFile.play(); }
}

function saveAudioRecording() {
  saveSound(soundFile, 'myRecording.wav');
}

function isPureAscii(str) {
  return /^[\x00-\x7F]*$/.test(str);
}


function startRecording() {
  userStartAudio();

  const recordButton = document.getElementById('record');

  if (!isRecording) {
    recordButton.disabled = true;
    recordButton.innerHTML = "Starting...";

    setTimeout(() => {
      recorder.record(soundFile);
      isRecording = true;
      console.log("Recording has started.");

      recordButton.innerHTML = "Stop Recording";
      setTimeout(() => {
        recordButton.disabled = false;
      }, 900);

    }, 100);

  } else {
    recorder.stop();
    isRecording = false;
    recordButton.innerHTML = "Record Audio";
    console.log("Recording has stopped.");
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


function isPureAscii(str) {

  return /^[\x00-\x7F]*$/.test(str);
}
class AlbumName {
  constructor() {
    this.bounceX = random(width);
    this.bounceY = random(height);
    this.textSpdX = 6;
    this.textSpdY = 6;
    this.nameR = random(255);
    this.nameG = random(255);
    this.nameB = random(255);
    this.albumName = "Album Name";
    this.inputField = document.getElementById("albumName");
    this.inputField.addEventListener("input", () => {
      this.albumName = this.inputField.value;
    });
  }

  display() {
    textSize(60);
    fill(this.nameR, this.nameG, this.nameB);
    if (isPureAscii(this.albumName)) {
      textFont(oswald);
    } else {
      textFont('Ariel');
    }
    text(this.albumName, this.bounceX, this.bounceY);
  }

  update() {
    this.bounceX += this.textSpdX;
    this.bounceY += this.textSpdY;
    const rightBoundary = width - textWidth(this.albumName);
    const leftBoundary = 0;
    const bottomBoundary = height - 30;
    const topBoundary = 60;

    let hitEdge = false;

    if (this.bounceX >= rightBoundary) {
      this.bounceX = rightBoundary;
      this.textSpdX *= -1;
      hitEdge = true;
    } else if (this.bounceX <= leftBoundary) {
      this.bounceX = leftBoundary;
      this.textSpdX *= -1;
      hitEdge = true;
    }
    if (this.bounceY >= bottomBoundary) {
      this.bounceY = bottomBoundary;
      this.textSpdY *= -1;
      hitEdge = true;
    } else if (this.bounceY <= topBoundary) {
      this.bounceY = topBoundary;
      this.textSpdY *= -1;
      hitEdge = true;
    }
    if (hitEdge) {
      this.nameR = random(255);
      this.nameG = random(255);
      this.nameB = random(255);
    }
  }
}