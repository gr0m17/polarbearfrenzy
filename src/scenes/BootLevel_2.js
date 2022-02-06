import { Scene } from "phaser";

class BootLevel_2 extends Scene {
  constructor() {
    super("bootLevel_2");
  }
  init(data) {
    this.gameData = data;
  }
  preload() {
    this.load.tilemapTiledJSON("map1", "./assets/level_001.json");
    this.load.tilemapTiledJSON("map2", "./assets/level_002.json");
    this.load.tilemapTiledJSON("map3", "./assets/level_003.json");
    this.load.tilemapTiledJSON("map4", "./assets/level_004.json");
    this.load.tilemapTiledJSON("map5", "./assets/level_005.json");
    // Load any assets here from your assets directory
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
    this.scene.launch("level_2", { data: this.gameData });
  }
}

export default BootLevel_2;
