import SpaceWars from "./SpaceWars.js";

var config = {
  type: Phaser.AUTO,
  // width: 800,
  // height: 600,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [SpaceWars],
  physics: {
    default: "arcade",
    arcade: {
      gravity: false,
      debug: true,
    },
  },
};

new Phaser.Game(config);
