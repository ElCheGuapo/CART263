class Enemy {
  constructor(x, y, sprite) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.sprite = sprite;
    this.size = 60;
  }

  update() {
    this.move();
    this.display();
  }

  display() {
    if (this.flip()) {
      push();
      fill(150);
      image(this.sprite, this.pos.x - this.size, this.pos.y, this.pos.x, this.size);
      pop();
    } else {
      push();
      fill(150);
      image(this.sprite, this.pos.x, this.pos.y, this.size, this.size);
      pop();
    }

  }

  move() {
    this.pos.add(this.vel);
  }

  flip() {
    if (this.vel.x <= 0) {
      return true;
    } else {
      return false;
    }
  }
}
