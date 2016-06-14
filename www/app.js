var game = new Phaser.Game(352, 640, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var map;
var music;
var buttonSound;
var placeSound;
var errorSound;
var layer;
var layer2;
var marker;
var reservedArea = [];
var buildingCount = 0;
var buildingText;
var footerUI;
var headerUI;

var selected = null;
var justBuilt = true;

var resources = {
    matter: 10,
    energy: 0
}

var alertText;
var bgTimer = 0;

//Building Objects
var buildings = [
    {
        name: 'solar',
        image: 'app/assets/solarpanel.png',
        matterCost: 20,
        energyCost: 0,
        matterMake: 0,
        energyMake: 1,
        count: 0,
        handicap: 4,
        text: { x: 10,  y: 24, text: 'Solar Panels', font: { font: '10px Monaco', fill: '#32ff14' } },
        textobject: undefined,
        button: { x: 115, y: 592, image: 'app/assets/solar-button.png', spritename: 'button2', buttonref: undefined },
        build: undefined,
        listener: undefined,
        handler: undefined
    },
    {
        name:  'mine',
        image: 'app/assets/mine.png',
        matterCost: 10,
        energyCost: 0,
        matterMake: 1,
        energyMake: 0,
        count: 0,
        handicap: 1,
        text: { x: 10,  y: 40, text: 'Mines', font: { font: '10px Monaco', fill: '#32ff14' } },
        textobject: undefined,
        button: { x: 45, y: 592, image: 'app/assets/mine-button.png', spritename: 'button1', buttonref: undefined },
        build: undefined,
        listener: undefined,
        handler: undefined
    },
]

function preload() {
    game.load.tilemap('planet', 'app/assets/planetSand.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('tiles', 'app/assets/Bones_A.png');
    game.load.image('footer', 'app/assets/footerbox2.png');
    game.load.image('header', 'app/assets/headerbox.png');

    // game.load.audio('ambience', 'app/assets/GalacticTemple.ogg');
    game.load.audio('ambience', 'app/assets/ambient_menu.mp3');

    game.load.audio('clickSfx', 'app/assets/buttonclick.mp3');
    game.load.audio('placeSfx', 'app/assets/placeclick.mp3');
    game.load.audio('errorSfx', 'app/assets/errorsound.mp3');

    for(var i = 0; i < buildings.length; ++i) {
        game.load.image( buildings[i].name, buildings[i].image )
        game.load.image( buildings[i].button.spritename, buildings[i].button.image )
    }
}


function create() {
    game.renderer.renderSession.roundPixels = true;

    //Map tileset
    map = game.add.tilemap('planet');
    map.addTilesetImage('Bones_A', 'tiles');

    //Sounds
    music = game.add.audio('ambience');
    buttonSound = game.add.audio('clickSfx');
    placeSound = game.add.audio('placeSfx');
    errorSound = game.add.audio('errorSfx');
    music.play();

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
    footerUI = game.add.sprite(176, 578, 'footer');
    footerUI.anchor.setTo(0.5, 0.5);
    headerUI = game.add.sprite(176, 48, 'header');
    headerUI.anchor.setTo(0.5, 0.5);

    //Text labels
    buildingText = game.add.text(10, 8, "Total Buildings: " + 0, {font: "10px Monaco", fill: '#32ff14' });
    matterText = game.add.text(10, 56, "Matter: " + resources.matter, {font: "10px Monaco", fill: "#32ff14" });
    energyText = game.add.text(10, 72, "Energy: " + resources.energy, {font: "10px Monaco", fill: "#32ff14" });
    alertText = game.add.text(172, 534, '', {font: "10px Monaco", fill: '#32ff14', align: "center"});
    alertText.anchor.set(0.5);

    //Add bitmapdata and bounds
    bmd = game.add.bitmapData(352, 640);
    bmd.addToWorld();
    bmd.smoothed = false;

    //Loads sprites and text from buildings object
    for(var i = 0; i < buildings.length; ++i) {
        
        var t = buildings[i].text;
        var b = buildings[i].button;

        buildings[i].textobject = game.add.text(t.x, t.y, t.text + ': ' + buildings[i].count, t.font );

        b.buttonref = game.add.sprite( b.x, b.y, b.spritename );
        b.buttonref.anchor.setTo(0.5, 0.5);
        b.buttonref.inputEnabled = true;

        buildings[i].build = game.make.sprite(0,0, buildings[i].name);
        buildings[i].build.anchor.set(0.5);

        b.buttonref.events.onInputDown.add( listener, i );
    }

    game.input.addMoveCallback(movehandler, this);

    //Game clock
    game.time.events.loop(Phaser.Timer.SECOND, updateTimers, this);
}

function listener() {
    selected = this;
    buttonSound.play();
    justBuilt = false;
    if(buildings[selected].name == 'mine'){
        alertText.text = "Mine: Cost 10 Matter"
        bgTimer = 0;
    }else if(buildings[selected].name == 'solar'){
        alertText.text = "Solar Panel: Cost 20 Matter"
        bgTimer = 0;
    }

}

function movehandler( pointer, x, y ) {
    if( pointer.isDown &&
        justBuilt == false &&
        x < 256 &&
        x > 96 &&
        y < 528 &&
        y > 112 ) {
        placeBuilding(selected);
    }
}

function placeBuilding(index) {
    var building = buildings[index];

    if( resources.matter >= building.matterCost &&
        resources.energy >= building.energyCost ) {

        var y = marker.y + 16;
        var x = marker.x + 16;

        console.log(x, y);
        var temp = "" + x + y;
        var j = 0;

        while(j < reservedArea.length){
            console.log(j)
            if(reservedArea[j] !== temp){
                j++;
            }else if(reservedArea[j] === temp){
                bgTimer = 0;
                alertText.text = "This Area is Occupied"
                errorSound.play();
                // console.log("There is already a building there");
                return;
            }
        }
        reservedArea.push(temp);
        console.log(reservedArea);
        building.count++;

        buildingCount++;
        buildingText.text = "Total Buildings: " + buildingCount;
        building.selected = false;

        resources.matter -= building.matterCost;
        resources.energy -= building.energyCost;

        building.textobject.text = building.text.text + ': ' + building.count;
        bmd.draw(building.build, x, y);
        justBuilt = true;
        placeSound.play();

    }else{
        bgTimer = 0;
        alertText.text = "You Don't Have Enough Resources" 
        errorSound.play();
    }

}


function updateTimers() {
    bgTimer++;
    if(bgTimer >= 3){
            alertText.text = '';
        }
    // console.log(bgTimer);

    for( var i = 0; i < buildings.length; ++i ) {
        
        resources.matter += ( buildings[i].count * buildings[i].matterMake ) / buildings[i].handicap;
        resources.energy += ( buildings[i].count * buildings[i].energyMake ) / buildings[i].handicap;
        matterText.setText('Matter: ' + resources.matter);
        energyText.setText('Energy: ' + resources.energy);
    }
}

function update() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
    // game.world.bringToTop(mineBuild);

}