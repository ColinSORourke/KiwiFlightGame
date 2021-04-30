class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }

    preload() {
      this.load.image("ScrollBG", "./assets/TempBackground.jpg");
      this.load.image("Ground", "./assets/Ground.png");
      this.load.atlas('kiwi', './assets/BodyAndHeadAnims.png', './assets/BodyAndHeadAnims.json');
      this.load.image('square', "./assets/BrownSquare.png");
      this.load.image('squareB', "./assets/BrownSquareB.png");
    }
    
    create() {
        this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

        var kiwiTexture = this.textures.get('kiwi');
        console.log(kiwiTexture);

        var defaultCategory = 0x0001,
            kiwiCategory = 0x0002;
        
        // Add Background
        this.bg = this.add.tileSprite(0,0, 1920, 1080, "ScrollBG").setOrigin(0,0);

        // Ground
        var ground = this.matter.add.image(game.config.width/2, game.config.height - screenUnit/2, 'Ground', null, {isStatic: true });

        // Add Body
        this.body = this.matter.add.sprite( 200, game.config.height - 120, "kiwi", "tile000.png", {
          label: 'Kiwi',
          collisionFilter: {
            category: kiwiCategory,
            mask: defaultCategory
          }
        });

        // Add Head
        this.head = this.matter.add.sprite( 200, game.config.height - 200, "kiwi", "head000.png", {
          label: 'Kiwi',
          collisionFilter: {
            category: kiwiCategory,
            mask: defaultCategory
          }
        });

        var headFrameNames = this.anims.generateFrameNames('kiwi', { prefix: 'head', suffix: ".png", end: 29, zeroPad: 3 });
        var bodyFrameNames = this.anims.generateFrameNames('kiwi', { prefix: 'tile', suffix: ".png", end: 29, zeroPad: 3 });

        this.anims.create({
          key: 'bodyRun',
          frames: bodyFrameNames,
          frameRate: 30,
          repeat: -1
        });
        this.body.anims.play('bodyRun', true);

        var frameNames = this.anims.generateFrameNames('KiwiHead')
        this.anims.create({
          key: 'headRun',
          frames: headFrameNames,
          frameRate: 30,
          repeat: -1
        });
        this.head.anims.play('headRun', true);

        // Add constraint that represents neck
        this.neckConst = this.matter.add.constraint(this.body, this.head, 70, 1, {angularStiffness: 100});
    

        this.vaulting = false;
        // Add keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        var graphics = this.add.graphics();

    }

    update(){
      // Scroll Background
      this.bg.tilePositionX += 8;

      if (keySPACE.isDown && !this.vaulting && this.neckConst.length <= 550) {
        // Stretch neck constraint. When Head is perfectly balanced straight above body, this sends head straight up
        this.neckConst.length += 7;
      }

      if (Phaser.Input.Keyboard.JustUp(keySPACE) && !this.vaulting){
        if (this.neckConst.length >= 170){
          // Do vault
          let vault = this.vaulting;
          vault = true;
          let myHead = this.head.setStatic(true);
          this.body.setStatic(false);
          this.tweens.add({
            targets: this.neckConst,
            length: 70,
            duration: 400,
            ease: 'Linear',
            onComplete: function(){
              myHead.setStatic(false);
              vault = false;
            }
          });
          
        } else {
          // Retract neck
          this.tweens.add({
            targets: this.neckConst,
            length: 70,
            duration: 1000,
            ease: 'Linear'
          });
        }
      }
    }
  }