let bg,
  playerShip,
  enemyShip,
  playerShipControls,
  platform,
  cosmicSound,
  playerShipSound,
  playerLaserSound,
  enemyLaser,
  frameNames,
  fireFrequency = 0,
  enemyShipSound,
  enemyLaserSound,
  playerExplode,
  enemyExplode;

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
    this.load.image("playerShip", "../assets/ships/ClipartKey_2127839.png");
    this.load.image("enemyShip", "../assets/ships/PodShip.svg");
    this.load.image("background", "../assets/startPage/bg.jpeg");
    this.load.image("bottom", "../assets/background/blackRectangle.svg");
    this.load.image("playerLaser", "../assets/lasers/laserBlue01.png");
    this.load.image("enemyLaser", "../assets/lasers/laserRed01.png");

    this.load.audio(
      "cosmic",
      "../assets/audio/Star Wars The Clone Wars - Star Wars Main Title & A Galaxy Divided (128 kbps).mp3"
    );
    this.load.audio("xwingFlyby", "../assets/audio/XWing flyby 1.mp3");
    this.load.audio("tieFlyby", "../assets/audio/TIE fighter flyby 1.mp3");
    this.load.audio("playerLaserAudio", "../assets/audio/XWing fire (1).mp3");
    this.load.audio(
      "enemyLaserAudio",
      "../assets/audio/TIE fighter fire 1 (1).mp3"
    );
    this.load.audio("playerExplode", "../assets/audio/XWing explode (1).mp3");
    this.load.audio(
      "enemyExplode",
      "../assets/audio/TIE fighter explode (1).mp3"
    );

    this.load.atlas(
      "explosion",
      "../assets/ships/explosion-fast.png",
      "../assets/ships/explosion-fast.json"
    );
  }

  create() {
    //ALL SOUNDS
    cosmicSound = this.sound.add("cosmic", { volume: 0.1 });
    playerShipSound = this.sound.add("xwingFlyby", { volume: 0.1 });
    playerLaserSound = this.sound.add("playerLaserAudio", { volume: 0.3 });
    enemyShipSound = this.sound.add("tieFlyby", { volume: 0.3 });
    enemyLaserSound = this.sound.add("enemyLaserAudio", { volume: 0.1 });
    playerExplode = this.sound.add("playerExplode", { volume: 0.1 });
    enemyExplode = this.sound.add("enemyExplode", { volume: 0.3 });

    bg = this.add.image(400, 300, "background");
    bg.setDisplaySize(800, 600);
    bg = this.add.tileSprite(500, 100, 1024, 1024, "background");

    frameNames = this.textures.get("explosion").getFrameNames();
    this.anims.create({
      key: "boom",
      frames: [
        { key: "explosion", frame: "Small Explosion Spriteheet-0.png" },
        { key: "explosion", frame: "Small Explosion Spriteheet-1.png" },
        { key: "explosion", frame: "Small Explosion Spriteheet-2.png" },
        { key: "explosion", frame: "Small Explosion Spriteheet-3.png" },
        { key: "explosion", frame: "Small Explosion Spriteheet-4.png" },
        { key: "explosion", frame: "Small Explosion Spriteheet-5.png" },
        { key: "explosion", frame: "Small Explosion Spriteheet-6.png" },
        { key: "explosion", frame: "Small Explosion Spriteheet-7.png" },
      ],
      frameRate: 20,
      repeat: 0,
    });

    this.explosion = this.add.sprite(100, 100, "explosion").setScale(0);
    this.explosion.play("boom");
    this.explosion.on("animationcomplete", function () {
      this.destroy();
    });

    platform = this.physics.add.staticGroup();
    platform.create(0, 730, "bottom");

    playerShip = this.physics.add.sprite(400, 490, "playerShip");
    playerShip.setScale(0.13);
    playerShip.setCollideWorldBounds(true); //Stops playerShip from leaving the frame.
    playerShipControls = this.input.keyboard.createCursorKeys(); //Gives us access to Arrowkeys + Space + Shift

    enemyShip = this.physics.add.sprite(700, 100, "enemyShip");
    enemyShip.setScale(0);
    enemyShip.setFlipY(true); //To flip the image on its Y-axis. It can also be used on the X-axis

    gameState.fallingEnemies = this.physics.add.group(); // Creating a group to generate random ships in

    function enemyGen() {
      const XCoord = Math.random() * 600; // Generates random enemyship on the X-axis
      gameState.fallingEnemies.create(XCoord, 0, "enemyShip").setScale(0.4);
    }

    this.time.addEvent({
      delay: 1000,
      callback: enemyGen, // using to call the function enemyGen()
      callbackScope: this,
      loop: true,
    });

    gameState.playerLaser = this.physics.add.group();

    this.physics.add.collider(playerShip, platform);

    this.physics.add.collider(
      playerShip,
      gameState.fallingEnemies,
      (playerShip, fallingEnemy) => {
        playerShip.destroy();
        fallingEnemy.destroy();
        this.explosion = this.add
          .sprite(fallingEnemy.x, fallingEnemy.y, "explosion")
          .setScale(0.5);
        this.explosion.play("boom");
        this.explosion.on("animationcomplete", function () {
          this.destroy();
        });
        enemyExplode.play();
      }
    );

    this.physics.add.collider(
      gameState.playerLaser,
      gameState.fallingEnemies,
      (playerLaser, fallingEnemy) => {
        this.explosion = this.add
          .sprite(fallingEnemy.x, fallingEnemy.y, "explosion")
          .setScale(0.5);
        this.explosion.play("boom");
        this.explosion.on("animationcomplete", function () {
          this.destroy();
        });
        enemyExplode.play();
        setTimeout(() => {
          playerLaser.destroy();
          fallingEnemy.destroy();
          gameState.hitScore += 1;
          gameState.hitScoreText.setText(
            `ENEMIES KILLED: ${gameState.hitScore}`
          );
        }, 1);
      }
    );

    this.physics.add.collider(
      playerShip,
      gameState.shoot,
      (playerShip, shoot) => {
        this.explosion = this.add.sprite(
          playerShip.x,
          playerShip.y,
          "explosion"
        );
        this.explosion.play("boom");
        this.explosion.on("animationcomplete", function () {
          this.destroy();
        });
        enemyExplode.play();
        setTimeout(() => {
          playerShip.destroy();
          shoot.destroy();
        }, 1);
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

    this.physics.add.collider(
      playerShip,
      gameState.fallingEnemies,
      (playerShip, fallingEnemy) => {
        playerShip.destroy();
        fallingEnemy.destroy();
        this.explosion = this.add
          .sprite(fallingEnemy.x, fallingEnemy.y, "explosion")
          .setScale(0.5);
        this.explosion.play("boom");
        this.explosion.on("animationcomplete", function () {
          this.destroy();
        });
        enemyExplode.play();
      }
    );

    gameState.hitScoreText = this.add.text(50, 560, "ENEMIES HIT : 0", {});
    gameState.scoreText = this.add.text(300, 560, "ENEMIES MISSED : 0", {});
  }

  randomFire(world) {
    let arrayOfEnemies = gameState.fallingEnemies.getChildren();
    let random = Math.floor(Math.random() * arrayOfEnemies.length);
    let enemy = arrayOfEnemies[random];
    if (enemy) {
      let position = enemy.body.center;
      gameState.shoot = this.physics.add.sprite(
        position.x,
        position.y,
        "enemyLaser"
      );
      gameState.shoot.setVelocityY(300);
      enemyLaserSound.play();
    }
  }

  update() {
    bg.tilePositionY -= 1; // THE BACKGROUND IS ROLLING

    if (fireFrequency > 50) {
      fireFrequency = 0;
      this.randomFire(this.physics);
    } else {
      fireFrequency++;
    }

    if (Phaser.Input.Keyboard.JustDown(playerShipControls.space)) {
      gameState.playerLaser
        .create(playerShip.x, playerShip.y, "playerLaser")
        .setGravityY(-1200);
      playerLaserSound.play();
    } else if (Phaser.Input.Keyboard.JustDown(playerShipControls.right)) {
      playerShipSound.play();
    } else if (Phaser.Input.Keyboard.JustDown(playerShipControls.left)) {
      playerShipSound.play();
    } else if (Phaser.Input.Keyboard.JustDown(playerShipControls.up)) {
      playerShipSound.play();
    } else if (Phaser.Input.Keyboard.JustDown(playerShipControls.down)) {
      playerShipSound.play();
    }

    if (playerShipControls.left.isDown) {
      playerShip.setVelocity(-400, 0); //Left arrow is pressed
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
        cosmicSound.loop = true;
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
