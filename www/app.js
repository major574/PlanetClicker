var game = new Phaser.Game(352, 640, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.tilemap('planet', 'app/assets/planetSand.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'app/assets/Bones_A.png');
    game.load.image('button1', 'app/assets/mine-button.png');
    game.load.image('button2', 'app/assets/solar-button.png')
    game.load.image('mine', 'app/assets/mine.png');
    game.load.image('solar', 'app/assets/solarpanel.png');
    game.load.image('footer', 'app/assets/footerbox.png');
    game.load.image('header', 'app/assets/headerbox.png');
}

var map;
var layer;
var layer2;
var marker;
var reservedArea = [];
var buildingCount = 0;
var buildingText;
var mineText;
var solarText;
var oreText;
var energyText;
var mineBool = false;
var solarBool = false;
var mineResources = 10;
var solarResources = 0;
var mineCount = 0;
var solarCount = 0;
var footerUI;
var headerUI;

function create() {
    //Map tileset
    map = game.add.tilemap('planet');
    map.addTilesetImage('Bones_A', 'tiles');

    //Add ground layer
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();

    //Cursor box for x y tile coords
    marker = game.add.graphics();
    marker.lineStyle(.5, 0x000033, 1);
    marker.drawRect(0, 0, 32, 32);

    //Add unhighlightable layer
    layer2 = map.createLayer('Tile Layer 2');

    //UI panels
    footerUI = game.add.sprite(176, 592, 'footer');
    footerUI.anchor.setTo(0.5, 0.5);
    headerUI = game.add.sprite(176, 48, 'header');
    headerUI.anchor.setTo(0.5, 0.5);
    
    //Text labels
    buildingText = game.add.text(12, 8, "Total Buildings: " + 0, {font: "12px Ariel", fill: '#32ff14' });
    solarText = game.add.text(12, 24, "Solar Panels: " + 0, {font: "12px Ariel", fill: '#32ff14' });
    mineText = game.add.text(12, 40, "Mines: " + 0, {font: "12px Ariel", fill: '#32ff14' });
    oreText = game.add.text(12, 56, "Metal Ore: " + 10, {font: "12px Ariel", fill: "#32ff14" });
    energyText = game.add.text(12, 72, "Energy: " + 0, {font: "12px Ariel", fill: "#32ff14" });

    //Draw Mine button, enable mouse input and listener
    mineButton = game.add.sprite(45, 592, 'button1');
    mineButton.anchor.setTo(0.5, 0.5);
    mineButton.inputEnabled = true;
    mineButton.events.onInputDown.add(mineListener, this);

    //Draw Solar Panel button, enable mouse input and listener
    solarButton = game.add.sprite(115, 592, 'button2');
    solarButton.anchor.setTo(0.5, 0.5);
    solarButton.inputEnabled = true;
    solarButton.events.onInputDown.add(solarListener, this);

    //Load mine sprite
    mineBuild = game.make.sprite(0,0, 'mine');
    mineBuild.anchor.set(0.5);

    //Load solar panel sprite
    solarBuild = game.make.sprite(0,0, 'solar');
    solarBuild.anchor.set(0.5);

    //Add bitmapdata and bounds
    bmd = game.add.bitmapData(352, 640);
    bmd.addToWorld();
    bmd.smoothed = false;

    //Game clock
    game.time.events.loop(Phaser.Timer.SECOND, updateTimers, this);
}

function mineListener () {
    if(mineBool === false){
        mineBool = true;
        console.log("mine " + mineBool);
        game.input.addMoveCallback(mineHandler, this);
    }
}

function solarListener () {
    if(solarBool === false){
        solarBool = true;
        console.log("solar " + solarBool);
        game.input.addMoveCallback(solarHandler, this);
    }
}

function mineHandler (pointer, x, y) {
    y = marker.y + 16;
    x = marker.x + 16;
    if(mineBool === true && pointer.isDown && mineResources >= 10 && x < 256 && x > 96 && y < 528 && y > 112) {
        console.log(x, y);
        var temp = "" + x + y;
        var i = 0
        while(i < reservedArea.length){
            console.log(i)
            if(reservedArea[i] !== temp){
                i++;
            }else if(reservedArea[i] === temp){
                console.log("There is already a building there");
                return;
            }
        }
        reservedArea.push(temp);
        console.log(reservedArea);
        mineCount++
        handleCounters();
        mineResources-=10;
        mineText.text = "Mines: " + mineCount;
        bmd.draw(mineBuild, x, y)
    }
}

function solarHandler (pointer, x, y) {
    y = marker.y + 16;
    x = marker.x + 16;
    if(solarBool === true && pointer.isDown && mineResources >= 20 && x < 256 && x > 64 && y < 580 && y > 100) {
        console.log(x, y);
        var temp = "" + x + y;
        var i = 0
        while(i < reservedArea.length){
            console.log(i)
            if(reservedArea[i] !== temp){
                i++;
            }else if(reservedArea[i] === temp){
                console.log("There is already a building there");
                return;
            }
        }
        reservedArea.push(temp);
        console.log(reservedArea);
        solarCount++
        handleCounters();
        mineResources-=20;
        solarText.text = "Solar Panels: " + solarCount;
        bmd.draw(solarBuild, x, y)
    }
}

function updateTimers() {
    mineResources+= mineCount;
    solarResources+= solarCount / 4;
    oreText.setText('Metal Ore: ' + mineResources);
    energyText.setText('Energy: ' + solarResources);
}

function update() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
    // game.world.bringToTop(mineBuild);

}

function handleCounters(){
    buildingCount++
    buildingText.text = "Total Buildings: " + buildingCount;
    mineBool = false;
    solarBool = false;
}