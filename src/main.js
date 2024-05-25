import Phaser from "phaser";

import PlayScene from "./PlayScene";
import PreloadScene from "./PreloadScene";

const scrennWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const config = {
  type: Phaser.AUTO,
  width: scrennWidth > 1000 ? 1000 : scrennWidth > 800 ? 800 : scrennWidth > 600 ? 600 : 400,
  height: 340,
  pixelArt: true,
  transparent: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [PreloadScene, PlayScene],
};

new Phaser.Game(config);
