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
            this.setTexture("sprExplosion");  // this refers to the same animation key we used when we added this.anims.create previously
            this.play("sprExplosion"); // play the animation

            // pick a random explosion sound within the array we defined in this.sfx in SceneMain
            //this.scene.sfx.explosions[Phaser.Math.Between(0, this.scene.sfx.explosions.length - 1)].play();

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
        //TODO We won't use this, as the player will always be moving forward
        this.body.velocity.y = this.getData("speed");
    }

    moveLeft()
    {
        //TODO Change this to make it rotate instead
        this.body.velocity.x = -this.getData("speed");
    }

    moveRight()
    {
        //TODO Change this to make it rotate instead
        this.body.velocity.x = this.getData("speed");
    }

    update()
    {
        //TODO Use the speed handle to set how fast it should be moving forward here
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
        //TODO the next line moves the asteroid down onto the screen. We'll be moving them in from several directions, so it will have to change based on where we spawn them
        this.body.velocity.y = Phaser.Math.Between(100, 200);
        this.setTexture("sprAsteroid");
    }
}

class ForceField extends Entity
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "sprForceField", "ForceField");
        this.setTexture("sprForceField");
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
