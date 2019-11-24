var config = {
    type: Phaser.CANVAS,
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,

    }
};

var game = new Phaser.Game(config);

var group;

function preload ()
{
    this.load.image('ball', 'resources/gear.png');

}

function create ()
{
    group = this.add.group();

    group.create(0, 0, 'ball');

    console.log('gameworld: ', game);
    console.log('screen: ', screen);
    console.log('game.scale: ', game.scale.height);
    console.log('window: ', window);

    for (var i = 0; i < 32; i++)
    {
        group.create(i * 32, i * 2, 'ball');
    }
}

function update ()
{
    // game.canvas.height = window.innerHeight;
    // game.scale.gameSize.height = window.innerHeight;
    // console.log('game.canvas.height: ', game.canvas.height);
    // console.log('game.scale.height: ', game.scale.height);
    // console.log('window.innerHeight: ', window.innerHeight);
    Phaser.Actions.RotateAroundDistance(group.getChildren(), { x: game.scale.width/2, y: game.scale.height/2 }, 0.015, game.scale.width/2 - 25);
}
