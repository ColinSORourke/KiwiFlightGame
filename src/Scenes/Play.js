class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }

    preload() {
    }
    
    create() {
        
        this.add.text(0,0, "We are in the scene");

    }

  }