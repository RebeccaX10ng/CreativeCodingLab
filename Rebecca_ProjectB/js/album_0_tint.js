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

//2025.10.7
let frozenImage; // p5.Graphics
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

function preload() {
  oswald = loadFont('assets/oswald.ttf');

}

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
  background(0);
  if (!frozen) {
    vid.loadPixels();
    for (let i = 0; i < vid.width; i++) {
      for (let j = 0; j < vid.height; j++) {
        let index = ((j * vid.width) + i) * 4;
        let r = vid.pixels[index + 0];
        let g = vid.pixels[index + 1];
        let b = vid.pixels[index + 2];

        noStroke();
        fill(r * tintR, g * tintG, b * tintB);
        ellipse(i * scl, j * scl, scl, scl);
      }
    }
  }


  if (checked) {
    albumName.display();
    albumName.update();
  }

  push();
  stroke(150, 255, 210);
  strokeWeight(160);
  noFill();
  circle(width / 2, height / 2, 780);
  pop();

  if (frozen && frozenImage) {
    rotateCanvas();
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
  let graphics = createGraphics(width, height);

  vid.loadPixels(); //read current frame pixels
  for (let i = 0; i < vid.width; i++) {
    for (let j = 0; j < vid.height; j++) {
      let index = ((j * vid.width) + i) * 4;
      let r = vid.pixels[index + 0];
      let g = vid.pixels[index + 1];
      let b = vid.pixels[index + 2];
      // draw on graphics
      graphics.noStroke();
      graphics.fill(r * tintR, g * tintG, b * tintB);
      graphics.ellipse(i * scl, j * scl, scl, scl);
    }
  }

  if (checked) {
    graphics.textSize(60);
    graphics.fill(albumName.nameR, albumName.nameG, albumName.nameB);
    if (isPureAscii(this.albumName)) {
      graphics.textFont(oswald);
    } else {
      graphics.textFont('Arial');
    }

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
function isPureAscii(str) {
  // 正则表达式：从字符串开头(^)到结尾($)
  // 匹配所有在 ASCII 范围内的字符 (\x00-\x7F)
  return /^[\x00-\x7F]*$/.test(str);
}
// album_0_tint.js 或 create.js

class AlbumName {
  constructor() {
    this.bounceX = random(width);
    this.bounceY = random(height);
    this.textSpdX = 5;
    this.textSpdY = 5;
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
      textFont('Arial');
    }
    // display() 函数不需要 constrain, update() 会处理边界
    text(this.albumName, this.bounceX, this.bounceY);
  }

  update() {
    // 1. 更新位置
    this.bounceX += this.textSpdX;
    this.bounceY += this.textSpdY;

    // 2. 定义边界
    const rightBoundary = width - textWidth(this.albumName);
    const leftBoundary = 0;
    const bottomBoundary = height - 30; // 文本底部
    const topBoundary = 60;        // 文本顶部

    let hitEdge = false; // 用于标记是否撞到边

    // 3. 【核心修正】检查水平碰撞
    if (this.bounceX >= rightBoundary) {
      this.bounceX = rightBoundary; // 强制拉回到边界上
      this.textSpdX *= -1;         // 反转速度
      hitEdge = true;
    } else if (this.bounceX <= leftBoundary) {
      this.bounceX = leftBoundary;
      this.textSpdX *= -1;
      hitEdge = true;
    }

    // 4. 【核心修正】检查垂直碰撞
    if (this.bounceY >= bottomBoundary) {
      this.bounceY = bottomBoundary;
      this.textSpdY *= -1;
      hitEdge = true;
    } else if (this.bounceY <= topBoundary) {
      this.bounceY = topBoundary;
      this.textSpdY *= -1;
      hitEdge = true;
    }

    // 5. 如果撞到了任何一条边，只改变一次颜色
    if (hitEdge) {
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