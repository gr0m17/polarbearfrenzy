import { Scene } from "phaser";

class BootLevel_2 extends Scene {
  constructor() {
    super("bootLevel_2");
  }
  init(data) {
    this.gameData = data;
  }
  preload() {
    //loading progress bar
    const { height, width } = this.game.config;
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    // draw the box
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 4, height / 2, 320, 50);
    //loading text
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 40,
      text: "Polar bear frenzy loading...",
      style: {
        fill: "#ffffff",
      },
    });
    loadingText.setOrigin(0.5, 0.5).setFont("16px squaredance10");

    //text area for asset name
    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 - 20,
      text: "",
      style: {
        fill: "#ffffff",
      },
    });
    assetText.setOrigin(0.5, 0.5).setFont("16px squaredance10");
    //percentage number text
    let percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 25,
      text: "0%",
      style: {
        fill: "#ffffff",
      },
    });
    percentText.setOrigin(0.5, 0.5).setFont("16px squaredance10");

    //redraws the progress bar
    this.load.on("progress", function (value) {
      percentText.setText(parseInt(value * 100) + " percent");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);

      progressBar.fillRect(width / 4, height / 2, 300 * value, 50);
    });
    //update the asset name
    this.load.on("fileprogress", function (file) {
      assetText.setText("Loading asset: " + file.key);
    });

    //destroy all the loading elements
    this.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    //import map jsons

    this.load.tilemapTiledJSON("map1", "./assets/level_001.json");
    this.load.tilemapTiledJSON("map2", "./assets/level_002.json");
    this.load.tilemapTiledJSON("map3", "./assets/level_003.json");
    this.load.tilemapTiledJSON("map4", "./assets/level_004.json");
    this.load.tilemapTiledJSON("map5", "./assets/level_005.json");
    this.load.tilemapTiledJSON("map6", "./assets/level_006.json");
    this.load.tilemapTiledJSON("map7", "./assets/level_007.json");
    this.load.tilemapTiledJSON("map8", "./assets/level_008.json");
    this.load.tilemapTiledJSON("map9", "./assets/level_009.json");
    this.load.tilemapTiledJSON("map10", "./assets/level_010.json");

    //sound assets

    this.load.audio("music1", "./assets/sound/game_music_1.wav");
    this.load.audio("music2", "./assets/sound/game_music_2.wav");
    this.load.audio("music3", "./assets/sound/game_music_3.wav");
    this.load.audio("music4", "./assets/sound/game_music_4.wav");
    this.load.audio("music5", "./assets/sound/game_music_5.wav");

    this.load.audio("seagull_01", "./assets/sound/seagull_01.wav");
    this.load.audio("seagull_02", "./assets/sound/seagull_02.wav");
    this.load.audio("seagull_03", "./assets/sound/seagull_03.wav");
    this.load.audio("seagull_04", "./assets/sound/seagull_04.wav");
    this.load.audio("seagull_05", "./assets/sound/seagull_05.wav");
    this.load.audio("seagull_06", "./assets/sound/seagull_06.wav");

    this.load.audio("bearAttack01", "./assets/sound/bearAttack_01.ogg");
    this.load.audio("bearAttack02", "./assets/sound/bearAttack_02.ogg");
    this.load.audio("bearHit", "./assets/sound/bearHit_01.wav");
    this.load.audio("jump", "./assets/sound/jump_03.wav");
    this.load.audio("penguinDeath", "./assets/sound/penguin_death_01.wav");

    this.load.audio("splash", "./assets/sound/splash_01.mp3");
    this.load.audio("casting", "./assets/sound/casting_01.wav");
    this.load.audio("reel", "./assets/sound/reel_01.wav");
    this.load.audio("level-complete", "./assets/sound/levelComplete_01.wav");
    this.load.audio("lose", "./assets/sound/loseMusic_01.wav");

    //sprite assets

    this.load.image("fish", "./assets/fish.png");
    this.load.image("fish-half", "./assets/fish_half.png");
    this.load.image("tiles", "./assets/iceTiles_001.png");
    this.load.image("mario-tiles", "./assets/super-mario-tiles.png");
    this.load.image("sky", "./assets/Arctic_Mountain_Background.png");
    this.load.spritesheet("door", "./assets/door.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("platform", "./assets/platforn_tileset_001.png");
    this.load.spritesheet("penguin", "./assets/penguin_walk_001.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("bird-flight", "./assets/bird_flight_001.png", {
      frameWidth: 20,
      frameHeight: 20,
    });
    this.load.spritesheet("penguin-death", "./assets/penguin_hit_001.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("penguin-idle", "./assets/penguin_idle_001.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("penguin-walk", "./assets/penguin_walk_001.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("penguin-slide", "./assets/penguin_slide_001.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("bear-idle", "./assets/bear_idle_001.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("bear-hit", "./assets/bear_hit_001.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("bear-attack", "./assets/bear_attack_16_20_001.png", {
      frameWidth: 20,
      frameHeight: 16,
    });
    this.load.spritesheet("bear-walk", "./assets/bear_walk_001.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("bear-jump", "./assets/bear_jump_001.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("bear-loser", "./assets/bear_loser_001.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("bear-catching", "./assets/bear_catching_001.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("bear-fishing", "./assets/bear_fishing_001.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("bear-casting", "./assets/bear_casting_001.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("water-splash", "./assets/water_splash_001.png", {
      frameWidth: 32,
      frameHeight: 16,
    });
  }

  create() {
    //todo: launch intro screen
    console.log(this.scene);
    this.scene.launch("titleScreen");
    // if (!this.startGame) {
    // } else {
    //   console.log("this.scene.launch", this.gameData);
    //   this.scene.launch("level_2", { data: this.gameData });
    //   }
  }
}

export default BootLevel_2;
