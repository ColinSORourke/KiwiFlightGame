class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
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

      // Load Kiwi Animations Atlas
      this.load.atlas('kiwi', './assets/BodyAndHeadAnims.png', './assets/BodyAndHeadAnims.json');

      // Temp Debugging Assets
      this.load.image('square', "./assets/BrownSquare.png");
      this.load.image('squareB', "./assets/BrownSquareB.png");
    }
    
    create() {
        this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

        var kiwiTexture = this.textures.get('kiwi');

        var defaultCategory = 0x0001,
            kiwiCategory = 0x0002;
        
        // Add Background Layers
        this.sky = this.add.tileSprite(0, 0, 3840, 1080, "Sky").setOrigin(0,0);
        this.clouds = this.add.tileSprite(0, 0, 3840, 1080, "Clouds").setOrigin(0,0);
        this.mountains = this.add.tileSprite(0, 0, 3840, 1080, "Mountains").setOrigin(0,0);
        this.hillsFar = this.add.tileSprite(0, 0, 3840, 1080, "HillsFar").setOrigin(0,0);
        this.hillsClose = this.add.tileSprite(0, 0, 3840, 1080, "HillsClose").setOrigin(0,-0.05);

        // Add white filter so Kiwi has better contrast with BG
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0xFFFFFF, 0.4).setOrigin(0,0);

        // Ground
        var ground = this.matter.add.image(game.config.width/2, game.config.height - screenUnit/2, 'Ground', null, {isStatic: true });

        // Add Body
        this.body = this.matter.add.sprite(200, game.config.height - 120, "kiwi", "tile000.png", {
          label: 'Kiwi',
          collisionFilter: {
            category: kiwiCategory,
            mask: defaultCategory
          }
        });

        // Add Head
        this.head = this.matter.add.sprite(200, game.config.height - 200, "kiwi", "head000.png", {
          label: 'Kiwi',
          collisionFilter: {
            category: kiwiCategory,
            mask: defaultCategory
          }
        }).setOrigin(0, 0.1);

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
      // Scroll Background Layers
      this.sky.tilePositionY += 0.05;
      this.clouds.tilePositionX -= 0.3;
      this.mountains.tilePositionX += 0.15;
      this.hillsFar.tilePositionX += 0.5;
      this.hillsClose.tilePositionX += 2;

      if (keySPACE.isDown && !this.vaulting && this.neckConst.length <= 550) {
        // Stretch neck constraint. When Head is perfectly balanced straight above body, this sends head straight up
        this.neckConst.length += 20;
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
            duration: 100,
            ease: 'Linear'
          });
        }
      }
    }
  }