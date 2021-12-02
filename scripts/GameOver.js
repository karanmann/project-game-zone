import {finalHits, finalMiss} from "./SpaceWars.js";

let background;

class GameOverScene extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  preload() {
    this.load.image("bkg", "../assets/startPage/bg.jpeg")
  }
  create() {
    background = this.add.tileSprite(500, 100, 1024, 1024, 'bkg')

    this.add.text(400, 80, 'Game Over!', {fontSize: '50px', fill: '#ffffff'}).setOrigin(0.5);
    this.add.text(400, 130, 'Press Enter To Try Again', {fontSize: '20px', fill: '#ffffff'}).setOrigin(0.5);
    this.add.text(400, 230, `Enemy ships shot : ${finalHits}`, {fontSize: '30px', fill: '#ffffff'}).setOrigin(0.5);
    this.add.text(400, 290, `Enemy ships missed : ${finalMiss}`, {fontSize: '30px', fill: '#ffffff'}).setOrigin(0.5);
    this.input.keyboard.once('keydown-ENTER', () => {
      console.log('Enter Pressed');
      // start title screen scene
      this.scene.start('game');
    });
  }
  update() {
    background.tilePositionY += 0.5;
  }
}


export default GameOverScene;