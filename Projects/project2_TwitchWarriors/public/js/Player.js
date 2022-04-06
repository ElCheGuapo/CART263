class Player {
  constructor(x, y, hp, spriteI, spriteR, spriteI1, spriteR1) {
    this.pos = createVector(x, y);
    this.size = 100;
    this.hp = hp;
    this.spriteIdle = spriteI;
    this.spriteRun = spriteR;
    this.spriteIdle1 = spriteI1;
    this.spriteRun1 = spriteR1;

    this.currentSprite = this.spriteIdle;

    this.playerIsMoving = false;
  }

  update() {
    this.display();
  }


  display() {
    push();
    image(this.currentSprite, this.pos.x, this.pos.y, this.size, this.size);
    pop();
  }
}
