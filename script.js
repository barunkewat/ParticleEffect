let particles = [];
const particleCount = 500;
const particleSize = 12;
const spacing = particleSize * 12;
let gravity;
let deltaTime = 1 / 60;
let mousePrevX = 0;
let mousePrevY = 0;

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-20, 20), random(-20, 20));
    this.acc = createVector(0, 0);
    this.color = color(255, 255, 255);
    this.lastPos = createVector(x, y);
    this.densityFactor = 0;
    this.rotation = random(TWO_PI);
    this.rotationVel = random(-0.1, 0.1);
    this.shapeType = random(["circle", "square", "triangle"]);
  }

  update() {
    this.lastPos.set(this.pos);
    this.rotation += this.rotationVel * deltaTime;

    if (gravity) {
      let gravityScale = map(this.densityFactor, 0, 5, 1, 0.7);
      this.acc.add(p5.Vector.mult(gravity, 4 * gravityScale));
    }

    if (mouseIsPressed) {
      let d = dist(this.pos.x, this.pos.y, mouseX, mouseY);
      let maxDist = 250;
      if (d < maxDist) {
        let mouseVel = createVector(mouseX - mousePrevX, mouseY - mousePrevY);
        let densityScale = map(this.densityFactor, 0, 5, 1, 0.85);
        let force = mouseVel.copy().mult(10 * densityScale);
        let strength = pow(map(d, 0, maxDist, 1, 0), 1.75);
        force.mult(strength);
        this.acc.add(force);
        this.rotationVel += mouseVel.mag() * 0.01 * random(-1, 1);
      }
    }

    let dampingFactor = map(this.densityFactor, 0, 5, 1, 1);
    this.vel.add(p5.Vector.mult(this.acc, deltaTime * 15.0 * dampingFactor));

    if (this.pos.y > height - particleSize * 2) {
      this.vel.mult(0.92);
      this.vel.x *= 0.94;
      this.rotationVel *= 0.95;
    } else {
      this.vel.mult(0.985);
      this.rotationVel *= 0.99;
    }

    this.pos.add(p5.Vector.mult(this.vel, deltaTime * 11.5));

    let bounce = 0.45;
    let buffer = particleSize;

    if (this.pos.x < buffer || this.pos.x > width - buffer) {
      this.pos.x = constrain(this.pos.x, buffer, width - buffer);
      this.vel.x *= -bounce;
    }
    if (this.pos.y < buffer || this.pos.y > height - buffer) {
      this.pos.y = constrain(this.pos.y, buffer, height - buffer);
      this.vel.y *= -bounce;
    }

    this.acc.mult(0);
    this.densityFactor = 0;
  }

  draw() {
    noStroke();
    fill(this.color);
    let renderX = lerp(this.lastPos.x, this.pos.x, 0.5);
    let renderY = lerp(this.lastPos.y, this.pos.y, 0.5);

    push();
    translate(renderX, renderY);
    rotate(this.rotation);
    let size = particleSize;

    switch (this.shapeType) {
      case "triangle":
        triangle(-size / 2, size / 2, size / 2, size / 2, 0, -size / 2);
        break;
      case "square":
        rectMode(CENTER);
        rect(0, 0, size, size);
        break;
      case "circle":
        circle(0, 0, size);
        break;
    }
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  gravity = createVector(0, 2.2);
  background("#1a2ffb");

  document.body.style.overflow = "hidden"; // Scrollbar hatane ke liye

  let cols = floor((width - spacing * 0.95) / spacing);
  let startX = (width - cols * spacing) / 2;
  let startY = height * 0.05;
  let count = 0, row = 0;

  while (count < particleCount) {
    for (let col = 0; col < cols && count < particleCount; col++) {
      let x = startX + col * spacing + random(-5, 5);
      let y = startY + row * spacing + random(-5, 5);
      particles.push(new Particle(x, y));
      count++;
    }
    row++;
  }
}

function draw() {
  background("#1a2ffb");
  deltaTime = 1 / frameRate();

  for (let p of particles) p.update();
  for (let p of particles) p.draw();

  mousePrevX = mouseX;
  mousePrevY = mouseY;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
