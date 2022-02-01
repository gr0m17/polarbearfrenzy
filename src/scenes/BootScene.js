import { Scene } from "phaser";

class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }

  preload() {
    this.load.tilemapTiledJSON("map", "./assets/level_001.json");
    // Load any assets here from your assets directory
    this.load.image("fish", "./assets/fish.png");
    this.load.image("fish-half", "./assets/fish_half.png");
    this.load.image("tiles", "./assets/iceTiles_001.png");
    this.load.image("mario-tiles", "./assets/super-mario-tiles.png");
    this.load.image("sky", "./assets/Arctic_Mountain_Background.png");

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
  }

  create() {
    this.scene.start("scene-game");
  }
}

export default BootScene;
