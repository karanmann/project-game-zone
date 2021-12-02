let background;

class GameOverScene extends Phaser.Scene {
  constructor() {
    super("game-over");
  }
   init(data)
   {
     this.finalHits = data.hitScore;
     this.finalMiss = data.score;
    }
  preload() {
    this.load.image("bkg", "../assets/startPage/bg.jpeg")
  }
  create() {
    background = this.add.tileSprite(500, 100, 1024, 1024, 'bkg')

    this.add.text(400, 80, 'Game Over!', {fontSize: '70px', fill: '#39ff14'}).setOrigin(0.5);
    this.add.text(400, 230, `Enemy ships shot : ${this.finalHits}`, {fontSize: '30px', fill: '#9acd32'}).setOrigin(0.5);
    this.add.text(400, 290, `Enemy ships missed : ${this.finalMiss}`, {fontSize: '30px', fill: '#9acd32'}).setOrigin(0.5);
    this.add.text(400, 400, '"More Practice you need young padawan"', {fontSize: '32px', fill: '#ffffff'}).setOrigin(0.5);
    this.add.text(400, 450, 'Press Enter To Try Again', {fontSize: '35px', fill: '#ff0000'}).setOrigin(0.5);
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