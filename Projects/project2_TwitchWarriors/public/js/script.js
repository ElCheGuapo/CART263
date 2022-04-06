/**
Hotline Deadpool
Hugo Agnola
You play as Deadpool in the intro scene to the first movie where he in on the
bridge fighting multiple enemies. Let's see how many waves you can get through!!
*/

let player, bg, fireTrig, spawnTrig, timer, pixelFont, waveAmnt, score, playerIdle, playerRuning, playerIdle1, playerRuning1, enemyRuning, enemyRuning2, gameOver, dmgBorder, displayBorder;
let enemies = [];
let bullets = [];
let enemyBullets = [];

var SCENE_W = 1650;
var SCENE_H = 800;

var socket;

"use strict";

/** _____________________
    Description of preload()
    _____________________
*/

function preload() {
  //images
  playerIdle = loadImage('assets/images/idlePlayer.gif');
  playerRuning = loadImage('assets/images/runningPlayer.gif');
  playerIdle1 = loadImage('assets/images/idlePlayer1.gif');
  playerRuning1 = loadImage('assets/images/runningPlayer1.gif');
  enemyRuning = loadImage('assets/images/runningEnemy.gif');
  enemyRuning2 = loadImage('assets/images/runningEnemy2.gif');

  dmgBorder = loadImage('assets/images/bloodBorder.png');
  bg = loadImage('assets/images/BackgroundLoop1.png');

  //fonts
  pixelFont = loadFont('assets/fonts/Coolville.ttf');
}

/** _____________________
    Description of setup()
    _____________________
*/

function setup() {
  createCanvas(1650, 800);

  player = new Player(SCENE_W/2, 550, 100, playerIdle, playerRuning, playerIdle1, playerRuning1);

  //GAMEPLAY VARS
  waveAmnt = 5;
  score = 0;
  fireTrig = false;
  spawnTrig = false;
  gameOver = false;
  displayBorder = false;
  timer = 0;

  //CREATE IN-GAME TIMER
  setInterval(function() {
    for (let i = 0; i <= 5; i++) {
      timer++;
    }
    //console.log(enemies);
  }, 10);

  //SETUP SOCKET EMITER + ENDPOINT
  socket = io.connect('http://localhost:3000');
  socket.on('enemyPlayer', createPlayer2);

  socket.on("message", (data) => {
    const packet = JSON.parse(data);

    switch (packet.type) {
      case "lootbox":
        console.log("lootbox received");
        break;
    }
  });
}

function createPlayer2(data) {
  console.log(data);
}

function mousePressed() {
  playerShoot();

  // if(mouseX < player.pos.x) {
  //   console.log("flip");
  // } else {
  //   console.log("flip no");
  // }
  //console.log(player.hp);
}

function enemySpawnTimer() {
  if (timer % 500 === 0 && enemies.length < waveAmnt) {
    createEnemies();
  }
}

function createEnemies() {
  let Ex = random(0, 10);
  if (Ex > 5) {
    Ex = SCENE_W;
  } else if (Ex < 5) {
    Ex = 0;
  }
  let Ey = random(0, SCENE_H);

  let enemy = new Enemy(Ex, Ey, enemyRuning, enemyRuning2);
  enemies.push(enemy);
}

function enemyShoot() {
  if (enemies.length > 0 && timer % 400 === 0) {
    for (let enemy of enemies) {
      let v = createVector(player.pos.x - enemy.pos.x, player.pos.y - enemy.pos.y);
      v.normalize();
      v.mult(9);

      let bullet = {
        pos: createVector(enemy.pos.x + 50, enemy.pos.y + 50),
        vel: v
      };
      enemyBullets.push(bullet);
    }
  }
}

function playerShoot() {
  let v = createVector(camera.mouseX - player.pos.x, camera.mouseY - player.pos.y);
  v.normalize();
  v.mult(10);
  let bullet = {
    pos: createVector(player.pos.x + 50, player.pos.y + 50),
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
        v.mult(0.4);
        enemy.vel = v;
      }
    }
  }
}

