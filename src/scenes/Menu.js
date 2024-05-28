import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    const { width, height } = this.scale;
    const startButton = this.add
      .text(width / 2, height / 2, "Play", {
        fontFamily: "Arial",
        fontSize: "30px",
        color: "#ffffff",
        align: "center",
        fixedWidth: 240,
        backgroundColor: "#2d2d2d",
      })
      .setPadding(32)
      .setOrigin(0.5);

    startButton.setInteractive({ useHandCursor: true });
    startButton.on("pointerover", () => {
      startButton.setBackgroundColor("#8d8d8d");
    });

    startButton.on("pointerout", () => {
      startButton.setBackgroundColor("#2d2d2d");
    });

    startButton.on("pointerdown", this.startGame);

    this.createShopButton();
  }

  createShopButton = () => {
    const shopButton = this.add
      .text(60, 40, "Shop", {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        fixedWidth: 100,
        backgroundColor: "#2d2d5d",
      })
      .setPadding(16)
      .setOrigin(0.5);

    shopButton.alpha = 0.6;
    shopButton.setInteractive({ useHandCursor: true });
    shopButton.on("pointerover", () => {
      shopButton.setBackgroundColor("#1d1d8d");
    });

    shopButton.on("pointerout", () => {
      shopButton.setBackgroundColor("#2d2d5d");
    });

    shopButton.on("pointerdown", this.openShop);

    const comingSoonText = this.add.text(
      shopButton.x - 50,
      shopButton.y + 10,
      "Coming soon",
      {
        color: "#4500ff",
        align: "center",
        fontSize: "28px",
        fontFamily: "Arial",
      }
    );

    comingSoonText.rotation = Math.PI * -0.1;
  };

  openShop = () => {};

  startGame = () => {
    this.scene.start("PlayScene");
  };
}
