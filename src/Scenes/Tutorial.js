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

        // Add white filter so Kiwi has better contrast with BG
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0xFFFFFF, 0.4).setOrigin(0,0);
        
        let tutorialConfig = {
            fontFamily: 'Garamond',
            fontSize: '28px',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }

        tutorialConfig.fontSize = "64px";    
        tutorialConfig.backgroundColor = '#FFFFFF';
        this.add.text(game.config.width/2, game.config.height/3 - 200, 'Tutorial:', tutorialConfig).setOrigin(0.5);
        
        tutorialConfig.fontSize = "48px";    
        this.add.text(game.config.width/2, game.config.height/3 - 100, 'Press and hold space to stretch,\nrelease to fly!', tutorialConfig).setOrigin(0.5);

        this.add.text(game.config.width/2, game.config.height/3 + 100, 'Avoid red Kiwi fruits:', tutorialConfig).setOrigin(0.5);
        this.badKiwi = this.add.image(game.config.width/2 + 220, game.config.height/3 + 40, "badToken").setOrigin(0,0);
        this.add.text(game.config.width/2, game.config.height/3 + 250, 'Collect green Kiwi fruits:', tutorialConfig).setOrigin(0.5);
        this.goodKiwi = this.add.image(game.config.width/2 + 250, game.config.height/3 + 190, "goodToken").setOrigin(0,0);

        // Menu
        //tutorialConfig.color = '#FFFFF0';
        tutorialConfig.backgroundColor = '#44874C';
        let MenuButton = this.add.text(game.config.width/2, game.config.height/2 + 300, 'Continue', tutorialConfig).setOrigin(0.5);

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