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
      this.load.image('platform', "./assets/Platform.png");

      this.load.image('badToken', "./assets/BadToken.png");
      this.load.image('goodToken', "./assets/GoodToken.png");
    }
    
    

    create() {
      this.Bodies = Phaser.Physics.Matter.Matter.Bodies;

        this.matter.world.setBounds(-game.config.width/4, 0, game.config.width*1.5, game.config.height);

        var kiwiTexture = this.textures.get('kiwi');

        this.categories = [0x0001, 0x0002, 0x0004];

        
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

        /* Platform causes bird head/body to desync
        this.platform = this.matter.add.image(game.config.width, game.config.height/2, 'platform', null, {
          ignoreGravity: true,
          category: defaultCategory,
          isStatic: true
        });

        this.platform.setVelocity(-3, 0); */

               

        // Add Body
        this.body = this.matter.add.sprite(200, game.config.height - 120, "kiwi", "tile000.png", {
          label: 'Kiwi',
          collisionFilter: {
            category: this.categories[1],
            mask: this.categories[0] | this.categories[2]
          },
          frictionAir: 0.05,
        });

        // Add Head
        this.head = this.matter.add.sprite(200, game.config.height - 200, "kiwi", "head000.png", {
          label: 'Kiwi',
          collisionFilter: {
            category: this.categories[1],
            mask: this.categories[0] | this.categories[2]
          },
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

        let myBod = this.body;
        let myHead = this.head;
        let scene = this;

        this.points = 0;
        this.pointsDisplay = this.add.text(game.config.width/2, game.config.height - screenUnit, "0").setOrigin(0.5,0);

        this.addPointBall();

        this.matter.world.on('collisionstart', function (event) {

          //  Loop through all of the collision pairs
          var pairs = event.pairs;
  
          for (var i = 0; i < pairs.length; i++)
          {
              var bodyA = pairs[i].bodyA;
              var bodyB = pairs[i].bodyB;
  
              if (bodyA.label == "BADBALL" || bodyB.label == "BADBALL" && bodyA.label !== "Ground" && bodyB.label !== "Ground"){
                console.log(" YO WHAT THE HELL");
                console.log(pairs);
                bodyA.setStatic(true);
                bodyB.setStatic(true);
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

                  if (playerBody.label != "Kiwi" ){
                    pointBody.parent.gameObject.destroy();
                    console.log("destroyed Point");
                  }

                  else if (pointBody.label === 'pointSensor')
                  {
                    scene.points += 1;
                    scene.pointsDisplay.setText(scene.points);
                    scene.resetObj(pointBody.parent.gameObject);
                  }
                  else if (pointBody.label === 'harmSensor')
                  {
                    scene.points -= 1;
                    scene.pointsDisplay.setText(scene.points);
                    scene.resetObj(pointBody.parent.gameObject);
                  }
              }
          }
        });

        
        // Add constraint that represents neck
        this.neckConst = this.matter.add.constraint(this.body, this.head, 70, 1, {angularStiffness: 100});
    

        this.vaulting = false;

        // Add keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);

        var graphics = this.add.graphics();

    }

    update(){
      // Scroll Background Layers
      this.sky.tilePositionY += 0.05;
      this.clouds.tilePositionX -= 0.3;
      this.mountains.tilePositionX += 0.15;
      this.hillsFar.tilePositionX += 0.5;
      this.hillsClose.tilePositionX += 2;

      //this.platform.setX(this.platform.x - 4);

      if (Phaser.Input.Keyboard.JustDown(keyF)){
        this.addPointBall();
      }
      if (Phaser.Input.Keyboard.JustDown(keyH)){
        this.addHarmBall();
      }

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
      myPoint.applyForce({x: -0.5, y: 0.5});
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
      myPoint.applyForce({x: -0.5, y: 0.5});
      return myPoint;
    }
  }