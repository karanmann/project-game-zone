let bg,
  playerShip,
  enemyShip,
  playerShipControls,
  platform,
  cosmicSound,
  cruisingSound,
  playerLaserSound,
  enemyLaser,
  fireFrequency = 0;

const gameState = {
  score: 0,
  lastFired: 0,
  playBackgroundSound: false,
  highScore: 0,
  hitScore: 0,
};

class SpaceWars extends Phaser.Scene {
  preload() {
    //GAME ASSETS
    this.load.image("playerShip", "../assets/ships/rebelShip.svg");
    this.load.image("enemyShip", "../assets/ships/PodShip.svg");
    this.load.image("background", "../assets/startPage/bg.jpeg");
    this.load.image("bottom", "../assets/background/blackRectangle.svg");
    this.load.audio("cosmic", "../assets/audio/cosmicGlow.mp3");
    // this.load.audio("cruising", "../assets/audio/shipCruising.mp3");
    this.load.audio("cruising", "../assets/audio/flying.mp3");
    this.load.audio(
      "playerLaserAudio",
      "../assets/audio/Laser Gun Sound Effect.mp3"
    );
    this.load.image("playerLaser", "../assets/lasers/laserBlue01.png");
    this.load.image("enemyLaser", "../assets/lasers/laserRed01.png");
  }

  create() {
    bg = this.add.image(400, 300, "background");
    bg.setDisplaySize(800, 600);
    bg = this.add.tileSprite(500, 100, 1024,1024, "background")

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

    gameState.fallingEnemies = this.physics.add.group(); // Creating a group to generate random ships in

    function enemyGen() {
      const XCoord = Math.random() * 600; // Generates random enemyship on the X-axis
      gameState.fallingEnemies.create(XCoord, 0, "enemyShip").setScale(0.4);
    }

    this.time.addEvent({
      delay: 900,
      callback: enemyGen, // using to call the function enemyGen()
      callbackScope: this,
      loop: true,
    });

    gameState.playerLaser = this.physics.add.group();

    this.physics.add.collider(
      gameState.playerLaser,
      gameState.fallingEnemies,
      function (laser, enemy) {
        setTimeout(() => {
          laser.destroy();
          enemy.destroy();
          console.log(gameState.hitScore)
          gameState.hitScore += 1;
          gameState.hitScoreText.setText(`ENEMIES KILLED: ${gameState.hitScore}`)
          },1)
      }
      
    );

    this.physics.add.collider(
      gameState.fallingEnemies,
      platform,
      function (singleEnemy) {
        gameState.score += 1;
        gameState.scoreText.setText(`ENEMIES MISSED: ${gameState.score}`);
        singleEnemy.destroy();
      }
    );

    gameState.hitScoreText = this.add.text(50, 560, "ENEMIES HIT : 0", {})
    gameState.scoreText = this.add.text(300, 560, "ENEMIES MISSED : 0", {});

    //ALL SOUNDS
    cosmicSound = this.sound.add("cosmic", { volume: 0.2 });
    cruisingSound = this.sound.add("cruising", { volume: 0.1 });
    playerLaserSound = this.sound.add("playerLaserAudio", { volume: 0.2 });
  }

  randomFire(world) {
    let arrayOfEnemies = gameState.fallingEnemies.getChildren()
    let random = Math.floor(Math.random() * arrayOfEnemies.length);
    let enemy = arrayOfEnemies[random]
    if(enemy){
      let position = enemy.body.center;
      let shoot = this.physics.add.sprite(position.x, position.y,"enemyLaser" );
      shoot.setVelocityY(300)
    }
  }

  update() {
    
    bg.tilePositionY -= 1 // THE BACKGROUND IS ROLLING

    if(fireFrequency > 50){
      fireFrequency = 0;
      this.randomFire(this.physics)
    }else{
      fireFrequency++
    }

    if (Phaser.Input.Keyboard.JustDown(playerShipControls.space)) {
      gameState.playerLaser
        .create(playerShip.x, playerShip.y, "playerLaser")
        .setGravityY(-1200);
      playerLaserSound.play();
    } else if (Phaser.Input.Keyboard.JustDown(playerShipControls.right)) {
      cruisingSound.play();
    } else if (Phaser.Input.Keyboard.JustDown(playerShipControls.left)) {
      cruisingSound.play();
    } else if (Phaser.Input.Keyboard.JustDown(playerShipControls.up)) {
      cruisingSound.play();
    } else if (Phaser.Input.Keyboard.JustDown(playerShipControls.down)) {
      cruisingSound.play();
    }


    if (playerShipControls.left.isDown) {
      playerShip.setVelocity(-400, 0); //Left arrow is pressed
      // cruisingSound.play();
    } else if (playerShipControls.right.isDown) {
      playerShip.setVelocity(400, 0);
      // cruisingSound.play(); //Right arrow is pressed
    } else if (playerShipControls.up.isDown) {
      playerShip.setVelocity(0, -400);
      // cruisingSound.play(); // Up arrow is pressed
    } else if (playerShipControls.down.isDown) {
      playerShip.setVelocity(0, 400);
      // cruisingSound.play(); // Down arrow is pressed
    } else if (Phaser.Input.Keyboard.JustDown(playerShipControls.shift)) {
      if (!gameState.playBackgroundSound) {
        cosmicSound.play();
        gameState.playBackgroundSound = true;
        // setTimeout(() => {gameState.playBackgroundSound = true}, 500)
        console.log("SoundPlaying");
      } else if (gameState.playBackgroundSound) {
        cosmicSound.stop();
        gameState.playBackgroundSound = false;
        console.log("Sound Stopped");
      }
    } else {
      playerShip.setVelocity(0, 0); // if nothing is pressed velocity on x & y-axis to 0
    }
  }
}

export default SpaceWars; // To export the class component so that it can be accessed in the other JavaScript files.
