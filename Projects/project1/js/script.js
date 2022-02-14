/**
Hotline Deadpool
Hugo Agnola
You play as Deadpool in the intro scene to the first movie where he in on the
bridge fighting multiple enemies. Let's see how many waves you can get through!!
*/

let player, bg;
let enemies = [];
let bullets = [];

var SCENE_W = 1600;
var SCENE_H = 800;

"use strict";

/**
Description of preload
*/
function preload() {
  bg = loadImage('assets/images/BackgroundLoop1.png');
}
/**
Description of setup
*/
function setup() {
  createCanvas(800, 400);
  player = new Player(SCENE_W/2, 550);

  setInterval(function() {
    console.log("spawn enemy");
  }, 2000)
}

function mousePressed() {
  playerShoot();
}

// function mousePressed() {
//   console.log('debug');
// }

function createEnemies() {
  let Ex = random(0, 10);
  if (Ex > 5) {
    Ex = SCENE_W;
  } else if (Ex < 5) {
    Ex = 0;
  }
  let Ey = random(0, SCENE_H);

  let enemy = new Enemy(Ex, Ey);
  enemies.push(enemy);
}

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
  let v = createVector(camera.mouseX - player.pos.x, camera.mouseY - player.pos.y);
  v.normalize();
  v.mult(8);
  let bullet = {
    pos: createVector(player.pos.x, player.pos.y),
    vel: v
  };

  bullets.push(bullet);
  //console.log(bullets);
}

function handleCamera() {
  camera.zoom = 0.6;
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
}

/**
Description of draw()
*/
function draw() {
  background(255, 255, 255);
  image(bg, 0, 0, 1600, 800);
  handlePlayer();
  handleBullet();
  handleCamera();
}
