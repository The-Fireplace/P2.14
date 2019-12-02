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
        SceneInstruction,
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