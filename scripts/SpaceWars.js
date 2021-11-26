let center,
  bg,
  playerShip,
  enemyShip,
  playerShipControls,
  startGame,
  text,
  platform,
  cosmicSound,
  cruisingSound,
  playerLaser,
  enemyLaser,
  bullets,
  speed  ;

const gameState = { score: 0, lastFired: 0 };

class SpaceWars extends Phaser.Scene {
  preload() {
    //GAME ASSETS

    this.load.image("playerShip", "../assets/ships/rebelShip.svg");
    this.load.image("enemyShip", "../assets/ships/PodShip.svg");
    this.load.image("background", "../assets/startPage/bg.jpeg");
    this.load.image("bottom", "../assets/background/blackRectangle.svg");
    this.load.audio("cosmic", "../assets/audio/cosmicGlow.mp3");
    this.load.audio("cruising", "../assets/audio/shipCruising.mp3"); 
    this.load.image("playerLaser", "../assets/lasers/laserBlue01.png");
    this.load.image("enemyLaser", "../assets/lasers/laserRed03.png");
  }

  create() {
    bg = this.add.image(400, 300, "background");
    bg.setDisplaySize(800, 600);

    platform = this.physics.add.staticGroup();
    platform.create(0, 730, "bottom");

    playerShip = this.physics.add.sprite(400, 490, "playerShip");
    playerShip.setScale(0.4);
    playerShip.setCollideWorldBounds(true); //Stops playerShip from leaving the frame.

    playerShipControls = this.input.keyboard.createCursorKeys(); //Gives us access to Arrowkeys + Space + Shift
  
    this.physics.add.collider(playerShip, platform);

    enemyShip = this.physics.add.sprite(700, 100, "enemyShip");
    enemyShip.setScale(0.25);
    enemyShip.setFlipY(true); //To flip the image on its Y-axis. It can also be used on the X-axis

    const fallingEnemies = this.physics.add.group(); // Creating a group to generate random ships in

    function enemyGen() {
      const XCoord = Math.random() * 600; // Generates random enemyship on the X-axis
      fallingEnemies.create(XCoord, 0, "enemyShip").setScale(0.4);
    }

    this.time.addEvent({
      delay: 900,
      callback: enemyGen, // using to call the function enemyGen()
      callbackScope: this,
      loop: true,
    });
    gameState.playerLaser = this.physics.add.group();

    // this.physics.add.collider(fallingEnemies, gameState.playerLaser, function (enemy, laser) {
    //   enemy.destroy();
    //   laser.destroy();
    //   gameState.hitScore += 1;
    //   gameState.hitScore.setText(`ENEMIES HIT: ${gameState.hitScore}`);
    // });

    this.physics.add.collider(fallingEnemies, platform, function (singleEnemy) {
      singleEnemy.destroy();
      gameState.score += 1;
      gameState.scoreText.setText(`ENEMIES MISSED: ${gameState.score}`);
    });

    

    // gameState.hitScore = this.add.text(50, 560, "ENEMIES HIT : 0", {})
    gameState.scoreText = this.add.text(300, 560, "ENEMIES MISSED : 0", {});
    cosmicSound = this.sound.add("cosmic", { volume: 0.2 });
    cruisingSound = this.sound.add("cruising", { volume: 0.2 });
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(playerShipControls.space)) {
      gameState.playerLaser.create(playerShip.x, playerShip.y, 'playerLaser').setGravityY(-900);
    }

    if (playerShipControls.left.isDown) {
      playerShip.setVelocity(-400, 0); //Left arrow is pressed
      cruisingSound.play();
    } else if (playerShipControls.right.isDown) {
      playerShip.setVelocity(400, 0);
      cruisingSound.play(); //Right arrow is pressed
    } else if (playerShipControls.up.isDown) {
      playerShip.setVelocity(0, -400);
      cruisingSound.play(); // Up arrow is pressed
    } else if (playerShipControls.down.isDown) {
      playerShip.setVelocity(0, 400);
      cruisingSound.play(); // Down arrow is pressed
    } else {
      playerShip.setVelocity(0, 0); // if nothing is pressed velocity on x & y-axis to 0
    }
  }
}

export default SpaceWars; // To export the class component so that it can be accessed in the other JavaScript files.
