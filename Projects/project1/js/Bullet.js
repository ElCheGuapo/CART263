class Bullet {
  constructor(v, px, py) {
    this.pos = createVector(px, py);
    this.vel = v;
  }

  update() {
    this.pos = this.pos.add(this.vel);
    this.display;
  }

  display() {
    push();
    fill(0);
    ellipse(this.pos.x, this.pos.y, 10, 10);
    pop();
  }
}
