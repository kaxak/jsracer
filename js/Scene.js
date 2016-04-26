/*
Created : 23/02/2016
Authors : ROCHE Emmanuel
Description :
    Prototype représantant une scène.
*/

/* global include, X, SAT */


include('js/Node.js');
include('js/Car.js');
include('js/Shape.js');
include('js/Rect.js');
include('js/Vector.js');
include('js/Tile.js');
include('js/TileMap.js');
include('js/Chrono.js');

include('js/lib/tool/Screen.js');
include('js/lib/ext/sat/SAT.js');

include('assets/scenes/Map.js');

X.Scene = function () {
    
    var _ = X.class.propertiesGetter();
    
    var X_object = function(protected) {
        //* Initialise les propriétés
        _(this, protected);
        //* Appel le super contructeur 
        X.Node.apply(this, [protected, new X.Vector(0, 0), 0, new X.Vector(1, 1)]);
        
        var tiledRace = this.addChild('circuit', X.new(X.TileMap, [32, 'assets/textures/tiles/TileSet2.png']));
        
        this.addChild('car_player', X.new(X.Car,[
            4*32, 4*32,
            Math.PIO2,
            new X.Rect(new X.Vector(-20/2, -44/4*3), 20, 44),
            'assets/textures/sprites/carrosserie.png',
            'assets/textures/sprites/wheel.left.1.png',
            'assets/textures/sprites/wheel.right.1.png'
        ]));
        
//        var chrono = this.addChild('chrono', X.new(X.Chrono));
//        chrono.addCheck(X.new(X.ChronoChecker, [13, 1, 2, 6, tiledRace.getTileSize()]));//devra être un paramètre du circuit
//        chrono.addCheck(X.new(X.ChronoChecker, [34, 1, 5, 6, tiledRace.getTileSize()]));
//        chrono.addCheck(X.new(X.ChronoChecker, [34, 10, 5, 4, tiledRace.getTileSize()]));
//        chrono.addCheck(X.new(X.ChronoChecker, [28, 10, 6, 4, tiledRace.getTileSize()]));
//        chrono.addCheck(X.new(X.ChronoChecker, [28, 26, 6, 6, tiledRace.getTileSize()]));
//        chrono.addCheck(X.new(X.ChronoChecker, [22, 26, 6, 6, tiledRace.getTileSize()]));
//        chrono.addCheck(X.new(X.ChronoChecker, [22, 17, 6, 4, tiledRace.getTileSize()]));
//        chrono.addCheck(X.new(X.ChronoChecker, [1, 17, 5, 4, tiledRace.getTileSize()]));
//        chrono.addCheck(X.new(X.ChronoChecker, [1, 1, 5, 6, tiledRace.getTileSize()]));
        
        
    };
    
    X_object.prototype = X.extend(X.Node);
 
    return X.Scene = X_object;
};
