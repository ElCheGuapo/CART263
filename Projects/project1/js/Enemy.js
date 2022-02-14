class Enemy {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
  }

  update() {
    this.move();
    this.display();
  }

  display() {
    push();
    fill(50);
    ellipse(this.pos.x, this.pos.y, 30, 30);
    pop();
  }

  move() {
    this.pos.add(this.vel);
  }
}
