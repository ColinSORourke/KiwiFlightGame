class Menu extends Phaser.Scene {
    constructor() {
      super("menuScene");
    }

    preload() {
    }
    
    create() {
      // Menu Config
      let menuConfig = {
          fontFamily: 'Garamond',
          fontSize: '28px',
          color: '#FFFFF0',
          alighn: 'right',
          padding: {
              top: 5,
              bottom: 5
          },
          fixedWidth: 0
      }

      // Title
      menuConfig.fontSize = "48px";    
      this.add.text(game.config.width/2, game.config.height/3 - 100, 'FLIGHT', menuConfig).setOrigin(0.5);
      menuConfig.fontSize = "24px";   
      this.add.text(game.config.width/2, game.config.height/3 - 50, 'OF THE', menuConfig).setOrigin(0.5);
      menuConfig.fontSize = "48px";    
      this.add.text(game.config.width/2, game.config.height/3, 'KIWI', menuConfig).setOrigin(0.5);
      menuConfig.backgroundColor = '#04471C';

      // Play
      let startButton = this.add.text(game.config.width/2, game.config.height/2 - 50, 'Play', menuConfig).setOrigin(0.5);

      // Credits
      let creditButton = this.add.text(game.config.width/2, game.config.height/2 + 50, 'Credits', menuConfig).setOrigin(0.5);

      startButton.setInteractive();
      startButton.on('pointerdown', () => {
        this.scene.start('playScene');
      });
    }
  }