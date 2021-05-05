class Tutorial extends Phaser.Scene {
    constructor() {
      super("tutorialScene");
    }

    preload() {
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
        
        let tutorialConfig = {
            fontFamily: 'Garamond',
            fontSize: '28px',
            color: '#013220',
            alighn: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }

        tutorialConfig.fontSize = "48px";    
        this.add.text(game.config.width/2, game.config.height/3 - 100, 'Tutorial:', tutorialConfig).setOrigin(0.5);
        
        tutorialConfig.fontSize = "40px";    
        this.add.text(game.config.width/2, game.config.height/3 - 50, 'Press and hold space to fly', tutorialConfig).setOrigin(0.5);

        // Menu
        tutorialConfig.color = '#FFFFF0';
        let MenuButton = this.add.text(game.config.width/2, game.config.height/2 + 150, 'Continue', tutorialConfig).setOrigin(0.5);

        // Menu Button
        MenuButton.setInteractive();
        MenuButton.on('pointerdown', () => {
            this.scene.start('menuScene');
        });
    }
    update() {
        this.sky.tilePositionY += 0.05;
        this.clouds.tilePositionX -= 1.2;
      }
}