import { Scene } from "phaser";
import drawEndbox from "./drawEndbox";
import drawGameOver from "./drawGameOver";
let fontName = "squaredance10";
let fontSize = 12;
let bearWalk;
let score;
let baseScore;
let thisContext;
let joystick;
let penguins;
let birds;
let deadPenguins = 0;
let penguinCounter = 0;
let birdMFD = 96;
let penguinSizeX = 8;
let penguinSizeY = 12;
let penguinSizeOffsetX = 4;
let penguinSizeOffsetY = 4;
let birdSizeX = 20;
let birdSizeY = 20;
let birdSizeOffsetX = 0;
let birdSizeOffsetY = 0;
let splashpointLocation;
let splashPoint;
let splashPointFish;
let scoreText;
let currentScoreText;
let exitPoint;
let fishText;
let attachedText;
let introAnimation;
let introAnimationPlaying = false;
let attackButtonclicked = false;
let healthBar = [];
let music;
let musicPlaying = false;
let stopMusic = false;
let penguinDeath;
let bearAttack;
let seagullSounds;
let castingSound;
let splashSound;
let reelSound;
let jumpSound;
let levelComplete;
let loseSound;
let bearHit;
//how fast they fly when you smack em
let hitSpeed = 50;
const penguinVision = 100;
const minimumFollowDistance = 50;
let spawnpoint = { x: 50, y: 330 };
let deathline;
let map;
class Level_2 extends Scene {
  constructor() {
    super("level_2");
  }

  init(data) {
    //setup the intro scene variables
    introAnimation = true;
    introAnimationPlaying = false;
    stopMusic = false;
    //delete all fish in the healthbar for reset
    if (healthBar) {
      healthBar.length = 0;
    }
    //reset deadPenguins counter for level
    deadPenguins = 0;
    console.log("init", data);
    //process data payload, if any.
    //what map is this to be?
    if (data?.loadMap) {
      this.loadMap = data.loadMap;

      data.data = { loadMap: data.loadMap, score: data.score };
    }
    if (data?.data?.loadMap) this.loadMap = data.data.loadMap;
    //if no map, map == 1
    if (!this?.loadMap) {
      this.loadMap = 1;
    }
    let songNumber = Math.ceil(this.loadMap / 2);

    music = this.sound.add(`music${songNumber}`);
    penguinDeath = this.sound.add("penguinDeath");
    bearHit = this.sound.add("bearHit");
    castingSound = this.sound.add("casting");
    reelSound = this.sound.add("reel");
    splashSound = this.sound.add("splash");
    bearAttack = [
      this.sound.add("bearAttack01"),
      this.sound.add("bearAttack02"),
    ];
    seagullSounds = [
      this.sound.add("seagull_01"),
      this.sound.add("seagull_02"),
      this.sound.add("seagull_03"),
      this.sound.add("seagull_04"),
      this.sound.add("seagull_05"),
      this.sound.add("seagull_06"),
    ];
    jumpSound = this.sound.add("jump");
    levelComplete = this.sound.add("level-complete");
    loseSound = this.sound.add("lose");
    //recieve current score
    if (data?.data?.score) {
      baseScore = data.data.score;
    }
    //if none then == 0
    if (!baseScore) {
      baseScore = 0;
    }
    //set the current level score counter to 0
    console.log(baseScore);
    score = 0;
    console.log("loadMap", this.loadMap);
  }

