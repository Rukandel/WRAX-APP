import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  create() {
    this.isGameRunning = false;
    this.gameSpeed = 10;
    this.respawnTime = 0;

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

    this.obsticles = this.physics.add.group();

    this.initAnim();
    this.handleInputs();
    this.initStartTrigger();
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

  handleInputs() {
    this.input.keyboard.on("keydown-SPACE", () => {
      if (!this.dino.body.onFloor()) {
        return;
      }

      this.dino.body.height = 92;
      this.dino.body.offset.y = 0;

      this.dino.setVelocityY(-1600);
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      if (!this.dino.body.onFloor()) {
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

  update() {
    if (!this.isGameRunning) return;
    this.ground.tilePositionX += this.gameSpeed;

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
