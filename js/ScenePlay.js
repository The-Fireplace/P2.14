let cockpitHeight = 0;

class ScenePlay extends Phaser.Scene
{
    constructor()
    {
        super({ key: "ScenePlay" });
    }

    preload()
    {
        this.load.image("sprBg", "resources/background.png");
        this.load.image("sprCockpit", "resources/EmptyCockpit.png");
        this.load.image("sprAsteroid", "resources/asteroid.png");
        this.load.image("sprPlayer", "resources/SpaceShipWFire.png");
        this.load.spritesheet("explosionAnim", "resources/Explosion.png", {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet("forceFieldGrowingAnim", "resources/ForceFieldGrow.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image("sprForceField", "resources/ForceField.png");
        this.load.image("sprSteeringWheel", "resources/SteeringWheel.png");
        this.load.image("sprShieldBtnNotUsable", "resources/ShieldBtnNotUsable.png");
        this.load.image("sprShieldBtnUsable", "resources/ShieldBtnUsable.png");
        this.load.image("sprShieldBtnInUse", "resources/ShieldBtnInUse.png");
        this.load.image("sprFuel0", "resources/Fuel0.png");
        this.load.image("sprFuel1", "resources/Fuel1.png");
        this.load.image("sprFuel2", "resources/Fuel2.png");
        this.load.image("sprFuel3", "resources/Fuel3.png");
        this.load.image("sprFuel4", "resources/Fuel4.png");
        this.load.image("sprFuel5", "resources/Fuel5.png");
        this.load.image("sprFuel6", "resources/Fuel6.png");
        this.load.image("sprFuel7", "resources/Fuel7.png");
        this.load.image("sprFuel8", "resources/Fuel8.png");
        this.load.image("sprFuel9", "resources/Fuel9.png");
        this.load.image("sprSpeedHandle", "resources/SpeedHandle.png");
        this.load.audio('explosion', 'resources/zapsplat_explosion.mp3');
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
        this.sndExplosion = this.sound.add('explosion');

        this.backgrounds = [];
        for (let i = 0; i < 3; i++)
        {
            const bg = new ScrollingBackground(this, "sprBg", i * 10);
            this.backgrounds.push(bg);
        }

        this.btnOptions = this.add.sprite(
            this.game.scale.width - 32,
            32,
            "sprGear"
        ).setInteractive();
        this.btnOptions.scale = 1;
        this.btnOptions.setDepth(2);

        this.throttle = this.add.sprite(
            0,
            0,
            "sprSpeedHandle"
        );
        this.throttle.scale = .5;
        this.throttle.setDepth(3);

        this.steering = this.add.sprite(
            0,
            0,
            "sprSteeringWheel"
        );
        this.steering.scale = .5;
        this.steering.setDepth(3);

        this.fuel9 = this.add.sprite(
            0,
            0,
            "sprFuel9"
        );
        this.fuel9.scale = .5;
        this.fuel9.setDepth(3);

        this.shieldUse = this.add.sprite(
            0,
            0,
            "sprShieldBtnUsable"
        );
        this.shieldUse.scale = .5;
        this.shieldUse.setDepth(3);

        this.cockPit = this.add.sprite(
            this.game.scale.width * .5,
            this.game.scale.height * .5,
            "sprCockpit"
        );
        this.cockPit.scale = 1;
        this.cockPit.setDepth(2);
        cockpitHeight = this.cockPit.displayHeight;

        this.player = new Player(
            this,
            0,
            0,
            "sprPlayer"
        );
        this.player.scale = 0.3;
        this.player.setDepth(1);

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.pointer = this.input.activePointer;

        this.ff = null;

        this.enemies = this.add.group();

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

    positionControls(width, height)
    {
        localScaleManager.scaleSprite(this.player, width / 7, height, 0, 1, true);
        this.player.setPosition(width / 2, height * 0.6);

        localScaleManager.scaleSprite(this.btnOptions, width / 14, height, 0, 1, true);
        this.btnOptions.setPosition((width - this.btnOptions.displayWidth / 2) - 1 * this.btnOptions.scale, this.btnOptions.displayHeight / 2 + 1 * this.btnOptions.scale);

        localScaleManager.scaleSprite(this.cockPit, width, height, 0, 1, true);
        this.cockPit.setPosition(width * .5, height - this.cockPit.displayHeight / 2);
        cockpitHeight = this.cockPit.displayHeight;

        localScaleManager.scaleSprite(this.steering, width / 3.8, height, 0, 1, true);
        this.steering.setPosition(width * .22, height + 2 - this.cockPit.displayHeight / 2);

        localScaleManager.scaleSprite(this.throttle, width / 7.5, height, 0, 1, true);
        this.throttle.setPosition(width * .725, height - this.cockPit.displayHeight / 2);

        localScaleManager.scaleSprite(this.fuel9, width / 5, height, 0, 1, true);
        this.fuel9.setPosition(width * .49, height - 5 - this.cockPit.displayHeight / 4 - this.cockPit.displayHeight / 2);

        localScaleManager.scaleSprite(this.shieldUse, width / 6, height, 0, 1, true);
        this.shieldUse.setPosition(width * .49, height - 5 - this.cockPit.displayHeight / 4);
    }

    resize(gameSize, baseSize, displaySize, resolution)
    {
        let width = gameSize.width;
        let height = gameSize.height;

        this.cameras.resize(width, height);
        this.positionControls(width, height);
    }

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

            this.shieldUse.on('pointerdown', function (pointer)
            {
                this.scene.activateForceField();
            })

            if (this.ff != null)
            {
                this.ff.x = this.player.x;
                this.ff.y = this.player.y;
            }
        }

        for (let i = 0; i < this.enemies.getChildren().length; i++)
        {
            const enemy = this.enemies.getChildren()[i];

            enemy.update();

            if (enemy.x < -enemy.displayWidth ||
                enemy.x > this.game.scale.width + enemy.displayWidth ||
                enemy.y < -enemy.displayHeight * 4 ||
                enemy.y > this.game.scale.height + enemy.displayHeight)
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