class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }

  preload() {
    // Load Trees
    this.load.image("Tree1", "./assets/Tree1.png");
    this.load.image("Tree2", "./assets/Tree2.png");
    this.load.image("Tree3", "./assets/Tree3.png");
    this.load.image("Tree4", "./assets/Tree4.png");

    // Load birds
    this.load.spritesheet('Birds', "./assets/BirdFly-154w-154h-8frames.png", {frameWidth: 154, frameHeight: 154, startFrame: 0, endFrame: 7})

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
      this.lives = 5;
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

      let neckBod = this.Bodies.rectangle(212,  game.config.height - 95, 14, 40, {
        label: "KiwiNeck",
        ignoreGravity: true,
        collisionFilter: {
          category: this.categories[1],
          mask: this.categories[0] | this.categories[2]
        },
        isSensor: true,
      });
      let neckRect = this.add.rectangle(205, game.config.height - 115, 22, 40, 0x785434).setOrigin(0, 0);
      neckRect.visible = false;

      this.neck = this.matter.add.gameObject(neckRect,  neckBod);

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
        gravityScale: {x: 1, y: 1.2}
      }).setFixedRotation();

      this.bodySensor = this.matter.add.rectangle(260,  this.body.y, 20, 75, {
        label: "KiwiBodSensor",
        ignoreGravity: true,
        collisionFilter: {
          category: this.categories[1],
          mask: this.categories[0] | this.categories[2]
        },
        isSensor: true,
        frictionAir: 0,
        friction: 0,
        frictionStatic: 0, 
      });

      // Add Head
      this.head = this.matter.add.sprite(200, game.config.height - 200, "kiwi", "head000.png", {
        label: 'KiwiHead',
        collisionFilter: {
          category: this.categories[1],
          mask: this.categories[0] | this.categories[2]
        },
        frictionAir: 0,
        friction: 0,
        frictionStatic: 0, 
        gravityScale: {x: 1, y: 1.2}
      }).setOrigin(0, 0.1).setFixedRotation();

      this.head.setStatic(true);
      this.body.setStatic(true);

      // KIWI CREATION OVER ==============================================================================================

      // Add keys
      keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
      keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);

      // Graphics
      var graphics = this.add.graphics();

      // INTRO SEQUENCE GOES HERE

      /* this.tweens.add({
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
          }
      }) */

      this.anims.create({
        key: 'birdFly',
        frames: this.anims.generateFrameNumbers('Birds', { start: 0, end: 7, first: 0}),
        frameRate: 30,
        repeat: -1
      });

      for (let i = 0; i < 7; i++){
        let newBird = this.add.sprite(-200, Math.random() * 300 + 50, 'Birds');
        newBird.play('birdFly');
        this.tweens.add({
          targets: newBird,
          x: game.config.width + 200,
          duration: 3000 + i*100,
          ease: 'Linear',
          onComplete: function() {
            newBird.destroy();
          }
        });
      }
      let newBird = this.add.sprite(-200, Math.random() * 300 + 50, 'Birds');
      newBird.play('birdFly');
      this.tweens.add({
        targets: newBird,
        x: game.config.width + 200,
        duration: 4000,
        ease: 'Linear',
        onComplete: function() {
          newBird.destroy();
          scene.finishCreate()
        }
      });

      // scene.finishCreate()
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
      this.neck.x = this.head.x + 2;
      this.neck.y = this.head.y + 10 + (this.neckConst.length - 30)/2;
      this.neck.height = this.neckConst.length - 30
      this.neck.visible = true;

      this.head.setStatic(false);
      this.body.setStatic(false);

      // Add Music
      this.musicConfig =  {
        mute: false,
        volume: 1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0
      };
      this.music = this.sound.add('BGLoop', this.musicConfig);
      this.music.play();

      this.addPointBall();
      this.pointBalls = scene.time.addEvent({
        delay: 3000,                // ms
        callback: () => {scene.addPointBall()},
        //args: [],
        callbackScope: this,
        loop: true
      });
      this.harmBalls = scene.time.addEvent({
        delay: 10000,                // ms
        callback: () => {scene.addHarmBall()},
        //args: [],
        callbackScope: this,
        loop: true
      });
      this.addPlatform();

      // BIG COLLISION TRACKER
      this.matter.world.on('collisionstart', function (event) {

          //  Loop through all of the collision pairs
          var pairs = event.pairs;
  
          for (var i = 0; i < pairs.length; i++)
          {
              var bodyA = pairs[i].bodyA;
              var bodyB = pairs[i].bodyB;

              if (((bodyA.label == "KiwiNeck" || bodyA.label == "KiwiBodSensor" || bodyA.label == "KiwiHead") && bodyB.label == "Platform") || ((bodyB.label == "KiwiNeck" || bodyB.label == "KiwiBodSensor" || bodyB.label == "KiwiHead") && bodyA.label == "Platform")){
                scene.endGame();
              }

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

                  if (playerBody.label != "Kiwi" && playerBody.label != "KiwiHead" && playerBody.label != "KiwiNeck" && playerBody.label != "Platform" && pointBody.label != "KiwiNeck" && pointBody.parent.gameObject){
                    pointBody.parent.gameObject.destroy();
                  }

                  else if (pointBody.label === 'pointSensor' && pointBody.parent.gameObject && (playerBody.label == "Kiwi" || playerBody.label == "KiwiHead"))
                  {
                    scene.points += 1;
                    scene.pointsDisplay.setText('Score: ' + scene.points);
                    pointBody.parent.gameObject.destroy()
                    //scene.resetObj(pointBody.parent.gameObject);
                  }
                  else if (pointBody.label === 'harmSensor' && pointBody.parent.gameObject && (playerBody.label == "Kiwi" || playerBody.label == "KiwiHead"))
                  {
                    scene.lives -= 1;
                    scene.pointsDisplay.setText('Score: ' + scene.points);
                    pointBody.parent.gameObject.destroy();
                    if (scene.lives == 0){
                      scene.endGame();
                    }
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

    // Display Score
    this.pointsDisplay = this.add.text(75, 20, "Score: 0", menuConfig).setOrigin(0.5,0);

  }

  update(){

    if (!this.gameOver){
      // Scroll Background Layers
      this.sky.tilePositionY += 0.05;
      this.clouds.tilePositionX -= 1.2;
      this.mountains.tilePositionX += 0.6;
      this.hillsFar.tilePositionX += 2;
      this.hillsClose.tilePositionX += 7;

      this.neck.x = this.head.x + 14;
      this.neck.y = this.head.y + 10 + (this.neckConst.length - 30)/2;
      this.bodySensor.position.y = this.body.y;
      this.neck.setScale(1, (this.neckConst.length - 30)/40);
      

      if (keySPACE.isDown && !this.vaulting && this.neckConst.length <= 580 && this.head.y > 100) {
        // Stretch neck constraint. When Head is perfectly balanced straight above body, this sends head straight up
        this.neckConst.length += 15;
        // Play stretch sfx if neck stretch initiated
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
          this.sound.play('sfx_NeckStretch');
        }
      }

      if (Phaser.Input.Keyboard.JustUp(keySPACE) && !this.vaulting){
        this.sound.play('sfx_NeckSnap');
        if (this.neckConst.length >= 170){
          // Do vault
          let scene = this;
          scene.vaulting = true;
          let myHead = this.head.setStatic(true);
          this.body.setStatic(false);
          this.tweens.add({
            targets: this.neckConst,
            length: 70,
            duration: this.neckConst.length - 50,
            ease: 'Linear',
            onComplete: function(){
              myHead.setStatic(false);
              scene.vaulting = false;
            }
          });
          
        } else {
          // Retract neck
          this.tweens.add({
            targets: this.neckConst,
            length: 70,
            duration: 50,
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
    let height = Math.random()*game.config.height*0.6;
    let myPoint = this.matter.add.image(game.config.width, height, 'goodToken', null);
    let pointBody = this.Bodies.circle(game.config.width, height, 50, {label: "BADBALL"}); 
    let pointSensor = this.Bodies.circle(game.config.width, height, 80, {isSensor: true, label: "pointSensor"});
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
    myPoint.applyForce({x: -0.8 - Math.random()/2, y: 0});
    return myPoint;
  }

  addHarmBall(){
    let height = Math.random()*game.config.height*0.6;
    let myPoint = this.matter.add.image(game.config.width, height, 'badToken', null);
    let pointBody = this.Bodies.circle(game.config.width, height, 50) 
    let pointSensor = this.Bodies.circle(game.config.width, height, 80, {isSensor: true, label: "harmSensor"});
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
    myPoint.applyForce({x: -0.8 - Math.random()/2, y: 0});
    return myPoint;
  }

  addPlatform(y){
    let scene = this;
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

    myTree.setVelocity(-6, 0);
    myTree.setOrigin(0.5, offset);

    this.tweens.add({
      targets: myTree,
      x: -game.config.width/4,
      duration: 7000,
      ease: 'Linear',
      onComplete: function() {
        myTree.destroy();
        scene.addPlatform(Math.floor(Math.random()*4 + 1));
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

    this.time.removeEvent(this.pointBalls);
    this.time.removeEvent(this.harmBalls);
    
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