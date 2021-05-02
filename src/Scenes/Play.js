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
    this.load.image("Tree1", "./assets/Tree1.png");
    this.load.image("Tree2", "./assets/Tree2.png");
    this.load.image("Tree3", "./assets/Tree3.png");
    this.load.image("Tree4", "./assets/Tree4.png");

    // Load Kiwi Animations Atlas
    this.load.atlas('kiwi', './assets/BodyAndHeadAnims.png', './assets/BodyAndHeadAnims.json');

    // Temp Debugging Assets
    this.load.image('square', "./assets/BrownSquare.png");
    this.load.image('squareB', "./assets/BrownSquareB.png");
    this.load.image('platform', "./assets/Platform.png");

    this.load.image('badToken', "./assets/BadToken.png");
    this.load.image('goodToken', "./assets/GoodToken.png");
  }
  
  

  create() {
      this.Bodies = Phaser.Physics.Matter.Matter.Bodies;

      this.matter.world.setBounds(-game.config.width/4, 0, game.config.width*1.5, game.config.height);

      // Scene Variables
      this.vaulting = false;
      this.categories = [0x0001, 0x0002, 0x0004];
      this.points = 0;
      this.gameOver = true;
      let scene = this;

      
      // Add Background Layers
      this.sky = this.add.tileSprite(0, 0, 3840, 1080, "Sky").setOrigin(0,0);
      this.clouds = this.add.tileSprite(0, 0, 3840, 1080, "Clouds").setOrigin(0,0);
      this.mountains = this.add.tileSprite(0, 0, 3840, 1080, "Mountains").setOrigin(0,0);
      this.hillsFar = this.add.tileSprite(0, 0, 3840, 1080, "HillsFar").setOrigin(0,0);
      this.hillsClose = this.add.tileSprite(0, 0, 3840, 1080, "HillsClose").setOrigin(0,-0.05);

      // Add white filter so Kiwi has better contrast with BG
      this.add.rectangle(0, 0, game.config.width, game.config.height, 0xFFFFFF, 0.4).setOrigin(0,0);

      // Ground
      this.ground = this.matter.add.image(game.config.width/2, game.config.height - screenUnit/2, 'Ground', null, {isStatic: true, label: "Ground"});

      // KIWI CREATION ===================================================================================================

      this.neckRect = this.add.rectangle(205, game.config.height - 115, 13, 40, 0x754C29).setOrigin(0, 0);
      this.neckRect.visible = false;

      // Add Body
      this.body = this.matter.add.sprite(200, game.config.height - 120, "kiwi", "tile000.png", {
        label: 'Kiwi',
        collisionFilter: {
          category: this.categories[1],
          mask: this.categories[0] | this.categories[2]
        },
        frictionAir: 0,
        friction: 0,
        frictionStatic: 0, 
      }).setFixedRotation();

      // Add Head
      this.head = this.matter.add.sprite(200, game.config.height - 200, "kiwi", "head000.png", {
        label: 'Kiwi',
        collisionFilter: {
          category: this.categories[1],
          mask: this.categories[0] | this.categories[2]
        },
        frictionAir: 0,
        friction: 0,
        frictionStatic: 0, 
      }).setOrigin(0, 0.1).setFixedRotation();

      // KIWI CREATION OVER ==============================================================================================

      // Add keys
      keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
      keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);

      // Graphics
      var graphics = this.add.graphics();

      // INTRO SEQUENCE GOES HERE
      this.tweens.add({
          targets: this.body,
          y: this.body.y - 600,
          duration: 5000,
          ease: 'Linear',
      })
      this.tweens.add({
          targets: this.head,
          y: this.head.y - 600,
          duration: 5000,
          ease: 'Linear',
          onComplete: function() {
            scene.finishCreate()
          }
      })

      // INTRO SEQUENCE ENDS WHEN YOU CALL scene.finishCreate()
  }

  finishCreate(){
      let scene = this;
      this.gameOver = false;

      // KIWI ANIMATIONS ============================================================

      // Animation Creating
      let headFrameNames = this.anims.generateFrameNames('kiwi', { prefix: 'head', suffix: ".png", end: 29, zeroPad: 3 });
      let bodyFrameNames = this.anims.generateFrameNames('kiwi', { prefix: 'tile', suffix: ".png", end: 29, zeroPad: 3 });

      // Kiwi Body Running
      this.anims.create({
      key: 'bodyRun',
          frames: bodyFrameNames,
          frameRate: 30,
          repeat: -1
      });
      this.body.anims.play('bodyRun', true);

      // Kiwi Head Running
      this.anims.create({
          key: 'headRun',
          frames: headFrameNames,
          frameRate: 30,
          repeat: -1
      });
      this.head.anims.play('headRun', true);
      // KIWI ANIMS DONE ============================================================

      // Add constraint that represents neck
      this.neckConst = this.matter.add.constraint(this.body, this.head, 70, 1, {angularStiffness: 100});
      this.neckRect.x = this.head.x + 7;
      this.neckRect.y = this.head.y + 5;
      this.neckRect.height = this.neckConst.length - 30
      this.neckRect.visible = true;


      // Add Music
      this.musicConfig =  {
        mute: false,
        volume: 0.75,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0
      };
      this.music = this.sound.add('BGLoop', this.musicConfig);
      this.music.play();

      this.pointsDisplay = this.add.text(game.config.width/2, game.config.height - screenUnit, "0").setOrigin(0.5,0);
      this.addPointBall();

      // Platform
      this.addPlatform(1);
      this.addPlatform(2);
      this.addPlatform(3);
      this.addPlatform(4);

      // BIG COLLISION TRACKER
      this.matter.world.on('collisionstart', function (event) {

          //  Loop through all of the collision pairs
          var pairs = event.pairs;
  
          for (var i = 0; i < pairs.length; i++)
          {
              var bodyA = pairs[i].bodyA;
              var bodyB = pairs[i].bodyB;

              //  We only want sensor collisions with not Ground
              if (pairs[i].isSensor && bodyA.label !== "Ground" && bodyB.label !== "Ground")
              {
                  var pointBody;
                  var playerBody;
  
                  if (bodyA.isSensor)
                  {
                      pointBody = bodyA;
                      playerBody = bodyB;
                  }
                  else if (bodyB.isSensor)
                  {
                      pointBody = bodyB;
                      playerBody = bodyA;
                  }

                  if (playerBody.label != "Kiwi" && playerBody.label != "Platform"){
                    pointBody.parent.gameObject.destroy();
                    console.log("destroyed Point");
                  }

                  else if (pointBody.label === 'pointSensor' && playerBody.label == "Kiwi")
                  {
                    scene.points += 1;
                    scene.pointsDisplay.setText(scene.points);
                    pointBody.parent.gameObject.destroy()
                    //scene.resetObj(pointBody.parent.gameObject);
                  }
                  else if (pointBody.label === 'harmSensor' && playerBody.label == "Kiwi")
                  {
                    scene.points -= 1;
                    scene.pointsDisplay.setText(scene.points);
                    pointBody.parent.gameObject.destroy();
                    //scene.resetObj(pointBody.parent.gameObject);
                  }
              }
          }
      });

      // Menu Config
      let menuConfig = {
        fontFamily: 'Garamond',
        fontSize: '35px',
        color: '#FFFFF0',
        alighn: 'right',
        padding: {
            top: 5,
            bottom: 5
        },
        fixedWidth: 0
    }
    // Menu Button
    menuConfig.backgroundColor = '#04471C';
    let MenuButton = this.add.text(game.config.width - 100, 50, 'Menu', menuConfig).setOrigin(0.5);
    MenuButton.setInteractive();
    MenuButton.on('pointerdown', () => {
      this.music.stop();
      this.scene.start('menuScene');
    });

    
  }

  update(){

    if (!this.gameOver){
      // Scroll Background Layers
      this.sky.tilePositionY += 0.05;
      this.clouds.tilePositionX -= 1.2;
      this.mountains.tilePositionX += 0.6;
      this.hillsFar.tilePositionX += 2;
      this.hillsClose.tilePositionX += 7;

      if (Phaser.Input.Keyboard.JustDown(keyF)){
        this.endGame();
      }
      if (Phaser.Input.Keyboard.JustDown(keyH)){
        this.addHarmBall();
      }

      this.neckRect.x = this.head.x + 7;
      this.neckRect.y = this.head.y + 6;
      this.neckRect.height = this.neckConst.length - 30;
      

      if (keySPACE.isDown && !this.vaulting && this.neckConst.length <= 550) {
        // Stretch neck constraint. When Head is perfectly balanced straight above body, this sends head straight up
        this.neckConst.length += 20;
        // Play stretch sfx if neck stretch initiated
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
          this.sound.play('sfx_NeckStretch');
        }
      }

      if (Phaser.Input.Keyboard.JustUp(keySPACE) && !this.vaulting){
        this.sound.play('sfx_NeckSnap');
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

      // If the player is "dead"
      if ((this.body.x <= 0 || this.body.x >= 300 )&& !this.vaulting ) {
        this.endGame();
      }
      // Reset position after vaulting
      if (this.body.x > 200 && !this.vaulting) {
        console.log('x: ' + this.body.x + ' | bool: ' + this.vaulting);
        this.body.x -= 5;
        this.head.x -= 5;
      }
    }
  }

  resetObj(object){
    object.setX(game.config.width);
  }

  addPointBall(){
    let myPoint = this.matter.add.image(game.config.width, game.config.height/2 + screenUnit, 'goodToken', null);
    let pointBody = this.Bodies.circle(game.config.width, game.config.height/2 + screenUnit, 40, {label: "BADBALL"}); 
    let pointSensor = this.Bodies.circle(game.config.width, game.config.height/2 + screenUnit, 100, {isSensor: true, label: "pointSensor"});
    let compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [ pointSensor, pointBody ],
      ignoreGravity: false,
      restitution: 1,
      collisionFilter: {
        category: this.categories[2],
        mask: this.categories[0] | this.categories[1]
      },
      friction: 0,
      frictionAir: 0,
    });
    
    myPoint.setExistingBody(compoundBody);
    myPoint.applyForce({x: -0.75, y: 0.5});
    return myPoint;
  }

  addHarmBall(){
    let myPoint = this.matter.add.image(game.config.width, game.config.height/2 + screenUnit, 'badToken', null);
    let pointBody = this.Bodies.circle(game.config.width, game.config.height/2 + screenUnit, 40) 
    let pointSensor = this.Bodies.circle(game.config.width, game.config.height/2 + screenUnit, 100, {isSensor: true, label: "harmSensor"});
    let compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [ pointSensor, pointBody ],
      ignoreGravity: false,
      restitution: 1,
      collisionFilter: {
        category: this.categories[2],
        mask: this.categories[0] | this.categories[1]
      },
      friction: 0,
      frictionAir: 0,
    });
    
    myPoint.setExistingBody(compoundBody);
    myPoint.applyForce({x: -0.75, y: 0.5});
    return myPoint;
  }

  addPlatform(y){
    let height;
    let sprite;
    let offset;
    switch (y){
      case 1:
        height = 263;
        sprite = "Tree1";
        offset = 0.15;
        break;
      case 2:
        height = 413;
        sprite = "Tree2";
        offset = 0.1;
        break;
      case 3: 
        height = 573;
        sprite = "Tree3";
        offset = 0.07;
        break;
      case 4: 
        height = 727;
        sprite = "Tree4";
        offset = 0.055;
        break;
      default:
        height = 413;
        sprite = "Tree2";
        offset = 0.1;
        break;
    }

    let platY = game.config.height - screenUnit/2 - height;
    let spriteY = game.config.height - screenUnit - height/2;

    let myTree = this.matter.add.image(game.config.width * 1.25, spriteY, sprite, null);
    let treeBody = this.Bodies.rectangle(game.config.width * 1.25,  platY, 588, screenUnit, {
      label: "Platform",
      ignoreGravity: true,
      category: this.categories[0],
      isStatic: true
    });

    myTree.setExistingBody(treeBody);
    console.log(myTree);

    myTree.setVelocity(-6, 0);
    myTree.setOrigin(0.5, offset);

    this.tweens.add({
      targets: myTree,
      x: -game.config.width/4,
      duration: 7000,
      ease: 'Linear',
      onComplete: function() {
        myTree.destroy();
      }
    })

    return myTree;
  }

  endGame(){
    this.gameOver = true;
    this.head.anims.stop();
    this.body.anims.stop();
    this.matter.world.pause();
    this.music.stop();
    this.tweens.killAll();
    
    let textConfig = {
      fontFamily: 'Garamond',
      fontSize: '35px',
      color: '#FFFFF0',
      alighn: 'right',
      padding: {
          top: 5,
          bottom: 5
      },
      fixedWidth: 0
  }
  textConfig.backgroundColor = '#04471C';

    this.add.text(game.config.width/2, game.config.height/4, 'Oh no, game over.', textConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/4 + 64, 'Your score was: ' + this.points, textConfig).setOrigin(0.5);
    let menuButton = this.add.text(game.config.width/2, game.config.height/4 + 128, 'Click this to return to menu', textConfig).setOrigin(0.5);
    let restartButton = this.add.text(game.config.width/2, game.config.height/4 + 192, 'Click this to restart the game', textConfig).setOrigin(0.5);
    menuButton.setInteractive();
    menuButton.on('pointerdown', () => {
      this.scene.start('menuScene');
    });
    restartButton.setInteractive();
    restartButton.on('pointerdown', () => {
      this.scene.start('playScene');
    });
  }
}