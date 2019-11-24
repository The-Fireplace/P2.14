const config = {
    type: Phaser.WEBGL,
    backgroundColor: "black",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 }
        }
    },
    scene: [
        SceneMainMenu,
        ScenePlay,
        SceneGameOver
    ],
    pixelArt: true,
    roundPixels: true,
    scale: {
        parent: 'game',
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
    }
};

const game = new Phaser.Game(config);

function LocalScaleManager() {
}

LocalScaleManager.prototype = {
    scaleSprite: function (sprite, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier, isFullScale) {
        let scale = this.getSpriteScale(sprite.frame.width, sprite.frame.height, availableSpaceWidth, availableSpaceHeight, padding, isFullScale);
        sprite.setScale(scale * scaleMultiplier);
        return scale;
    },
    scaleSpriteTo: function (sprite, scale) {
        sprite.setScale(scale);
    },
    scaleText: function (sprite, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier, isFullScale) {
        let originalWidth = sprite.width;
        let originalHeight = sprite.height;
        let scale = this.getSpriteScale(originalWidth, originalHeight, availableSpaceWidth, availableSpaceHeight, padding, isFullScale);
        sprite.setScale(scale * scaleMultiplier);
    },
    getSpriteScale: function (spriteWidth, spriteHeight, availableSpaceWidth, availableSpaceHeight, minPadding, isFullScale) {
        let ratio = 1;
        let currentDevicePixelRatio = window.devicePixelRatio;
        // Sprite needs to fit in either width or height
        let widthRatio = (spriteWidth * currentDevicePixelRatio + 2 * minPadding) / availableSpaceWidth;
        let heightRatio = (spriteHeight * currentDevicePixelRatio + 2 * minPadding) / availableSpaceHeight;
        if (widthRatio > 1 || heightRatio > 1) {
            ratio = 1 / Math.max(widthRatio, heightRatio);
        } else {
            if (isFullScale)
                ratio = 1 / Math.max(widthRatio, heightRatio);
        }
        return ratio * currentDevicePixelRatio;
    }
};

let localScaleManager = new LocalScaleManager;