import SpaceWars from "./SpaceWars.js";

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
      debug: true,
    },
  },
  scene: [SpaceWars],
};

new Phaser.Game(config);
