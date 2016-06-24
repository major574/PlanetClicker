var game = new Phaser.Game(352, 640, Phaser.CANVAS, 'TESTER', { preload: preload, create: create, update: update });

var map;
var music;
var ambience;
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
var bullets
var drones;
var bulletSound;

var pirateInterval = 30000;
var pirateDecayRate = 500;
var pirateMinInterval = 5000;

var droneInterval = 8000;


var selected = null;
var justBuilt = true;

var resources = {
    matter: 10,
    energy: 0
}
var collisions = 0;

var alertText;
var bgTimer = 0;
var globalClock = 0;

var explosionEmitter = null;
var armed = false;
var gunArea = [];
var destructActivated = false;

//drones
var droneOcc1 = false;
var droneAreaX1 = [];
var droneAreaY1 = [];
var droneOcc2 = false;
var droneAreaX2 = [];
var droneAreaY2 = [];
var droneOcc3 = false;
var droneAreaX3 = [];
var droneAreaY3 = [];
var droneOcc4 = false;
var droneAreaX4 = [];
var droneAreaY4 = [];
var droneOcc5 = false;
var droneAreaX5 = [];
var droneAreaY5 = [];
var droneCount = 0;


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
    {
        name: 'gun',
        image: 'app/assets/gun1.png',
        matterCost: 300,
        energyCost: 100,
        matterMake: 0,
        energyMake: 0,
        count: 0,
        handicap: 1,
        textobject: undefined,
        button: { x: 277, y: 616, image: 'app/assets/gun-button-small.png', spritename: 'button7', buttonref: undefined },
        build: undefined,
        listener: undefined,
        handler: undefined
    },
    {
        name: 'trap',
        image: 'app/assets/trap.png',
        matterCost: 3,
        energyCost: 1,
        matterMake: 0,
        energyMake: 0,
        count: 0,
        handicap: 1,
        textobject: undefined,
        button: { x: 233, y: 616, image: 'app/assets/trap-button-small.png', spritename: 'button8', buttonref: undefined },
        build: undefined,
        listener: undefined,
        handler: undefined
    },
    {
        name: 'destruct',
        image: 'app/assets/destructsquare.png',
        matterCost: 0,
        energyCost: 0,
        matterMake: 0,
        energyMake: 0,
        count: 0,
        handicap: 1,
        textobject: undefined,
        button: { x: 176, y: 594, image: 'app/assets/destroy-button.png', spritename: 'button9', buttonref: undefined },
        build: undefined,
        listener: undefined,
        handler: undefined
    },
    {
        name: 'dronelauncher',
        image: 'app/assets/dronelauncher.png',
        matterCost: 3000,
        energyCost: 1000,
        matterMake: 0,
        energyMake: 0,
        count: 0,
        handicap: 1,
        textobject: undefined,
        button: { x: 321, y: 616, image: 'app/assets/dronelauncher-button.png', spritename: 'button10', buttonref: undefined },
        build: undefined,
        listener: undefined,
        handler: undefined
    },

]

buildingsObject = {};

buildings.forEach(building => {
    buildingsObject[building.name] = building;
})



var buildingUnits = null;

