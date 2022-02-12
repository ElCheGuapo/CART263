/**
Hotline Deadpool
Author Name
This is a template. You must fill in the title,
author, and this description to match your project!
*/

let player;
let bullets = [];

"use strict";


/**
Description of preload
*/
function preload() {

}


/**
Description of setup
*/
function setup() {
  createCanvas(800, 800);
  player = new Player(400, 400);
}

function mousePressed() {
  playerShoot();
}

// function mousePressed() {
//   console.log('debug');
// }

function handlePlayer() {
  movementCharacter();
  player.update();
}

function handleBullet() {
  if (bullets.length > 0) {
    for (let i = 0; i <= bullets.length; i++) {
      bullets[i].update();
    }

    removeBullet();
  }
}

function movementCharacter() {
  if (keyIsDown(65)) {
    player.x -= 5;
  }
  if (keyIsDown(68)) {
    player.x += 5;
  }

  if (keyIsDown(87)) {
    player.y -= 5;
  }

  if (keyIsDown(83)) {
    player.y += 5;
  }
}

function removeBullet() {
  for (let i = 0; i <= bullets.length; i++) {
    if(bullets[i].x < 0 || bullets[i].x > 800) {
      bullets[i].splice();
    }
    if(bullets[i].y < 0 || bullets[i].y > 800) {
      bullets[i].splice();
    }
  }
}

function playerShoot() {
  let bullet;
  let v = createVector(player.x - mouseX, player.y - mouseY);
  v.normalize();

  bullet = new Bullet(v, player.x, player.y);
  bullets.push(bullet);
}

/**
Description of draw()
*/
function draw() {
  background(230);
  handlePlayer();
  handleBullet();
}
