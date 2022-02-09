/**

Bubble Popper
Pippin Barr

Turns the index finger as seen through the webcam into a pin that can pop
a bubble that floats from the bottom of the screen to the top.

Uses:

ml5.js Handpose:
https://learn.ml5js.org/#/reference/handpose

*/

"use strict";

// Current state of program
let state = `loading`; // loading, running
// User's webcam
let video;
// The name of our model
let modelName = `Handpose`;
// Handpose object (using the name of the model for clarity)
let handpose;
// The current set of predictions made by Handpose once it's running
let predictions = [];

let cursorIsActive;

//game variables
let score, lives, lifeUpAnimationTrigger;

//asset variables
let lifeUp, popSfx, failSfx;

// The bubble we will be popping
let bubble;
// The pin
let pin = {
  tip: {
    x: undefined,
    y: undefined
  },
  head: {
    x: undefined,
    y: undefined,
    size: 20
  }
};

/**
load all assets
*/
function preload() {
  //images
  lifeUp = loadImage('assets/images/hp.gif');

  //sounds
  popSfx = loadSound('assets/sounds/popSfx.mp3');
  failSfx = loadSound('assets/sounds/oof.mp3');
}

/**
Starts the webcam and the Handpose, creates a bubble object
*/
function setup() {
  createCanvas(640, 480);
  frameRate(30);
  cursorIsActive = true;

  //initialize score and lives
  score = 0;
  lives = 3;
  lifeUpAnimationTrigger = false;

  // Start webcam and hide the resulting HTML element
  video = createCapture(VIDEO);
  video.hide();

  // Start the Handpose model and switch to our running state when it loads
  handpose = ml5.handpose(video, {
    flipHorizontal: true
  }, function() {
    // Switch to the running state
    state = `running`;
  });

  // Listen for prediction events from Handpose and store the results in our
  // predictions array when they occur
  handpose.on(`predict`, function(results) {
    predictions = results;
  });

  // Create our basic bubble
  bubble = {
    x: random(width),
    y: height,
    size: 100,
    vx: 0,
    vy: -2
  }
}

/**
Handles the two states of the program: loading, running
*/
function draw() {
  if (state === `loading`) {
    loading();
  }
  else if (state === `running`) {

    running();
  } else if (state === `ended`) {
    push();
    fill(255, 255, 255);
    textSize(25)
    text("Game Over", width/2 - 30, height/2);
    fill(255, 0, 0);
    text("score: " + score, width/2 - 30, height/2 + 60)
    pop();
  }
}

function mousePressed() {
  if(state === 'ended') {
    lives = 3;
    score = 0;
    state = 'running';
  }
}

function displayText() {
  //display score
  push();
  fill(255, 255, 255);
  textSize(25)
  text("score: " + score, 30, 60);
  pop();

  //display lives
  push();
  fill(230, 0, 0);
  textSize(25)
  text("HP: " + lives, width - 100, 60);
  pop();
}

function display1UpAnimation() {
  if(lifeUpAnimationTrigger) {
    push();
    image(lifeUp, width - 100, 45, 100, 100);
    pop();
  }
}

/**
Displays a simple loading screen with the loading model's name
*/
function loading() {
  push();
  textSize(32);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(`Loading ${modelName}...`, width / 2, height / 2);
  pop();
}

/**
Displays the webcam.
If there is a hand it outlines it and highlights the tip of the index finger
*/
function running() {
  // Use these lines to see the video feed
  // const flippedVideo = ml5.flipImage(video);
  // image(flippedVideo, 0, 0, width, height);

  // Use this line to just see a black background. More theatrical!
  background(0);
  displayText();
  display1UpAnimation();

  // Check if there currently predictions to display
  if (predictions.length > 0 && cursorIsActive) {
    // If yes, then get the positions of the tip and base of the index finger
    updatePin(predictions[0]);

    // Check if the tip of the "pin" is touching the bubble
    let d = dist(pin.tip.x, pin.tip.y, bubble.x, bubble.y);
    if (d < bubble.size / 2) {
      cursorIsActive = false;
      bubble.size += 50;

      setTimeout(function() {
        bubble.size = 150;
        setTimeout(function() {
          bubble.size -= 80;
          popSfx.play();
          bubble.size = 0;
          //random extra life event
          let r = random(0, 10);
          if(r > 9) {
            lifeUpAnimationTrigger = true;
            setTimeout(function() {
              lifeUpAnimationTrigger = false;
            }, 2000);
            lives ++;
          }

          setTimeout(function() {
            score ++;
            // Pop!
            resetBubble();
            cursorIsActive = true;
          }, 100);
        }, 200);
      }, 50);

      //bubble.size = 100;

      //random extra life event
      let r = random(0, 10);
      if(r > 9) {
        lifeUpAnimationTrigger = true;
        setTimeout(function() {
          lifeUpAnimationTrigger = false;
        }, 2000);
        lives ++;
      }


    }
    // Display the current position of the pin
    displayPin();
  }

  // Handle the bubble's movement and display (independent of hand detection
  // so it doesn't need to be inside the predictions check)
  moveBubble();
  checkOutOfBounds();
  displayBubble();
}

/**
Updates the position of the pin according to the latest prediction
*/
function updatePin(prediction) {
  pin.tip.x = prediction.annotations.indexFinger[3][0];
  pin.tip.y = prediction.annotations.indexFinger[3][1];
  pin.head.x = prediction.annotations.indexFinger[0][0];
  pin.head.y = prediction.annotations.indexFinger[0][1];
}

/**
Resets the bubble to the bottom of the screen in a new x position
*/
function resetBubble() {
  bubble.size = 100;
  bubble.x = random(width);
  bubble.y = height;
}

/**
Moves the bubble according to its velocity
*/
function moveBubble() {
  bubble.x += bubble.vx;
  bubble.y += (bubble.vy - (score/4));
}

/**
Resets the bubble if it moves off the top of the canvas
*/
function checkOutOfBounds() {
  if (bubble.y < 0) {
    lives --;
    failSfx.play();
    resetBubble();

    if(lives <= 0) {
      state = 'ended';
    }
  }
}

/**
Displays the bubble as an ellipse
*/
function displayBubble() {
  push();
  noStroke();
  fill(50, 100, 240, 200);
  ellipse(bubble.x, bubble.y, bubble.size);

  fill(255, 255, 255, 150);
  ellipse(bubble.x, bubble.y, bubble.size - 5);

  fill(255, 255, 255, 160);
  ellipse(bubble.x - (bubble.size/4), bubble.y - (bubble.size/4), bubble.size - 70);
  pop();
}

/**
Displays the pin based on the tip and base coordinates. Draws
a line between them and adds a red pinhead.
*/
function displayPin() {
  // Draw pin
  if(cursorIsActive) {
    push();
    stroke(255);
    strokeWeight(2);
    line(pin.tip.x, pin.tip.y, pin.head.x, pin.head.y);
    pop();

    // Draw pinhead
    push();
    fill(255, 0, 0);
    noStroke();
    ellipse(pin.head.x, pin.head.y, pin.head.size);
    pop();
  }
}
