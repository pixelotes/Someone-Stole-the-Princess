(function () {
    var gameW = 304;
    var gameH = 300;
    var game = new Phaser.Game(gameW, gameH, Phaser.AUTO, 'game', {
        preload: preload,
        create: create,
        update: update
    });
    var templayer;
    var tilesize = 16;
    var depth = 10;
    var estar;
    var map = [];
    var walkablemap = [];
    var objectmap = [];
    var viewport = [];
    var enemyArray = [];
    var objectArray = [];
    var playerArray = [];
    var renderContentGroup;
    var prettymap = [];
    var newplayer;
    var framenumber = 0;
    var guiText;
    var text;
    var objects;
    var enemies;
    var lup; //ladder up
    var ldwn; //ladder down
    var floorsymbol = 2;
    var wallsymbol = 1;
    var prettyhorizontalwall = [3, 4, 5, 6, 16, 17, 18, 25, 29, 30, 36, 37, 38, 39, 40, 41, 42];
    var prettyverticalwall = [12, 19];
    var prettyfloor = [48, 52, 75, 76];
    var cursors;
    var upKey;
    var downKey;
    var leftKey;
    var rightKey;
    var debugkey1;
    var debugkey2;
    var ascending = false;
    var music;
    var death;
    var punch;
    var potionsfx;
    var stairsfx;
    var doorsfx;
    var stepsfx;
    var victorysfx;

    var player = function (name, type) {
        this.name = name;
        this.type = type;
        this.number = 7;
        this.basehealth = 4;
        this.health = 20;
        this.bonushealth = 0;
        this.endurance = 5;
        this.strength = 5;
        this.weapon = 0;
        this.armor = 0;
        this.luck = 1;
        this.level = 1;
        this.experience = 0;
        this.posX = 2;
        this.posY = 2;
        this.nextLevel = 50;
    };

    var potion = function (type, strength) {
        this.type = type;
        this.strength = strength;
    };

    var princess = function () {
        posX=2;
        posY=2;
        this.number=4;
    };

    var popup;

    var foe = function (type, level) {
        this.level = level;
        this.type = type;
        this.weapon = 0;
        this.armor = 0;
        this.health = 10;
        this.strength = 1 * level;
        this.posX = 2;
        this.posY = 2;
        this.experience = 5;
        this.number = 8;
    };

    var ladderUp = function () {
        posX = 2;
        posY = 2;
        this.number = 4;
    };

    var ladderDown = function () {
        posX = 2;
        posY = 2;
    };

    function preload() {
        game.load.spritesheet("tiles", "img/dungeon.png", tilesize, tilesize);
        game.load.spritesheet("potions", "img/potions.png", tilesize, tilesize);
        game.load.spritesheet("chars", "img/chars.png", tilesize, tilesize);
        game.load.bitmapFont('courier', 'font/courier_0.png', 'font/courier.fnt');
        game.load.spritesheet('intro', 'img/introslides.png', 304,256);
        game.load.audio('punchsfx', ['audio/punch.mp3', 'audio/punch.ogg']);
        game.load.audio('deathsfx', ['audio/death.mp3', 'audio/death.ogg']);
        game.load.audio('potionsfx', ['audio/potion.mp3', 'audio/potion.ogg']);
        game.load.audio('stairsfx', ['audio/stairs.mp3', 'audio/stairs.ogg']);
        game.load.audio('doorsfx', ['audio/door.mp3', 'audio/door.ogg']);
        game.load.audio('stepsfx', ['audio/step.mp3', 'audio/step.ogg']);
        game.load.audio('victorysfx', ['audio/victory.mp3', 'audio/victory.ogg']);
        game.load.audio('bgmusic', ['audio/cave.mp3', 'audio/cave.ogg']);
    }
    
    function intro(){
        
        myintro = setTimeout(function(){
            bg = game.add.sprite(0,0,'intro');
            setTimeout(function(){
                setTimeout(function(){
                    bg.frame = 1;
                    setTimeout(function(){
                        bg.frame = 2;
                        setTimeout(function(){
                            bg.frame = 3;
                            setTimeout(function(){
                                bg.frame = 4; 
                                setTimeout(function(){
                                    bg.frame = 5;
                                    setTimeout(function(){
                                        bg.destroy;
                                    
                                    },1500);
                                 },1000);
                            },1000);
                        },1000);
                    },1000);
                },1000);
            },1500);
        },0);

    }
    
    function create() {
        if (!ascending) {
            
            intro();
            try{
                music.stop();
            } catch(err){}
            setTimeout(function(){
                
            renderContentGroup = game.add.group();
                
            music = game.add.audio('bgmusic',1,true);
            death = game.add.audio('deathsfx');
            punch = game.add.audio('punchsfx');
            potionsfx = game.add.audio('potionsfx');
            stairsfx = game.add.audio('stairsfx');
            doorsfx = game.add.audio('doorsfx');
            stepsfx = game.add.audio('stepsfx');
            victorysfx = game.add.audio('victorysfx');

            music.play();
            music.volume=0.1;
            death.volume=0.5;
            
            cursors = game.input.keyboard.createCursorKeys();

            createmap();
            createplayer();
            makeprettymap(map);
            setvars();

            populatemap(newplayer.luck);

            updateviewport();
            text = game.add.bitmapText(tilesize, walkablemap.length * tilesize, 'courier', '', tilesize);

            updategui();

            estar = new EasyStar.js();

            //animation timer
            
                var interval = setInterval(function () {
                    if (framenumber === 0) {
                        framenumber = 1;
                    } else {
                        framenumber = 0;
                    }
                    updateviewport();
                }, 500);
            

            //KEY PRESS
            upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
            upKey.onDown.add(function (key) {
                turnomatic(newplayer, 'up');
            }, this);
            downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
            downKey.onDown.add(function (key) {
                turnomatic(newplayer, 'down');
            }, this);
            leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
            leftKey.onDown.add(function (key) {
                turnomatic(newplayer, 'left');
            }, this);
            rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
            rightKey.onDown.add(function (key) {
                turnomatic(newplayer, 'right');
            }, this);
            debugkey1 = game.input.keyboard.addKey(Phaser.Keyboard.Q);
            debugkey1.onDown.add(function (key) {
                alert(walkablemap.join("\n"));
            }, this);
            debugkey1 = game.input.keyboard.addKey(Phaser.Keyboard.E);
            debugkey1.onDown.add(function (key) {
                alert(map.join("\n"));
            }, this);
                },8000);
        } else {

            createmap();
            createplayer();
            makeprettymap(map);
            setvars();

            populatemap(newplayer.luck);

            updateviewport();

            updategui();
 
            for (i = 0; i < enemyArray.length; i++) {
                checkoverlap(newplayer, enemyArray[i]);
            }

            for (i = 0; i < enemyArray.length; i++) {
                checkoverlap(lup, enemyArray[i]);
            }

        }
    }

    function checkoverlap(ent1, ent2) {
        if (ent1.posX == ent2.posX && ent1.posY == ent2.posY) {
            startingPos(ent1, walkablemap.length - 1, walkablemap[0].length - 1, ent1.number);
        }
    }

    function relocateobjs(obj) {
        var coordx = obj.posX;
        var coordy = obj.posY;
        alert(walkablemap[coordy][coordx]);
        if (walkablemap[coordy][coordx] == 1 || walkablemap[coordy][coordx] === 0) {
            this.tempx = Math.floor((Math.random() * px) + 1);
            this.tempy = Math.floor((Math.random() * py) + 1);
            var val = (walkablemap[this.tempy][this.tempx]);

            //if empty walkable tile updates the entity value and walkable map value
            if (val == 1) {
                obj.posX = this.tempx;
                obj.posY = this.tempy;
                walkablemap[this.tempy][this.tempx] = obj.number;
            }

            //else it tries to relocate object until success
            else {
                relocateobjs(obj);
            }
        }
    }

    function usepotion(type, coordx, coordy) {
        //alert(type+","+coordx+","+coordy);
        potionsfx.play();
        if (type === 10) {
            //health potion
            newplayer.health = newplayer.health + 5;
            setText(newplayer,5,'#00ff00');
            if (newplayer.health > (newplayer.endurance * 4 + newplayer.bonushealth)) {
                newplayer.health = newplayer.endurance * 4 + newplayer.bonushealth;
            }
            updategui();
        } else if (type === 11) {
            //endurance potion
            var oldhealth = newplayer.endurance * 4 + newplayer.bonushealth;
            newplayer.endurance = newplayer.endurance + 1;
            newplayer.health = newplayer.health + ((newplayer.endurance * 4 + newplayer.bonushealth) - oldhealth);

            updategui();
        } else if (type === 12) {
            //strength potion
            newplayer.strength = newplayer.strength + 1;
            updategui();
        } else if (type === 13) {
            //luck potion
            newplayer.luck = newplayer.luck + 1;
            updategui();
        } else if (type === 14) {
            //levelup potion
            levelup();
        }
    }

    function levelup() {
        newplayer.level = newplayer.level + 1;
        newplayer.endurance = newplayer.endurance + 1;
        newplayer.strength = newplayer.strength + 1;
        updategui();
        //newplayer.nextLevel = 50;
    }

    function update() {

    }


    function updategui() {


        text.setText(newplayer.name + ' the ' + newplayer.type + ' (LVL ' + newplayer.level + ')' + '\nHP ' + newplayer.health + ' / ' + (newplayer.endurance * 4 + newplayer.bonushealth) + ' | EXP ' + newplayer.experience + ' | DPT ' + depth + '\nEND ' + newplayer.endurance + ' | STR ' + newplayer.strength + ' | LCK ' + newplayer.luck);

    }

    function setvars() {
        if (newplayer.type == "Lizard") {
            newplayer.strength = 5;
            newplayer.initialFrame = 0;
            newplayer.luck = newplayer.luck + 2;
        } else if (newplayer.type == "Imp") {
            newplayer.strength = 6;
            newplayer.initialFrame = 2;
            newplayer.endurance = newplayer.endurance + 1;
            newplayer.health = newplayer.endurance * 4 + newplayer.bonushealth;
            newplayer.luck = newplayer.luck + 1;
        } else if (newplayer.type == "Demon") {
            newplayer.strength = 8;
            newplayer.initialFrame = 4;
            newplayer.weapon = 3;
        } else if (newplayer.type == "Cacodemon") {
            newplayer.strength = 7;
            newplayer.initialFrame = 6;
            newplayer.basehealth = 40;
            newplayer.health = newplayer.endurance * 4 + newplayer.bonushealth;
            newplayer.weapon = 2;
        } else if (newplayer.type == "Troll") {
            newplayer.strength = 10;
            newplayer.endurance = newplayer.endurance + 5;
            newplayer.initialFrame = 8;
        }
    }

    function updateviewport() {
        viewport = JSON.parse(JSON.stringify(map));
        //40x27 window

        rendermap(viewport);
    }

    function turnomatic(entity, evt) {

        //*****************
        //** PLAYER TURN **
        //*****************

        //check what kind of tile the player is going to collide with
        //maybe get_tile(evt), if enemy tile then attack, if container then break and generate stuff,
        //if ladder then change floor, if wall then don't move or take the turn
        if (canMove(entity, evt)) {
            if (nexTile(entity, evt) !== false && (nexTile(entity, evt) == floorsymbol || nexTile(entity, evt) == 4)) {
                //floor, open doors
                //check if enemy
                var coords = nexTileCoords(entity, evt);
                //movement(entity,evt);
                var ent = checkEntityAtCoords(coords);
                if (ent[0] === true) {
                    //combat
                    //enemyArray.splice((ent[1]),1);
                    combat(entity, enemyArray[(ent[1])], ent[1]);
                } else {
                    //alert(nexTilePotion(entity, evt));
                    var pot = nexTilePotion(entity, evt);
                    if (pot[0] !== 0) {
                        usepotion(pot[0], pot[1], pot[2]);

                    }
                    movement(entity, evt);
                    objectArray[newplayer.posY][newplayer.posX] = 0;

                }
            } else if (nexTile(entity, evt) !== false && nexTile(entity, evt) == 3) {
                //Doors
                doorsfx.play();
                var coords = nexTileCoords(entity, evt);
                map[coords[0]][coords[1]] = 4;
                walkablemap[coords[0]][coords[1]] = floorsymbol;
                rendermap(map);
            } else if (nexTile(entity, evt) != false && nexTile(entity, evt) == 6) {
                //Containers
            } else if (nexTile(entity, evt) != false && nexTile(entity, evt) == 4) {
                //ladder
                //alert("ladder!");
            }
        }
        //****************
        //** ENEMY TURN **
        //****************

        enemyMovement();

        //******************
        //** EFFECTS TURN **
        //******************

        updateEffects();
    }

    function enemyMovement() {
        var easystar;
        var actualfoe = 0;
        //enemies will move one tile and, if collide with player, will fight him
        for (var s = 0; s < enemyArray.length; s++) {
            calculate(s);
        }
    }

    function calculate(i) {
        //alert(i);
        
        estar.setGrid(walkablemap);
        estar.setAcceptableTiles([1, 2, 7, 8]);
        estar.findPath(enemyArray[i].posX, enemyArray[i].posY, newplayer.posX, newplayer.posY, function (path) {
            if (path) {
                //alert("");
                if (path[1].x == newplayer.posX && path[1].y == newplayer.posY) {
                    foecombat(enemyArray[i]);
                } else {
                    //alert(walkablemap[path[1].y][path[1].x]);

                    if (walkablemap[path[1].y][path[1].x] != 8) {
                        walkablemap[enemyArray[i].posY][enemyArray[i].posX] = 1;
                        enemyArray[i].posX = path[1].x;
                        enemyArray[i].posY = path[1].y;
                        walkablemap[path[1].y][path[1].x] = 8;
                    }

                }
            } else {}
        });
        estar.calculate();
    }

    function updateEffects() {}

    function combat(ent1, ent2, idx) {

        //damage calculation
        
        var damage = ent1.strength + ent1.weapon;
        ent2.health = (ent2.health + ent2.armor) - damage;
        setText(ent2,damage,'#ff0000');
        //if enemy health drop to 0 or less
        if (ent2.health <= 0) {
            death.play();
            //destroy the enemy
            newplayer.experience = ent1.experience + ent2.experience;
            newplayer.nextLevel = newplayer.nextLevel - ent2.experience;

            if(newplayer.nextLevel<=0){
                newplayer.nextLevel=50;
                levelup();
            }
            walkablemap[ent2.posY][ent2.posX] = 1;
            enemyArray.splice(idx, 1);
            updategui();
        } else {
            punch.play();
        }
    }
    
    function setText(ent,damage,color){
        var style = { font: "16px bold Monospace", fill: color, wordWrap: false, align: "center" };
        this.btext="";
        this.btext = game.add.text(ent.posX*tilesize, ent.posY*tilesize, damage, style);
        //text dissapears after 1/2 second
        game.time.events.add(300, this.btext.destroy, this.btext);
    }

    function foecombat(ent) {
        punch.play();
        //damage calculation
        var damage = ent.strength + ent.weapon;
        newplayer.health = (newplayer.health) - ent.strength;
        updategui();
        setText(newplayer,damage,'#ffffff');
        //if enemy health drop to 0 or less
        if (newplayer.health <= 0) {
            alert("Game over! You allowed the Princess to escape.");
            location.reload();
        }
    }

    function checkEntityAtCoords(coords) {
        for (i = 0; i < enemyArray.length; i++) {
            if (enemyArray[i].posX == coords[1] && enemyArray[i].posY == coords[0]) {
                return [true, i];
            }
        }
        return false;
    }

    function nexTile(entity, evt) {
        if (evt == 'up') {
            return map[entity.posY - 1][entity.posX];
        } else if (evt == 'down') {
            return map[entity.posY + 1][entity.posX];
        } else if (evt == 'left') {
            return map[entity.posY][entity.posX - 1];
        } else if (evt == 'right') {
            return map[entity.posY][entity.posX + 1];
        }
        return false;
    }

    function nexTileWalkable(entity, evt) {
        if (evt == 'up') {
            return walkablemap[entity.posY - 1][entity.posX];
        } else if (evt == 'down') {
            return walkablemap[entity.posY + 1][entity.posX];
        } else if (evt == 'left') {
            return walkablemap[entity.posY][entity.posX - 1];
        } else if (evt == 'right') {
            return walkablemap[entity.posY][entity.posX + 1];
        }
        return false;
    }

    function nexTilePotion(entity, evt) {
        if (evt == 'up') {
            return [objectArray[entity.posY - 1][entity.posX], entity.posY - 1, entity.posX];
        } else if (evt == 'down') {
            return [objectArray[entity.posY + 1][entity.posX], entity.posY + 1, entity.posX];
        } else if (evt == 'left') {
            return [objectArray[entity.posY][entity.posX - 1], entity.posY, entity.posX - 1];
        } else if (evt == 'right') {
            return [objectArray[entity.posY][entity.posX + 1], entity.posY, entity.posX + 1];
        }
        return false;
    }

    function nexTileCoords(entity, evt) {

        coords = [];

        if (evt == 'up') {
            coords = [entity.posY - 1, entity.posX];
            return coords;
        } else if (evt == 'down') {
            coords = [entity.posY + 1, entity.posX];
            return coords;
        } else if (evt == 'left') {
            coords = [entity.posY, entity.posX - 1];
            return coords;
        } else if (evt == 'right') {
            coords = [entity.posY, entity.posX + 1];
            return coords;
        }
        return false;
    }

    function canMove(entity, evt) {
        if (evt == 'up') {
            if (map[entity.posY - 1][entity.posX] != wallsymbol) {
                return true;
            }
        } else if (evt == 'down') {
            if (map[entity.posY + 1][entity.posX] != wallsymbol) {
                return true;
            }
        } else if (evt == 'left') {
            if (map[entity.posY][entity.posX - 1] != wallsymbol) {
                return true;
            }
        } else if (evt == 'right') {
            if (map[entity.posY][entity.posX + 1] != wallsymbol) {
                return true;
            }
        }
        return false;
    }

    function movement(entity, evt) {

        if (nexTileWalkable(entity, evt) == 4) {
            ascend();
        }
        
        if (evt == 'up') {
            if (map[entity.posY - 1][entity.posX] != wallsymbol) {
                walkablemap[entity.posY][entity.posX] = 1;
                entity.posY = entity.posY - 1;
                walkablemap[entity.posY][entity.posX] = 7;
                updateviewport();
                stepsfx.play();      
                return true;
            }
        } else if (evt == 'down') {
            if (map[entity.posY + 1][entity.posX] != wallsymbol) {
                walkablemap[entity.posY][entity.posX] = 1;
                entity.posY = entity.posY + 1;
                walkablemap[entity.posY][entity.posX] = 7;
                updateviewport();
                stepsfx.play();
                return true;
            }
        } else if (evt == 'left') {
            if (map[entity.posY][entity.posX - 1] != wallsymbol) {
                walkablemap[entity.posY][entity.posX] = 1;
                entity.posX = entity.posX - 1;
                walkablemap[entity.posY][entity.posX] = 7;
                updateviewport();
                stepsfx.play();
                return true;
            }
        } else if (evt == 'right') {
            if (map[entity.posY][entity.posX + 1] != wallsymbol) {
                walkablemap[entity.posY][entity.posX] = 1;
                entity.posX = entity.posX + 1;
                walkablemap[entity.posY][entity.posX] = 7;
                updateviewport();
                stepsfx.play();
                return true;
            }
        }
        return false;
    }

    function createmap() {
        //loadmap();

        map = maps[Math.floor(Math.random() * maps.length)];
    }

    function loadmap() {
        var foo = requestCSV("testmap.csv", function (d) {
            map = d;
        });
    }

    function requestCSV(f, c) {
        return new CSVAJAX(f, c);
    }

    function CSVAJAX(filepath, callback) {
        this.request = new XMLHttpRequest();
        this.request.timeout = 10000;
        this.request.open("GET", filepath, true);
        this.request.parent = this;
        this.callback = callback;
        this.request.onload = function () {
            var d = this.response.split('\n');
            var i = d.length;
            while (i--) {
                if (d[i] !== "")
                    d[i] = d[i].split(',');
                else
                    d.splice(i, 1);
            }
            this.parent.response = d;
            if (typeof this.parent.callback !== "undefined")
                this.parent.callback(d);
        }
        this.request.send();
    }

    function renderprettymap() {

        /*var carpet;
        var jail;
        var rails;
        var pools;
        
        
        
                            var rng = Math.floor(Math.random()*10);
                    //alert(rng);
                    if(rng===5){
                        spr.frame=prettyfloor[Math.floor(Math.random()*prettyfloor.length)];
                    }*/
    }

    function populatemap(luck) {
        var boxes = 4;
        var chests = 3 + luck;
        var foes = (10 - depth) + 5 - luck;
        
        //foes=3;
        var ylen = walkablemap.length;
        var xlen = walkablemap[0].length;
        var potionqty = newplayer.luck;

        if(foes<=0){foes=2;}
        
        //Creates ladders
        if(depth>0){
            lup = new ladderUp();
        }
        
        //if in surface, creates princess instead of ladder
        else {
            lup = new princess();
        }
        //ldwn = new ladderDown();

        startingPos(lup, xlen - 1, ylen - 1, 4);
        //startingPos(ldwn, xlen - 1, ylen - 1, 3);

        //Creates foes
        types = ["Peasant", "Knight", "Ninja"]
        for (i = 0; i < foes; i++) {
            var thistype = Math.floor(Math.random() * types.length);
            enemyArray[i] = new foe(types[thistype], 1);
            startingPos(enemyArray[i], xlen - 1, ylen - 1, 8);
            if (types[thistype] == "Peasant") {
                enemyArray[i].initialFrame = 10;
            } else if (types[thistype] == "Knight") {
                enemyArray[i].initialFrame = 12;
            } else if (types[thistype] == "Ninja") {
                enemyArray[i].initialFrame = 14;
            }

        }

        //create potions
        objectArray = JSON.parse(JSON.stringify(map));

        for (i = 0; i < objectArray.length; i++) {
            for (j = 0; j < objectArray[i].length; j++) {
                objectArray[i][j] = 0;
            }
        }
        
        if(potionqty>5){potionqty=5}
        
        for (i = 0; i < potionqty * Math.floor((Math.random() + 1) * 2); i++) {
            var rnd = Math.floor(Math.random() * 50);
            if (rnd <=0 && rnd < 13) {
                pot = new potion("Healing", "5");
                startingPos(pot, walkablemap[0].length - 1, walkablemap.length - 1, 10);
            } else if (rnd <=13 && rnd < 25) {
                pot = new potion("Endurance", "1");
                startingPos(pot, walkablemap[0].length - 1, walkablemap.length - 1, 11);
            } else if (rnd <=25 && rnd < 37) {
                pot = new potion("Strength", "1");
                startingPos(pot, walkablemap[0].length - 1, walkablemap.length - 1, 12);
            } else if (rnd <=37 && rnd < 49) {
                pot = new potion("Level-Up", "1");
                startingPos(pot, walkablemap[0].length - 1, walkablemap.length - 1, 14);

            } else {
                pot = new potion("Luck", "1");
                startingPos(pot, walkablemap[0].length - 1, walkablemap.length - 1, 13);
            }


        }
        //move potions to objectArray
        for (i = 0; i < walkablemap.length; i++) {
            for (j = 0; j < walkablemap[i].length; j++) {
                if (walkablemap[i][j] == 10) {
                    walkablemap[i][j] = 1;
                    objectArray[i][j] = 10;
                } else if (walkablemap[i][j] == 11) {
                    walkablemap[i][j] = 1;
                    objectArray[i][j] = 11;
                } else if (walkablemap[i][j] == 12) {
                    walkablemap[i][j] = 1;
                    objectArray[i][j] = 12;
                } else if (walkablemap[i][j] == 13) {
                    walkablemap[i][j] = 1;
                    objectArray[i][j] = 13;
                } else if (walkablemap[i][j] == 14) {
                    walkablemap[i][j] = 1;
                    objectArray[i][j] = 14;
                }
            }
        }

        //debug walkable map
        //alert(walkablemap.join('\n'));
    }

    function rendermap(view) {

        var floorframe = 48;
        var wallframe = 32;
        var wallul = 0;
        var wallur = 2;
        var walldl = 24;
        var walldr = 26;
        var wallcr;
        var wallh = 1;
        var wallv = 14;
        var walltr = 32;
        var walltl = 32;
        var walltriu = 91;
        var walltrid = 79;
        var walltril = 89;
        var walltrir = 88;
        var doorhc = 15;
        var doorvc = 31;
        var doorho = 27;
        var doorvo = 43;

        //Pass 0 - Destroy objects
        renderContentGroup.forEach(function(elem) {
          elem.destroy();
        }, this);


        //Pass 1 - FLOOR
        for (i = 0; i < view.length; i++) {
            for (z = 0; z < view[i].length; z++) {
                //Floor
                if (view[i][z] != 0) {
                    spr = game.add.sprite(0 + (z * tilesize), 0 + (i * tilesize), 'tiles');
                    spr.frame = floorframe;
                    renderContentGroup.add(spr);
                    //pretty floor
                    if (prettymap[i][z] != 0) {
                        spr.frame = prettymap[i][z]
                    }
                }
                //emptyness
                else {
                    spr = game.add.sprite(0 + (z * tilesize), 0 + (i * tilesize), 'tiles');
                    spr.frame = 77;
                    renderContentGroup.add(spr);
                }
            }
        }

        //Pass 2 - WALLS
        for (i = 0; i < view.length; i++) {
            for (z = 0; z < view[i].length; z++) {
                if (view[i][z] == wallsymbol) {
                    spr = game.add.sprite(0 + (z * tilesize), 0 + (i * tilesize), 'tiles');
                    spr.frame = wallframe;
                    renderContentGroup.add(spr);

                    if (view[i - 1][z] != wallsymbol && view[i][z - 1] != wallsymbol && view[i + 1][z] == wallsymbol && view[i][z + 1] == wallsymbol) {
                        spr.frame = wallul;
                        if (view[i][z - 1] == 3 || view[i][z - 1] == 4) {
                            spr.frame = walltrid;
                        } else if (view[i - 1][z] == 3 || view[i - 1][z] == 4) {
                            spr.frame = walltrir;
                        }
                    } else if (view[i - 1][z] == wallsymbol && view[i][z - 1] != wallsymbol && view[i + 1][z] != wallsymbol && view[i][z + 1] == wallsymbol) {
                        spr.frame = walldl;
                        if (view[i + 1][z] == 4 || view[i + 1][z] == 3) {
                            spr.frame = walltrir;
                        } else if (view[i][z - 1] == 3 || view[i][z - 1] == 4) {
                            spr.frame = walltriu;
                        }
                    } else if (view[i - 1][z] == wallsymbol && view[i][z - 1] != wallsymbol && view[i + 1][z] == wallsymbol && view[i][z + 1] != wallsymbol) {
                        spr.frame = wallv;
                        //PRETTY VWALL
                        if (prettymap[i][z] != 0) {
                            spr.frame = prettymap[i][z]
                        }
                    } else if (view[i - 1][z] != wallsymbol && view[i][z - 1] == wallsymbol && view[i + 1][z] != wallsymbol && view[i][z + 1] == wallsymbol) {
                        spr.frame = wallh;
                        //PRETTY HWALL
                        if (prettymap[i][z] != 0) {
                            spr.frame = prettymap[i][z]
                        }
                    } else if (view[i - 1][z] != wallsymbol && view[i][z - 1] == wallsymbol && view[i + 1][z] == wallsymbol && view[i][z + 1] != wallsymbol) {
                        spr.frame = wallur;
                        if (view[i][z + 1] == 4 || view[i][z + 1] == 3) {
                            spr.frame = walltrid;
                        } else if (view[i - 1][z] == 3 || view[i - 1][z] == 4) {
                            spr.frame = walltril;
                        }
                    } else if (view[i - 1][z] == wallsymbol && view[i][z - 1] == wallsymbol && view[i + 1][z] != wallsymbol && view[i][z + 1] != wallsymbol) {
                        spr.frame = walldr;
                        if (view[i + 1][z] == 4 || view[i + 1][z] == 3) {
                            spr.frame = walltril;
                        } else if (view[i][z + 1] == 4 || view[i][z + 1] == 3) {
                            spr.frame = walltriu;
                        }
                    } else if (view[i - 1][z] != wallsymbol && view[i][z - 1] == wallsymbol && view[i + 1][z] != wallsymbol && view[i][z + 1] != wallsymbol) {
                        spr.frame = walltr;
                    } else if (view[i - 1][z] != wallsymbol && view[i][z - 1] != wallsymbol && view[i + 1][z] != wallsymbol && view[i][z + 1] == wallsymbol) {
                        spr.frame = walltl;
                    }

                }
            }
        }

        //Pass 3 - DOORS
        for (i = 0; i < view.length; i++) {
            for (z = 0; z < view[i].length; z++) {

                if (view[i][z] == 3) {
                    spr = game.add.sprite(0 + (z * tilesize), 0 + (i * tilesize), 'tiles');
                    renderContentGroup.add(spr);
                    if (view[i + 1][z] == wallsymbol || view[i - 1][z] == wallsymbol) {
                        spr.frame = doorvc;
                    } else {
                        spr.frame = doorhc;
                    }
                } else if (view[i][z] == 4) {
                    spr = game.add.sprite(0 + (z * tilesize), 0 + (i * tilesize), 'tiles');
                    spr.frame=doorho;
                    renderContentGroup.add(spr);
                    try{
                    if (view[z][i + 1] === wallsymbol) {

                        spr.frame = doorvo;
                    } else {
                        spr.frame = doorho;
                    }
                    } catch(err){}
                }

            }
        }

        //PASS 4 - DECORATIONS
        /*for (i = 0; i < prettymap.length; i++) {
            for (z = 0; z < prettymap[i].length; z++) {

                if (prettymap[i][z] != 0) {
                    //spr = game.add.sprite(0 + (z * tilesize), 0 + (i * tilesize), 'tiles');
                    //spr.frame(prettymap[z][i]);
                }

            }
        }*/

        //PASS 5 - POTIONS & OBJECTS
        for (i = 0; i < walkablemap.length; i++) {
            for (z = 0; z < walkablemap[i].length; z++) {

                if (walkablemap[i][z] === 1 && objectArray[i][z] === 10) {
                    spr = game.add.sprite(0 + (z * tilesize), 0 + (i * tilesize), 'potions');
                    spr.frame = 0;
                    renderContentGroup.add(spr);
                } else if (walkablemap[i][z] === 1 && objectArray[i][z] === 11) {
                    spr = game.add.sprite(0 + (z * tilesize), 0 + (i * tilesize), 'potions');
                    spr.frame = 2;
                    renderContentGroup.add(spr);
                } else if (walkablemap[i][z] === 1 && objectArray[i][z] === 12) {
                    spr = game.add.sprite(0 + (z * tilesize), 0 + (i * tilesize), 'potions');
                    spr.frame = 4;
                    renderContentGroup.add(spr);
                } else if (walkablemap[i][z] === 1 && objectArray[i][z] === 13) {
                    spr = game.add.sprite(0 + (z * tilesize), 0 + (i * tilesize), 'potions');
                    spr.frame = 5;
                    renderContentGroup.add(spr);
                } else if (walkablemap[i][z] === 1 && objectArray[i][z] === 14) {
                    spr = game.add.sprite(0 + (z * tilesize), 0 + (i * tilesize), 'potions');
                    spr.frame = 6;
                    renderContentGroup.add(spr);
                }

            }
        }

        //PASS 6 - FOV
        //TODO :-)

        //PASS 7 - LADDERS
        if(depth!==0){
            spr = game.add.sprite(lup.posX * tilesize, lup.posY * tilesize, 'tiles');
            spr.frame = 78;
            renderContentGroup.add(spr);
        } else {
            spr = game.add.sprite(lup.posX * tilesize, lup.posY * tilesize, 'chars');
            spr.frame=16;
            spr.initialFrame=16;
            renderContentGroup.add(spr);
        }
        //spr = game.add.sprite(ldwn.posX * tilesize, ldwn.posY * tilesize, 'tiles');
        //spr.frame = 66;

        //PASS 8 - DRAW FOES
        for (i = 0; i < enemyArray.length; i++) {
            spr = game.add.sprite(enemyArray[i].posX * tilesize, enemyArray[i].posY * tilesize, 'chars');
            spr.frame = enemyArray[i].initialFrame + framenumber;
            renderContentGroup.add(spr);
        }

        //PASS 9 - DRAW PLAYER
        spr = game.add.sprite(newplayer.posX * tilesize, newplayer.posY * tilesize, 'chars');
        spr.frame = newplayer.initialFrame + framenumber;
        renderContentGroup.add(spr);
    }


    function createplayer() {
        makewalkablemap();
        names = ['Johnny', 'Mike', 'Stuart', 'James', 'Earl', 'Jonas', 'Snowball II', 'Luke', 'Mark', 'Luke', 'Clark', 'Stan', 'Dom', 'Steven', 'Obi-Wan', 'Arthur', 'Ron'];
        types = ['Lizard', 'Imp', 'Demon', 'Cacodemon', 'Troll'];
        if (!ascending) {
            newplayer = new player(names[Math.floor(Math.random() * names.length)], types[Math.floor(Math.random() * types.length)]);
        } else {
            newplayer = templayer;
        }
        //starting position
        var ylen = walkablemap.length;
        var xlen = walkablemap[0].length;
        startingPos(newplayer, xlen - 1, ylen - 1, 7);
    }

    function makeprettymap(view) {

        var floorframe = 48;
        var wallframe = 32;
        var wallh = 1;
        var wallv = 14;
        var floorchance = 15;
        var wallvchance = 5;
        var wallhchance = 3;
        prettymap = JSON.parse(JSON.stringify(map));

        for (i = 0; i < prettymap.length; i++) {
            for (j = 0; j < prettymap[i].length; j++) {
                prettymap[i][j] = 0;
            }
        }



        //Pass 2 - WALLS
        for (i = 0; i < map.length; i++) {
            for (z = 0; z < map[i].length; z++) {
                if (map[i][z] == wallsymbol) {
                    if (map[i - 1][z] == wallsymbol && map[i][z - 1] != wallsymbol && map[i + 1][z] == wallsymbol && map[i][z + 1] != wallsymbol) {
                        var rng = Math.floor(Math.random() * wallvchance);
                        if (rng === 0) {
                            prettymap[i][z] = prettyverticalwall[Math.floor(Math.random() * prettyverticalwall.length)];
                        }
                    } else if (map[i - 1][z] != wallsymbol && map[i][z - 1] == wallsymbol && map[i + 1][z] != wallsymbol && map[i][z + 1] == wallsymbol) {
                        var rng = Math.floor(Math.random() * wallhchance);
                        if (rng === 1) {
                            prettymap[i][z] = prettyhorizontalwall[Math.floor(Math.random() * prettyhorizontalwall.length)];
                        }
                    }

                }
            }
        }

        //Pass 1 - FLOOR
        for (i = 0; i < view.length; i++) {
            for (z = 0; z < view[i].length; z++) {
                //Floor
                if (view[i][z] != 0 && walkablemap[i][z] == 1) {

                    var rng = Math.floor(Math.random() * floorchance);
                    if (rng === 7) {
                        prettymap[i][z] = prettyfloor[Math.floor(Math.random() * prettyfloor.length)];
                    }

                }
            }
        }
    }

    function makewalkablemap() {

        //val 7 = player
        //val 8 = foe
        //val 1 = walkable
        //val 0 = non-walkable
        //val 4 = ladder up 
        //val 3 = ladder down
        //val 6 = breakable container
        //val 5 = non-breakable stuff

        walkablemap = JSON.parse(JSON.stringify(map));
        for (i = 0; i < walkablemap.length; i++) {
            for (z = 0; z < walkablemap[i].length; z++) {
                if (walkablemap[i][z] == 2 || walkablemap[i][z] == 4) {
                    walkablemap[i][z] = 1;
                } else {
                    walkablemap[i][z] = 0;
                }
            }

        }
    }

    function startingPos(entity, px, py, entityVal) {
        this.entity = entity;
        this.tempx = Math.floor((Math.random() * px) + 1);
        this.tempy = Math.floor((Math.random() * py) + 1);
        var val = (walkablemap[this.tempy][this.tempx]);

        //if empty walkable tile updates the entity value and walkable map value
        if (val == 1) {
            entity.posX = this.tempx;
            entity.posY = this.tempy;
            walkablemap[this.tempy][this.tempx] = entityVal;
        }

        //else it tries to relocate object until success
        else {
            startingPos(entity, px, py, entityVal);
        }

    }

    function ascend() {
        depth = depth - 1;
        if(depth>=0){
            stairsfx.play();
            //levelup(); //levelup when ascending level?
            newplayer.health=newplayer.health+10;
            setText(newplayer,10,'#00ff00');
            if(newplayer.health > (newplayer.endurance * 4 + newplayer.bonushealth)) {
                    newplayer.health = newplayer.endurance * 4 + newplayer.bonushealth;
            }
            ascending = true;
            templayer = newplayer;
            create();
        } else {
            victorysfx.play();
            game.time.events.add(3500, function(){
                alert("Congratulations! You took the Princess back to her cell and ate her for dinner.");
                location.reload();
            }, this);
            
            //reload the page
            
        }
    }

    //function descend() {}
    var maps = [
[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
 [0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0],
 [0, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0],
 [0, 1, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 1, 0],
 [0, 1, 2, 2, 2, 1, 1, 1, 4, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0],
 [0, 1, 2, 2, 2, 1, 0, 1, 2, 1, 0, 0, 1, 2, 2, 2, 2, 1, 0],
 [0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
 [0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 1, 1, 1, 1, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 1, 2, 3, 2, 2, 2, 3, 2, 1, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 1, 0, 0, 1, 1, 1, 1, 1, 1, 3, 1, 1, 0],
[0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0],
[0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 0, 0, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 3, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 0],
[0, 1, 2, 2, 3, 2, 2, 1, 2, 2, 3, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 3, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 0],
[0, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 1, 2, 2, 3, 2, 2, 1, 2, 2, 3, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 1, 1, 1, 1, 3, 1, 1, 1, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 1, 3, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1, 0],
[0, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 1, 1, 1, 1, 3, 1, 1, 1, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 1, 1, 0],
[0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 2, 1, 0],
[0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 1, 0],
[0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3, 2, 2, 1, 0],
[0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 1, 0],
[0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 2, 1, 0],
[0, 0, 0, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
[0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
[0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
[0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 2, 1, 2, 1, 3, 1, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 0, 0, 0, 0],
[0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0],
[0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 0, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0],
[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0],
[0, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 0],
[0, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 0],
[0, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 0],
[0, 1, 2, 1, 3, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 1, 1, 1, 2, 1, 0],
[0, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 1, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], [0, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0], [0, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0], [0, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0], [0, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0], [0, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0], [0, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 0], [0, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 0], [0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 0], [0, 1, 2, 1, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 0], [0, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 0], [0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 1, 0], [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
[0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0],
[0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
[0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0],
[0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
[0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
[0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0],
[0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0],
[0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0],
[0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0],
[0, 0, 1, 2, 1, 1, 1, 1, 3, 1, 1, 3, 1, 2, 2, 1, 0, 0, 0],
[0, 0, 1, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0],
[0, 0, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0],
[0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0],
[0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 2, 2, 2, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
[0, 1, 2, 2, 2, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
[0, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
[0, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
[0, 1, 2, 2, 2, 1, 2, 2, 1, 1, 1, 1, 3, 1, 1, 1, 1, 0, 0],
[0, 1, 1, 1, 3, 1, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
[0, 0, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
[0, 0, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
[0, 0, 1, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
[0, 0, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
[0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 3, 1, 1, 1, 0],
[0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3, 1, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 0],
[0, 0, 0, 1, 2, 2, 2, 1, 0, 1, 1, 1, 1, 1, 2, 2, 2, 1, 0],
[0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0],
[0, 0, 1, 1, 2, 1, 1, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0],
[0, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
[0, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0],
[0, 0, 1, 1, 2, 1, 1, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0],
[0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
[0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0],
[0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 3, 2, 2, 3, 2, 2, 2, 2, 1, 0, 0, 0],
[0, 0, 0, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0],
[0, 0, 0, 1, 1, 1, 3, 1, 0, 0, 1, 1, 1, 1, 3, 1, 0, 0, 0],
[0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
[0, 0, 0, 0, 1, 1, 3, 1, 1, 1, 1, 1, 0, 1, 3, 1, 1, 1, 0],
[0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 0],
[0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 3, 2, 3, 2, 2, 2, 1, 0],
[0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 0],
[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
[0,0,0,1,2,2,2,2,2,2,1,0,1,1,1,1,1,1,0],
[0,0,0,1,2,2,2,2,2,2,1,0,1,2,2,2,2,1,0],
[0,0,0,1,1,1,3,1,1,1,1,0,1,2,2,2,2,1,0],
[0,0,0,0,0,1,2,1,0,0,0,0,1,2,2,2,2,1,0],
[0,0,0,0,0,1,2,1,1,1,1,1,1,2,2,2,2,1,0],
[0,0,0,0,0,1,2,2,2,2,2,2,3,2,2,2,2,1,0],
[0,0,1,1,1,1,2,2,2,2,2,2,1,1,1,1,1,1,0],
[0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0],
[0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0],
[0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0],
[0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0],
[0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
[0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,1,1,0,0],
[0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0],
[0,1,2,2,2,2,1,1,1,1,1,1,1,2,2,2,2,1,0],
[0,1,2,2,2,1,1,0,0,0,0,0,1,1,2,2,2,1,0],
[0,1,2,2,1,1,0,0,0,0,0,0,0,1,1,2,2,1,0],
[0,1,2,2,1,0,0,0,0,0,0,0,0,0,1,2,2,1,0],
[0,1,2,2,1,1,0,0,0,0,0,0,0,1,1,2,2,1,0],
[0,1,2,2,2,1,1,0,0,0,0,0,1,1,2,2,2,1,0],
[0,1,1,2,2,2,1,1,1,1,1,1,1,2,2,2,1,1,0],
[0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,1,1,0,0],
[0,0,0,1,1,2,2,2,2,2,2,2,2,2,1,1,0,0,0],
[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
[0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
[0,1,2,2,2,1,1,1,1,3,1,1,1,1,2,2,2,1,0],
[0,1,2,2,1,1,0,0,1,2,1,0,0,1,1,2,2,1,0],
[0,1,2,2,1,0,0,1,1,2,1,1,0,0,1,2,2,1,0],
[0,1,2,2,1,0,1,1,2,2,2,1,1,0,1,2,2,1,0],
[0,1,2,2,1,0,1,2,2,2,2,2,1,0,1,2,2,1,0],
[0,1,2,2,1,0,1,1,2,2,2,1,1,0,1,2,2,1,0],
[0,1,2,2,1,0,0,1,1,2,1,1,0,0,1,2,2,1,0],
[0,1,2,2,1,1,0,0,1,2,1,0,0,1,1,2,2,1,0],
[0,1,2,2,2,1,1,1,1,3,1,1,1,1,2,2,2,1,0],
[0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]
];
})();
