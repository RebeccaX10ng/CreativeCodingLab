let cam;
let img;
let character;
function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("p5-canvas-container");
  background(220);

  cam = createCapture(VIDEO, { flipped: true });
  cam.hide();
  img = createImage(640, 480); // blank image
}

function draw() {
  background(0);
  //image(cam, 0, 0);
  cam.loadPixels();
  img.loadPixels();
  // now we can access the cam.pixels and img.pixels arrays!
  for (let y = 0; y < cam.height; y += 10) {
    for (let x = 0; x < cam.width; x += 6) {
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
      textSize(7);
      if (meanValue <= 60) {
        character = "*";
      } else if (meanValue > 60 && meanValue <= 120) {
        character = "0";
      } else if (meanValue > 120 && meanValue <= 180) {
        character = "1";
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

  // image(img, 0, 0);
}