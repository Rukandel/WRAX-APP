import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    /** basic path */
    this.load.setPath("assets/");

    this.load.audio("jump", "jump.m4a");
    this.load.audio("hit", "hit.m4a");
    this.load.audio("reach", "reach.m4a");

    this.load.image("ground", "ground.png");
    this.load.image("dino-idle", "dino-idle.png");
    this.load.image("dino-hurt", "dino-hurt.png");
    this.load.image("restart", "restart.png");
    this.load.image("game-over", "game-over.png");
    this.load.image("cloud", "cloud.png");

    this.load.atlas("coin", "coin/coin.png", "coin/coin.json");

    //for buttons
    this.load.image("profile", "buttons/profile.png");
    this.load.image("quests", "buttons/swords.png");
    this.load.image("boosts", "buttons/boosts.png");

    this.load.spritesheet("star", "stars.png", {
      frameWidth: 9,
      frameHeight: 9,
    });

    this.load.spritesheet("moon", "moon.png", {
      frameWidth: 20,
      frameHeight: 40,
    });

    this.load.spritesheet("dino", "dino-run.png", {
      frameWidth: 88,
      frameHeight: 94,
    });

    this.load.spritesheet("dino-down", "dino-down.png", {
      frameWidth: 118,
      frameHeight: 94,
    });

    this.load.spritesheet("enemy-bird", "enemy-bird.png", {
      frameWidth: 92,
      frameHeight: 77,
    });

    this.load.image("obsticle-1", "cactuses_small_1.png");
    this.load.image("obsticle-2", "cactuses_small_2.png");
    this.load.image("obsticle-3", "cactuses_small_3.png");
    this.load.image("obsticle-4", "cactuses_big_1.png");
    this.load.image("obsticle-5", "cactuses_big_2.png");
    this.load.image("obsticle-6", "cactuses_big_3.png");
  }

  create() {
    this.scene.start("Menu");
  }
}

export default PreloadScene;
