class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }

    preload() {
      this.load.image("ScrollBG", "./assets/TempBackground.jpg");
      this.load.image("Ground", "./assets/Ground.png");
      this.load.spritesheet("Kiwi", "./assets/KiwiRunFullSpritesheet.png", {frameWidth: 938, frameHeight: 847});
      this.load.image('square', "./assets/BrownSquare.png");
      this.load.image('squareB', "./assets/BrownSquareB.png");
    }
    
    create() {
        this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

        var defaultCategory = 0x0001,
            kiwiCategory = 0x0002;
        
        // Add Background
        this.bg = this.add.tileSprite(0,0, 1920, 1080, "ScrollBG").setOrigin(0,0);

        // Ground
        var ground = this.matter.add.image(game.config.width/2, game.config.height - screenUnit/2, 'Ground', null, {isStatic: true });

        // Add Body
        this.body = this.matter.add.image(200, game.config.height - 120, 'square', null, {
          label: 'kiwiBody',
          collisionFilter: {
            category: kiwiCategory,
            mask: defaultCategory
          }
        });

        // Add Head
        this.head = this.matter.add.image(200, game.config.height - 200, 'squareB', null, {
          label: 'kiwiHead',
          collisionFilter: {
            category: kiwiCategory,
            mask: defaultCategory
          }
        });

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

      if (keySPACE.isDown && !this.vaulting && this.neckConst.length <= 600) {
        // Stretch neck constraint. When Head is perfectly balanced straight above body, this sends head straight up
        this.neckConst.length += 5;
      }

      if (Phaser.Input.Keyboard.JustUp(keySPACE) && !this.vaulting){
        if (this.neckConst.length >= 170){
          // Do vault
          this.vaulting = true;
          this.doVault();
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

    doVault(){
      let myHead = this.head;
      let myBod = this.body;
      let scene = this;


      // Head falls, rotating around fixed point body.
      myBod.setStatic(true);
      myHead.setStatic(false);
      myHead.applyForce({x: 0.25, y: 0});
      

      // When the head hits the ground
      myHead.setOnCollide(function(event) {
        // We need to apply force using this method, Matter.js apparntly clears all forces on event emit
        scene.matter.world.once('beforeupdate', function(){

          // Body launches, rotating around fixed point head
          myBod.setStatic(false);
          myHead.setStatic(true);
          myBod.applyForce({x: 0, y: -1});

          // Retract neck length
          scene.tweens.add({
            targets: scene.neckConst,
            length: 70,
            duration: 1000,
            ease: 'Linear',
          });

          // Remove both collide functions so they don't re-trigger
          myBod.setOnCollide(function(event) {
            myBod.setOnCollide(function() { /* do nothing */ });
            myHead.setOnCollide(function() { /* do nothing */ });
          });

          // This no longer vaulting.
          scene.vaulting = false;
        });
      })
    }
  }