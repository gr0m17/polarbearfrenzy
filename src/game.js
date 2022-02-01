import "./main.css";
import Phaser, { Game } from "phaser";
import BootScene from "./scenes/BootScene";
import GameScene from "./scenes/GameScene";

const canvas = document.getElementById("game-canvas");
const config = {
  type: Phaser.WEB_GL,
  width: 400,
  height: 300,
  zoom: 2,
  pixelArt: true,
  canvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 400 },
      debug: false,
    },
  },
  scene: [BootScene, GameScene],
};

const game = new Game(config);
