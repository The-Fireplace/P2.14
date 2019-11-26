class ScenePlay extends Phaser.Scene
{
    constructor()
    {
        super({ key: "ScenePlay" });
    }

    preload()
    {
        this.load.image("sprBg", "resources/background.png");
        this.load.image("sprCockpit", "resources/Cockpit.png");
        this.load.image("sprEmptyCockpit", "resources/EmptyCockpit.png");
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
        this.load.image("steeringWheel", "resources/SteeringWheel.png");
        this.load.image("shieldBtnNotUsable", "resources/ShieldBtnNotUsable.png");
        this.load.image("shieldBtnUsable", "resources/ShieldBtnUsable");
        this.load.image("shieldBtnInUse", "resources/ShieldBtnInUse");
        this.load.image("fuel0", "resources/Fuel0.png");
        this.load.image("fuel1", "resources/Fuel1.png");
        this.load.image("fuel2", "resources/Fuel2.png");
        this.load.image("fuel3", "resources/Fuel3.png");
        this.load.image("fuel4", "resources/Fuel4.png");
        this.load.image("fuel5", "resources/Fuel5.png");
        this.load.image("fuel6", "resources/Fuel6.png");
        this.load.image("fuel7", "resources/Fuel7.png");
        this.load.image("fuel8", "resources/Fuel8.png");
        this.load.image("fuel9", "resources/Fuel9.png");
        this.load.image("speedHandle", "resources/SpeedHandle.png");
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
        for (let i = 0; i < 3; i++)
        {
            const bg = new ScrollingBackground(this, "sprBg", i * 10);
            this.backgrounds.push(bg);
        }
        console.log('scale width: ', this.game.scale.width, '\theight: ', this.game.scale.height);
        this.player = new Player(
            this,
            this.game.scale.width * 0.5,
            this.game.scale.height * 0.5,
            "sprPlayer"
        );
        this.player.scale = 0.3;

        console.log('player: ', this.player);

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyNum8 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT);
        this.keyNum5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE);
        this.keyNum4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR);
        this.keyNum6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX);
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

        // this.scale.on('resize', this.resize, this);
        // let gameWidth = this.cameras.main.width;
        // let gameHeight = this.cameras.main.height;
        // this.positionControls(gameWidth, gameHeight);
    }

    // positionControls(width, height) {
    //     localScaleManager.scaleSprite(this.player, width/2, height, 0, 1, true);
    //     this.player.setPosition(width / 2, height * 0.825);
    // }
    //
    // resize(gameSize, baseSize, displaySize, resolution) {
    //     let width = gameSize.width;
    //     let height = gameSize.height;
    //
    //     this.cameras.resize(width, height);
    //     this.positionControls(width, height);
    // }

    activateForceField()
    {
        if (this.player.fuel > 50)
        {
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
            if (this.keyW.isDown || this.keyUp.isDown || this.keyNum8.isDown)
            {
                this.player.moveUp();
            } else if (this.keyS.isDown || this.keyDown.isDown || this.keyNum5.isDown)
            {
                this.player.moveDown();
            }

            if (this.keyA.isDown || this.keyLeft.isDown || this.keyNum4.isDown)
            {
                this.player.moveLeft();
            } else if (this.keyD.isDown || this.keyRight.isDown || this.keyNum6.isDown)
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