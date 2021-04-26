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

        menuConfig.fontSize = "48px";    
        this.add.text(game.config.width/2, game.config.height/2 - 100, 'Title', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = "28px";   
        this.add.text(game.config.width/2, game.config.height/2 - 50, 'Temporary Menu Scene', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#04471C';
        let startButton = this.add.text(game.config.width/2, game.config.height/2 + 50, 'Click here to start', menuConfig).setOrigin(0.5);

        startButton.setInteractive();
        startButton.on('pointerdown', () => {
          this.scene.start('playScene');
        });
    }
  }