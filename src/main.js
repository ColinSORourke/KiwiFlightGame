let config = {
    type: Phaser.WEBGL,
    width: 1920,
    height: 1080,
    scene: [ Menu, Play ],
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

let keySPACE, keyF, keyH;