  create() {
    console.log(music);
    this.input.addPointer(3);

    function attackButtonHandler(event) {
      console.log(event.isDown);
      // console.log(event);
      if (event.isDown) {
        attackButtonclicked = true;
        // console.log(attackButtonclicked);
      } else {
        attackButtonclicked = false;
      }
    }
    //pointer for context for reasons.
    thisContext = this;
    //todo: manage level looping based on an array of levels
    //loops through the levels after playing through them once.
    if (this.loadMap && this.loadMap < 10) {
      map = this.make.tilemap({ key: `map${this.loadMap}` });
    }
    if (this.loadMap && this.loadMap >= 10) {
      map = this.make.tilemap({ key: `map${(this.loadMap % 10) + 1}` });
    }
    // if somehow you get here without a loadmap then load level 1
    if (!this.loadMap) {
      map = this.make.tilemap({ key: "map1" });
    }
    //find the spawn point from the json map
    spawnpoint = map.findObject("Objects", (obj) => obj.name === "spawnPoint");
    //print background image
    deathline = map.findObject("Objects", (obj) => obj.name === "deathline");
    //todo: background images based on json level

    this.add
      .image(350 + 0, 200, "sky")
      .setScale(3)
      .setScrollFactor(0.3);
    //print the map onto the screen from the json map with the loaded iceTiles
    const tileset = map.addTilesetImage("iceTiles_001", "tiles");
    const worldLayer = map.createLayer("Platforms", tileset, 0, 0);

    //load the exit point for the level from the json map.
    let exitpointLocation = map.findObject(
      "Objects",
      (obj) => obj.name === "exitPoint"
    );
    //spawn the exit point.
    //todo: animate the door.
    exitPoint = this.physics.add.sprite(
      exitpointLocation.x,
      exitpointLocation.y,
      "door"
    );
    //load the splashPoint from the json for the intro animation.
    splashpointLocation = map.findObject(
      "Objects",
      (obj) => obj.name === "splashPoint"
    );
    //spawn the splash animation from the sprite.
    splashPoint = this.physics.add.sprite(
      splashpointLocation.x,
      splashpointLocation.y,
      "water-splash"
    );
    //spawn the prop fish under the splash point.
    //todo: animate the fish around the bait initially
    splashPointFish = this.physics.add
      .image(splashpointLocation.x - 50, splashpointLocation.y, "fish")
      .setScale(2)
      .setAngle(-45)
      .setVelocityX(10);
    //no gravity because prop.
    splashPointFish.body.setAllowGravity(false);

    //nake the tile made map tiles marked "collides: true" to collision surfaces. (the water is collides: false, aka you can pass through it.)
    worldLayer.setCollisionByProperty({ collides: true });
    worldLayer.width = 400;

    //define width/height
    const { height, width } = this.game.config;

    //bear spawn
    //load the idle sprite initially with standard bear collision/bounce.
    bearWalk = this.physics.add.sprite(spawnpoint.x, spawnpoint.y, "bear-idle");
    bearWalk.setScale(2);
    bearWalk.setBounce(0.2);
    bearWalk.setCollideWorldBounds(false);
    //attacking off, fish remaining set to 10
    //todo: manage # of fish in per map by json.
    //todo: maybe less fish later on.
    bearWalk.attacking = false;
    bearWalk.hurt = false;
    bearWalk.fish = 10;

    //map the animations

    //door animation
    this.anims.create({
      key: "door",
      frames: this.anims.generateFrameNumbers("door", {
        start: 0,
        end: 0,
      }),
    });

    //fishing
    this.anims.create({
      key: "bear-casting",
      frames: this.anims.generateFrameNumbers("bear-casting", {
        start: 0,
        end: 9,
      }),
      frameRate: 5,
      repeat: -1,
    });
    //water splash animation
    this.anims.create({
      key: "water-splash",
      frames: this.anims.generateFrameNumbers("water-splash", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "bear-fishing",
      frames: this.anims.generateFrameNumbers("bear-fishing", {
        start: 0,
        end: 6,
      }),
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: "bear-catching",
      frames: this.anims.generateFrameNumbers("bear-catching", {
        start: 0,
        end: 7,
      }),
      frameRate: 5,
      repeat: 0,
    });

    //bear game animations
    //death animation
    this.anims.create({
      key: "bear-loser",
      frames: this.anims.generateFrameNumbers("bear-loser", {
        start: 0,
        end: 0,
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "bear-walk",
      frames: this.anims.generateFrameNumbers("bear-walk", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "bear-hit",
      frames: this.anims.generateFrameNumbers("bear-hit", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "bear-attack",
      frames: this.anims.generateFrameNumbers("bear-attack", {
        start: 0,
        end: 7,
      }),
      frameRate: 15,
      repeat: 0,
    });
    this.anims.create({
      key: "bear-idle",
      frames: this.anims.generateFrameNumbers("bear-idle", {
        start: 0,
        end: 7,
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "bear-jump",
      frames: this.anims.generateFrameNumbers("bear-jump", {
        start: 0,
        end: 1,
      }),
      frameRate: 1,
      repeat: -1,
    });
    // bird animations
    this.anims.create({
      key: "bird-flight",
      frames: this.anims.generateFrameNumbers("bird-flight", {
        start: 0,
        end: 3,
      }),
      frameRate: 4,
      repeat: -1,
    });

    //penguin animations
    this.anims.create({
      key: "penguin-idle",
      frames: this.anims.generateFrameNumbers("penguin-idle", {
        start: 0,
        end: 7,
      }),
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: "penguin-slide",
      frames: this.anims.generateFrameNumbers("penguin-slide", {
        start: 0,
        end: 2,
      }),
      frameRate: 3,
      repeat: 0,
    });
    this.anims.create({
      key: "penguin-walk",
      frames: this.anims.generateFrameNumbers("penguin", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "penguin-death",
      frames: this.anims.generateFrameNumbers("penguin-death", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: 0,
    });
    //

    //spawning bird(s)
    birds = [];
    //spawning penguins
    //empty array to house the penguins
    penguins = [];
    //spawnpoints for penguins are declaired in the json map
    spawnpoint = map.findObject("Objects", (obj) => obj.name === "spawnPoint");

    //helper function
    const gameObjectsToObjectPoints = (gameObjects) => {
      return gameObjects.map((gameObject) => gameObject);
    };
    const initBirds = () => {
      const birdSpawns = gameObjectsToObjectPoints(
        map.filterObjects("Objects", (obj) => obj.name === "birdSpawnPoint")
      );
      birds = birdSpawns.map((birdSpawn) =>
        this.physics.add
          .sprite(birdSpawn.x, birdSpawn.y, "bird-flight")
          .setSize(birdSizeX, birdSizeY)
          .setOffset(birdSizeOffsetX, birdSizeOffsetY)
      );
      birds.forEach((bird) => {
        bird.maxFD = Math.floor(Math.random() * 30) + birdMFD;
        bird.minFD = birdMFD - Math.floor(Math.random() * 30);
        bird.maxYD = 450;
      });
    };
    const initPenguins = () => {
      //process the penguin spawn points from the json map using helper
      const penguinSpawns = gameObjectsToObjectPoints(
        map.filterObjects("Objects", (obj) => obj.name === "penguinSpawner")
      );
      //spawn the actual penguins on the spawn points.
      penguins = penguinSpawns.map((penguinSpawn) =>
        this.physics.add
          .sprite(penguinSpawn.x, penguinSpawn.y, "penguin")
          .setSize(penguinSizeX, penguinSizeY)
          .setOffset(penguinSizeOffsetX, penguinSizeOffsetY)
      );
    };

    initPenguins();
    initBirds();

    let mainCamera = this.cameras.main;

    function endGameHandler(endContext) {
      //stop the music from looping, then prepare to play the next song
      stopMusic = true;
      music.stop();
      // todo: add level end sound play to transition

      if (!endContext) {
        endContext = thisContext;
      }
      if (!score) {
        score = 0;
      }
      score = baseScore + bearWalk.fish * 1000 - deadPenguins * 250;

      endContext.scene.restart({
        loadMap: endContext.loadMap + 1,
        score: score,
      });
    }

    function endGameContextHandler(gameContext) {
      console.log(gameContext);
      const gameRestartTimer = gameContext.time.addEvent({
        delay: 3500, // ms
        callback: endGameHandler,
        //args: [],
        loop: false,
      });
      // endGameHandler(gameContext);
      for (let i; i < penguins.length; i++) {
        penguins[i].disableBody(true, false);
      }
      bearWalk.disableBody(true, false);
    }

    const collisionHandler = (bear, penguin) => {
      if (bearWalk.attacking == true) {
        if (penguin.flipX == true) {
          penguin.setVelocityX(-Math.floor(Math.random() * hitSpeed));
        } else {
          penguin.setVelocityX(Math.floor(Math.random() * hitSpeed));
        }
        const deathSlideTimer = this.time.addEvent({
          delay: 400, // ms
          callback: () => {
            penguin.setVelocityX(0);
            penguin.disableBody(true, false);
          },
          //args: [],
          loop: false,
        });
        penguin.dead = true;
      } else if (!bearWalk.hurt && !bearWalk.gameOver) {
        bearHit.play();

        bearWalk.hurt = true;
        bearWalk.play("bear-hit", true);
        const animateMinusFish = () => {
          let minusFish = this.physics.add
            .sprite(attachedText.x - 10, attachedText.y + 60, "fish")
            .setScale(2);

          this.tweens.add({
            targets: minusFish,
            angle: -175,
            duration: 300,
          });

          const destroyTimer = this.time.addEvent({
            delay: 2200, // ms
            callback: () => {
              minusFish.destroy();
            },
            //args: [],
            loop: false,
          });
          const disappearTimer = this.time.addEvent({
            delay: 1400, // ms
            callback: () => {
              this.tweens.add({
                targets: minusFish,
                alpha: 0,
                duration: 450,
              });
            },
            //args: [],
            loop: false,
          });

          this.physics.add.collider(worldLayer, minusFish);
        };
        const timer = this.time.addEvent({
          delay: 650, // ms
          callback: () => {
            bearWalk.hurt = false;
            bearWalk.play("bear-idle", true);
          },
          //args: [],
          loop: false,
        });
        console.log("bump the bear");
        bearWalk.fish--;

        animateMinusFish();
        if (healthBar[bearWalk.fish]) {
          healthBar[bearWalk.fish].destroy();
          healthBar.splice(bearWalk.fish, 1);
        }
        if (bearWalk.fish <= 0) {
          stopMusic = true;
          music.stop();
          bearWalk.gameOver = true;
          bearWalk.disableBody(true, true);
          loseSound.play();
          drawGameOver(
            deadPenguins,
            bearWalk.fish,
            this.loadMap,
            thisContext,
            baseScore,
            null
          );
        }
      }
    };

    const exitHandler = (bear, exit, context) => {
      console.log(context);

      console.log("collision");

      console.log("thisContext:", thisContext);
      if (!score) {
        score = 0;
      }
      score = +baseScore + bearWalk.fish * 1000 - deadPenguins * 250;
      music.pause();
      levelComplete.play();
      drawEndbox(
        deadPenguins,
        bearWalk.fish,
        this.loadMap,
        thisContext,
        score,
        endGameContextHandler
      );
      endGameContextHandler(this);
    };
    //make things collide
    this.physics.add.collider(worldLayer, bearWalk);
    this.physics.add.collider(worldLayer, exitPoint);
    this.physics.add.collider(worldLayer, penguins);
    this.physics.add.overlap(bearWalk, exitPoint, exitHandler, null, this);
    this.physics.add.overlap(bearWalk, penguins, collisionHandler, null, this);

    //camera follows the bear
    currentScoreText = this.add.text("score: " + deadPenguins, {
      font: "12px",
      fontFamily: "squaredance10",
      fill: "#A00",
    });
    // console.log(this);
    joystick = this.plugins.get("rexVirtualJoystick").add(this.scene, {
      x: 50,
      y: height - 50,
      radius: 33,
      base: this.add.circle(0, 0, 35, 0x2b5967, 0.5),
      thumb: this.add.circle(0, 0, 20, 0x53a593, 0.5),
      dir: "8dir",
      // forceMin: 16,
      fixed: true,
      // enable: true
    });
    const attackButton = this.add
      .circle(width - 50, height - 50, 35, 0xff0000, 0.0)
      .setInteractive()
      .setScrollFactor(0)
      .on("pointerdown", attackButtonHandler)
      .on("pointerup", attackButtonHandler);
    scoreText = this.add.text("dead penguins: " + deadPenguins, {
      font: "12px",
      fontFamily: "squaredance10",
      fill: "#A00",
    });
    attachedText = this.add.text("");
    fishText = this.add.text("fish Remaining: " + bearWalk.fish, {
      font: "12px",
      fontFamily: "squaredance10",
      fill: "#A00",
    });
    this.cameras.main.startFollow(bearWalk);

    for (let i = 0; i < bearWalk.fish; i++) {
      // console.log("for loop");
      // if (bearWalk.fish - 2 >= 0) {
      // console.log(bearWalk);
      let inv = healthBar.length;
      healthBar.push(
        this.add
          .image(this.game.config.width - 200 + i * 20, 20, "fish")
          .setScrollFactor(0)
          .setScale(2)
      );
      // }
    }
    attachedText = this.add
      .text(bearWalk.x, bearWalk.y, "", { font: "12px" })
      .setScrollFactor(1);
  }
  update() {
    thisContext = this;
    musicPlaying = music.seek;
    if (musicPlaying == 0 && stopMusic == false) {
      music.stop();
      music.play();
    }
    // console.log(musicPlaying);
    // console.log(bearWalk.x, bearWalk.y);
    attachedText.x = bearWalk.x + 15;
    attachedText.y = bearWalk.y - 60;
    currentScoreText
      .setText("score: " + baseScore)
      .setFont("16px squaredance10");
    currentScoreText.displayOriginY = -20;
    currentScoreText.displayOriginX = -20;
    scoreText.setText("dead penguins: " + deadPenguins);
    scoreText.setFont("16px squaredance10");
    scoreText.displayOriginX = -20;
    fishText.setText("fish remaining: " + bearWalk.fish);
    fishText.displayOriginX = -this.game.config.width + 200;
    fishText.setFont("16px squaredance10");
    // console.log(bearWalk.fish);

    // console.log(this.cameras.main);
    penguinCounter++;
    // console.log(penguinCounter);
    const attackHandler = () => {
      if (!bearWalk.attacking) {
        bearWalk.attacking = true;
        const attackTimer = this.time.addEvent({
          delay: 650, // ms
          callback: () => {
            bearWalk.attacking = false;
            bearWalk.setSize(16, 16);
            bearWalk.setOffset(0, 0);
          },
          //args: [],
          loop: false,
        });
        bearAttack[Math.floor(Math.random() * bearAttack.length)].play();
        bearWalk.play("bear-attack");
        bearWalk.setSize(12, 16);
        if (bearWalk.flipX == true) {
          bearWalk.setOffset(-6, 0);
        } else {
          bearWalk.setOffset(12, 0);
        }
        bearWalk.set;
      }
    };
    const birdHandler = () => {
      birds.forEach((bird, index) => {
        bird.body.setAllowGravity(false);
        const birdFlight = () => {
          var dy = bearWalk.y - bird.y;
          var dx = bearWalk.x - bird.x;
          // console.log(dy);
          if (dy < bird.minFD) {
            bird.setVelocityY(Math.random() * -15 - 6);
          }
          if (dy > bird.maxFD) {
            bird.setVelocityY(Math.random() * 15);
          }
          if (dx > bird.maxYD) {
            bird.setVelocityX(30);
            bird.play("bird-flight", true).setFlipX(false);
            bird.setSize(birdSizeX, birdSizeY);
            bird.setOffset(birdSizeOffsetX, birdSizeOffsetY);
          }
          if (dx < -bird.maxYD) {
            bird.setVelocityX(-30);
            bird.play("bird-flight", true).setFlipX(true);
            bird.setSize(birdSizeX, birdSizeY);
            bird.setOffset(birdSizeOffsetX, birdSizeOffsetY);
          }
          if (bird.flipX) {
            bird.setVelocityX(-30);
            bird.play("bird-flight", true);
          } else {
            bird.setVelocityX(30);
            bird.play("bird-flight", true);
          }
        };

        // if nothing else, then birdFlight
        // seagull sounds
        if (penguinCounter % 100 == 0) {
          if (Math.floor(Math.random() * 8) > 5) {
            seagullSounds[
              Math.floor(Math.random() * seagullSounds.length)
            ].play();
          }
        }
        birdFlight();
      });
    };

    const penguinHandler = () => {
      penguins.forEach((penguin, index) => {
        if (penguin.dead == true) {
          penguin.dying = true;
        }
        if (penguin.dying == true) {
          if (penguin.dyingAnim == true) {
            return;
          }
          penguin.dyingAnim = true;
          penguin.dying = false;
          penguin.play("penguin-death", true);
          penguinDeath.play();
          penguin.setVelocityX(0);
          deadPenguins++;

          const minusScoreSpawn = (penguin) => {
            const minusScoreText = this.add
              .text(penguin.x, penguin.y - 20, "-250", {
                font: "12px squaredance10",
                fill: "#A00",
              })
              .setScrollFactor(1);
            this.tweens.add({
              targets: minusScoreText,
              y: minusScoreText.y - 10,
              duration: 450,
            });
            this.tweens.add({
              targets: minusScoreText,
              alpha: 0,
              duration: 700,
            });
            let minusScoreTimer = this.time.addEvent({
              delay: 700, // ms
              callback: () => {
                minusScoreText.destroy();
              },
              //args: [],
              loop: false,
            });
          };
          minusScoreSpawn(penguin);
        }
        if (penguin.dead == true) {
          return;
        }
        const penguinIdle = () => {
          var dx = bearWalk.x - penguin.x;
          if (!(penguinCounter % 200)) {
            // console.log("idle random");
            const move = Math.ceil(Math.random() * 5);
            if (!(penguinCounter % 400)) {
              penguin.setFlipX(Math.floor(Math.random() * 2));
            }
            // console.log("move:", move);
            if (move == 1) {
              penguin.flipX
                ? penguin.setVelocityX(25)
                : penguin.setVelocityX(-25);
              penguin.play("penguin-slide", true);
              penguin.setSize(16, 9);
              penguin.setOffset(0, 8);
              // penguin.setVelocityX(0);
            }
            if (move == 2) {
              penguin.setVelocityX(-10);
              penguin.play("penguin-walk", true);
              penguin.setSize(penguinSizeX, penguinSizeY);
              penguin.setOffset(penguinSizeOffsetX, penguinSizeOffsetX);
            }
            if (move == 3) {
              penguin.setVelocityX(0);
              penguin.play("penguin-idle", true);
              penguin.setSize(penguinSizeX, penguinSizeY);
              penguin.setOffset(penguinSizeOffsetX, penguinSizeOffsetY);
            }
            if (move == 4) {
              penguin.setVelocityX(10);
              penguin.play("penguin-walk", true);
              penguin.setSize(penguinSizeX, penguinSizeY);
              penguin.setOffset(penguinSizeOffsetX, penguinSizeOffsetY);
            }
            if (move == 5) {
              if (dx < 0) {
                penguin.setVelocityX(10);
              }
              if (dx > 0) {
                penguin.setVelocityX(-10);
              }

              penguin.play("penguin-walk", true);
              penguin.setSize(penguinSizeX, penguinSizeY);
              penguin.setOffset(penguinSizeOffsetX, penguinSizeOffsetY);
            }
          }
        };

        var dx = bearWalk.x - penguin.x;
        if (Math.abs(dx) < penguinVision) {
          if (dx < 0) {
            penguin.setFlipX(false);
          }
          if (dx > 0) {
            penguin.setFlipX(true);
          }
        }

        if (Math.abs(dx) < minimumFollowDistance) {
          if (!(penguinCounter % 100)) {
            if (Math.floor(Math.random() * 3) == 3) {
              penguin.flipX
                ? penguin.setVelocityX(25)
                : penguin.setVelocityX(-25);
              penguin.play("penguin-slide", true);
              penguin.setSize(16, 9);
              penguin.setOffset(0, 8);
              // penguin.setVelocityX(0);
            } else {
              penguin.setVelocityX(Math.sign(dx) * 15);
              penguin.play("penguin-walk", true);
              penguin.setSize(penguinSizeX, penguinSizeY);
              penguin.setOffset(penguinSizeOffsetX, penguinSizeOffsetY);
            }
          }
        }
        if (Math.abs(dx) > minimumFollowDistance) {
          penguinIdle();
        }
      });
    };
    const { height, width } = this.game.config;

    if (!introAnimation) {
      penguinHandler();

      // console.log(birds);

      //
      //
      //controls
      //
      //

      this.joySticks = [joystick];
      var s = [];
      for (var i = 0, cnt = this.joySticks.length; i < cnt; i++) {
        var cursorKeys = this.joySticks[i].createCursorKeys();
        s.push(`[${i}] Key down: `);
        for (var name in cursorKeys) {
          if (cursorKeys[name].isDown) {
            s.push(`${name} `);
          }
        }
        s.push("\n");
      }
      // console.log(s.join(""));
      //joystick button

      var spaceBar = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );

      //bind keys
      let joyCursors = joystick.createCursorKeys();
      let cursors = this.input.keyboard.createCursorKeys();
      if (
        (spaceBar.isDown || joyCursors.down.isDown || cursors.down.isDown) &&
        bearWalk.gameOver
      ) {
        console.log("restarting");
        baseScore = 0;
        this.scene.restart({
          loadMap: 1,
          score: 0,
        });
      }
      //attack spacebar
      // console.log("attackButtonclicked =", attackButtonclicked);
      if (
        (attackButtonclicked == true ||
          joyCursors.down.isDown ||
          cursors.down.isDown ||
          spaceBar.isDown) &&
        bearWalk.body.onFloor()
      ) {
        attackHandler();
      }
      if (
        (cursors.left.isDown || joyCursors.left.isDown) &&
        bearWalk.attacking == false
      ) {
        //left arrow
        bearWalk.setVelocityX(-160);
        if (bearWalk.body.onFloor()) {
          if (bearWalk.hurt == false) {
            bearWalk.play("bear-walk", true);
          }
        }
        bearWalk.setFlipX(true);
      } else if (
        (cursors.right.isDown || joyCursors.right.isDown) &&
        bearWalk.attacking == false
      ) {
        //right arrow
        bearWalk.setVelocityX(160);
        if (bearWalk.body.onFloor()) {
          if (bearWalk.hurt == false) {
            bearWalk.play("bear-walk", true);
          }
        }
        bearWalk.setFlipX(false);
      } else {
        //ekse idle
        bearWalk.setVelocityX(0);
        if (
          bearWalk.body.onFloor() &&
          bearWalk.attacking == false &&
          bearWalk.hurt == false
        ) {
          bearWalk.play("bear-idle", true);
        }
      }
      // if bear falls off planet, respawn

      //if bear falls past the deathline, take a fish and respawn at spawnpoint.
      if (bearWalk.body.position.y > deathline.y) {
        bearWalk.setPosition(spawnpoint.x, spawnpoint.y - 70);
      }
      //jump

      if (
        (cursors.up.isDown || joyCursors.up.isDown) &&
        bearWalk.body.onFloor() &&
        bearWalk.attacking == false
      ) {
        jumpSound.play();
        bearWalk.setVelocityY(-250);
        if (bearWalk.hurt == false) {
          bearWalk.play("bear-jump", true);
        }
      }
      // console.log(this.cameras.main._scrollX);

      // const textbox = this.add.text(
      //   this.cameras.main._scrollX,
      //   this.cameras.main._scrollY,
      //   "Hello World"
      // );
    }
    const introHandler = () => {
      if (introAnimation == true) {
        let animationDelay = 1000;

        splashPoint.body.setAllowGravity(false);

        //locate the splash for casting
        var directionX = bearWalk.x - splashPoint.x;
        // console.log(bearWalk.x);
        // console.log(splashPoint.x);

        if (directionX < 0) {
          bearWalk.setFlipX(false);
        }
        if (directionX > 0) {
          bearWalk.setFlipX(true);
        }

        if (introAnimationPlaying == false) {
          //play casting sound
          castingSound.play();
          //play casting animation
          bearWalk.play("bear-casting", true).setSize(16, 16).setOffset(4, 16);
          const castingTimer = this.time.addEvent({
            delay: animationDelay + 100, // ms
            callback: () => {
              // bearWalk.setImmovable(true).body.setAllowGravity(false);
              splashPoint.play("water-splash", true);
              splashSound.play();
              // todo: play splash sound
            },
            //args: [],
            loop: false,
          });

          const catchingTimer = this.time.addEvent({
            delay: animationDelay + 4000, // ms
            callback: () => {
              reelSound.play();
              splashPoint.body.destroy();
              bearWalk
                .play("bear-catching", true)
                .setSize(16, 16)
                .setOffset(4, 16);
              splashPointFish.setVelocityX(0);
              this.tweens.add({
                targets: splashPointFish,
                x: bearWalk.x - 25,
                y: bearWalk.y,
                angle: -25,
                duration: 300,
              });
            },
            //args: [],
            loop: false,
          });
          const fishDeletingTimer = this.time.addEvent({
            delay: animationDelay + 4800, // ms
            callback: () => {
              splashPointFish.destroy();
            },
            //args: [],
            loop: false,
          });
          const fishingTimer = this.time.addEvent({
            delay: animationDelay + 1000, // ms
            callback: () => {
              bearWalk
                .play("bear-fishing", true)
                .setSize(16, 16)
                .setOffset(4, 16);
            },
            //args: [],
            loop: false,
          });
          const enderTimer = this.time.addEvent({
            delay: animationDelay + 6000, // ms
            callback: () => {
              attachedText
                .setText(["I need to", "get these", "fish home!"])
                .setFont("16px squaredance10");
              attachedText.alpha = 1;
              const clearAttachedText = this.time.addEvent({
                delay: 4000, // ms
                callback: () => {
                  attachedText.setText("");
                },
                //args: [],
                loop: false,
              });
              introAnimation = false;
              bearWalk.play("bear-idle").setSize(16, 16).setOffset(0, 0);
            },
            //args: [],
            loop: false,
          });
        }
        introAnimationPlaying = true;
      }
    };
    introHandler();
    birdHandler();
  }
}

export default Level_2;
