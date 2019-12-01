class Entity extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, key, type)
    {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData("type", type);
        this.setData("isDead", false);
    }

    explode(canDestroy)
    {
        if (!this.getData("isDead"))
        {
            // Set the texture to the explosion image, then play the animation
            //TODO different animation for asteroid being destroyed?
            this.setTexture("explosionAnim");  // this refers to the same animation key we used when we added this.anims.create previously
            this.play("explosionAnim", true, 2); // play the animation
            //Scale up because the explosion texture is smol
            this.scale *= 5;

            this.scene.sndExplosion.play();

            this.setAngle(0);
            this.body.setVelocity(0, 0);

            this.on('animationcomplete', function ()
            {
                if (canDestroy)
                {
                    this.destroy();
                }
                else
                {
                    this.setVisible(false);
                }

            }, this);

            this.setData("isDead", true);
        }
    }

    batteryExplode(canDestroy)
    {
        if (!this.getData("isDead"))
        {
            //TODO different animation for asteroid being destroyed?
            this.setTexture("sprPlusFuel");
            this.texture.visible = true;
            this.setDepth(2);
            this.scale = 1.5;
            this.scene.tweens.add({
                targets: this,
                alpha: {value: 0, duration: 1500, ease: 'Power1', delay: 1500},
                yoyo: false,
                loop: false
            });

            this.body.setVelocity(0, 0);

            this.scene.time.addEvent({
                delay: 3000,
                callback: function() {
                    if (canDestroy)
                    {
                        this.destroy();
                    }
                },
                callbackScope: this,
                loop: false
            });


            this.setData("isDead", true);
        }
    }
}

class Player extends Entity
{
    constructor(scene, x, y, key, type)
    {
        super(scene, x, y, key, "Player");
        this.setData("speed", 200);
        this.setTexture("sprPlayer");
        this.fuel = 100;
    }

    moveUp()
    {
        this.body.velocity.y = -this.getData("speed");
    }

    moveDown()
    {
        this.body.velocity.y = this.getData("speed");
    }

    moveLeft()
    {
        this.body.velocity.x = -this.getData("speed");
    }

    moveRight()
    {
        this.body.velocity.x = this.getData("speed");
    }

    update()
    {
        this.body.setVelocity(0, 0);

        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.scale.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.scale.height - cockpitHeight);
    }
}

class Asteroid extends Entity
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "sprAsteroid", "Asteroid");
        this.body.velocity.y = Phaser.Math.Between(100, 200);
        this.setTexture("sprAsteroid");
    }
}

class Battery extends Entity
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "sprBattery", "Battery");
        this.body.velocity.y = Phaser.Math.Between(50, 150);
        this.setTexture("sprBattery");
    }
}

class Planet extends Entity
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "sprPlanet", "Planet");
        //this.body.velocity.y = 50;
        this.setTexture("sprPlanet");
    }
}

class PlanetExplosion extends Entity
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "explosionAnim", "PlanetExplosion");
        this.body.velocity.y = 50;
        this.setTexture("explosionAnim");
        // Set the texture to the explosion image, then play the animation
        //TODO different animation for asteroid being destroyed?
        this.play("explosionAnim", true, 2); // play the animation
        //Scale up because the explosion texture is smol
        this.scale *= 2;

        this.scene.sndExplosion.play();

        this.setAngle(Phaser.Math.Between(0, 360));

        this.on('animationcomplete', function ()
        {
            this.destroy();
        }, this);

        this.setData("isDead", true);
    }
}

class ForceField extends Entity
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "sprForceField", "ForceField");
        this.setTexture("forceFieldGrowingAnim");
        //Scale up because the forcefield texture is smol
        this.scale *= 5;
        this.play("forceFieldGrowingAnim", true);

        this.scene.sndForceFieldOn.play();

        this.on('animationcomplete', function ()
        {
            this.setTexture("sprForceField");
        }, this);
    }

    powerDown() {
        this.setTexture("forceFieldGrowingAnim");
        this.anims.playReverse("forceFieldGrowingAnim", true);

        this.scene.sndForceFieldOff.play();

        this.on('animationcomplete', function ()
        {
            this.scene.ff = null;
            this.destroy();
        }, this);
    }
}

class ScrollingBackground
{
    constructor(scene, key, velocityY)
    {
        this.scene = scene;
        this.key = key;
        this.velocityY = velocityY;
        this.layers = this.scene.add.group();

        this.createLayers();
    }

    createLayers()
    {
        for (let i = 0; i < 2; i++)
        {
            // creating two backgrounds will allow a continuous scroll
            const layer = this.scene.add.sprite(0, 0, this.key);
            layer.y = (layer.displayHeight * i);
            const flipX = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            const flipY = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            layer.setScale(flipX * 2, flipY * 2);
            layer.setDepth(-5 - (i - 1));
            layer.setFlipX(flipX);
            layer.setFlipY(flipY);
            layer.setRotation(Phaser.Math.Between(0, 360));
            this.scene.physics.world.enableBody(layer, 0);
            layer.body.velocity.y = this.velocityY;

            this.layers.add(layer);
        }
    }

    update()
    {
        if (this.layers.getChildren()[0].y > 0)
        {
            for (let i = 0; i < this.layers.getChildren().length; i++)
            {
                const layer = this.layers.getChildren()[i];
                layer.y = (-layer.displayHeight) + (layer.displayHeight * i);
            }
        }
    }
}