function flipPlayer() {
  if(player.playerIsMoving) {
    if(mouseX < player.pos.x) {
      player.currentSprite = player.spriteRun1;
    } else {
      player.currentSprite = player.spriteRun;
    }
  } else {
    if(mouseX < player.pos.x) {
      player.currentSprite = player.spriteIdle1;
    } else {
      player.currentSprite = player.spriteIdle;
    }
  }
}

function playerMovement() {
  if (keyIsDown(65)) {
    player.pos.add(-5, 0);
    player.playerIsMoving = true;
  }

  if (keyIsDown(68)) {
    player.pos.add(5, 0);
    player.playerIsMoving = true;
  }

  if (keyIsDown(87)) {
    player.pos.add(0, -5);
    player.playerIsMoving = true;
  }

  if (keyIsDown(83)) {
    player.pos.add(0, 5);
    player.playerIsMoving = true;
  }
}

function keyReleased() {
  player.playerIsMoving = false;
}

function keyPressed() {
  if(gameOver) {
    player.hp = 100;
    waveAmnt = 5;
    score = 0;

    fireTrig = false;
    spawnTrig = false;
    timer = 0;

    setTimeout(function() {
      gameOver = false;
    }, 2000);
  }
}

function bulletCollisionEnemy() {
  for (let enemy of enemies) {
    for (let bullet of bullets) {

      /**
      FIX THIS ISSUE :
      >>>>>> Uncaught TypeError: Cannot read properties of undefined (reading 'pos') <<<<<<
      */

      let d = dist(bullet.pos.x, bullet.pos.y, enemy.pos.x + 50, enemy.pos.y + 50);

      if (d < enemy.size / 2) {
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
    let d = dist(bullet.pos.x, bullet.pos.y, player.pos.x + 50, player.pos.y + 50);

    if (d < player.size / 2) {
      displayBorder = true;
      enemyBullets.splice(enemyBullets.indexOf(bullet), 1);
      player.hp -= 10;
      setTimeout(function() {
        displayBorder = false;
      }, 500);
    }
  }
}

function displayDMGBorder() {
  if(displayBorder) {
    camera.off();
    push();
    image(dmgBorder, 0, 0, width, height);
    pop();
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
  flipPlayer();
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
      circle(bullet.pos.x, bullet.pos.y, 20);
      bullet.pos.add(bullet.vel);
    }
  }

  if (enemyBullets.length > 0) {
    for (let bullet of enemyBullets) {
      circle(bullet.pos.x, bullet.pos.y, 20);
      bullet.pos.add(bullet.vel);
    }
  }
  removeBullet();
}

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

function handleUI() {
  //display health points
  push();
  textFont(pixelFont);

  textSize(100);
  fill(255, 150, 150);
  text(player.hp, width - 245, 100, 100, 100);

  textSize(100);
  fill(255, 20, 0);
  text(player.hp, width - 250, 100, 100, 100);

  pop();

  //display score
  push();
  textFont(pixelFont);

  textSize(100);
  fill(100, 100, 255);
  text(score, 145, 100, 100, 100);

  textSize(100);
  fill(0, 20, 255);
  text(score, 140, 100, 100, 100);

  pop();

  displayDMGBorder();
}

/** _____________________
    Description of draw()
    _____________________
*/

function draw() {
  if(player.hp <= 0) {
    gameOver = true;
  }

  if(!gameOver) {
    background(0);
    image(bg, 0, 0, 1600, 800);

    handlePlayer();
    //handleEnemies();

    handleBullets();
    handleCamera();
  }

  camera.off();
  handleUI();

  if(gameOver) {
    camera.off();
    push();
    textFont(pixelFont);
    textSize(100);
    fill(20);
    rect(0, 0, width, height);
    fill(255, 50, 50);
    text("GAME\nOVER", width/2-100, height/2-300, 100, 200);

    textSize(50);
    fill(255, 50, 50);
    text("press any key to continue", width/2-80, height/2, 200, 400);
    pop();
  }

}
