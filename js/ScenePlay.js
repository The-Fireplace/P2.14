let cockpitHeight = 0;
let updateCount = 0;
let moveCount = 0;
let winLose = 0;
let sfx = {volume: .3};

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
        this.load.image("sprBattery", "resources/battery.png");
        this.load.image("sprPlusFuel", "resources/plus_fuel.png");
        this.load.spritesheet("sprPlayer", "resources/shipAnimated.png", {
            frameWidth: 32,
            frameHeight: 32
        });
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
        this.load.image("sprPlanet", "resources/planet.png");
        this.load.audio('explosion', 'resources/zapsplat_explosion.mp3');
        this.load.audio('forceFieldOn', 'resources/zapsplat_power_up.mp3');
        this.load.audio('forceFieldOff', 'resources/zapsplat_power_down.mp3');
        this.load.audio('lose', 'resources/zapsplat_lose.mp3');
        this.load.audio('win', 'resources/zapsplat_fanfare.mp3');
        this.load.audio('charge', 'resources/zapsplat_charge.mp3');
    }

    create()
    {
        winLose = 0;
        this.anims.create({
            key: "sprPlayer",
            frames: this.anims.generateFrameNumbers("sprPlayer"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "explosionAnim",
            frames: this.anims.generateFrameNumbers("explosionAnim"),
            frameRate: 5,
            repeat: 0
        });
        this.anims.create({
            key: "forceFieldGrowingAnim",
            frames: this.anims.generateFrameNumbers("forceFieldGrowingAnim"),
            frameRate: 10,
            repeat: 0
        });
        this.sndExplosion = this.sound.add('explosion', sfx);
        this.sndForceFieldOn = this.sound.add('forceFieldOn', sfx);
        this.sndForceFieldOff = this.sound.add('forceFieldOff', sfx);
        this.sndLose = this.sound.add('lose', sfx);
        this.sndWin = this.sound.add('win', sfx);
        this.sndCharge = this.sound.add('charge', sfx);

        this.backgrounds = [];
        for (let i = 0; i < 3; i++)
        {
            const bg = new ScrollingBackground(this, "sprBg", i * 10);
            this.backgrounds.push(bg);
        }

        // this.btnOptions = this.add.sprite(
        //     this.game.scale.width - 32,
        //     32,
        //     "sprGear"
        // ).setInteractive();
        // this.btnOptions.scale = 1;
        // this.btnOptions.setDepth(3);

        this.throttle = this.add.sprite(
            0,
            0,
            "sprSpeedHandle"
        );
        this.throttle.setDepth(4);
        this.throttle.setInteractive();
        this.throttle.position = "static";
        this.input.setDraggable(this.throttle);
        this.input.dragDistanceThreshold = 30;
        this.throttle.dragged = false;
        this.throttle.on('drag', function (pointer)
        {
            this.scene.throttle.pointer = pointer;
            this.dragged = true;
        });
        this.input.on('pointerup', function (pointer)
        {
            if(this.scene.throttle.pointer === pointer) {
                this.scene.throttle.pointer = null;
            }
            this.scene.throttle.dragged = false;
        });

        this.steering = this.add.sprite(
            0,
            0,
            "sprSteeringWheel"
        );
        this.steering.position = "static";
        this.steering.setInteractive();
        this.steering.setDepth(4);
        this.input.setDraggable(this.steering);
        this.input.dragDistanceThreshold = 30;
        this.steering.dragged = false;
        this.steering.on('drag', function (pointer)
        {
            this.scene.steering.pointer = pointer;
            this.dragged = true;
        });
        this.input.on('pointerup', function (pointer)
        {
            if(this.scene.steering.pointer === pointer) {
                this.scene.steering.pointer = null;
            }
            this.scene.steering.dragged = false;
        });

        this.fuel = [];

        for (let i = 0; i < 10; i++)
        {
            this.fuel[i] = this.add.sprite(0, 0, "sprFuel" + i);
            this.fuel[i].scale = .5;
            this.fuel[i].setDepth(4);
            this.fuel[i].visible = false;
        }
        this.fuel[9].visible = true;

        this.shieldUseable = this.add.sprite(
            0,
            0,
            "sprShieldBtnUsable"
        );
        this.shieldUseable.scale = .5;
        this.shieldUseable.setDepth(4);
        this.shieldUseable.setInteractive();
        this.shieldUseable.on('pointerdown', function (pointer)
        {
            this.scene.activateForceField();
        });

        this.shieldInUse = this.add.sprite(
            0,
            0,
            "sprShieldBtnInUse"
        );
        this.shieldInUse.scale = .5;
        this.shieldInUse.setDepth(4);
        this.shieldInUse.visible = false;

        this.shieldNotUse = this.add.sprite(
            0,
            0,
            "sprShieldBtnNotUsable"
        );
        this.shieldNotUse.scale = .5;
        this.shieldNotUse.setDepth(4);
        this.shieldNotUse.visible = false;

        this.cockPit = this.add.sprite(
            this.game.scale.width * .5,
            this.game.scale.height * .5,
            "sprCockpit"
        );
        this.cockPit.scale = 1;
        this.cockPit.setDepth(3);
        cockpitHeight = this.cockPit.displayHeight;

        this.plusFuel = this.add.sprite(
            0,
            0,
            "sprPlusFuel"
        );
        this.plusFuel.visible = false;
        this.plusFuel.setDepth(2);

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
        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyNum8 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT);
        this.keyNum5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE);
        this.keyNum4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR);
        this.keyNum6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.pointer = this.input.activePointer;
        this.input.addPointer(2);

        this.ff = null;

        this.enemies = this.add.group();
        this.batteries = this.add.group();

        this.physics.add.overlap(this.player, this.enemies, function (player, enemy)
        {
            if (!player.getData("isDead") &&
                !enemy.getData("isDead"))
            {
                //IF force field is not active, then it's game over.
                if (player.scene.ff == null)
                {
                    player.explode(false);
                    enemy.explode(true);
                    player.on('animationcomplete', function ()
                    {
                        this.scene.sound.sounds[0].pause();
                        winLose = -1;
                        this.scene.scene.start("SceneGameOver");
                    }, player);
                } else
                {
                    enemy.explode(true);
                }
            }
        });

        this.physics.add.overlap(this.player, this.batteries, function (player, battery)
        {
            if (!player.getData("isDead") && !battery.getData("isDead"))
            {
                if (player.scene.player.fuel + 30 > 100)
                {
                    player.scene.player.fuel = 100;
                }
                else
                {
                    player.scene.player.fuel += 30;
                }
                player.scene.sndCharge.play();
                battery.batteryExplode(true);
            }
        });

        this.planetSpawned = false;
        this.planetSceneStarted = false;

        //Enemy spawning timer
        this.time.addEvent({
            delay: 1000,
            callback: function ()
            {
                if (this.planetSpawned)
                {
                    return;
                }
                const enemy = new Asteroid(
                    this,
                    Phaser.Math.Between(0, this.game.scale.width),
                    0
                );
                enemy.scale = 0.15 + Phaser.Math.Between(0, 20)/100;
                enemy.rotation = Phaser.Math.Between(0, 359);
                if (Phaser.Math.Between(0,1) === 1) {
                    enemy.flipX = true;
                }
                if (Phaser.Math.Between(0,1) === 1) {
                    enemy.flipY = true;
                }
                this.enemies.add(enemy);
            },
            callbackScope: this,
            loop: true
        });

        //Battery spawning timer
        this.time.addEvent({
            delay: 15000,
            callback: function() {
                if(this.planetSpawned) {
                    return;
                }
                const battery = new Battery(
                    this,
                    Phaser.Math.Between(0, this.game.scale.width),
                    0
                );
                battery.scale = 2.8;
                this.batteries.add(battery);
            },
            callbackScope: this,
            loop: true
        });

        //Planet spawning timer
        let gameTime = 60000 + Phaser.Math.Between(0, 60)*1000;
        this.time.addEvent({
            //3 minutes before planet spawn
            delay: gameTime,
            callback: function ()
            {
                this.planetSpawned = true;
                this.planet = new Planet(
                    this,
                    this.game.scale.width / 2,
                    -320
                );
                this.planet.setDepth(-1);
                this.time.addEvent({
                    delay: 6400,
                    callback: function ()
                    {
                        this.planetSceneStarted = true;
                        if(this.ff != null) {
                            this.ff.destroy();
                            this.ff = null;
                        }
                        this.tweens.add({
                            targets: this.planet,
                            y: this.game.scale.height * 0.3,
                            duration: 4000,
                            ease: 'Sine.easeInOut',
                            repeat: 0,
                            yoyo: false
                        });

                        this.tweens.add({
                            targets: this.player,
                            y: this.game.scale.height * 0.3,
                            x: this.game.scale.width * 0.5,
                            duration: 4000,
                            ease: 'Sine.easeInOut',
                            repeat: 0,
                            yoyo: false
                        });

                        this.time.addEvent({
                            delay: 4000,
                            callback: function ()
                            {
                                this.planet.scale *= 10;
                                this.planet.explode(false);
                                //this.player.explode(false);
                                this.planet.on('animationcomplete', function ()
                                {
                                    this.scene.sound.sounds[0].pause();
                                    winLose = 1;
                                    this.scene.scene.start("SceneGameOver");
                                }, this.planet);
                            },
                            callbackScope: this,
                            loop: false
                        })
                    },
                    callbackScope: this,
                    loop: false
                });
            },
            callbackScope: this,
            loop: false
        });

        updateCount = 0;
        moveCount = 0;
        this.scale.on('resize', this.resize, this);
        let gameWidth = this.cameras.main.width;
        let gameHeight = this.cameras.main.height;
        this.positionControls(gameWidth, gameHeight);
    }

    positionControls(width, height)
    {
        localScaleManager.scaleSprite(this.player, width / 7, height, 0, 1, true);
        this.player.setPosition(width / 2, height * 0.6);

        // localScaleManager.scaleSprite(this.btnOptions, width / 14, height, 0, 1, true);
        // this.btnOptions.setPosition((width - this.btnOptions.displayWidth / 2) - 1 * this.btnOptions.scale, this.btnOptions.displayHeight / 2 + 1 * this.btnOptions.scale);

        localScaleManager.scaleSprite(this.cockPit, width, height, 0, 1, true);
        this.cockPit.setPosition(width * .5, height - this.cockPit.displayHeight / 2);
        cockpitHeight = this.cockPit.displayHeight;

        localScaleManager.scaleSprite(this.steering, width / 3.8, height, 0, 1, true);
        this.steering.setPosition(width * .22, height + 2 - this.cockPit.displayHeight / 2);

        localScaleManager.scaleSprite(this.throttle, width / 7.5, height, 0, 1, true);
        this.throttle.setPosition(width * .72, height - this.cockPit.displayHeight / 2);

        for (let i = 0; i < 10; i++)
        {
            localScaleManager.scaleSprite(this.fuel[i], width / 5, height, 0, 1, true);
            this.fuel[i].setPosition(width * .49, height - 5 - this.cockPit.displayHeight / 4 - this.cockPit.displayHeight / 2);
        }

        localScaleManager.scaleSprite(this.shieldUseable, width / 6, height, 0, 1, true);
        this.shieldUseable.setPosition(width * .49, height - 5 - this.cockPit.displayHeight / 4);

        localScaleManager.scaleSprite(this.shieldNotUse, width / 6, height, 0, 1, true);
        this.shieldNotUse.setPosition(width * .49, height - 5 - this.cockPit.displayHeight / 4);

        localScaleManager.scaleSprite(this.shieldInUse, width / 6, height, 0, 1, true);
        this.shieldInUse.setPosition(width * .49, height - 5 - this.cockPit.displayHeight / 4);
    }

    resize(gameSize, baseSize, displaySize, resolution)
    {
        let width = gameSize.width;
        let height = gameSize.height;

        this.cameras.resize(width, height);
        this.positionControls(width, height);
    }

    canMove(input)
    {
        let moveX = true;
        let moveY = true;
        if (this.player.x >= this.game.scale.width || this.player.x <= 0)
        {
            moveX = false;
        }
        if (this.player.y >= this.game.scale.height - cockpitHeight || this.player.y <= 0)
        {
            moveY = false;
        }
        if (moveX && moveY)
        {
            moveCount += 1;
        }
        else if (!moveX && !moveY)
        {
        }
        else if (!moveX && input == 'y')
        {
            moveCount += 1;
        }
        else if (!moveY && input == 'x')
        {
            moveCount += 1;
        }

    }

    activateForceField()
    {
        if (this.player.fuel > 50)
        {
            this.shieldUseable.visible = false;
            this.shieldNotUse.visible = false;
            this.shieldInUse.visible = true;
            //Activate forcefield
            this.player.fuel -= 50;
            this.ff = new ForceField(this, this.player.x, this.player.y);
            this.ff.setDepth(2);
            this.time.addEvent({
                delay: 4500,
                callback: function ()
                {
                    //Check if the forcefield is not null because the endgame may have already terminated it.
                    if(this.ff != null) {
                        this.ff.powerDown();
                    }
                },
                callbackScope: this,
                loop: false
            });
        }
    }

    canUseControls()
    {
        return this.player.fuel > 0 && !this.planetSceneStarted;
    }

    update()
    {
        for (let i = 0; i < this.backgrounds.length; i++)
        {
            this.backgrounds[i].update();
        }

        for (let i = 0; i < 10; i++)
        {
            this.fuel[i].visible = false;
        }

        if (this.player.fuel > 0)
            this.fuel[parseInt(Math.ceil(this.player.fuel/10) - 1, 10)].visible = true;
        else
            this.fuel[0].visible = true;

        if (this.player.fuel < 50 && this.ff == null) {
            this.shieldUseable.visible = false;
            this.shieldInUse.visible = false;
            this.shieldNotUse.visible = true;
        }
        else if (this.player.fuel >= 50 && this.ff == null) {
            this.shieldNotUse.visible = false;
            this.shieldInUse.visible = false;
            this.shieldUseable.visible = true;
        }

        if (!this.player.getData("isDead")) {
            this.player.update();
            if (this.canUseControls())
            {
                this.steering.position = "static";
                this.throttle.position = "static";
                //TODO This is where the player controls would go
                if (this.keyW.isDown || this.keyUp.isDown || this.keyNum8.isDown || this.throttle.dragged && (this.throttle.pointer.y < this.throttle.y))
                {
                    this.canMove('y');
                    if (this.throttle.position != "up")
                    {
                        this.throttle.position = "up";
                        this.throttle.setPosition(this.game.scale.width * .72, this.game.scale.height - this.cockPit.displayHeight / 1.5);
                    }
                    this.player.moveUp();
                } else if (this.keyS.isDown || this.keyDown.isDown || this.keyNum5.isDown || this.throttle.dragged && (this.throttle.pointer.y > this.throttle.y))
                {
                    this.canMove('y');
                    if (this.throttle.position != "down")
                    {
                        this.throttle.position = "down";
                        this.throttle.setPosition(this.game.scale.width * .72, this.game.scale.height - this.cockPit.displayHeight / 3);
                    }
                    this.player.moveDown();
                }

                if (this.keyA.isDown || this.keyLeft.isDown || this.keyNum4.isDown || this.steering.dragged && (this.steering.pointer.x < this.steering.x))
                {
                    this.canMove('x');
                    if (this.steering.position != "left")
                    {
                        this.steering.position = "left";
                        this.steering.angle = -45;
                    }
                    this.player.moveLeft();
                } else if (this.keyD.isDown || this.keyRight.isDown || this.keyNum6.isDown || this.steering.dragged && (this.steering.pointer.x > this.steering.x))
                {
                    this.canMove('x');
                    if (this.steering.position != "right")
                    {
                        this.steering.position = "right";
                        this.steering.angle = 45;
                    }
                    this.player.moveRight();
                }
                if (moveCount >= 40)
                {
                    this.player.fuel -= 1;
                    moveCount = 0;
                }
                if (this.shieldUseable.visible && this.keySpace.isDown)
                {
                    this.activateForceField();
                }

                if (this.ff != null)
                {
                    this.ff.x = this.player.x;
                    this.ff.y = this.player.y;
                }
                if (this.steering.position == "static")
                {
                    this.steering.angle = 0;
                }
                if (this.throttle.position == "static")
                {
                    this.throttle.setPosition(this.game.scale.width * .72, this.game.scale.height - this.cockPit.displayHeight / 2);
                }
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

        for (let i = 0; i < this.batteries.getChildren().length; i++)
        {
            const battery = this.batteries.getChildren()[i];

            battery.update();

            if (battery.x < -battery.displayWidth ||
                battery.x > this.game.scale.width + battery.displayWidth ||
                battery.y < -battery.displayHeight * 4 ||
                battery.y > this.game.scale.height + battery.displayHeight)
            {

                if (battery)
                {
                    if (battery.onDestroy !== undefined)
                    {
                        battery.onDestroy();
                    }

                    battery.destroy();
                }

            }
        }
        if (updateCount % 300 === 0 && this.player.fuel > 0)
        {
            updateCount = 0;
            this.player.fuel -= 1;
        }
        updateCount += 1;
    }
}