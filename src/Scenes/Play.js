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

        // Add Kiwi Parts
        this.body = this.matter.add.image(200, game.config.height - 120, 'square', null, {
          label: 'kiwiBody',
          collisionFilter: {
            category: kiwiCategory,
            mask: defaultCategory
          },
          sleepThreshold: 60
        });
        this.head = this.matter.add.image(200, game.config.height - 200, 'squareB', null, {
          label: 'kiwiHead',
          collisionFilter: {
            category: kiwiCategory,
            mask: defaultCategory
          },
          sleepThreshold: 60
        });
        this.head.setSleepEvents(true, true);

        this.neckConst = this.matter.add.constraint(this.body, this.head, 70, 1);
    

        this.vaulting = false;
        // Add keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        var graphics = this.add.graphics();

    }

    update(){
      // Scroll Background
      this.bg.tilePositionX += 8;

      if (keySPACE.isDown && !this.vaulting && this.neckConst.length <= 600) {
        this.neckConst.length += 5;
      }

      if (Phaser.Input.Keyboard.JustUp(keySPACE) && !this.vaulting){
        if (this.neckConst.length >= 170){
          this.vaulting = true;
          this.doVault();
        } else {
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
      myBod.setStatic(false);
      myHead.setStatic(false);
      myHead.applyForce({x: 0.25, y: 0});
      

      myHead.setOnCollide(function(event) {
        console.log(myHead);
        scene.matter.world.once('beforeupdate', function(){
          myBod.setStatic(false);
          myHead.setStatic(true);
          myBod.applyForce({x: 0, y: -1});

          scene.tweens.add({
            targets: scene.neckConst,
            length: 70,
            duration: 1000,
            ease: 'Linear'
          });

          

          myBod.setOnCollide(function(event) {
            myBod.setOnCollide(function() { /* do nothing */ });
            myHead.setOnCollide(function() { /* do nothing */ });
            

            scene.vaulting = false;
            myBod.setStatic(false);
            scene.tweens.add({
              targets: myHead,
              x: 200,
              y: game.config.height - 180,
              duration: 1000,
              ease: 'Linear',
              onComplete: function () {
                console.log("I did the thing");
                scene.vaulting = false;
                
                myBod.setStatic(true);
                myHead.setStatic(true);

                myBod.x = 200;
                myHead.x = 200;
                myBod.y = game.config.height - 130;
                myHead.y = game.config.height - 200;
                myBod.angle = 0;
                myHead.angle = 0;

                //myBod.setStatic(false);
                //myHead.setStatic(false);
              }
            });
          });
        });
      })
    }
  }