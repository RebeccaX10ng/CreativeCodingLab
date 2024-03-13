let mood;
let startAngle = 0;
let inc = 0.1;
let offsetX = [];
let offsetY = [];
let velocityX, velocityY;
let speedX = [];
let speedY = [];
let itemX, itemY;
let radius;
let cellSize = 1;
let moods = [];
let cellX = [15];
let cellY = [15];
let lastTime = 0;
let genInterval = 1000;
let triX, triY;
let heart;
let fillcolor;
let startTime;
let lastHeartTime = 0;
let heartInterval = 500;
let cellSplit = false;
let happyEnding;
let heartAmount = 0;
let sadCell;
function preload() {
    heart = loadImage("heart.png")
    happyEnding = loadImage("HappyEnding.PNG")
    sadCell = loadImage("sadCell.PNG")
}
function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container")
    textFont('Courier New');

    offsetX.push(random(width));
    offsetY.push(random(height));
    velocityX = random(2);
    velocityY = random(2);
    itemX = -100;
    itemY = mouseY;
    //set obstacle positions
    triX = 0;
    triY = 0;
    mood = 100;
    startTime = millis();
    speedX.push(1)
    speedY.push(1)
}

function draw() {
    background(143, 231, 255, 20);
    push();
    noFill();
    strokeWeight(2);
    stroke(255);
    circle(random(width), random(height), random(5, 15))
    pop();
    noStroke();
    let begunTime = millis() - startTime;
    let surviveTime = floor(begunTime / 1000)
    fill(143, 231, 255, 20);
    rect(0, 0, 800, 50);

    if (cellSize < 0) {
        background(0)
        fill(255)
        textSize(30)
        textAlign(CENTER)
        fillColor = (0, 0, 0, 0)
        text("Please Feed Me With More Love :(", width / 2, height / 2 - 15)
        text("Total Surive Time:" + surviveTime + "Seconds", width / 2, height / 2 + 15)
        text("You've given " + heartAmount + " hearts", width / 2, height / 2 + 45)
        image(sadCell, 50, 0, 800, 500)
        //         if(surviveTime>=60){
        //           text("You really took a good care.Well done!", width/2,height/2+40)
        //         }

        noLoop()

    }

    for (let i = 0; i < offsetX.length; i++) {
        updateCells(i)
        cell(i);

    }

    //text box
    fill(0);
    textSize(20)
    text("Current mood:", 0, 20)
    push();
    // text(floor(mood), 150, 20)
    // strokeWeight(3);
    // stroke(209, 0, 125)
    fill(fillColor);
    rect(155, 5, map(mood, 0, 100, 0, 120), 20)
    pop();
    text(floor(mood), 160 + map(mood, 0, 100, 0, 120), 20)
    mood -= 0.1
    text("Survive time:" + surviveTime + "seconds", 0, 50)
    if (mood >= 50 && surviveTime >= 60 && cellSplit == false) {
        // console.log(speedX)
        offsetX.push(offsetX[0] - radius * cellSize * 2 - 10)
        offsetY.push(offsetY[0])
        speedX.push(speedX[0])
        speedY.push(speedY[0])
        cellSplit = true;
    }
    if (mood >= 50 && surviveTime >= 60 && cellSplit == true) {
        image(heart, random(width), random(height), 35, 30)
        if (surviveTime >= 63) {
            image(happyEnding, 0, 0, 800, 500)
            fill(255)
            fillColor = (0, 0, 0, 0)
            textAlign(CENTER);
            text("You really took a good care.Well done!", width / 2, height / 2 - 60)
            text("You've given " + heartAmount + " hearts", width / 2, height / 2 - 40)

            noLoop();
        }
    }
    if (millis() - lastHeartTime >= heartInterval) {
        if (mouseIsPressed) {
            itemX = mouseX;
            itemY = mouseY;
            lastHeartTime = millis();
        }
    }




    if (cellSize >= 0) {
        cellSize = map(mood, 0, 100, 0, 1)
    }
    push()
    let currTime = millis();
    if (currTime - lastTime >= genInterval) {
        let yPos = 0;
        triX = random(width);
        triY = random(height);
        if (triX > 0 && triX < width - 100) {
            if (triY > 25 && triY < height) {
                translate(triX, triY);
                for (let posX = 30; posX < 100; posX += 30) {
                    noStroke();
                    fill(200, 0, 0);
                    triangle(posX, yPos, posX + 15, yPos - 25, posX + 30, yPos)

                }
                lastTime = currTime
            }
        }
    }

    pop()
}
function cell(i) {
    push()

    translate(offsetX[i], offsetY[i]);
    // let colorIndex = (mood,0,100,0,255)
    beginShape();
    stroke(0);
    strokeWeight(2);//cell wall
    let startColor = color(255, 18, 152);
    let endColor = color(0);
    fillColor = lerpColor(endColor, startColor, mood / 100);
    fill(fillColor);

    if (mood > 0) {
        // fill(255, 200-colorIndex,200-colorIndex);
    } else {
        speedX[i] = 0;
        speedY[i] = 0;
        if (cellSize >= 0) { cellSize -= 0.01 }

    }

    scale(cellSize);
    radius = 50;
    for (let angle = 0; angle < TWO_PI; angle += 0.1) {
        let inc = 0.1;
        let noiseVal = noise(cos(angle) * 0.5 + startAngle, sin(angle) * 0.5 + startAngle);
        let r = radius + map(noiseVal, 0, 1, -10, 10);
        let x = r * cos(angle);
        let y = r * sin(angle);
        vertex(x, y);
        startAngle += inc;
    }
    endShape(CLOSE);
    fill(255)
    ellipse(-10, -10, 6, 10)
    ellipse(10, -10, 6, 10)
    strokeWeight(5)
    point(-10, -12)
    point(10, -12)
    if (mood >= 70 && millis() - lastHeartTime < 5000) {
        noFill();
        arc(0, 10, 30, 10, 0, PI)
    } else {
        // }if(mood<70 ||millis() - lastHeartTime >= 4000){
        noFill()
        arc(0, 20, 20, 20, -PI, 0)
    }

    if (random(1) < 0.02) { //0.5%
        velocityX = random(-1, 1) * 3;
        velocityY = random(-1, 1) * 3;
    }


    offsetX[i] += speedX[i] * velocityX;
    offsetY[i] += speedY[i] * velocityY;

    if (offsetX[i] < 0 || offsetX[i] > width) {
        velocityX *= -1;

    }
    if (offsetY[i] < 0 || offsetY[i] > height) {
        velocityY *= -1;

    }
    pop()
}

function updateCells(i) {
    if (offsetX[i] > triX - radius * cellSize && offsetX[i] < triX + radius * cellSize) {
        if (offsetY[i] > triY - radius * cellSize && offsetY[i] < triY + radius * cellSize) {
            //console.log(1)
            // cellSize+=0.1;
            speedX[i] -= 0.1;
            speedY[i] -= 0.1;
            mood -= 30;
            triX = -100
            triY = -100

            console.log("Oh no! I'm hurt!")
        }
    }
    image(heart, itemX, itemY, 35, 30);
    if (offsetX[i] > itemX - radius * cellSize && offsetX[i] < itemX + radius * cellSize) {
        if (offsetY[i] > itemY - radius * cellSize && offsetY[i] < itemY + radius * cellSize) {
            console.log("Thank You For Your Love!")
            heartAmount++;
            // cellSize+=0.1;
            speedX[i] += 0.1;
            speedY[i] += 0.1;
            mood += 20;
            itemX = -100
            itemY = -100
        }
    }
}
