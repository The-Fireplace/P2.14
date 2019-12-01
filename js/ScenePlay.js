let cockpitHeight = 0;
let updateCount = 0;
let moveCount = 0;
let sfx = {volume: .08};

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

        this.fuel = [];

        for (let i = 0; i < 10; i++) {
            this.fuel[i] = this.add.sprite(0, 0, "sprFuel" + i);
            this.fuel[i].scale = .5;
            this.fuel[i].setDepth(3);
            this.fuel[i].visible = false;
        }
        this.fuel[9].visible = true;

        this.shieldUseable = this.add.sprite(
            0,
            0,
            "sprShieldBtnUsable"
        );
        this.shieldUseable.scale = .5;
        this.shieldUseable.setDepth(3);

        this.shieldInUse = this.add.sprite(
            0,
            0,
            "sprShieldBtnInUse"
        );
        this.shieldInUse.scale = .5;
        this.shieldInUse.setDepth(3);
        this.shieldInUse.visible = false;

        this.shieldNotUse = this.add.sprite(
            0,
            0,
            "sprShieldBtnNotUsable"
        );
        this.shieldNotUse.scale = .5;
        this.shieldNotUse.setDepth(3);
        this.shieldNotUse.visible = false;

        this.cockPit = this.add.sprite(
            this.game.scale.width * .5,
            this.game.scale.height * .5,
            "sprCockpit"
        );
        this.cockPit.scale = 1;
        this.cockPit.setDepth(2);
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
                        this.scene.sndLose.play();
                        this.scene.scene.start("SceneGameOver");
                    }, player);
                } else
                {
                    enemy.explode(true);
                }
            }
        });

        this.physics.add.overlap(this.player, this.batteries, function (player, battery) {
           if (!player.getData("isDead") && !battery.getData("isDead")) {
               if (player.scene.player.fuel + 30 > 100) {
                   player.scene.player.fuel = 100;
               }
               else {
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
                if(this.planetSpawned) {
                    return;
                }
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

        //Battery spawning timer
        this.time.addEvent({
            delay: 8000,
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
        this.time.addEvent({
            //3 minutes before planet spawn
            delay: 1000/* * 60*/ * 3,
            callback: function ()
            {
                this.planetSpawned = true;
                this.planet = new Planet(
                  this,
                  this.game.scale.width/2,
                  -320
                );
                this.planet.setDepth(-1);
                this.time.addEvent({
                    delay: 6400,
                    callback: function ()
                    {
                        this.planetSceneStarted = true;
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
                                this.planet.scale *= 2;
                                this.planet.explode(false);
                                //this.player.explode(false);
                                this.planet.on('animationcomplete', function ()
                                {
                                    this.scene.sndWin.play();
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

        localScaleManager.scaleSprite(this.btnOptions, width / 14, height, 0, 1, true);
        this.btnOptions.setPosition((width - this.btnOptions.displayWidth / 2) - 1 * this.btnOptions.scale, this.btnOptions.displayHeight / 2 + 1 * this.btnOptions.scale);

        localScaleManager.scaleSprite(this.cockPit, width, height, 0, 1, true);
        this.cockPit.setPosition(width * .5, height - this.cockPit.displayHeight / 2);
        cockpitHeight = this.cockPit.displayHeight;

        localScaleManager.scaleSprite(this.steering, width / 3.8, height, 0, 1, true);
        this.steering.setPosition(width * .22, height + 2 - this.cockPit.displayHeight / 2);

        localScaleManager.scaleSprite(this.throttle, width / 7.5, height, 0, 1, true);
        this.throttle.setPosition(width * .725, height - this.cockPit.displayHeight / 2);

        for (let i = 0; i < 10; i++) {
            localScaleManager.scaleSprite(this.fuel[i], width / 5, height, 0, 1, true);
            this.fuel[i].setPosition(width * .49, height - 5 - this.cockPit.displayHeight / 4 - this.cockPit.displayHeight / 2);
        }

        localScaleManager.scaleSprite(this.shieldUseable, width / 6, height, 0, 1, true);
        this.shieldUseable.setPosition(width * .49, height - 5 - this.cockPit.displayHeight / 4);
    }

    resize(gameSize, baseSize, displaySize, resolution)
    {
        let width = gameSize.width;
        let height = gameSize.height;

        this.cameras.resize(width, height);
        this.positionControls(width, height);
    }

    canMove(input) {
        let moveX = true;
        let moveY = true;
        if (this.player.x >= this.game.scale.width || this.player.x <= 0) {
            moveX = false;
        }
        if (this.player.y >= this.game.scale.height - cockpitHeight || this.player.y <= 0) {
            moveY = false;
        }
        if (moveX && moveY) {
            moveCount +=1;
        }
        else if (!moveX && !moveY){
        }
        else if (!moveX && input == 'y'){
            moveCount +=1;
        }
        else if (!moveY && input == 'x'){
            moveCount +=1;
        }

    }

    activateForceField()
    {
        if (this.player.fuel > 50)
        {
            //Activate forcefield
            this.player.fuel -= 50;
            this.ff = new ForceField(this, this.player.x, this.player.y);
            this.ff.setDepth(2);
            this.time.addEvent({
                delay: 5000,
                callback: function ()
                {
                    this.ff.powerDown();
                },
                callbackScope: this,
                loop: false
            });
        }
    }

    canUseControls() {
        return this.player.fuel > 0 && !this.planetSceneStarted;
    }

    update()
    {
        for (let i = 0; i < this.backgrounds.length; i++)
        {
            this.backgrounds[i].update();
        }

        for (let i = 0; i < 10; i++) {
            this.fuel[i].visible = false;
        }
        this.fuel[parseInt(Math.ceil(this.player.fuel/10) - 1, 10)].visible = true;

        if (!this.player.getData("isDead")) {
            this.player.update();
            if (this.canUseControls()) {
                //TODO This is where the player controls would go
                if (this.keyW.isDown || this.keyUp.isDown || this.keyNum8.isDown) {
                    this.canMove('y');
                    this.player.moveUp();
                } else if (this.keyS.isDown || this.keyDown.isDown || this.keyNum5.isDown) {
                    this.canMove('y');
                    this.player.moveDown();
                }

                if (this.keyA.isDown || this.keyLeft.isDown || this.keyNum4.isDown) {
                    this.canMove('x');
                    this.player.moveLeft();
                } else if (this.keyD.isDown || this.keyRight.isDown || this.keyNum6.isDown) {
                    this.canMove('x');
                    this.player.moveRight();
                }

                this.shieldUseable.on('pointerdown', function (pointer) {
                    this.scene.activateForceField();
                });

                if (moveCount >= 40) {
                    this.player.fuel -= 1;
                    moveCount = 0;
                }
                if(this.shieldUseable.visible && this.keySpace.isDown) {
                    this.activateForceField();
                }

                if (this.ff != null) {
                    this.ff.x = this.player.x;
                    this.ff.y = this.player.y;
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
        if (updateCount % 300 === 0 && this.player.fuel > 0) {
            updateCount = 0;
            this.player.fuel -= 1;
        }
        updateCount += 1;
    }
}