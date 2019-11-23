class SceneMainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMainMenu" });
    }

    create() {
        //this.scene.start("ScenePlay");
        this.btnPlay = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprBtnPlay"
        );

        this.backgrounds = [];
        for (let i = 0; i < 5; i++) {
            const keys = ["sprBg", "sprBg"];
            const key = keys[Phaser.Math.Between(0, keys.length - 1)];
            const bg = new ScrollingBackground(this, key, i * 10);
            this.backgrounds.push(bg);
        }
    }
}