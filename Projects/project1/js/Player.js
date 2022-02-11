class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update() {
    this.display();
  }

  display() {
    push();
    fill(0);
    ellipse(this.x, this.y, 50, 50);
    pop();
  }
}
