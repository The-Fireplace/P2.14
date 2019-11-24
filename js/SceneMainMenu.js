class SceneMainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMainMenu" });
    }

    preload() {
        this.load.image("sprBg", "resources/background.png");
        this.load.image("sprBtnPlay", "resources/play_button.png");
        this.load.image("sprLogo", "resources/SPACIALDELIVERY-1.png");
        this.load.image("sprShip", "resources/SpaceShipWFire.png");
        this.load.image("sprGear", "resources/gear.png");
    }

    create() {
        console.log('game: ', game);
        //this.scene.start("ScenePlay");
        this.btnPlay = this.add.sprite(
            this.game.scale.width * 0.5,
            this.game.scale.height * 0.75,
            "sprBtnPlay"
        );
        this.btnPlay.scale = 1.5;

        this.btnShip = this.add.sprite(
            this.game.scale.width * 0.5,
            this.game.scale.height * 0.6,
            "sprShip"
        );
        this.btnShip.scale = 0.5;

        this.btnLogo = this.add.sprite(
            this.game.scale.width * 0.5,
            this.game.scale.height * 0.3,
            "sprLogo"
        );

        this.btnOptions = this.add.sprite(
            this.game.scale.width - 32,
            32,
            "sprGear"
        );
        this.btnOptions.scale = 1;

        this.backgrounds = [];
        for (let i = 0; i < 3; i++) {
            const keys = ["sprBg"];
            const key = keys[Phaser.Math.Between(0, keys.length - 1)];
            const bg = new ScrollingBackground(this, key, i * 10);
            this.backgrounds.push(bg);
        }

        this.input.on('pointerdown', function(pointer){
            //var touchX = pointer.x;
            //var touchY = pointer.y;
            //TODO Not on options click
            game.scene.start("ScenePlay");
        });

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
        localScaleManager.scaleSprite(this.btnPlay, width/2.15, height, 0, 1, true);
        this.btnPlay.setPosition(width / 2, height * 0.825);

        localScaleManager.scaleSprite(this.btnShip, width/5, height, 0, 1, true);
        this.btnShip.setPosition(width / 2, height * .6 );

        localScaleManager.scaleSprite(this.btnOptions, width / 14, height, 0, 1, true);
        this.btnOptions.setPosition(width - 20, 20);

        localScaleManager.scaleSprite(this.btnLogo, width/1.50, height, 0, 1, true);
        this.btnLogo.setPosition(width / 2, height * 0.25);
    }

    resize(gameSize, baseSize, displaySize, resolution) {
        let width = gameSize.width;
        let height = gameSize.height;

        this.cameras.resize(width, height);
        this.positionControls(width, height);
    }
}