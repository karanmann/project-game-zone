import SpaceWars from "./SpaceWars.js";
import GameOverScene from "./GameOver.js";

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  // width: window.innerWidth,
  // height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200},
      enableBody: true,
      debug: false,
    },
  },
  backgroundColor: "#000",
  scene: [SpaceWars, GameOverScene],
  render: {
    pixelArt: true,
  },
};

new Phaser.Game(config);