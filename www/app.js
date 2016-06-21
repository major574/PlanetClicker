var game = new Phaser.Game(352, 640, Phaser.CANVAS, 'TESTER', { preload: preload, create: create, update: update });

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
var matterPSCount = 0;
var energyPSCount = 0;
var buildingText;
var matterPS;
var energyPS;
var footerUI;
var headerUI;
var shipPlatform;
var pirateSprite;

var RNG = 0;
var pirateBOOL;

var selected = null;
var justBuilt = true;

var resources = {
    matter: 10,
    energy: 0
}

var alertText;
var bgTimer = 0;


var buildingsSprites = []

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
        textobject: undefined,
        button: { x: 30, y: 616, image: 'app/assets/solar-button-small.png', spritename: 'button2', buttonref: undefined },
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
        textobject: undefined,
        button: { x: 30, y: 572, image: 'app/assets/mine-button-small.png', spritename: 'button1', buttonref: undefined },
        build: undefined,
        listener: undefined,
        handler: undefined
    },
    {
        name:  'mineII',
        image: 'app/assets/mineII.png',
        matterCost: 100,
        energyCost: 0,
        matterMake: 10,
        energyMake: 0,
        count: 0,
        handicap: 1,
        textobject: undefined,
        button: { x: 74, y: 572, image: 'app/assets/mineII-button-small.png', spritename: 'button3', buttonref: undefined },
        build: undefined,
        listener: undefined,
        handler: undefined
    },
    {
        name:  'mineIII',
        image: 'app/assets/mineIII.png',
        matterCost: 1000,
        energyCost: 0,
        matterMake: 100,
        energyMake: 0,
        count: 0,
        handicap: 1,
        textobject: undefined,
        button: { x: 118, y: 572, image: 'app/assets/mineIII-button-small.png', spritename: 'button4', buttonref: undefined },
        build: undefined,
        listener: undefined,
        handler: undefined
    },
    {
        name: 'solar2',
        image: 'app/assets/solarpanelII.png',
        matterCost: 200,
        energyCost: 0,
        matterMake: 0,
        energyMake: 10,
        count: 0,
        handicap: 4,
        textobject: undefined,
        button: { x: 74, y: 616, image: 'app/assets/solarII-button-small.png', spritename: 'button5', buttonref: undefined },
        build: undefined,
        listener: undefined,
        handler: undefined
    },
    {
        name: 'solar3',
        image: 'app/assets/solarpanelIII.png',
        matterCost: 2000,
        energyCost: 0,
        matterMake: 0,
        energyMake: 100,
        count: 0,
        handicap: 4,
        textobject: undefined,
        button: { x: 118, y: 616, image: 'app/assets/solarIII-button-small.png', spritename: 'button6', buttonref: undefined },
        build: undefined,
        listener: undefined,
        handler: undefined
    },
]

