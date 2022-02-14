class Enemy {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.size = 30;
  }

  update() {
    this.move();
    this.display();
  }

  display() {
    push();
    fill(150);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    pop();
  }

  move() {
    this.pos.add(this.vel);
  }
}
