/**
Hotline Deadpool
Author Name
This is a template. You must fill in the title,
author, and this description to match your project!
*/

let player;

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

// function mousePressed() {
//   console.log('debug');
// }

function handlePlayer() {
  movementCharacter();
  player.update();
}


/**
Description of draw()
*/
function draw() {
  background(230);
  handlePlayer();

}
