class SceneGameOver extends Phaser.Scene {
    constructor() {
        super({ key: "SceneGameOver" });
    }

    preload()
    {
        this.load.image("sprBtnContinue", "resources/touch_to_continue.png");
        this.load.image("sprGameOver", "resources/game_over.png");
    }

    create() {
        this.backgrounds = [];
        for (let i = 0; i < 3; i++)
        {
            const bg = new ScrollingBackground(this, "sprBg", i * 10);
            this.backgrounds.push(bg);
        }
        this.btnContinue = this.add.sprite(
          this.game.scale.width * 0.5,
          this.game.scale.height * 0.75,
          "sprBtnContinue"
        );
        this.btnContinue.scale = 1.5;

        this.btnGameOver = this.add.sprite(
          this.game.scale.width * 0.5,
          this.game.scale.height * 0.3,
          "sprGameOver"
        );

        this.input.on('pointerdown', function (pointer)
        {
            this.scene.start("SceneMainMenu");
        }, this);
        this.scale.on('resize', this.resize, this);
        let gameWidth = this.cameras.main.width;
        let gameHeight = this.cameras.main.height;
        this.positionControls(gameWidth, gameHeight);
    }

    update() {
        for (let i = 0; i < this.backgrounds.length; i++) {
            this.backgrounds[i].update();
        }
    }

    positionControls(width, height) {
        localScaleManager.scaleSprite(this.btnContinue, width/2.15, height, 0, 1, true);
        this.btnContinue.setPosition(width / 2, height * 0.825);

        localScaleManager.scaleSprite(this.btnGameOver, width/1.50, height, 0, 1, true);
        this.btnGameOver.setPosition(width / 2, height * 0.25);
    }

    resize(gameSize, baseSize, displaySize, resolution) {
        let width = gameSize.width;
        let height = gameSize.height;

        this.cameras.resize(width, height);
        this.positionControls(width, height);
    }
}