function preload() {

    game.load.tilemap('planet', 'app/assets/planetSand.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'app/assets/Bones_A.png');
    game.load.image('platform', 'app/assets/shipPlatform2.png');
    game.load.image('spaceship', 'app/assets/orion1.png');
    game.load.image('footer', 'app/assets/footerbox2.png');
    game.load.image('header', 'app/assets/headerbox.png');
    game.load.spritesheet('pirate', 'app/assets/pirate1.png', 32, 32, 4);
    game.load.spritesheet('kaboom', 'app/assets/explode.png', 128, 128);

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
    // music.play();

    //Add ground layer
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();

    //Cursor box for x y tile coords
    marker = game.add.graphics();
    marker.lineStyle(.5, 0x000033, 1);
    marker.drawRect(0, 0, 32, 32);

    //Add unhighlightable layer
    layer2 = map.createLayer('Tile Layer 2');

    //-------------------------------
    // pirateSprite = game.add.sprite(112, 0, 'pirate');

    pirateSprite = game.add.sprite(112, 0, 'pirate');
    pirateSprite.anchor.setTo(0.5, 0.5);
    pirateSprite.animations.add('walk');
    pirateSprite.animations.play('walk', 6, true);
    game.add.tween(pirateSprite).to({ y: game.height }, 30000, Phaser.Easing.Linear.None, true);
    pirateBOOL = true;
    

    //UI panels
    shipPlatform = game.add.sprite(176, 480, 'platform');
    shipPlatform.anchor.setTo(0.5, 0.5);
    spaceShip = game.add.sprite(174, 481, 'spaceship');
    spaceShip.anchor.setTo(0.5, 0.5);
    footerUI = game.add.sprite(176, 578, 'footer');
    footerUI.anchor.setTo(0.5, 0.5);
    headerUI = game.add.sprite(176, 48, 'header');
    headerUI.anchor.setTo(0.5, 0.5);


    //Text labels
    buildingText = game.add.text(10, 8, "Total Buildings: " + 0, {font: "10px Monaco", fill: '#32ff14' });
    matterPS = game.add.text(10, 24, "MPS: " + 0, {font: "10px Monaco", fill: '#32ff14' });
    energyPS = game.add.text(10, 40, "EPS: " + 0, {font: "10px Monaco", fill: '#32ff14' });
    matterText = game.add.text(10, 56, "Matter: " + resources.matter, {font: "10px Monaco", fill: "#32ff14" });
    energyText = game.add.text(10, 72, "Energy: " + resources.energy, {font: "10px Monaco", fill: "#32ff14" });
    alertText = game.add.text(172, 532, '', {font: "10px Monaco", fill: '#32ff14', align: "center"});
    alertText.anchor.set(0.5);

    //Add bitmapdata and bounds
    bmd = game.add.bitmapData(352, 640);
    bmd.addToWorld();
    bmd.smoothed = false;

    //Loads sprites and text from buildings object
    for(var i = 0; i < buildings.length; ++i) {
        
        // var t = buildings[i].text;
        var b = buildings[i].button;

        // buildings[i].textobject = game.add.text(t.x, t.y, t.text + ': ' + buildings[i].count, t.font );

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
    if(buildings[selected].name == 'solar'){
        alertText.text = "Solar I: 20 Matter (EPS: 0.25)"
        bgTimer = 0;
    }else if(buildings[selected].name == 'solar2'){
        alertText.text = "Solar II: 200 Matter (EPS: 2.5)"
        bgTimer = 0;
    }else if(buildings[selected].name == 'solar3'){
        alertText.text = "Solar III: 2000 Matter (EPS: 25)"
        bgTimer = 0;
    }else if(buildings[selected].name == 'mine'){
        alertText.text = "Mine I: 10 Matter (MPS: 1)"
        bgTimer = 0;
    }else if(buildings[selected].name == 'mineII'){
        alertText.text = "Mine II: 100 Matter (MPS: 10)"
        bgTimer = 0;
    }else if(buildings[selected].name == 'mineIII'){
        alertText.text = "Mine III: 1000 Matter (MPS 100)"
        bgTimer = 0;
    }
}

function movehandler( pointer, x, y ) {
    if( pointer.isDown &&
        justBuilt == false &&
        x < 256 &&
        x > 96 &&
        y < 448 &&
        y > 112 ) {
        // console.log(x);
        // console.log(y);
        placeBuilding(selected);
    }
}

function placeBuilding(index) {
    var building = buildings[index];
    if( resources.matter >= building.matterCost &&
        resources.energy >= building.energyCost ) {
        var y = marker.y + 32;
        var x = marker.x + 32;
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
                return;
            }
        }
        reservedArea.push(temp);
        console.log(reservedArea);
        building.count++;
        energyPSCount += (building.energyMake / 4);
        matterPSCount += building.matterMake;
        buildingCount++;
        buildingText.text = "Total Buildings: " + buildingCount;
        matterPS.text = "MPS: " + matterPSCount;
        energyPS.text = "EPS: " + energyPSCount;
        building.selected = false;

        resources.matter -= building.matterCost;
        resources.energy -= building.energyCost;

        buildingsSprites.push(game.add.sprite(marker.x, marker.y, building.name));
        // console.log(buildingsSprites[0].key);

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
    RNG = Math.floor((Math.random() * 16) + 1)
    pirateCollision();
    console.log(RNG);
    if(bgTimer >= 3){
        alertText.text = '';
    }
    for( var i = 0; i < buildings.length; ++i ) {
        resources.matter += ( buildings[i].count * buildings[i].matterMake ) / buildings[i].handicap;
        resources.energy += ( buildings[i].count * buildings[i].energyMake ) / buildings[i].handicap;
        matterText.setText('Matter: ' + resources.matter);
        energyText.setText('Energy: ' + resources.energy);
    }
}


//Pirate Collision work in progress.
function pirateCollision() {
    var px = Math.floor(pirateSprite.x + 16)
    var i = 0;
    while(i < reservedArea.length){ 
        var resy = reservedArea[i].slice(3,6);
        var resx = reservedArea[i].slice(0,3);
        if((pirateSprite.y + 32) > resy && px == resx && buildingsSprites[i].key == 'mine'){
            buildings[1].count--;
            matterPSCount--;
            buildingCount--;
            pirateSprite.y = 0;
            buildingsSprites[i].destroy();
            pirateSprite.destroy();

            reservedArea[i] = '';
            buildingText.text = "Total Buildings: " + buildingCount;
            matterPS.text = "MPS: " + matterPSCount;
            // console.log(buildings[1].count);
            break;
        }
        i++;
    }
    if(pirateSprite.y > 420){
        pirateSprite.y = 0;
        pirateSprite.destroy();
    }

}

function update() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
    // game.world.bringToTop(mineBuild);    
}