import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  create() {
    this.isGameRunning = false;
    this.gameSpeed = 10;
    this.respawnTime = 0;
    this.score = 0;

    const { height, width } = this.game.config;

    this.startTrigger = this.physics.add
      .sprite(0, 10)
      .setOrigin(0, 1)
      .setImmovable();
    this.ground = this.add
      .tileSprite(0, height, 88, 26, "ground")
      .setOrigin(0, 1);
    this.dino = this.physics.add
      .sprite(0, height, "dino-idle")
      .setOrigin(0, 1)
      .setOrigin(0, 1)
      .setCollideWorldBounds(true)
      .setGravityY(5000);

    this.scoreText = this.add
      .text(width, 0, "00000", {
        fill: "#535353",
        font: "900 35px Courier",
        resolution: 5,
      })
      .setOrigin(1, 0)
      .setAlpha(0);

    this.highScoreText = this.add
      .text(width, 0, "00000", {
        fill: "#535353",
        font: "900 35px Courier",
        resolution: 5,
      })
      .setOrigin(1, 0)
      .setAlpha(0);

    this.gameOverScreen = this.add
      .container(width / 2, height / 2 - 50)
      .setAlpha(0);
    this.gameOverText = this.add.image(0, 0, "game-over");
    this.restart = this.add.image(0, 80, "restart").setInteractive();

    this.environment = this.add.group();
    this.environment.addMultiple([
      this.add.image(width/2, 170, "cloud"),
      this.add.image(width - 88, 80, "cloud"),
      this.add.image(width/1.3, 100, "cloud"),
    ])

    this.environment.setAlpha(0);

    this.gameOverScreen.add([this.gameOverText, this.restart]);

    this.obsticles = this.physics.add.group();

    this.initAnim();
    this.initColliders();
    this.handleInputs();
    this.initStartTrigger();
    this.handleScore();
  }

  initColliders() {
    this.physics.add.collider(
      this.dino,
      this.obsticles,
      () => {
        this.highScoreText.x = this.scoreText.x - this.scoreText.width - 20;

        const highScore = this.highScoreText.text.substring(
          this.highScoreText.text.length - 5
        );
        const newScore =
          Number(this.scoreText.text) > Number(highScore)
            ? this.scoreText.text
            : highScore;

        this.highScoreText.setText(`High Score: ${newScore}`);
        this.highScoreText.setAlpha(1);

        this.physics.pause();
        this.isGameRunning = false;
        this.anims.pauseAll();
        this.dino.setTexture("dino-hurt");
        this.respawnTime = 0;
        this.gameSpeed = 10;
        this.gameOverScreen.setAlpha(1);
        this.score = 0;
      },
      null,
      this
    );
  }

  initStartTrigger() {
    const { width, height } = this.game.config;
    this.physics.add.overlap(
      this.startTrigger,
      this.dino,
      () => {
        if (this.startTrigger.y === 10) {
          this.startTrigger.body.reset(0, height);
          return;
        }

        this.startTrigger.disableBody(true, true);

        const startEvent = this.time.addEvent({
          delay: 1000 / 60,
          loop: true,
          callbackScope: this,
          callback: () => {
            this.dino.setVelocityX(80);
            this.dino.anims.play("dino-run", 1);

            if (this.ground.width < width) {
              this.ground.width += 17 * 2;
            }

            if (this.ground.width >= width) {
              this.ground.width = width;
              this.isGameRunning = true;
              this.dino.setVelocity(0);
              this.scoreText.setAlpha(1);
              this.environment.setAlpha(1);
              startEvent.remove();
            }
          },
        });
      },
      null,
      this
    );
  }

  initAnim() {
    this.anims.create({
      key: "dino-run",
      frames: this.anims.generateFrameNumbers("dino", {
        start: 2,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "dino-down-anim",
      frames: this.anims.generateFrameNumbers("dino-down", {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "enemy-dino-fly",
      frames: this.anims.generateFrameNumbers("enemy-bird", {
        start: 0,
        end: 1,
      }),
      frameRate: 6,
      repeat: -1,
    });
  }

  handleScore() {
    this.time.addEvent({
      delay: 1000 / 60,
      loop: true,
      callbackScope: this,
      callback: () => {
        if (!this.isGameRunning) {
          return;
        }

        this.score++;
        this.gameSpeed += 0.01;

        // const score = Array.from(this.score.toString(), Number);
        // for(let i = 0; i < 6 - score.length; i++) {
        //   score.unshift(0);
        // }

        // this.scoreText.setText(score.join(""));
        const score = this.score.toString();
        this.scoreText.setText(score.padStart(5, "0"));
      },
    });
  }

  handleInputs() {
    this.restart.on("pointerdown", () => {
      this.dino.setVelocityY(0);
      this.dino.body.height = 92;
      this.dino.body.offset.y = 0;
      this.physics.resume();
      this.obsticles.clear(true, true);
      this.isGameRunning = true;
      this.gameOverScreen.setAlpha(0);
      this.anims.resumeAll();
    });

    this.input.keyboard.on("keydown-SPACE", () => {
      if (!this.dino.body.onFloor()) {
        return;
      }

      this.dino.body.height = 92;
      this.dino.body.offset.y = 0;

      this.dino.setVelocityY(-1600);
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      if (!this.dino.body.onFloor() || !this.isGameRunning) {
        return;
      }
      this.dino.body.height = 58;
      this.dino.body.offset.y = 34;
    });

    this.input.keyboard.on("keyup-DOWN", () => {
      if (!this.dino.body.onFloor()) {
        return;
      }
      this.dino.body.height = 92;
      this.dino.body.offset.y = 0;
    });
  }

  placeObsticle() {
    const { width, height } = this.game.config;

    const obsticleNum = Math.floor(Math.random() * 7) + 1; //1-7
    const distance = Phaser.Math.Between(600, 900);

    let obsticle;

    if (obsticleNum > 6) {
      const enemyHeight = [22, 50];
      obsticle = this.obsticles.create(
        width + distance,
        height - enemyHeight[Math.floor(Math.random() * 2)],
        "enemy-bird"
      );
      obsticle.play("enemy-dino-fly", true);
      obsticle.body.height /= 1.5;
    } else {
      obsticle = this.obsticles.create(
        width + distance,
        height,
        `obsticle-${obsticleNum}`
      );
      obsticle.body.offset.y = +10;
    }

    obsticle.setOrigin(0, 1);
    obsticle.setImmovable();

    console.log("Obsticle Num", obsticleNum, "Distance", distance);
  }

  update(time, delta) {
    if (!this.isGameRunning) return;
    this.ground.tilePositionX += this.gameSpeed;

    Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.environment.getChildren(), -0.5);

    this.respawnTime += delta * this.gameSpeed * 0.08;

    if (this.respawnTime >= 1500) {
      this.placeObsticle();
      this.respawnTime = 0;
    }

    this.obsticles.getChildren().forEach((obsticle) => {
      if (obsticle.getBounds().right < 0) {
        console.log("Remove", obsticle);
        obsticle.destroy();
      }
    });

    this.environment.getChildren().forEach((env) => {
      if (env.getBounds().right < 0) {
        env.x = this.game.config.width + 30;  
      }
    });

    if (this.dino.body.velocity.y !== 0) {
      this.dino.anims.stop();
      this.dino.setTexture("dino");
    } else {
      this.dino.anims.play("dino-run", true);

      this.dino.body.height <= 58
        ? this.dino.anims.play("dino-down-anim", true)
        : this.dino.anims.play("dino-run", true);
    }
  }
}

export default PlayScene;
