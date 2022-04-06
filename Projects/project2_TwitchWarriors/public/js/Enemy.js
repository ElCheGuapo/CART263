class Enemy {
  constructor(x, y, sprite, sprite2) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.sprite = sprite;
    this.sprite2 = sprite2;
    this.size = 100;
    this.flipE = false;
  }

  update() {
    this.display();
    this.pos.add(this.vel);
    this.flip();
  }

  flip() {
    if(this.vel.x < 0) {
      this.flipE = true;
      //console.log(this.flipE);
    } else if(this.vel.x > 0) {
      this.flipE = false;
    }
  }

  display() {
    if(this.flipE) {
      push();
      image(this.sprite2, this.pos.x, this.pos.y, this.size, this.size);
      pop();
    } else {
      push();
      image(this.sprite, this.pos.x, this.pos.y, this.size, this.size);
      pop();
    }
  }
}
