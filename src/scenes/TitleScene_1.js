import { Scene } from "phaser";
let backgroundRect;
let scrollText;
class TitleScene extends Scene {
  constructor() {
    super("titleScreen");
  }

  preload() {
    console.log("loading");
    this.anims.create({
      key: "bear-idle",
      frames: this.anims.generateFrameNumbers("bear-idle", {
        start: 0,
        end: 7,
      }),
      frameRate: 5,
      repeat: -1,
    });
  }

  create() {
    this.startGame = true;
    console.log("create background");
    this.add
      .image(350 + 0, 200, "sky")
      .setScale(3)
      .setScrollFactor(0.3);
    //
    //

    const centerOffset = {
      width: this.game.config.width,
      height: this.game.config.height,
    };

    (centerOffset.x = centerOffset.width - 300),
      (centerOffset.y = centerOffset.height);

    console.log(centerOffset);
    console.log("game scene:", this);
    backgroundRect = this.add
      .rectangle(centerOffset.x - 20, 150, 340, 200, 0x6666ff)
      .setScrollFactor(0);

    let graphics = this.add.graphics();
    let pointer = this.input.activePointer; // because MyGame extends Phaser scene this is a scene

    graphics.fillStyle(0xffffff, 0.0);
    graphics.fillRectShape(backgroundRect);

    graphics.setInteractive(backgroundRect, () => {
      if (pointer.isDown) {
        this.scene.start("level_2", {
          loadMap: 1,
          score: 0,
        });
      }
    });

    this.add
      .text(centerOffset.x - 20, 80, "Polar bear frenzy!")
      .setScrollFactor(0)
      .setOrigin(0.5, 0.5)
      .setFont("24px squaredance10");

    scrollText = this.add
      .text(
        centerOffset.x + 10,
        150,
        "\n\n\n\n" +
          "created by myke d." +
          "\n\n" +
          "sprites, tiles, and background art by zombcool" +
          "\n\n" +
          "reel sound: Memoraphile" +
          "\n\n" +
          "splash sound: jcpmcdonald" +
          "\n\n" +
          "casting sound: juskiddink" +
          "\n\n" +
          "seagull sounds: Rango Mango" +
          "\n\n" +
          "bear sounds: AntumDeluge"
      )
      .setWordWrapWidth(200)
      .setScrollFactor(0)
      .setOrigin(0.5, 0)
      .setFont("16px squaredance10");

    this.add
      .text(centerOffset.x - 19, 230, "click or press down to start!")
      .setScrollFactor(0)
      .setOrigin(0.5, 0.5)
      .setFont("16px squaredance10");
    this.add
      .text(centerOffset.x - 168, 90, "version 1.5.0")
      .setScrollFactor(0)

      .setFont("16px squaredance10");
    let bearWalk = this.physics.add.sprite(
      centerOffset.x - 140,
      185,
      "bear-idle"
    );
    bearWalk.play("bear-idle");
    bearWalk.setScale(3);
    bearWalk.body.setAllowGravity(false);
    bearWalk.setCollideWorldBounds(true);

    this.graphics = this.add.graphics();

    const shape = this.make.graphics();

    //  Create a hash shape Graphics object
    shape.fillStyle(0xffffff);

    //  You have to begin a path for a Geometry mask to work
    shape.beginPath();

    shape.fillRect(200, 110, 220, 100).setScrollFactor(0);

    // this.add
    //   .rectangle(centerOffset.x + 10, 160, 220, 100, 0x779966)
    //   .setScrollFactor(0);

    const mask = shape.createGeometryMask();

    scrollText.setMask(mask);
  }
  update() {
    backgroundRect.on("pointerdown", function (pointer) {
      this.scene.start("bootLevel_2", {
        loadMap: 1,
        score: 0,
      });
    });
    const tween = this.tweens.add({
      targets: [scrollText],
      x: scrollText.x,
      y: scrollText.y - 20,
      opacity: 0,
      duration: 3000,
      repeat: 0,
      onComplete() {},
    });
    // scrollText.y -= 0.1;
    let cursors = this.input.keyboard.createCursorKeys();
    var spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    if (spaceBar.isDown || cursors.down.isDown) {
      this.scene.start("level_2", {
        loadMap: 1,
        score: 0,
      });
    }
  }
}

//
//

export default TitleScene;
