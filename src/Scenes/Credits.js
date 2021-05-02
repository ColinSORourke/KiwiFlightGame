class Credits extends Phaser.Scene {
    constructor() {
      super("creditsScene");
    }

    preload() {
    }

    create() {
        let creditConfig = {
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
        creditConfig.fontSize = "48px";    
        this.add.text(game.config.width/2, game.config.height/3 - 100, 'CREDITS:', creditConfig).setOrigin(0.5);
        
        creditConfig.fontSize = "40px";    
        this.add.text(game.config.width/2, game.config.height/3 - 50, 'Programmer:', creditConfig).setOrigin(0.5);

        creditConfig.fontSize = "28px";    
        this.add.text(game.config.width/2, game.config.height/3, 'Name 1', creditConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/3 + 50, 'Name 2', creditConfig).setOrigin(0.5);

        creditConfig.fontSize = "40px";    
        this.add.text(game.config.width/2, game.config.height/2, 'ARTIST:', creditConfig).setOrigin(0.5);

        creditConfig.fontSize = "28px"; 
        this.add.text(game.config.width/2, game.config.height/2 + 50, 'Name 1', creditConfig).setOrigin(0.5);

        creditConfig.fontSize = "40px";   
        creditConfig.backgroundColor = '#04471C';

        // Menu
        let MenuButton = this.add.text(game.config.width/2, game.config.height/2 + 150, 'Back', creditConfig).setOrigin(0.5);

        // Menu Button
        MenuButton.setInteractive();
        MenuButton.on('pointerdown', () => {
        this.scene.start('menuScene');
      });
    }
}