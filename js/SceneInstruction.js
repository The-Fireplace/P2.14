class SceneInstruction extends Phaser.Scene {
    constructor() {
        super({key: "SceneInstruction"});
    }

    preload()
    {
        this.load.image("sprBg", "resources/background.png");
        this.load.image("sprBtnPlay", "resources/play_button.png");
        this.load.image("sprCockpit", "resources/EmptyCockpit.png");
        this.load.image("sprShip", "resources/SpaceShipWFire.png");
        this.load.image("sprAsteroid", "resources/asteroid.png");
        this.load.image("sprPlanet", "resources/planet.png");
        this.load.image("sprSteeringWheel", "resources/SteeringWheel.png");
        this.load.image("sprShieldBtnUsable", "resources/ShieldBtnUsable.png");
        this.load.image("sprSpeedHandle", "resources/SpeedHandle.png");
        this.load.image("sprFuel9", "resources/Fuel9.png");

    }

    create() {

        this.btnPlay = this.add.sprite(0, 0, "sprBtnPlay");
        this.btnShip = this.add.sprite(0, 0, "sprShip");
        this.cockPit = this.add.sprite(0, 0, "sprCockpit");
        this.cockPit.alpha = .4;
        this.cockPit.setDepth(3);
        this.asteroid = this.add.sprite(0, 0, "sprAsteroid");
        this.planet = this.add.sprite(0, 0, "sprPlanet");
        this.shieldUseable = this.add.sprite(0, 0, "sprShieldBtnUsable");
        this.shieldUseable.setDepth(4);
        this.steering = this.add.sprite(0, 0, "sprSteeringWheel");
        this.steering.setDepth(4);
        this.throttle = this.add.sprite(0, 0, "sprSpeedHandle");
        this.throttle.setDepth(4);
        this.fuel = this.add.sprite(0, 0, "sprFuel9");
        this.fuel.setDepth(4);

        this.backgrounds = [];
        for (let i = 0; i < 3; i++)
        {
            const bg = new ScrollingBackground(this, "sprBg", i * 10);
            this.backgrounds.push(bg);
        }

        this.input.on('pointerdown', function (pointer)
        {
            //TODO Not on options click
            this.scene.start("ScenePlay");
        }, this);

        this.scale.on('resize', this.resize, this);
        let gameWidth = this.cameras.main.width;
        let gameHeight = this.cameras.main.height;
        this.positionControls(gameWidth, gameHeight);
    }

    update() {

    }

    positionControls(width, height) {
        localScaleManager.scaleSprite(this.btnPlay, width/2.15, height, 0, 1, true);
        this.btnPlay.setPosition(width / 2, height * 0.825);

        localScaleManager.scaleSprite(this.btnShip, width/7, height, 0, 1, true);
        this.btnShip.setPosition(width / 2, height * .6 );

        localScaleManager.scaleSprite(this.cockPit, width, height, 0, 1, true);
        this.cockPit.setPosition(width * .5, height - this.cockPit.displayHeight / 2);

        localScaleManager.scaleSprite(this.asteroid, width/6, height, 0, 1, true);
        this.asteroid.setPosition(width * .2, height *.4);

        localScaleManager.scaleSprite(this.planet, width, height, 0, 1, true);
        this.planet.setPosition(width * .5, 0);

        localScaleManager.scaleSprite(this.steering, width / 3.8, height, 0, 1, true);
        this.steering.setPosition(width * .22, height + 2 - this.cockPit.displayHeight / 2);

        localScaleManager.scaleSprite(this.throttle, width / 7.5, height, 0, 1, true);
        this.throttle.setPosition(width * .725, height - this.cockPit.displayHeight / 2);

        localScaleManager.scaleSprite(this.shieldUseable, width / 6, height, 0, 1, true);
        this.shieldUseable.setPosition(width * .49, height - 5 - this.cockPit.displayHeight / 4);

        localScaleManager.scaleSprite(this.fuel, width / 5, height, 0, 1, true);
        this.fuel.setPosition(width * .49, height - 5 - this.cockPit.displayHeight / 4 - this.cockPit.displayHeight / 2);

        // localScaleManager.scaleSprite(this.btnOptions, width / 14, height, 0, 1, true);
        // this.btnOptions.setPosition((width - this.btnOptions.displayWidth / 2) - 1 * this.btnOptions.scale, this.btnOptions.displayHeight / 2 + 1 * this.btnOptions.scale);

        // localScaleManager.scaleSprite(this.btnLogo, width/1.50, height, 0, 1, true);
        // this.btnLogo.setPosition(width / 2, height * 0.25);
    }

    resize(gameSize, baseSize, displaySize, resolution) {
        let width = gameSize.width;
        let height = gameSize.height;

        this.cameras.resize(width, height);
        this.positionControls(width, height);
    }
}