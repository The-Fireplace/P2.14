let bgConfig = {
    volume: .3,
    loop: true
};
class SceneMainMenu extends Phaser.Scene
{
    constructor()
    {
        super({ key: "SceneMainMenu" });
    }

    preload()
    {
        this.load.image("sprBg", "resources/background.png");
        this.load.image("sprBtnPlay", "resources/play_button.png");
        this.load.image("sprLogo", "resources/SPACIALDELIVERY-1.png");
        this.load.image("sprShip", "resources/SpaceShipWFire.png");
        // this.load.image("sprGear", "resources/gear.png");
        this.load.audio('music', 'resources/POL-galactic-chase-short.wav');
    }

    create()
    {
        //Do it this way so music doesn't get created again every time you end up on the main menu
        if(this.music == null) {
            this.music = this.sound.add('music');
            const loopMarker = {
                name: 'loop',
                start: 0,
                duration: 22.588,
                config: bgConfig
            };
            this.music.addMarker(loopMarker);
        }
        if(!this.music.isPlaying) {
            this.music.play('loop', {
                delay: 0
            });
        }

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

        // this.btnOptions = this.add.sprite(
        //     this.game.scale.width - 32,
        //     32,
        //     "sprGear"
        // );
        // this.btnOptions.scale = 1;

        this.backgrounds = [];
        for (let i = 0; i < 3; i++) {
            //const keys = ["sprBg"];
            //const key = keys[Phaser.Math.Between(0, keys.length - 1)];
            const bg = new ScrollingBackground(this, "sprBg", i * 10);
            this.backgrounds.push(bg);
        }

        this.input.on('pointerdown', function (pointer)
        {
            game.sound.context.resume();
            if(!this.music.isPlaying) {
                this.music.play({
                    delay: 0
                });
            }
            //TODO Not on options click
            this.scene.start("SceneInstruction");
        }, this);
        this.scale.on('resize', this.resize, this);
        let gameWidth = this.cameras.main.width;
        let gameHeight = this.cameras.main.height;
        this.positionControls(gameWidth, gameHeight);
    }

    update()
    {
        for (let i = 0; i < this.backgrounds.length; i++)
        {
            this.backgrounds[i].update();
        }
    }

    positionControls(width, height) {
        localScaleManager.scaleSprite(this.btnPlay, width/2.15, height, 0, 1, true);
        this.btnPlay.setPosition(width / 2, height * 0.825);

        localScaleManager.scaleSprite(this.btnShip, width/7, height, 0, 1, true);
        this.btnShip.setPosition(width / 2, height * .6 );

        // localScaleManager.scaleSprite(this.btnOptions, width / 14, height, 0, 1, true);
        // this.btnOptions.setPosition((width - this.btnOptions.displayWidth / 2) - 1 * this.btnOptions.scale, this.btnOptions.displayHeight / 2 + 1 * this.btnOptions.scale);

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