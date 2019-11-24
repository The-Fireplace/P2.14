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
        this.load.image("sprGear", "resources/gear.png");
        this.load.audio('music', 'resources/POL-galactic-chase-short.wav');
    }

    create()
    {
        const music = this.sound.add('music');
        const loopMarker = {
            name: 'loop',
            start: 0,
            duration: 22.588,
            config: {
                loop: true
            }
        };
        music.addMarker(loopMarker);
        music.play('loop', {
            delay: 0
        });
        this.btnPlay = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.75,
            "sprBtnPlay"
        );
        this.btnPlay.scale = 1.5;

        this.btnShip = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.6,
            "sprShip"
        );
        this.btnShip.scale = 0.5;

        this.btnLogo = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.3,
            "sprLogo"
        );

        this.btnOptions = this.add.sprite(
            this.game.config.width - 32,
            32,
            "sprGear"
        );
        this.btnOptions.scale = 2.0;

        this.backgrounds = [];
        for (let i = 0; i < 5; i++)
        {
            const keys = ["sprBg"];
            const key = keys[Phaser.Math.Between(0, keys.length - 1)];
            const bg = new ScrollingBackground(this, key, i * 10);
            this.backgrounds.push(bg);
        }

        this.input.on('pointerdown', function (pointer)
        {
            //var touchX = pointer.x;
            //var touchY = pointer.y;
            //TODO Not on options click
            this.scene.start("ScenePlay");
        }, this);
    }

    update()
    {
        for (let i = 0; i < this.backgrounds.length; i++)
        {
            this.backgrounds[i].update();
        }
    }
}