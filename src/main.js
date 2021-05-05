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
