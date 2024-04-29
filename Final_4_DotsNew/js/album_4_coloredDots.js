let cam;
let img;

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("p5-canvas-container");
  background(220);

  cam = createCapture(VIDEO, { flipped: true });
  cam.hide();
  img = createImage(640, 480); // blank image
}

function draw() {
  background(253, 209, 18);

  //image(cam, 0, 0);
  cam.loadPixels();
  img.loadPixels();
  // now we can access the cam.pixels and img.pixels arrays!
  for (let y = 0; y < cam.height; y += 4) {
    for (let x = 0; x < cam.width; x += 4) {
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
      if (meanValue >= 35) {
        fill(0);
        noStroke();
        circle(x, y, 5 - map(meanValue, 0, 150, 0, 5))
        // let mappedValue = map(meanValue, 0, 255, 0, 6);
        // let mappedFloorValue = floor(mappedValue);
        // textSize(5);
        // text(mappedFloorValue, x, y);
      } else {
        circle(x, y, 4)
      }
      // fill(255, g, b, a);
      // noStroke();
      // ellipse(x, y, 1);
    }
  }
  img.updatePixels();

  // image(img, 0, 0);
}