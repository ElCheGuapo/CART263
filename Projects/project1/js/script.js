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
  movementCharacter();
  player.update();
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
  for (let bullet of bullets) {
    if(bullet.x < 0 || bullet.x > 800) {
      bullet.splice();
    } else if(bullet.y < 0 || bullet.y > 800) {
      bullet.splice();
    }
  }
}

function playerShoot() {

  let v = createVector(mouseX - player.x, mouseY - player.y);
  v.normalize();
  v.mult(8);
  let bullet = {
    pos: createVector(player.x, player.y),
    vel: v
  };

  bullets.push(bullet);
  console.log(bullets);
}

/**
Description of draw()
*/
function draw() {
  background(230);
  handlePlayer();
  handleBullet();

  //limit the ghost movements
  if(player.x < 0)
    player.x = 0;
  if(player.y < 0)
    player.y = 0;
  if(player.x > SCENE_W)
    player.x = SCENE_W;
  if(player.y > SCENE_H)
    player.y = SCENE_H;
}
