var game = new Phaser.Game(352, 640, Phaser.CANVAS, 'TESTER', { preload: preload, create: create, update: update });

var map;
var music;
var buttonSound;
var placeSound;
var errorSound;
var exploSound;
var layer;
var layer2;
var marker;

var buildingText;
var matterPS;
var energyPS;
var footerUI;
var headerUI;
var shipPlatform;

var pirates;

var pirateInterval = 30000;
var pirateDecayRate = 500;
var pirateMinInterval = 5000;

var selected = null;
var justBuilt = true;

var resources = {
    matter: 50,
    energy: 0
}
var collisions = 0;

var alertText;
var bgTimer = 0;
var globalClock = 0;

var explosionEmitter = null;

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

buildingsObject = {};

buildings.forEach(building => {
    buildingsObject[building.name] = building;
})

console.log(buildingsObject)

var buildingUnits = null;

function preload() {
    game.load.tilemap('planet', 'app/assets/planetSand.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'app/assets/Bones_A.png');
    game.load.image('platform', 'app/assets/shipPlatform.png');
    game.load.image('spaceship', 'app/assets/orion1.png');
    game.load.image('footer', 'app/assets/footerbox.png');
    game.load.image('header', 'app/assets/headerbox.png');
    game.load.spritesheet('pirate', 'app/assets/pirate.png', 32, 32, 5);
    game.load.spritesheet('kaboom', 'app/assets/explode2.png', 32, 32);
    // game.load.audio('ambience', 'app/assets/GalacticTemple.ogg');
    game.load.audio('ambience', 'app/assets/ambient_menu.mp3');
    game.load.audio('clickSfx', 'app/assets/buttonclick.mp3');
    game.load.audio('placeSfx', 'app/assets/placeclick.mp3');
    game.load.audio('errorSfx', 'app/assets/errorsound.mp3');
    game.load.audio('exploSfx', 'app/assets/explosound.mp3');
    for(var i = 0; i < buildings.length; ++i) {
        game.load.image( buildings[i].name, buildings[i].image )
        game.load.image( buildings[i].button.spritename, buildings[i].button.image )
    }
}




function create() {
    game.renderer.renderSession.roundPixels = true;
    game.stage.disableVisibilityChange = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Map tileset
    map = game.add.tilemap('planet');
    map.addTilesetImage('Bones_A', 'tiles');

    //Sounds
    music = game.add.audio('ambience');
    buttonSound = game.add.audio('clickSfx');
    placeSound = game.add.audio('placeSfx');
    errorSound = game.add.audio('errorSfx');
    exploSound = game.add.audio('exploSfx');
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

    pirates = game.add.group();
    pirates.physicsBodyType = Phaser.Physics.ARCADE;
    pirates.enableBody = true;

    buildingUnits = game.add.group();
    buildingUnits.physicsBodyType = Phaser.Physics.ARCADE;
    buildingUnits.enableBody = true;

    emitPirates();

    //UI panels
    shipPlatform = game.add.sprite(176, 480, 'platform');
    shipPlatform.anchor.setTo(0.5, 0.5);
    game.physics.enable(shipPlatform, Phaser.Physics.ARCADE);

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
        var b = buildings[i].button;

        b.buttonref = game.add.sprite( b.x, b.y, b.spritename );
        b.buttonref.anchor.setTo(0.5, 0.5);
        b.buttonref.inputEnabled = true;

        buildings[i].build = game.make.sprite(0,0, buildings[i].name);
        buildings[i].build.anchor.set(0.5);

        b.buttonref.events.onInputDown.add( listener, i );
    }

    explosionEmitter = game.add.emitter(0,0, 200);
    explosionEmitter.makeParticles('kaboom', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    explosionEmitter.gravity = -300;

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


function checkOverlap(sprite, rect) {
    var boundsA = sprite.getBounds();
    var boundsB = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height );

    var intersects = Phaser.Rectangle.intersects(boundsA, boundsB);

    if( intersects ) {
        collisions += 1;
        alertText.text = "Area Occupied"
        errorSound.play();
    }
}

function placeBuilding(index) {
    var building = buildings[index];
    if( resources.matter >= building.matterCost &&
        resources.energy >= building.energyCost ) {
        var y = marker.y + 16;
        var x = marker.x + 16;

        collisions = 0;

        buildingUnits.forEachAlive(checkOverlap, this, { x: x, y: y, width: 10, height: 10 });

        if(collisions === 0) {
            building.count++;
            building.selected = false;

            resources.matter -= building.matterCost;
            resources.energy -= building.energyCost;

            var thisbuilding = buildingUnits.create(marker.x, marker.y, building.name);

            thisbuilding.templateName = building.name;

            justBuilt = true;
            placeSound.play();
        }

        collisions = 0;
    } else {
        bgTimer = 0;
        alertText.text = "You Don't Have Enough Resources"
        errorSound.play();
    }
}

function addRandomPirate() {
    while(globalClock >= 0){
        var i = Math.floor( Math.random() * 5 );
        var thisPirate = pirates.create(96 + ( 32 * i ), 0, 'pirate');

        thisPirate.animations.add('walk');
        thisPirate.animations.play('walk', 8, true);

        game.physics.enable(thisPirate, Phaser.Physics.ARCADE);
        thisPirate.body.velocity.y = 12;
        return thisPirate;
    }
}

function emitPirates() {
    
    addRandomPirate();
    window.setTimeout( emitPirates, pirateInterval );

    pirateInterval -= pirateDecayRate;

    if(pirateInterval < pirateMinInterval) {
        pirateInterval = pirateMinInterval;
    }
}

function cleanupBuilding(building) {
    var buildingType = building.templateName;
    buildingsObject[buildingType].count--;

    explosionEmitter.x = building.x + building.width / 2;
    explosionEmitter.y = building.y + building.height / 2;
    explosionEmitter.start(true, 300, null, 500);

    building.destroy();
    exploSound.play();
}

function cleanupPirates(pirate) {
    explosionEmitter.x = pirate.x + pirate.width / 2;
    explosionEmitter.y = pirate.y + pirate.height / 2;
    // explosionEmitter.start(true, 300, null, 40);
    // pirate.destroy();
}

function updateTimers() {
    globalClock++;
    console.log(globalClock);
    bgTimer++;
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

function collisionHandler(thing1, thing2) {
    thing1.kill();
    // thing2.kill();
}

function shipCollisionHandler(thing1, thing2) {
    thing2.kill();
    // thing2.kill();
}

function update() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;

    var MPS = 0;
    var EPS = 0;

    buildingUnits.forEachAlive( b => {
        MPS += buildingsObject[b.templateName].matterMake
        EPS += buildingsObject[b.templateName].energyMake / buildingsObject[b.templateName].handicap;
    });

    matterPS.text = "MPS: " + MPS;
    energyPS.text = "EPS: " + EPS;
    buildingText.text = 'Total Buildings: ' + buildingUnits.children.length;

    game.physics.arcade.overlap(buildingUnits, pirates, collisionHandler, null, this);
    game.physics.arcade.overlap(shipPlatform, pirates, shipCollisionHandler, null, this);

    buildingUnits.forEachDead(cleanupBuilding);
    pirates.forEachDead(cleanupPirates);

    explosionEmitter.forEachAlive(function(p){
        p.alpha = p.lifespan / explosionEmitter.lifespan; 
    })
}