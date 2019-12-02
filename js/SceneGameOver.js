class SceneGameOver extends Phaser.Scene {
    constructor() {
        super({ key: "SceneGameOver" });
    }

    preload()
    {
        this.load.image("sprBtnContinue", "resources/touch_to_continue.png");
        this.load.image("sprGameFailed", "resources/DeliveryFailed.png");
        this.load.image("sprGameSuccess", "resources/DeliverySuccess.png");
    }

    create() {
        this.backgrounds = [];
        for (let i = 0; i < 3; i++)
        {
            const bg = new ScrollingBackground(this, "sprBg", i * 10);
            this.backgrounds.push(bg);
        }
        this.btnContinue = this.add.sprite(0, 0, "sprBtnContinue");
        this.btnContinue.scale = 1.5;

        this.deliverySucc = this.add.sprite(0, 0, "sprGameSuccess");

        this.deliveryFail = this.add.sprite(0, 0, "sprGameFailed");

        this.input.on('pointerdown', function (pointer)
        {
            this.scene.start("SceneMainMenu");
        }, this);
        this.scale.on('resize', this.resize, this);
        let gameWidth = this.cameras.main.width;
        let gameHeight = this.cameras.main.height;
        this.positionControls(gameWidth, gameHeight);


        if (winLose == 1) {
            this.deliveryFail.visible = false;
            //win sound from sceneplay
            this.game.sound.sounds[5].play();
        }
        else if (winLose == -1) {
            this.deliverySucc.visible = false;
            //lose sound from sceneplay
            this.game.sound.sounds[4].play();
        }
    }

    update() {
        for (let i = 0; i < this.backgrounds.length; i++) {
            this.backgrounds[i].update();
        }
    }

    positionControls(width, height) {
        localScaleManager.scaleSprite(this.btnContinue, width/2.15, height, 0, 1, true);
        this.btnContinue.setPosition(width / 2, height * 0.825);

        localScaleManager.scaleSprite(this.deliverySucc, width/1.22, height, 0, 1, true);
        this.deliverySucc.setPosition(width / 2, height * 0.255);

        localScaleManager.scaleSprite(this.deliveryFail, width/1.22, height, 0, 1, true);
        this.deliveryFail.setPosition(width / 2, height * 0.255);
    }

    resize(gameSize, baseSize, displaySize, resolution) {
        let width = gameSize.width;
        let height = gameSize.height;

        this.cameras.resize(width, height);
        this.positionControls(width, height);
    }
}