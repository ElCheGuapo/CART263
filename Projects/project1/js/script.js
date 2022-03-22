/**
Hotline Deadpool
Hugo Agnola
You play as Deadpool in the intro scene to the first movie where he in on the
bridge fighting multiple enemies. Let's see how many waves you can get through!!
*/

let player, bg, fireTrig, spawnTrig, timer, pixelFont, waveAmnt, score;
let enemies = [];
let bullets = [];
let enemyBullets = [];

var SCENE_W = 1600;
var SCENE_H = 800;

"use strict";

/**
Description of preload
*/

function preload() {
  bg = loadImage('assets/images/BackgroundLoop1.png');

  //fonts
  pixelFont = loadFont('assets/fonts/Coolville.ttf');
}

/**
Description of setup
*/
function setup() {
  createCanvas(1000, 800);
  player = new Player(SCENE_W/2, 550, 100);

  waveAmnt = 5;
  score = 0;

  fireTrig = false;
  spawnTrig = false;
  timer = 0;
  setInterval(function() {
    for (let i = 0; i <= 5; i++) {
      timer++;
    }
    //console.log(enemies);
  }, 10);
}

function mousePressed() {
  playerShoot();
  console.log(player.hp);
}

function enemySpawnTimer() {
  if (timer % 500 === 0 && enemies.length < waveAmnt) {
    createEnemies();
  }
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

function enemyShoot() {
  if (enemies.length > 0 && timer % 800 === 0) {
    for (let enemy of enemies) {
      let v = createVector(player.pos.x - enemy.pos.x, player.pos.y - enemy.pos.y);
      v.normalize();
      v.mult(7);

      let bullet = {
        pos: createVector(enemy.pos.x, enemy.pos.y),
        vel: v
      };
      enemyBullets.push(bullet);
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

function enemyMovement() {
  for (let enemy of enemies) {
    if(enemies.length > 0) {
      if (enemy.pos.x < 600 || enemy.pos.x > 1000) {
        let v = createVector(player.pos.x - enemy.pos.x, player.pos.y - enemy.pos.y);
        v.normalize();
        v.mult(0.2);

        enemy.pos.add(v);
      }
    }
  }
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

  if (keyIsDown(UP_ARROW)) {
    console.log(waveAmnt);
  }
}

function bulletCollisionEnemy() {
  for (let enemy of enemies) {
    for (let bullet of bullets) {

      /**
      FIX THIS ISSUE :
      >>>>>> Uncaught TypeError: Cannot read properties of undefined (reading 'pos') <<<<<<
      */

      let d = dist(bullet.pos.x, bullet.pos.y, enemy.pos.x, enemy.pos.y);

      if (d < enemy.size + 10) {
        //console.log("collision detected");
        enemies.splice(enemies.indexOf(enemy), 1);
        bullets.splice(bullets.indexOf(bullet), 1);

        score ++;
      }
    }
  }
}

function bulletCollisionPlayer() {
  for (let bullet of enemyBullets) {
    let d = dist(bullet.pos.x, bullet.pos.y, player.pos.x, player.pos.y);

    if (d < player.size + 10) {
      enemyBullets.splice(enemyBullets.indexOf(bullet), 1);
      player.hp -= 10;
    }
  }
}

function handleEnemyWaves() {
  //increase wave cap by one every 10 points in 'score'
  let waveNumber = (waveAmnt - 5);
  if ((waveNumber * 5) < score && score % 5 === 0) {
    waveAmnt ++;
  }
}

function handlePlayer() {
  player.update();
  playerMovement();
  bulletCollisionPlayer();
}

function handleEnemies() {
  enemySpawnTimer();
  handleEnemyWaves();

  for (let enemy of enemies) {
    enemy.update();
    enemyMovement();
    enemyShoot();
    bulletCollisionEnemy();
  }
  if(enemies.length === 0 && enemies.length <= waveAmnt) {
    createEnemies();
  }
}

function handleBullets() {
  if (bullets.length > 0) {
    for (let bullet of bullets) {
      circle(bullet.pos.x, bullet.pos.y, 10);
      bullet.pos.add(bullet.vel);
    }
  }

  if (enemyBullets.length > 0) {
    for (let bullet of enemyBullets) {
      circle(bullet.pos.x, bullet.pos.y, 10);
      bullet.pos.add(bullet.vel);
    }
  }

  removeBullet();
}
// function keyReleased() {
//   player.vel.mult(0);
// }

function removeBullet() {
  for (let bullet of bullets) {
    if(bullet.x < 0 || bullet.x > 800) {
      bullets.splice(indexOf(bullet), 1);
    } else if(bullet.y < 0 || bullet.y > 800) {
      bullets.splice(indexOf(bullet), 1);
    }
  }
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

function flipEnemy(vel) {
  let xAxis = createVector(width, 0);
  let movementAngle = xAxis.angleBetween(vel);

  if (movementAngle < 90 && movementAngle > -90) {
    return true;
  } else {
    return false;
  }
}

function handleUI() {
  //display health points
  push();
  textFont(pixelFont);

  textSize(100);
  fill(0);
  text(player.hp, width - 195, 100, 100, 100);

  textSize(100);
  fill(255, 20, 0);
  text(player.hp, width - 200, 100, 100, 100);

  pop();

  //display score
  push();
  textFont(pixelFont);

  textSize(100);
  fill(0);
  text(score, 85, 100, 100, 100);

  textSize(100);
  fill(0, 20, 255);
  text(score, 80, 100, 100, 100);

  pop();
}

/**
Description of draw()
*/
function draw() {
  background(255, 255, 255);
  image(bg, 0, 0, 1600, 800);

  handlePlayer();
  handleEnemies();

  handleBullets();
  handleCamera();

  camera.off();
  handleUI();
}
