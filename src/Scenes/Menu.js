class Menu extends Phaser.Scene {
    constructor() {
      super("menuScene");
    }

    preload() {

      // Load Background Layers
      this.load.image("Sky", "./assets/Sky.png");
      this.load.image("Clouds", "./assets/Clouds.png");
      this.load.image("Mountains", "./assets/Mountains.png");
      this.load.image("HillsFar", "./assets/HillsFar.png");
      this.load.image("HillsClose", "./assets/HillsClose.png");

      // Load Ground Layer
      this.load.image("Ground", "./assets/Ground.png");

      // Load Music
      this.load.audio("BGLoop", "./assets/RideOfTheKiwi.mp3");

      // Load SFX
      this.load.audio('sfx_NeckStretch', './assets/NeckStretch.mp3');
      this.load.audio('sfx_NeckSnap', './assets/NeckSnap.mp3');
      this.load.audio('sfx_IntroBirds', './assets/IntroBirds.mp3');
      this.load.audio('sfx_GoodToken', './assets/GoodToken.mp3');
      this.load.audio('sfx_BadToken', './assets/BadToken.mp3');
    }
    
    create() {

      // Add Background Layers
      this.sky = this.add.tileSprite(0, 0, 3840, 1080, "Sky").setOrigin(0,0);
      this.sky.tilePositionY += 500;
      this.clouds = this.add.tileSprite(0, 0, 3840, 1080, "Clouds").setOrigin(0,0);
      this.clouds.tilePositionX += 500;
      this.mountains = this.add.tileSprite(0, 0, 3840, 1080, "Mountains").setOrigin(0,0);
      this.mountains.tilePositionX -= 1200;
      this.hillsFar = this.add.tileSprite(0, 0, 3840, 1080, "HillsFar").setOrigin(0,0);
      this.hillsClose = this.add.tileSprite(0, 0, 3840, 1080, "HillsClose").setOrigin(0,-0.05);
      
      // Add white filter so Kiwi has better contrast with BG
      this.add.rectangle(0, 0, game.config.width, game.config.height, 0xFFFFFF, 0.4).setOrigin(0,0);

      // Menu Config
      let menuConfig = {
          fontFamily: 'Garamond',
          fontSize: '28px',
          color: '#000000',
          alighn: 'right',
          padding: {
              top: 5,
              bottom: 5
          },
          fixedWidth: 0
      }

      // Title
      menuConfig.fontSize = "256px";    
      this.add.text(game.config.width/2, game.config.height/3 - 220, 'FLIGHT', menuConfig).setOrigin(0.5);
      menuConfig.fontSize = "128px";   
      this.add.text(game.config.width/2, game.config.height/3 - 50, 'OF THE', menuConfig).setOrigin(0.5);
      menuConfig.fontSize = "256px";    
      this.add.text(game.config.width/2, game.config.height/3 + 120, 'KIWI', menuConfig).setOrigin(0.5);
      menuConfig.backgroundColor = '#44874C';
      

      // Play
      menuConfig.fontSize = "128px";
      let startButton = this.add.text(game.config.width/2, game.config.height/2 + 150, 'PLAY', menuConfig).setOrigin(0.5);

      // Credits
      let creditButton = this.add.text(game.config.width/2, game.config.height/2 + 350, 'CREDITS', menuConfig).setOrigin(0.5);

      // Start Button
      startButton.setInteractive();
      startButton.on('pointerdown', () => {
        this.scene.start('playScene');
      });

      
      // Credits Button
      creditButton.setInteractive();
      creditButton.on('pointerdown', () => {
        this.scene.start('creditsScene');
      });
    }
    update() {
      this.sky.tilePositionY += 0.05;
      this.clouds.tilePositionX -= 1.2;
    }
  }