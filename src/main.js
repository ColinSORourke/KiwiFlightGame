// ================================================================================================================
//  Flight of the Kiwi
//  By Colin O'Rourke, Daniel Aughenbaugh, & Dennis Zabluda
//  Date Completed: Wednesday May 5th
//
//  Creative Tilt
//    One element we are particularly proud of is that our game is actually using Matter.js for our Physics, instead of traditional arcade physics. While we didn't take full advantage of the cool things you can do, it was good to learn, and we did do a few interesting things.
//    
//    Daniel Aughenbaugh (artist):
//    I'm particularly proud of the how I was able to create all the of the art, animation, sound effects, and music. It's far from perfect, but I put a ton of time in and learned a lot in the process.
//    For the art, I learned Adobe Illustrator and tried to go for a simple and clear aesthetic for the parallax background/items/obstacles.
//    For the animation, I learned Adobe Animate, which was a lot more difficult than I expected, even for simple animations. I definitely have more respect for the work animators put in!
//    I think our implementation of the bird neck stretch and running animation is pretty creative, with the head and body being separate animation sprites, but part of the same texture atlas.
//    The sound effects I recorded with my microphone or phone and edited in Audacity (mostly pitch, speed, and left/right panning). I had to get creative using my voice, tape, rubber bands, and balloons to make the sounds.
//    The music is based on Ride of the Valkyries (which is in public domain). I created and modified the synths and bird call instrumentation in FL Studio to make it thematically appropriate.
// ================================================================================================================


let config = {
    type: Phaser.WEBGL,
    width: 1920,
    height: 1080,
    scene: [ Menu, Play, Credits, Tutorial ],
    physics: {
      default: "matter",
      matter: {
          debug: false
      }
    }
  }

let screenUnit = 80;
let groundLevel = 1000;
let game = new Phaser.Game(config);

let firstTime = true;

let keySPACE, keyF, keyH;
