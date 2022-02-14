class Player {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.size = 30;
  }

  update() {
    this.pos.add(this.vel);
    this.display();
  }

  display() {
    push();
    fill(0);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    pop();
  }
}
