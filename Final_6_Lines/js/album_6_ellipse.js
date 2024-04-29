let img;
let cam;

function setup() {
  canvas = createCanvas(768, 768);
  canvas.parent("p5-canvas-container");
  cam = createCapture(VIDEO, { flipped: true });
  cam.size(768, 768);
  cam.hide();
  img = createImage(768, 768);
}


function draw() {
  background(0);

  cam.loadPixels();
  img.loadPixels();

  for (let y = 0; y < img.height; y += 10) {
    for (let x = 0; x < img.width; x += 20) {
      let index = (x + y * img.width) * 4;

      let r = cam.pixels[index + 0];
      let g = cam.pixels[index + 1];
      let b = cam.pixels[index + 2];

      let avg = (r + g + b) / 3;
      let threshold = 0.27; // play with this number
      if (avg > 255 * threshold) {
        // white
        img.pixels[index + 0] = r; // R
        img.pixels[index + 1] = g; // G
        img.pixels[index + 2] = b; // B
        img.pixels[index + 3] = 255; // A
      } else {
        // black
        img.pixels[index + 0] = 0; // R
        img.pixels[index + 1] = 0; // G
        img.pixels[index + 2] = 0; // B
        img.pixels[index + 3] = 255; // A
      }
      noStroke();
      fill(r, g, b);
      ellipse(x, y, 20, map(avg, 0, 255, 0, 10));
    }
  }

  img.updatePixels();
}
