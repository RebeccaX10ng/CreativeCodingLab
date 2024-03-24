/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new RebeccaDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class RebeccaDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    // add properties for your dancer here:
    this.freqSpring = 3.14;
    this.freqSpringSpeed = 0.1;
    this.scaleIndex = 3;
    this.headY = -30;
    this.headYspeed = 0.5;
    this.rotateAngle = 0;
    this.rotateSpeed = 0.01;
    this.springX = -30;
    this.springY = 0;
    this.mappedFreqSpring = 0;
  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour
    if (this.headY < -60) {
      this.headYspeed = 1;
    }
    if (this.headY > -20) {
      this.headYspeed = -1;
    }
    this.headY += this.headYspeed;
    this.rotateAngle += this.rotateSpeed
    if (this.rotateAngle >= 0.2) {
      this.rotateSpeed = -0.01
    }
    if (this.rotateAngle <= -0.2) {
      this.rotateSpeed = 0.01
    }
  }
  display() {

    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.


    // ******** //
    // ⬇️ draw your dancer from here ⬇️
    // push();
    push();
    translate(this.x, this.y);
    stroke(99, 31, 0);
    strokeWeight(2);
    fill(99, 31, 0);


    // translate(this.x, this.y);
    scale(1, this.scaleIndex / 3);
    rotate(PI / 2);
    rectMode(CENTER);
    for (this.springX = -30; this.springX < 50; this.springX += 0.1) {
      this.mappedFreqSpring = map(sin(this.freqSpring), -1, 1, 2.5, 3.5);
      this.springY = abs(sin(this.springX / this.mappedFreqSpring)) * 25;
      point(this.springX, this.springY);
    }
    this.scaleIndex += this.freqSpringSpeed;
    if (this.scaleIndex < 2.5) {
      this.freqSpringSpeed = 0.1;
    } else if (this.scaleIndex > 3.5) {
      this.freqSpringSpeed = -0.1;
    }
    pop();
    push();
    //ears
    fill(117, 45, 0);
    translate(this.x - 7, this.y - 5 + this.headY);
    rotate(-PI / 4);
    ellipse(-25, -15, 50, 20);
    pop();
    push();

    fill(117, 45, 0);
    translate(this.x + 20, this.y + 29 + this.headY);
    rotate(PI / 4);
    ellipse(-25, -15, 50, 20);
    pop();
    push();
    stroke(99, 31, 0);
    strokeWeight(2);
    fill(99, 31, 0);
    translate(this.x, this.y + this.headY);
    rect(-36, 10, 50, 30);
    arc(-11, 10, 50, 60, -PI, 0);

    //frontlegs
    fill(117, 45, 0);
    ellipse(-30, 45, 10, 25);
    ellipse(10, 45, 10, 25);
    //eyes
    noStroke();
    fill(255);
    ellipse(-23, 0, 10, 18);
    ellipse(0, 0, 10, 18);
    fill(0);
    ellipse(-23, -3, 10, 12);
    ellipse(0, -3, 10, 12);
    fill(255);
    circle(-23, -5, 5)
    circle(-0, -5, 5)
    //mouth
    fill(255, 156, 156);
    arc(-11, 20 - 3, 12, 35, 0, -PI);
    fill(99, 31, 0);
    stroke(0);
    arc(-17, 19 - 3, 12, 10, 0, -PI);
    arc(-5, 19 - 3, 12, 10, 0, -PI);
    fill(0);
    triangle(-11, 20 - 3, -8, 17 - 3, -14, 17 - 3);

    pop();
    push();
    //tail
    push()
    stroke(117, 45, 0);
    translate(this.x + 20, this.y + 60)
    rotate(this.rotateAngle)

    noFill()
    strokeWeight(10)

    arc(0, 0, 40, 20, 0, PI)
    pop()
    //lowerBody
    translate(this.x, this.y);
    fill(117, 45, 0);
    ellipse(-30, 80, 30, 15)
    ellipse(8, 80, 30, 15)
    fill(99, 31, 0);
    stroke(99, 31, 0);
    strokeWeight(2);
    fill(99, 31, 0);
    arc(-11, 45, 50, 80, 0, -PI);
    this.drawReferenceShapes()
    pop();

    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.





  }

  drawReferenceShapes() {

    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);

  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/