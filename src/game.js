import "./main.css";
import Phaser, { Game } from "phaser";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import Level_2 from "./scenes/Level_2";
import BootLevel_2 from "./scenes/BootLevel_2";

const canvas = document.getElementById("game-canvas");
const config = {
  input: {
    activePointers: 3,
  },
  plugins: {
    global: [
      {
        key: "rexVirtualJoystick",
        plugin: VirtualJoystickPlugin,
        start: true,
      },
    ],
  },
  type: Phaser.WEB_GL,
  width: 600,
  height: 300,
  scale: {
    zoom: 2,
    mode: Phaser.Scale.ScaleModes.FIT,
    // autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
  },
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
