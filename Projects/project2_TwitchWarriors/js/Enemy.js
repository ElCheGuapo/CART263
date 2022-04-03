class Enemy {
  constructor(x, y, sprite) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.sprite = sprite;
    this.size = 60;
  }

  update() {
    this.display();
  }

  display() {

    push();
    fill(150);
    image(this.sprite, this.pos.x, this.pos.y, 60, 60);
    pop();
  }
}
