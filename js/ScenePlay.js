class ScenePlay extends Phaser.Scene {
    constructor() {
        super({ key: "ScenePlay" });
    }

    preload() {
        this.load.image("sprBg0", "content/sprBg0.png");
        this.load.image("sprBg1", "content/sprBg1.png");
        this.load.spritesheet("sprExplosion", "content/sprExplosion.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("sprEnemy0", "content/sprEnemy0.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("sprEnemy1", "content/sprEnemy1.png");
        this.load.spritesheet("sprEnemy2", "content/sprEnemy2.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("sprPlayer", "content/sprPlayer.png", {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create() {

    }
}