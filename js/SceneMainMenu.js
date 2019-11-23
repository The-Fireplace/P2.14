class SceneMainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMainMenu" });
    }

    preload() {
        this.load.image("sprBg", "resources/background.png");
        this.load.image("sprBtnPlay", "resources/play_button.png");
        this.load.image("sprLogo", "resources/SPACIALDELIVERY-1.png");
        this.load.image("sprShip", "resources/SpaceShipWFire.png");
    }

    create() {
        //this.scene.start("ScenePlay");
        this.btnPlay = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.75,
            "sprBtnPlay"
        );

        this.btnShip = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.6,
            "sprShip"
        );

        this.btnLogo = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.3,
            "sprLogo"
        );

        this.backgrounds = [];
        for (let i = 0; i < 5; i++) {
            const keys = ["sprBg"];
            const key = keys[Phaser.Math.Between(0, keys.length - 1)];
            const bg = new ScrollingBackground(this, key, i * 10);
            this.backgrounds.push(bg);
        }
    }

    update() {
        for (let i = 0; i < this.backgrounds.length; i++) {
            this.backgrounds[i].update();
        }
    }
}