class ScenePlay extends Phaser.Scene {
    constructor() {
        super({ key: "ScenePlay" });
    }

    preload() {
        this.load.image("sprBg", "resources/background.png");
        this.load.image("sprCockpit", "resources/Cockpit.png");
        /*this.load.spritesheet("sprExplosion", "resoures/explosion.png", {
            frameWidth: 32,
            frameHeight: 32
        });*/
        this.load.image("sprAsteroid", "resources/asteroid.png");
        this.load.image("sprPlayer", "resources/SpaceShipWFire.png");
    }

    create() {
        this.backgrounds = [];
        for (let i = 0; i < 5; i++) { // create five scrolling backgrounds
            const bg = new ScrollingBackground(this, "sprBg", i * 10);
            this.backgrounds.push(bg);
        }

        this.player = new Player(
            this,
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprPlayer"
        );

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.physics.add.overlap(this.player, this.enemies, function(player, enemy) {
            if (!player.getData("isDead") &&
                !enemy.getData("isDead")) {
                player.explode(false);
                enemy.explode(true);
            }
        });

        this.enemies = this.add.group();

        //Enemy spawning timer
        this.time.addEvent({
            delay: 100,
            callback: function() {
                const enemy = new Asteroid(
                    this,
                    Phaser.Math.Between(0, this.game.config.width),
                    0
                );
                this.enemies.add(enemy);
            },
            callbackScope: this,
            loop: true
        });
    }

    update() {
        for (let i = 0; i < this.backgrounds.length; i++) {
            this.backgrounds[i].update();
        }

        if (!this.player.getData("isDead")) {
            this.player.update();

            //TODO This is where the player controls would go
            if (this.keyW.isDown) {
                this.player.moveUp();
            } else if (this.keyS.isDown) {
                this.player.moveDown();
            }

            if (this.keyA.isDown) {
                this.player.moveLeft();
            } else if (this.keyD.isDown) {
                this.player.moveRight();
            }
        }

        for(let i = 0; i < this.enemies.getChildren().length; i++) {
            const enemy = this.enemies.getChildren()[i];

            enemy.update();

            if (enemy.x < -enemy.displayWidth ||
                enemy.x > this.game.config.width + enemy.displayWidth ||
                enemy.y < -enemy.displayHeight * 4 ||
                enemy.y > this.game.config.height + enemy.displayHeight) {

                if (enemy) {
                    if (enemy.onDestroy !== undefined) {
                        enemy.onDestroy();
                    }

                    enemy.destroy();
                }

            }
        }
    }
}