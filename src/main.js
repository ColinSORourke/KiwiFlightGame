// ================================================================================================================
//  Flight of the Kiwi
//  By Colin O'Rourke, Daniel Aughenbaugh, & Dennis Zabluda
//  Date Completed: Wednesday April 5th
//
//  Creative Tilt
//    One element we are particularly proud of is that our game is actually using Matter.js for our Physics, instead of traditional arcade physics. While we didn't take full advantage of the cool things you can do, it was good to learn, and wwe did do a few interesting things.
//    
//
// ================================================================================================================


let config = {
    type: Phaser.WEBGL,
    width: 1920,
    height: 1080,
    scene: [ Menu, Play, Credits ],
    physics: {
      default: "matter",
      matter: {
          debug: true
      }
    }
  }

let screenUnit = 80;
let groundLevel = 1000;
let game = new Phaser.Game(config);

let keySPACE, keyF, keyH;
