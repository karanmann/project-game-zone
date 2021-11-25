let center, bg, playerShip, enemyShip, playerShipControls, startGame, text

const gameState = {}

class SpaceWars extends Phaser.Scene {
  preload() {
    //GAME ASSETS
    this.load.image("playerShip", "../assets/ships/rebelShip.svg");
    this.load.image("enemyShip", "../assets/ships/PodShip.svg");
    this.load.image("background", "../assets/startPage/bg.jpeg");
  }

  create() {

    center = {
      x: this.physics.world.bounds.width / 2,
      y: this.physics.world.bounds.height / 2,
    };

    bg = this.add.image(center.x, center.y, "background");
    bg.setDisplaySize(center.x * 2, center.y * 2);

    playerShip = this.physics.add.sprite(
      window.innerWidth / 2,
      window.innerHeight - 50,
      "playerShip"
    );

    playerShip.setScale(0.4);
    playerShip.setCollideWorldBounds(true); //Stops playerShip from leaving the frame.
    playerShipControls = this.input.keyboard.createCursorKeys() //Gives us access to Arrowkeys + Space + Shift

    enemyShip = this.physics.add.sprite(
      window.innerWidth / 2,
      window.innerHeight / 5,
      "enemyShip"
    ); 

    enemyShip.setScale(0.3);
    enemyShip.setFlipY(true) //To flip the image on its Y-axis. It can also be used on the X-axis

    const fallingEnemies = this.physics.add.group();  // Creating a group to generate random ships in
  
    function enemyGen () {
      const XCoord = Math.random() * 600; // Generates random enemyship on the X-axis
      fallingEnemies.create(XCoord, 0, 'enemyShip').setScale(0.4);
    }

    this.time.addEvent({
      delay : 900,
      callback: enemyGen,  // using to call the function enemyGen()
      callbackScope: this,
      loop: true
    });

    text = this.add.text(center.x + 200, 10, "SCORE : XXX", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: 20,
    });

    text.setOrigin(0.5, 0);
  }

  update() {

    if (playerShipControls.left.isDown) {
      playerShip.setVelocity(-400, 0); //Left arrow is pressed
    }
    else if (playerShipControls.right.isDown) {
      playerShip.setVelocity(400, 0);//Right arrow is pressed
    }
    else if (playerShipControls.up.isDown) {
      playerShip.setVelocity(0, -400);
    }
    else if (playerShipControls.down.isDown) {
      playerShip.setVelocity(0, 400);
    } else {
      playerShip.setVelocity(0, 0);
    }
  }
}

export default SpaceWars; // To export the class component so that it can be accessed in the other JavaScript files.
