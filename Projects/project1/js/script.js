"use strict";

/**
DiCaprio Is Drowning!
Hugo Agnola!

In this short simulation the user will use their finger to swing their weapon around.
This simulation includes responsive voice, annyang, and ml5.js
*/

//DiCaprio Head
let dHead = undefined;
let hitBox = undefined;
let fogOverlay = undefined;

//counter
let counter;
let counterSFXplay;

//Head and Hitbox movement vector
let movement = undefined;
let wind = undefined;

//raft object
let r = undefined;

//fog x position
let fogX = 0;

//images
let raft;
let backdrop;
let startScreen;

let dicaprioFace;
let dicaprioCry;
let fogLayer;

//game variable
let simulationStarted;

//collision varibles
let hit;
let hitSFX;

//user's webcam
let video = undefined;

//handpose model
let handpose = undefined;

//current set of predictions (array)
let predictions = [];

/**
Preload all the image and sound assets
*/
function preload() {
    raft = loadImage('assets/images/raft.png');
    backdrop = loadImage('assets/images/backdrop.png');
    fogLayer = loadImage('assets/images/fogOverlay.png');
    startScreen = loadImage('assets/images/startScreen.png');
    
    dicaprioFace = loadImage('assets/images/DiCaprioHead.png');
    dicaprioCry = loadImage('assets/images/DiCaprioCry.png');
    
    hitSFX = loadSound('assets/sounds/punchSFX.mp3');
}

/**
Description of setup
*/

function setup() {
    //create canvas and set angle mode
    createCanvas(640, 480);
    angleMode(RADIANS);
    
    //get video input and hide it
    video = createCapture(VIDEO);
    video.hide();
    
    //create 2 velocity vectors
    movement = createVector(0, 0);
    wind = createVector(1, 0);
    
    //initialize boolean variables
    hit = false;
    simulationStarted = false;
    
    //initialize counter
    counter = 0.0;
    
    //create raft object
    r = new Raft(0, 0);
    
    //load handpose model
    handpose = ml5.handpose(video, { 
        flipHorizontal: true 
    }, function () {
        console.log('model loaded');
    });
    
    //Listen for predictions
    handpose.on('predict', function(results) {
        console.log(results);
        predictions = results;
    });
    
    //dicaprio head object params
    dHead = {
        x: 400, 
        y: 40,     
        size: 120,
    };
    
    //dicaprio head hitbox object params
    hitBox = {
        x: 455,
        y: 85,
        size: 125,
    };
    
    //fog overlay object params
    fogOverlay = {
        x: -100,
        y: 0,
        size: 800,
    };
}

//jittering raft
function handleRaft() {
    r.update();
    r.show();
    r.vel = movement;
}

//moving fog
function handleFog() {
    fogOverlay.x += wind.x;
    
    if (fogOverlay.x >= 0) {
        fogOverlay.x = -100;
    }
    
    //display fog at half opacity
    push();
        tint(255, 160);
        image(fogLayer, fogOverlay.x, fogOverlay.y, fogOverlay.size, fogOverlay.size);
    pop();
}

//display, move and check for collision on dicaprio's head
function handleDiCaprio() {
    hitBox.x +=  -movement.x;
    hitBox.y += movement.y;
    
    dHead.x += - movement.x;
    dHead.y += movement.y;
    
    if (counter >= 3.0) {
        hit = false;
        counter = 0.0;
    }
    
    if (hit === true) {
        push();
            fill(4, 4, 255);
            noStroke();
            image(dicaprioCry, dHead.x, dHead.y, dHead.size, dHead.size);
            console.log("hit yet");
            counter = counter + 1 * (deltaTime / 900);
            //ellipse(hitBox.x, hitBox.y, hitBox.size);
        pop();
    } else {
        push();
            fill(4, 4, 255);
            noStroke();
            image(dicaprioFace, dHead.x, dHead.y, dHead.size, dHead.size);
            console.log("not hit yet");
            //ellipse(hitBox.x, hitBox.y, hitBox.size);
        pop();
    }
}

function drawWeapon() {
    let hand = predictions[0];
    let index = hand.annotations.indexFinger;
    
    let tip = index[3];
    let base = index[0];
    
    let tipX = tip[0];
    let tipY = tip[1];
    
    let baseX = base[0];
    let baseY = base[1];
    
    let v = createVector((tipX - baseX), (tipY - baseY));
    v.normalize();
    
    console.log(v.x + ", " + v.y);
    
    push();
        noFill();
        
        stroke(128,0,0);
        strokeWeight(3);
        line(baseX, baseY, tipX, tipY);
        
        stroke(255, 255, 255);
        strokeWeight(6);
        line((baseX + (v.x * 20)), (baseY + (v.y * 20)), tipX, tipY);
    pop();
    
    let d = dist(tipX, tipY, hitBox.x, hitBox.y);
    var r = floor(random(4));
    
    if (d < hitBox.size / 2 && hitSFX.isPlaying() === false) {
        switch (r) {
            case 0:
              responsiveVoice.speak("That hurts");
              break;
            case 1:
              responsiveVoice.speak("Stop this at once!");
              break;
            case 2:
              responsiveVoice.speak("Why are you doing this to me?");
              break;
            case 3:
              responsiveVoice.speak("Lord have mercy");
              break;
          }
        hitSFX.play();
        hit = true;
    }
}

function mousePressed() {
    simulationStarted = true;
}

/**
check if simulationStart bool is true then start sim
*/

function draw() {
    if (simulationStarted === true) {
        background(50);
        image(backdrop, 0, 0, 640, 480);

        handleRaft();
        handleDiCaprio();
        handleFog();

        if (annyang) {
            let commands = {
                'this is it': function() {
                responsiveVoice.speak("I'm going to cry...");
                },
                'hahaha': function() {
                responsiveVoice.speak("Why are you laughing!");
                }
            }
            annyang.addCommands(commands);
            annyang.start();
        }

        if(predictions.length > 0) {
            drawWeapon();
        }
    } else {
        image(startScreen, 0, 0, 640, 480);
    }
}

//
class Raft {
    constructor(x, y) {
        this.y = y;
        this.pos = createVector(x, y);
        this.vel = createVector(0, 1);
    }
    
    update() {
        this.acc = p5.Vector.random2D();
        this.vel.x = this.acc.x;
        this.vel.limit(0.5);
        this.pos.add(this.vel);
        
        if (this.y <= 0) {
            this.vel.y = this.vel.y * -1; 
        } else if (this.y >= 30) {
            this.vel.y = this.vel.y * -1;
        }
    }
    
    show() {
        image(raft, this.pos.x, this.y + 30, 640, 480);
    }
}