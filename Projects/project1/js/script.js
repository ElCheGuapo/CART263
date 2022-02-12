/**
Hotline Deadpool
Author Name
This is a template. You must fill in the title,
author, and this description to match your project!
*/

let player;
let bullets = [];
var SCENE_W = 1600;
var SCENE_H = 1600;

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
  player.update();
  playerMovement();
}

function handleBullet() {
  if (bullets.length > 0) {
    for (let bullet of bullets) {
      circle(bullet.pos.x, bullet.pos.y, 10);
      bullet.pos.add(bullet.vel);
    }
  }
  removeBullet();
}

function playerMovement() {
  if (keyIsDown(65)) {
    player.pos.add(-5, 0);
  }

  if (keyIsDown(68)) {
    player.pos.add(5, 0);
  }

  if (keyIsDown(87)) {
    player.pos.add(0, -5);
  }

  if (keyIsDown(83)) {
    player.pos.add(0, 5);
  }
}
// function keyReleased() {
//   player.vel.mult(0);
// }

function removeBullet() {
  for (let bullet of bullets) {
    if(bullet.x < 0 || bullet.x > 800) {
      bullet.splice();
    } else if(bullet.y < 0 || bullet.y > 800) {
      bullet.splice();
    }
  }
}

function playerShoot() {

  let v = createVector(mouseX - player.pos.x, mouseY - player.pos.y);
  v.normalize();
  v.mult(8);
  let bullet = {
    pos: createVector(player.pos.x, player.pos.y),
    vel: v
  };

  bullets.push(bullet);
  console.log(bullets);
}

/**
Description of draw()
*/
function draw() {
  background(255, 255, 255);
  rect(400, 400, 50, 50);
  handlePlayer();
  handleBullet();

  camera.zoom = 1;
  //
  camera.position.x = player.pos.x;
  camera.position.y = player.pos.y;

  //limit the ghost movements
  if(player.pos.x < 0)
    player.pos.x = 0;
  if(player.pos.y < 0)
    player.pos.y = 0;
  if(player.pos.x > SCENE_W)
    player.pos.x = SCENE_W;
  if(player.pos.y > SCENE_H)
    player.pos.y = SCENE_H;

  // camera.off();
}
