import "./main.css";
import Phaser, { Game } from "phaser";

import Level_2 from "./scenes/Level_2";
import BootLevel_2 from "./scenes/BootLevel_2";

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
  scene: [BootLevel_2, Level_2],
};

const game = new Game(config);
