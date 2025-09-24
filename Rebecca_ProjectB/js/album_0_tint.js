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

let checked = false;

//2024.5.3 Modified Version
let frozenImage;
let frozen = false;
let rotationAngle = 0;
let clickCount = 0;
//2024.5.6 Modified Version
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

  vid = createCapture(VIDEO, { flipped: true });
  vid.hide();
  vid.size(w, h);

  getAudioContext().suspend();

  tintR = random(0.5, 1);
  tintG = random(0.5, 1);
  tintB = random(0.5, 1);
  albumCheckBox = document.getElementById('showName');
  albumCheckBox.addEventListener('change', function () {
    checked = this.checked;
  });
  albumName = new AlbumName();

  //2024.5.6 Modified version
  mic = new p5.AudioIn();
  mic.start();

  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  soundFile = new p5.SoundFile();

  // recordButton = document.getElementById('record');
  // recordButton.addEventListener('click', startRecording);

  // playButton = document.getElementById('play');
  // playButton.addEventListener('click', playRecording);

  // saveButton = document.getElementById('save');
  // saveButton.addEventListener('click', saveAudioRecording);
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

  }
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

function toggleFreeze() {
  clickCount++;
  const button = document.getElementById("capture");
  if (clickCount % 2 === 1) {
    frozenImage = get(); // 从画布获取图像并存入全局变量 frozenImage
    frozen = true;
    button.innerHTML = "Resume";
  } else {
    frozen = false;
    rotationAngle = 0;
    button.innerHTML = "Freeze Image";
  }
}

function saveLocalImage() {
  if (frozenImage) {
    save(frozenImage, "MyAlbum.png"); // 使用 p5.js 的 save() 函数保存 frozenImage
  } else {
    alert("Please freeze an image first!");
  }
}

// recordButton=document.getElementById('record');
// button.addEventListener(
//   'click',function(){

//   }
// )

function rotateCanvas() {
  translate(width / 2, height / 2);
  rotate(rotationAngle);
  background(0);
  image(frozenImage, -width / 2, -height / 2);
  rotationAngle += 0.01;
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

// album_0_tint.js

/**
 * 启动或停止录音的函数。
 * 包含了防止快速点击和录音启动时序问题的修复。
 */
function startRecording() {
  // 确保音频环境已由用户激活
  userStartAudio();

  const recordButton = document.getElementById('record');

  // 检查当前是否正在录音
  if (!isRecording) {
    // ---- 开始录音的逻辑 ----

    // 1. 禁用按钮，防止用户立即再次点击
    recordButton.disabled = true;
    recordButton.innerHTML = "Starting..."; // 提示用户状态

    // 2. 设置一个短暂的延迟 (100毫秒)
    //    这给予麦克风音频流足够的时间来准备，防止 'Cannot read properties of undefined' 错误
    setTimeout(() => {
      // 3. 在延迟后，正式开始录音
      recorder.record(soundFile);
      isRecording = true;
      console.log("Recording has started.");

      // 4. 更新按钮文本，并在一小段时间后（例如1秒）重新启用按钮
      //    这可以防止用户创建长度过短（或为零）的音频文件
      recordButton.innerHTML = "Stop Recording";
      setTimeout(() => {
        recordButton.disabled = false;
      }, 900); // 900毫秒 + 上面的100毫秒延迟 = 总共1秒后按钮可用

    }, 100);

  } else {
    // ---- 停止录音的逻辑 ----

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