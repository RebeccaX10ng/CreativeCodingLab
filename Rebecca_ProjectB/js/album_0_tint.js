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
let frozenImage; // 这个现在将是一个 p5.Graphics 对象，而不是 p5.Image
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

  mic = new p5.AudioIn();
  mic.start();

  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  soundFile = new p5.SoundFile();
}

function draw() {
  background(0); // 主画布仍然可以有背景色，这不影响 frozenImage 的透明度

  // 如果没有冻结，则继续绘制实时视频效果
  if (!frozen) {
    vid.loadPixels();
    for (let i = 0; i < vid.width; i++) {
      for (let j = 0; j < vid.height; j++) {
        let index = ((j * vid.width) + i) * 4;
        let r = vid.pixels[index + 0];
        let g = vid.pixels[index + 1];
        let b = vid.pixels[index + 2];
        // let a = vid.pixels[index + 3]; // 视频通常是完全不透明的，所以a值在此处不关键
        noStroke();
        fill(r * tintR, g * tintG, b * tintB);
        ellipse(i * scl, j * scl, scl, scl);
      }
    }
  }

  // 主画布上绘制外圈，这部分不会被保存到透明图片里
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

  if (frozen && frozenImage) { // 冻结状态下显示 frozenImage
    rotateCanvas();
  }
}

function toggleFreeze() {
  clickCount++;
  const button = document.getElementById("capture");

  if (clickCount % 2 === 1) { // 冻结操作
    // 【核心修改：生成透明圆图的逻辑】
    frozenImage = createCircularTransparentImage();
    frozen = true;
    button.innerHTML = "Resume";
  } else { // 解冻操作
    frozen = false;
    rotationAngle = 0;
    frozenImage = null; // 清除 frozenImage，释放内存
    button.innerHTML = "Freeze Image";
  }
}

// 【新增函数：创建圆形透明图片】
// album_0_tint.js

// 【新增函数：创建圆形透明图片】
// album_0_tint.js

// 【【【 用这个修正后的版本，替换掉你现有的同名函数 】】】
function createCircularTransparentImage() {
  let graphics = createGraphics(width, height); // 创建一个离屏画布，默认透明

  // --- 【核心修正】---
  // 1. 从全局的 `vid` 读取像素，并绘制到 `graphics` 画布上
  vid.loadPixels(); // 读取实时视频的像素
  for (let i = 0; i < vid.width; i++) {
    for (let j = 0; j < vid.height; j++) {
      let index = ((j * vid.width) + i) * 4;
      // 从全局 vid 读取像素颜色
      let r = vid.pixels[index + 0];
      let g = vid.pixels[index + 1];
      let b = vid.pixels[index + 2];
      // 【重要】在 graphics 画布上进行绘制
      graphics.noStroke();
      graphics.fill(r * tintR, g * tintG, b * tintB);
      graphics.ellipse(i * scl, j * scl, scl, scl);
    }
  }

  // 2. 如果专辑名需要显示，也在离屏画布上绘制
  if (checked) {
    graphics.textSize(60);
    graphics.fill(albumName.nameR, albumName.nameG, albumName.nameB);
    graphics.textFont('Courier New');
    let constrainedX = constrain(albumName.bounceX, 0, width - graphics.textWidth(albumName.albumName));
    let constrainedY = constrain(albumName.bounceY, 60, height - 30);
    graphics.text(albumName.albumName, constrainedX, constrainedY);
  }

  // 3. 创建一个圆形遮罩
  let maskGraphics = createGraphics(width, height);
  maskGraphics.fill(255); // 白色代表保留的部分
  maskGraphics.noStroke();
  maskGraphics.circle(320, 320, 640); // 画一个白色圆形

  // 4. 将 graphics 内容变成一张 p5.Image
  let img = graphics.get();

  // 5. 将圆形遮罩应用到这张新图片上
  img.mask(maskGraphics);

  return img; // 返回最终被遮罩处理过的 p5.Image

}


function saveLocalImage() {
  if (frozenImage) {
    // frozenImage 现在是一个 graphics 对象，我们可以直接保存它
    frozenImage.save("MyAlbum.png");
  } else {
    alert("Please freeze an image first!");
  }
}

function rotateCanvas() {
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
  push()
  scale(1 + sin(millis() / 100) / 500);


  stroke(0);
  noFill();
  circle(width / 2, height / 2, 570);
  circle(width / 2, height / 2, 550);
  circle(width / 2, height / 2, 450);
  circle(width / 2, height / 2, 400);
  fill(50);
  circle(width / 2, height / 2, 320);
  pop()

  push(); // 保存当前绘图状态

  translate(width / 2, height / 2);
  scale(0.5 + sin(millis() / 100) / 500);
  rotate(rotationAngle);
  // 在主画布上绘制 frozenImage (它现在是透明的)

  image(frozenImage, -width / 2, -height / 2);

  rotationAngle += 0.01;
  // 轻微缩小，制造动态效果
  pop(); // 恢复之前的绘图状态，避免影响其他元素

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

/**
 * 启动或停止录音的函数。
 * 包含了防止快速点击和录音启动时序问题的修复。
 */
function startRecording() {
  userStartAudio(); // 确保音频环境已由用户激活

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