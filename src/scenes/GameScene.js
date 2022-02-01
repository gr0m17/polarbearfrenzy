import { Scene } from "phaser";
let bearWalk;
let penguins;
let deadPenguins = 0;
let penguinCounter = 0;
let scoreText;
let fishText;
let healthBar = [];
//how many initial penguins?
const initPenguins = 20;
let hitSpeed = 50;
const penguinVision = 100;
const minimumFollowDistance = 50;
const spawnpoint = { x: 50, y: 330 };
class GameScene extends Scene {
  constructor() {
    super("scene-game");
  }

  create() {
    this.add.image(300, 200, "sky").setScale(3).setScrollFactor(0.3);
    const map = this.make.tilemap({ key: "map" });
    // const tiles = map.addTilesetImage("mario-tiles");
    const tileset = map.addTilesetImage("iceTiles_001", "tiles");
    const worldLayer = map.createLayer("Platforms", tileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });
    worldLayer.width = 400;
    //degine width/height
    const { height, width } = this.game.config;
    //environment
    bearWalk = this.physics.add.sprite(spawnpoint.x, spawnpoint.y, "bear-idle");
    bearWalk.setBounce(0.2);
    bearWalk.setCollideWorldBounds(false);
    bearWalk.attacking = false;
    bearWalk.fish = 10;

    //map the animations

    //bear
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

    //penguin
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

    // animate them

    //bears

    //penguins
    //empty array to house the penguins
    bearWalk.hurt = false;
    bearWalk.setScale(2);
    penguins = [];
    //produce the penguins at random locations across 1000 pixels
    for (let i = 0; i < initPenguins; i++) {
      let x = Math.floor(Math.random() * 1000);
      let y = 0;
      penguins.push(this.physics.add.sprite(x, y, "penguin"));
    }
    var mainCamera = this.cameras.main;
    function endGameHandler(thisContext) {
      mainCamera.shake(250);
      const height = thisContext.game.height;
      thisContext.scene.pause();
      thisContext.add
        .rectangle(200, 150, 300, 200, 0x6666ff)
        .setScrollFactor(0);
      thisContext.add.text(150, 75, "GAME OVER").setScrollFactor(0);
      thisContext.add
        .text(100, 150, "You lost all the fish!")
        .setScrollFactor(0);
    }

    const collisionHandler = (bear, penguin) => {
      if (bearWalk.attacking == true) {
        if (penguin.flipX == true) {
          penguin.setVelocityX(-Math.floor(Math.random() * hitSpeed));
        } else {
          penguin.setVelocityX(Math.floor(Math.random() * hitSpeed));
        }
        const slideTimer = this.time.addEvent({
          delay: 400, // ms
          callback: () => {
            penguin.setVelocityX(0);
            penguin.disableBody(true, false);
          },
          //args: [],
          loop: false,
        });
        penguin.dead = true;
      } else if (!bearWalk.hurt) {
        bearWalk.hurt = true;
        bearWalk.play("bear-hit", true);
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
        if (healthBar[bearWalk.fish]) {
          healthBar[bearWalk.fish].destroy();
        }
        if (bearWalk.fish <= 0) {
          endGameHandler(this);
        }
      }
    };
    //make things collide
    this.physics.add.collider(worldLayer, bearWalk);
    this.physics.add.collider(worldLayer, penguins);

    this.physics.add.overlap(bearWalk, penguins, collisionHandler, null, this);

    //camera follows the bear

    scoreText = this.add.text("score: " + deadPenguins, {
      fontSize: "32px",
      fill: "#FFF",
    });

    fishText = this.add.text("fish Remaining: " + bearWalk.fish);
    this.cameras.main.startFollow(bearWalk);
    for (let i = 0; i < bearWalk.fish; i++) {
      // console.log("for loop");
      if (bearWalk.fish - 2 >= 0) {
        // console.log(bearWalk);
        let inv = healthBar.length;
        healthBar.push(
          this.add
            .image(200 + i * 20, 20, "fish")
            .setScrollFactor(0)
            .setScale(2)
        );
      }
    }
  }

  update() {
    scoreText.setText("dead penguins: " + deadPenguins);
    scoreText.displayOriginX = -20;
    fishText.setText("fish remaining: " + bearWalk.fish);
    fishText.displayOriginX = -200;
    // console.log(bearWalk.fish);

    // console.log(this.cameras.main);
    penguinCounter++;
    // console.log(penguinCounter);
    const attackHandler = () => {
      if (!bearWalk.attacking) {
        bearWalk.attacking = true;
        const timer = this.time.addEvent({
          delay: 650, // ms
          callback: () => {
            bearWalk.attacking = false;
            bearWalk.setSize(16, 16);
            bearWalk.setOffset(0, 0);
          },
          //args: [],
          loop: false,
        });
        bearWalk.play("bear-attack");
        bearWalk.setSize(12, 16);
        if (bearWalk.flipX == true) {
          bearWalk.setOffset(2, 0);
        } else {
          bearWalk.setOffset(8, 0);
        }
        bearWalk.set;
      }
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
          penguin.setVelocityX(0);
          deadPenguins++;
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
              penguin.setVelocityX(0);
              penguin.play("penguin-idle", true);
            }
            if (move == 2) {
              penguin.setVelocityX(-10);
              penguin.play("penguin-walk", true);
            }
            if (move == 3) {
              penguin.setVelocityX(0);
              penguin.play("penguin-idle", true);
            }
            if (move == 4) {
              penguin.setVelocityX(10);
              penguin.play("penguin-walk", true);
            }
            if (move == 5) {
              if (dx < 0) {
                penguin.setVelocityX(10);
              }
              if (dx > 0) {
                penguin.setVelocityX(-10);
              }

              penguin.play("penguin-walk", true);
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
          penguin.setVelocityX(Math.sign(dx) * 15);
          penguin.play("penguin-walk", true);
        }
        if (Math.abs(dx) > minimumFollowDistance) {
          penguinIdle();
        }
      });
    };
    penguinHandler();

    //
    //
    //controls
    //
    //

    var spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    //bind keys
    let cursors = this.input.keyboard.createCursorKeys();

    //attack spacebar
    if (spaceBar.isDown && bearWalk.body.onFloor()) {
      attackHandler();
    }
    if (cursors.left.isDown && bearWalk.attacking == false) {
      //left arrow
      bearWalk.setVelocityX(-160);
      if (bearWalk.body.onFloor()) {
        if (bearWalk.hurt == false) {
          bearWalk.play("bear-walk", true);
        }
      }
      bearWalk.setFlipX(true);
    } else if (cursors.right.isDown && bearWalk.attacking == false) {
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
    if (bearWalk.body.position.y > 1000) {
      bearWalk.setPosition(spawnpoint.x, spawnpoint.y - 70);
    }
    //jump
    if (
      cursors.up.isDown &&
      bearWalk.body.onFloor() &&
      bearWalk.attacking == false
    ) {
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
}
export default GameScene;
