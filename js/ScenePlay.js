class ScenePlay extends Phaser.Scene
{
    constructor()
    {
        super({ key: "ScenePlay" });
    }

    preload()
    {
        this.load.image("sprBg", "resources/background.png");
        this.load.image("sprCockpit", "resources/FullCockpit.png");
        this.load.image("sprAsteroid", "resources/asteroid.png");
        this.load.image("sprPlayer", "resources/SpaceShipWFire.png");
        this.load.spritesheet("explosionAnim", "resources/Explosion.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("forceFieldGrowingAnim", "resources/ForceFieldGrow.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image("forceField", "resources/ForceField.png");
    }

    create()
    {
        this.anims.create({
            key: "explosionAnim",
            frames: this.anims.generateFrameNumbers("explosionAnim"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "forceFieldGrowingAnim",
            frames: this.anims.generateFrameNumbers("forceFieldGrowingAnim"),
            frameRate: 10,
            repeat: -1
        });

        this.backgrounds = [];
        for (let i = 0; i < 3; i++) {
            const bg = new ScrollingBackground(this, "sprBg", i * 10);
            this.backgrounds.push(bg);
        }

        this.btnOptions = this.add.sprite(
            this.game.scale.width - 32,
            32,
            "sprGear"
        );
        this.btnOptions.scale = 1;

        this.cockPit = this.add.sprite(
            this.game.scale.width * .5,
            this.game.scale.height * .5,
            "sprCockpit"
        );
        this.cockPit.scale = 1;

        this.player = new Player(
            this,
            this.game.scale.width * 0.5,
            this.game.scale.height * 0.5,
            "sprPlayer"
        );
        this.player.scale = 0.3;

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.ff = null;

        this.physics.add.overlap(this.player, this.enemies, function (player, enemy)
        {
            if (!player.getData("isDead") &&
                !enemy.getData("isDead"))
            {
                if (this.ff == null)
                {
                    player.explode(false);
                    enemy.explode(true);
                } else
                {
                    enemy.explode(true);
                }
            }
        });

        this.enemies = this.add.group();

        //Enemy spawning timer
        this.time.addEvent({
            delay: 1000,
            callback: function ()
            {
                const enemy = new Asteroid(
                    this,
                    Phaser.Math.Between(0, this.game.scale.width),
                    0
                );
                enemy.scale = 0.3;
                this.enemies.add(enemy);
            },
            callbackScope: this,
            loop: true
        });

        this.scale.on('resize', this.resize, this);
        let gameWidth = this.cameras.main.width;
        let gameHeight = this.cameras.main.height;
        this.positionControls(gameWidth, gameHeight);
    }

    positionControls(width, height) {
        localScaleManager.scaleSprite(this.player, width/7, height, 0, 1, true);
        this.player.setPosition(width / 2, height * 0.6);

        localScaleManager.scaleSprite(this.btnOptions, width / 14, height, 0, 1, true);
        this.btnOptions.setPosition((width - this.btnOptions.displayWidth / 2) - 1 * this.btnOptions.scale, this.btnOptions.displayHeight / 2 + 1 * this.btnOptions.scale);

        console.log('options: ', this.btnOptions);

        localScaleManager.scaleSprite(this.cockPit, width, height, 0, 1, true);
        this.cockPit.setPosition(width * .5, height - this.cockPit.displayHeight/2);

        console.log('cockpit: ', this.cockPit);
    }

    resize(gameSize, baseSize, displaySize, resolution) {
        let width = gameSize.width;
        let height = gameSize.height;

        this.cameras.resize(width, height);
        this.positionControls(width, height);
    }

    activateForceField() {
        if(this.player.fuel > 50) {
            //Activate forcefield
            this.player.fuel -= 50;
            //TODO forcefield sound effect
            this.ff = new ForceField(this, this.player.x, this.player.y);
            this.time.addEvent({
                delay: 1000,
                callback: function ()
                {
                    this.ff.destroy();
                    this.ff = null;
                },
                callbackScope: this,
                loop: false
            });
        }
    }

    update()
    {
        for (let i = 0; i < this.backgrounds.length; i++)
        {
            this.backgrounds[i].update();
        }

        if (!this.player.getData("isDead"))
        {
            this.player.update();

            //TODO This is where the player controls would go
            if (this.keyW.isDown)
            {
                this.player.moveUp();
            } else if (this.keyS.isDown)
            {
                this.player.moveDown();
            }

            if (this.keyA.isDown)
            {
                this.player.moveLeft();
            } else if (this.keyD.isDown)
            {
                this.player.moveRight();
            }
        }

        for (let i = 0; i < this.enemies.getChildren().length; i++)
        {
            const enemy = this.enemies.getChildren()[i];

            enemy.update();

            if (enemy.x < -enemy.displayWidth ||
                enemy.x > this.game.scale.width + enemy.displayWidth ||
                enemy.y < -enemy.displayHeight * 4 ||
                enemy.y > this.game.config.height + enemy.displayHeight)
            {

                if (enemy)
                {
                    if (enemy.onDestroy !== undefined)
                    {
                        enemy.onDestroy();
                    }

                    enemy.destroy();
                }

            }
        }
    }
}