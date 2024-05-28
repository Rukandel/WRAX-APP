import Phaser from "phaser";

import PlayScene from "./scenes/PlayScene";
import PreloadScene from "./scenes/PreloadScene";
import Menu from "./scenes/Menu";

const scrennWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const config = {
  parent: document.querySelector("#game-container"),
  type: Phaser.AUTO,
  width:
    scrennWidth > 1000
      ? 1000
      : scrennWidth > 800
      ? 800
      : scrennWidth > 600
      ? 600
      : 400,
  height: 340,
  pixelArt: true,
  transparent: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [PreloadScene, Menu, PlayScene],
};

new Phaser.Game(config);
