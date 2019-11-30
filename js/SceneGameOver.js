class SceneGameOver extends Phaser.Scene {
    constructor() {
        super({ key: "SceneGameOver" });
    }

    preload()
    {
        this.load.image("sprBtnContinue", "resources/touch_to_continue.png");
    }

    create() {

    }
}