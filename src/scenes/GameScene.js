import { Scene } from "phaser";
let bearWalk;
let penguins;
let penguinCounter = 0;
class GameScene extends Scene {
  constructor() {
    super("scene-game");
  }

  // create() {
  //   // Add, scale, and make up a speed for our creature
  //   this.cat = this.physics.add.sprite(10, 10, "cat-like");
  //   this.cat.body.setAllowGravity(false);
  //   this.cat.setScale(0.5);
  //   this.catSpeed = 300;
  //   // Create a helper object for our arrow keys
  //   this.cursors = this.input.keyboard.createCursorKeys();
  // }
  create() {
    this.add.image(400, 300, "sky");
    const map = this.make.tilemap({ key: "map" });
    // const tiles = map.addTilesetImage("mario-tiles");
    const tileset = map.addTilesetImage("iceTiles_001", "tiles");
    const worldLayer = map.createLayer("Platforms", tileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });
    worldLayer.width = 400;
    //degine width/height
    const { height, width } = this.game.config;
    //environment

    bearWalk = this.physics.add.sprite(80, 100, "bear-idle");
    bearWalk.setBounce(0.2);
    bearWalk.setCollideWorldBounds(false);
    bearWalk.attacking = false;

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
      frames: this.anims.generateFrameNumbers("penguin", { start: 0, end: 4 }),
      frameRate: 10,
      repeat: 0,
    });

    // animate them

    //bears

    bearWalk.play("bear-idle", true).setScale(2);
    //penguins
    //how many initial penguins?
    const initPenguins = 20;
    //empty array to house the penguins

    penguins = [];
    //produce the penguins at random locations across 1000 pixels
    for (let i = 0; i < initPenguins; i++) {
      let x = Math.floor(Math.random() * 1000);
      let y = 0;
      penguins.push(this.physics.add.sprite(x, y, "penguin"));
    }
    //make things collide
    this.physics.add.collider(worldLayer, bearWalk);
    this.physics.add.collider(worldLayer, penguins);

    //camera follows the bear
    this.cameras.main.startFollow(bearWalk);
  }

  update() {
    penguinCounter++;
    // console.log(penguinCounter);
    const attackHandler = () => {
      if (!bearWalk.attacking) {
        bearWalk.attacking = true;
        const timer = this.time.addEvent({
          delay: 650, // ms
          callback: () => {
            bearWalk.attacking = false;
          },
          //args: [],
          loop: false,
        });
        bearWalk.play("bear-attack");
      }
    };
    const penguinHandler = () => {
      const minimumFollowDistance = 50;
      penguins.forEach((penguin, index) => {
        const penguinIdle = () => {
          var dx = bearWalk.x - penguin.x;
          if (!(penguinCounter % 200)) {
            // console.log("idle random");
            const move = Math.ceil(Math.random() * 5);
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
        // console.log(penguin);
        var dx = bearWalk.x - penguin.x;
        if (Math.abs(dx) < 300) {
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

    let cursors = this.input.keyboard.createCursorKeys();
    if (spaceBar.isDown && bearWalk.body.onFloor()) {
      attackHandler();
    }
    if (cursors.left.isDown && bearWalk.attacking == false) {
      bearWalk.setVelocityX(-160);
      if (bearWalk.body.onFloor()) {
        bearWalk.play("bear-walk", true).setScale(2);
      }
      bearWalk.setFlipX(true);
    } else if (cursors.right.isDown && bearWalk.attacking == false) {
      bearWalk.setVelocityX(160);
      if (bearWalk.body.onFloor()) {
        bearWalk.play("bear-walk", true);
      }
      bearWalk.setFlipX(false);
    } else {
      bearWalk.setVelocityX(0);
      if (bearWalk.body.onFloor() && bearWalk.attacking == false) {
        bearWalk.play("bear-idle", true);
      }
    }
    // console.log(bearWalk.body.position);
    if (bearWalk.body.position.y > 1000) {
      bearWalk.setPosition(50, 0);
    }

    if (
      cursors.up.isDown &&
      bearWalk.body.onFloor() &&
      bearWalk.attacking == false
    ) {
      bearWalk.setVelocityY(-250);
      bearWalk.play("bear-jump", true);
    }
  }
}
export default GameScene;
