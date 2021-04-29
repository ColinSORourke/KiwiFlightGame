class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }

    preload() {
      this.load.image("ScrollBG", "./assets/TempBackground.jpg");
    }
    
    create() {
        
        // Add Background
        this.bg = this.add.tileSprite(0,0, 1920, 1080, "ScrollBG").setOrigin(0,0);

        // Ground
        this.add.rectangle(0, groundLevel, game.config.width, screenUnit, 0x7CA982).setOrigin(0,0);

        // Add Kiwi Parts
        this.body = this.add.rectangle(screenUnit*2, groundLevel, screenUnit, screenUnit, 0x823200).setOrigin(0,1);
        this.head = this.add.rectangle(screenUnit*2.5, groundLevel - screenUnit*.75, screenUnit*0.75, screenUnit*0.75, 0x823200).setOrigin(0,1);

        // Add keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){
      // Scroll Background
      this.bg.tilePositionX += 8;

      // Stretch head.
      if (keySPACE.isDown && this.head.y >= screenUnit*2){
        this.head.y -= 5;
      }

      if (Phaser.Input.Keyboard.JustUp(keySPACE)){
        if (this.head.y <= groundLevel - screenUnit*2){
          // Do 'Vault'
          this.doVault();
        } else {
          // Go back to body
          this.head.y = groundLevel - screenUnit*.75;
        }
      }
    }

    doVault(){
      let height = (groundLevel - screenUnit*.75) - this.head.y;
      console.log(height);
      let middle = this.head.x + height*0.5;
      let scene = this;

      // THIS IS HEAD -> GGROUND
      let headFall = this.tweens.add({
        targets: this.head,
        x: this.head.x + height*0.5,
        y: groundLevel,
        duration: 1000,
        ease: 'Linear',
        onComplete: function() {
          // BODY UP
          scene.tweens.add({
            targets: scene.body,
            y: groundLevel - height,
            duration: 1000,
            ease: 'Linear',
            // BODY BACK TO ORIGINAL POS
            onComplete: function () {
              scene.tweens.add({
                targets: scene.body,
                y: groundLevel,
                duration: 1000,
                ease: 'Linear',
                onComplete: function () {
                  // more stuff
                }
              });
            }
          });
          // HEAD BACK TO LEFT SIDE OF SCREEN
          scene.tweens.add({
            targets: scene.head,
            x: scene.body.x + screenUnit/2,
            y: groundLevel,
            duration: 500,
            ease: 'Linear',
            onComplete: function () {
              // HEAD BACK UP TO BODY
              scene.tweens.add({
                targets: scene.head,
                x: scene.body.x + screenUnit/2,
                y: groundLevel - (height + screenUnit*.75),
                duration: 500,
                ease: 'Linear',
                onComplete: function () {
                  // HEAD BACK TO ORIGINAL POS
                  scene.tweens.add({
                    targets: scene.head,
                    y: groundLevel - (screenUnit*.75),
                    duration: 1000,
                    ease: 'Linear',
                    onComplete: function () {
                      // more stuff
                    }
                  });
                }
              });
            }
          });

        },
      });
    }
  }