function preload() {
    game.load.tilemap('planet', 'app/assets/planetSand.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'app/assets/Bones_A.png');
    game.load.image('platform', 'app/assets/shipPlatform.png');
    game.load.image('spaceship', 'app/assets/orion1.png');
    game.load.image('footer', 'app/assets/footerbox.png');
    game.load.image('header', 'app/assets/headerbox.png');
    game.load.image('bullet', 'app/assets/bullet.png');
    game.load.image('drone', 'app/assets/drone.png');
    game.load.spritesheet('pirate', 'app/assets/pirate.png', 32, 32, 5);
    game.load.spritesheet('kaboom', 'app/assets/explode2.png', 32, 32);
    game.load.audio('music', 'app/assets/ambient_menu.mp3');
    game.load.audio('ambience', 'app/assets/Ambience_BlackHole_00.mp3');
    game.load.audio('clickSfx', 'app/assets/buttonclick.mp3');
    game.load.audio('placeSfx', 'app/assets/placeclick.mp3');
    game.load.audio('errorSfx', 'app/assets/errorsound.mp3');
    game.load.audio('exploSfx', 'app/assets/explosound.mp3');
    game.load.audio('bulletSfx', 'app/assets/Laser_00.mp3');
    for(var i = 0; i < buildings.length; ++i) {
        game.load.image( buildings[i].name, buildings[i].image )
        game.load.image( buildings[i].button.spritename, buildings[i].button.image )
    }
}




function create() {
    game.renderer.renderSession.roundPixels = true;
    // game.stage.disableVisibilityChange = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Map tileset
    map = game.add.tilemap('planet');
    map.addTilesetImage('Bones_A', 'tiles');

    //Sounds
    ambience = game.add.audio('ambience');
    music = game.add.audio('music');
    buttonSound = game.add.audio('clickSfx');
    placeSound = game.add.audio('placeSfx');
    errorSound = game.add.audio('errorSfx');
    exploSound = game.add.audio('exploSfx');
    bulletSound = game.add.audio('bulletSfx');
    ambience.play();
    music.play();
    ambience.loopFull();

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
    buildingUnits.inputEnabled = true;

    explosionEmitter = game.add.emitter(0,0, 200);
    explosionEmitter.makeParticles('kaboom', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    explosionEmitter.gravity = -300;

    bullets = game.add.group();
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.enableBody = true;

    drones = game.add.group();
    drones.physicsBodyType = Phaser.Physics.ARCADE;
    drones.enableBody = true;


    selfDestruct = game.add.group();
    selfDestruct.physicsBodyType = Phaser.Physics.ARCADE;
    selfDestruct.enableBody = true;
    // buildingUnits.events.onInputDown.add(clickGun, this);

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

    game.input.addMoveCallback(movehandler, this);

    //Game clock
    game.time.events.loop(Phaser.Timer.SECOND, updateTimers, this);
}



function listener() {
    selected = this;
    justBuilt = false;
    if(buildings[selected].name == 'solar'){
        alertText.text = "Solar I: 20 M (EPS: 0.25)"
        bgTimer = 0;
        buttonSound.play();
        destructActivated = false;
    }else if(buildings[selected].name == 'solar2'){
        alertText.text = "Solar II: 200 M (EPS: 2.5)"
        bgTimer = 0;
        buttonSound.play();
        destructActivated = false;
    }else if(buildings[selected].name == 'solar3'){
        alertText.text = "Solar III: 2000 M (EPS: 25)"
        bgTimer = 0;
        buttonSound.play();
        destructActivated = false;
    }else if(buildings[selected].name == 'mine'){
        alertText.text = "Mine I: 10 M (MPS: 1)"
        bgTimer = 0;
        buttonSound.play();
        destructActivated = false;
    }else if(buildings[selected].name == 'mineII'){
        alertText.text = "Mine II: 100 M (MPS: 10)"
        bgTimer = 0;
        buttonSound.play();
        destructActivated = false;
    }else if(buildings[selected].name == 'mineIII'){
        alertText.text = "Mine III: 1000 M (MPS 100)"
        bgTimer = 0;
        buttonSound.play();
        destructActivated = false;
    }else if(buildings[selected].name == 'gun'){
        alertText.text = "Gun: 300 M 100 E (Click To Shoot)"
        bgTimer = 0;
        buttonSound.play();
        destructActivated = false;
    }else if(buildings[selected].name == 'trap'){
        alertText.text = "Trap: 3 M 1 E (Explodes)"
        bgTimer = 0;
        buttonSound.play();
        destructActivated = false;
    }else if(buildings[selected].name == 'destruct'){
        alertText.text = "Destructor: Destroys Buildings"
        bgTimer = 0;
        buttonSound.play();
        destructActivated = true;
    }else if(buildings[selected].name == 'dronelauncher'){
        if(droneCount < 5){
            alertText.text = "Drone Launcher: 3000 M 1000 E"
            bgTimer = 0;
            buttonSound.play();
            destructActivated = false;
        }else{
            justBuilt = true;
            alertText.text = "Max Limit of Drones Exceeded"
            bgTimer = 0;
            errorSound.play();
            destructActivated = false;
        }
    }
}

function movehandler( pointer, x, y ) {
    if( pointer.isDown &&
        justBuilt == false &&
        x < 256 &&
        x > 96 &&
        y < 448 &&
        y > 112 ) {
        placeBuilding(selected);
    }
    if(justBuilt == true && pointer.isDown){
        var y = marker.y + 16;
        var x = marker.x + 16;
        var temp = "" + x + y;
        var g = 0;

        while(g < gunArea.length){
            if(gunArea[g] == temp){
                console.log(gunArea);
                emitBullets();
                bulletSound.play();
                g++
            }else{
                g++;
            }
        }
    }
}

//Bullet Emitter
function emitBullets() {
    var thisBullet = bullets.create(marker.x + 13, marker.y - 12, 'bullet');
    thisBullet.animations.add('fire');
    thisBullet.animations.play('fire', 1, true);
    thisBullet.body.velocity.y = -800;
    return thisBullet;
}

//Drone Emitters
function emitDrone1() {
    var thisDrone = drones.create(droneAreaX1 - 16, droneAreaY1 - 18, 'drone');
    thisDrone.animations.add('fly');
    thisDrone.animations.play('fly', 1, true);
    thisDrone.body.velocity.y = -60;
    window.setTimeout( emitDrone1, droneInterval );  
}
function emitDrone2() {
    var thisDrone = drones.create(droneAreaX2 - 16, droneAreaY2 - 18, 'drone');
    thisDrone.animations.add('fly');
    thisDrone.animations.play('fly', 1, true);
    thisDrone.body.velocity.y = -60;
    window.setTimeout( emitDrone2, droneInterval );   
}
function emitDrone3() {
    var thisDrone = drones.create(droneAreaX3 - 16, droneAreaY3 - 18, 'drone');
    thisDrone.animations.add('fly');
    thisDrone.animations.play('fly', 1, true);
    thisDrone.body.velocity.y = -60;  
    window.setTimeout( emitDrone3, droneInterval );
}
function emitDrone4() {
    var thisDrone = drones.create(droneAreaX4 - 16, droneAreaY4 - 18, 'drone');
    thisDrone.animations.add('fly');
    thisDrone.animations.play('fly', 1, true);
    thisDrone.body.velocity.y = -60; 
    window.setTimeout( emitDrone4, droneInterval );  
}
function emitDrone5() {
    var thisDrone = drones.create(droneAreaX5 - 16, droneAreaY5 - 18, 'drone');
    thisDrone.animations.add('fly');
    thisDrone.animations.play('fly', 1, true);
    thisDrone.body.velocity.y = -60; 
    window.setTimeout( emitDrone5, droneInterval ); 
}

function addDrones() {
    if(droneOcc1 == false){
        emitDrone1();
        droneCount++;
        droneOcc1 = true
    }else if(droneOcc2 == false){
        emitDrone2();
        droneCount++;
        droneOcc2 = true
    }else if(droneOcc3 == false){
        emitDrone3();
        droneCount++;
        droneOcc3 = true
    }else if(droneOcc4 == false){
        emitDrone4();
        droneCount++;
        droneOcc4 = true
    }else if(droneOcc5 == false){
        emitDrone5();
        droneCount++;
        droneOcc5 = true
    }
}



function emitDestruct() {
    var y = marker.y + 16;
    var x = marker.x + 16;
    var temp = "" + x + y;
    for(var g = 0; g <= gunArea.length; g++){
        if(gunArea[g] == temp){
            gunArea[g] = '0';
            console.log(gunArea);
            console.log(temp);
        }
    }
    var thisDestruct = selfDestruct.create(marker.x, marker.y, 'destruct');
    return thisDestruct;
    
}

function checkOverlap(sprite, rect) {
    var boundsA = sprite.getBounds();
    var boundsB = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height );

    var intersects = Phaser.Rectangle.intersects(boundsA, boundsB);

    if( intersects && destructActivated == false) {
        collisions += 1;
        alertText.text = "Area Occupied"
        errorSound.play();
    }else if( intersects && destructActivated == true){
        collisions += 1;
        alertText.text = "Building Destroyed"
        // errorSound.play();
    }
}

function placeBuilding(index) {
    var building = buildings[index];
    if( resources.matter >= building.matterCost &&
        resources.energy >= building.energyCost) {
        var y = marker.y + 16;
        var x = marker.x + 16;

        var temp = "" + x + y;

        collisions = 0;

        buildingUnits.forEachAlive(checkOverlap, this, { x: x, y: y, width: 10, height: 10 });

        if(collisions === 0 && destructActivated == false) {

            building.count++;
            building.selected = false;

            resources.matter -= building.matterCost;
            resources.energy -= building.energyCost;

            var thisbuilding = buildingUnits.create(marker.x, marker.y, building.name);

            thisbuilding.templateName = building.name;

            if(thisbuilding.templateName == 'gun'){
                gunArea.push(temp);
            }
            if(thisbuilding.templateName == 'dronelauncher' && droneOcc1 == false){
                droneAreaX1.push(x);
                droneAreaY1.push(y);
                addDrones();
            }else if(thisbuilding.templateName == 'dronelauncher' && droneOcc2 == false){
                droneAreaX2.push(x);
                droneAreaY2.push(y);
                addDrones();
            }else if(thisbuilding.templateName == 'dronelauncher' && droneOcc3 == false){
                droneAreaX3.push(x);
                droneAreaY3.push(y);
                addDrones();
            }
            else if(thisbuilding.templateName == 'dronelauncher' && droneOcc4 == false){
                droneAreaX4.push(x);
                droneAreaY4.push(y);
                addDrones();
            }else if(thisbuilding.templateName == 'dronelauncher' && droneOcc5 == false){
                droneAreaX5.push(x);
                droneAreaY5.push(y);
                addDrones();
            }
            justBuilt = true;
            placeSound.play();
        }else if( collisions === 1 && destructActivated == true){
            emitDestruct();
            destructActivated = false;
            justBuilt = true;
            bgTimer = 0;
        }

        collisions = 0;
    } else {
        bgTimer = 0;
        alertText.text = "You Don't Have Enough Resources"
        justBuilt = true;
        destructActivated = false;
        errorSound.play();
    }
}

function addRandomPirate() {
    while(globalClock >= 20){
        var i = Math.floor( Math.random() * 5 );
        var thisPirate = pirates.create(96 + ( 32 * i ), 0, 'pirate');

        thisPirate.animations.add('walk');
        thisPirate.animations.play('walk', 8, true);

        game.physics.enable(thisPirate, Phaser.Physics.ARCADE);
        thisPirate.body.velocity.y = 14;
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
    explosionEmitter.start(true, 300, null, 40);
    pirate.destroy();
    exploSound.play();
}

function updateTimers() {
    globalClock++;
    bgTimer++;
    console.log(globalClock);
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
    if(thing1.key == 'trap'){
        thing1.kill();
        thing2.kill();
    }else{
        thing1.kill();
    }
}

function shipCollisionHandler(thing1, thing2) {
    thing2.kill();
}


function bulletCollisionHandler(thing1, thing2) {
    thing1.kill();
    thing2.kill();
}

function droneCollisionHandler(thing1, thing2) {
    thing2.kill();
}

function destructCollisionHandler(thing1, thing2) {
    thing1.kill();
    thing2.kill();
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
    game.physics.arcade.overlap(bullets, pirates, bulletCollisionHandler, null, this);
    game.physics.arcade.overlap(drones, pirates, droneCollisionHandler, null, this);
    game.physics.arcade.overlap(selfDestruct, buildingUnits, destructCollisionHandler, null, this);

    buildingUnits.forEachDead(cleanupBuilding);
    pirates.forEachDead(cleanupPirates);

    explosionEmitter.forEachAlive(function(p){
        p.alpha = p.lifespan / explosionEmitter.lifespan; 
    })
}