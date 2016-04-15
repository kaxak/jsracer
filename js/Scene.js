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
        
        this.addChild('circuit', X.new(X.TileMap, ['nom', 'assets/textures/tiles/TileSet2.png']));
        
        this.addChild('car_player', X.new(X.Car,[
            4*32, X.Screen.height/2+8*32,
            new X.Rect(new X.Vector(-20/2, -44/4*3), 20, 44),
            'assets/textures/sprites/carrosserie.png',
            'assets/textures/sprites/wheel.png'
        ]));
        
        var chrono = this.addChild('chrono', X.new(X.Chrono));
        chrono.addCheck(X.new(X.ChronoChecker, [2*32, 14*32, 4*32, 2*32]));//devra être un paramètre du circuit
        chrono.addCheck(X.new(X.ChronoChecker, [2*32, 2*32, 4*32, 4*32]));
        chrono.addCheck(X.new(X.ChronoChecker, [35*32, 2*32, 4*32, 4*32]));
        chrono.addCheck(X.new(X.ChronoChecker, [35*32, 9*32, 4*32, 4*32]));
        chrono.addCheck(X.new(X.ChronoChecker, [30*32, 9*32, 4*32, 4*32]));
        chrono.addCheck(X.new(X.ChronoChecker, [30*32, 23*32, 4*32, 4*32]));
        chrono.addCheck(X.new(X.ChronoChecker, [34*32, 23*32, 4*32, 4*32]));
        chrono.addCheck(X.new(X.ChronoChecker, [34*32, 27*32, 4*32, 4*32]));
        chrono.addCheck(X.new(X.ChronoChecker, [22*32, 27*32, 4*32, 4*32]));
        chrono.addCheck(X.new(X.ChronoChecker, [22*32, 8*32, 4*32, 4*32]));
        chrono.addCheck(X.new(X.ChronoChecker, [18*32, 8*32, 4*32, 4*32]));
        chrono.addCheck(X.new(X.ChronoChecker, [18*32, 27*32, 4*32, 4*32]));
        chrono.addCheck(X.new(X.ChronoChecker, [6*32, 27*32, 4*32, 4*32]));
        chrono.addCheck(X.new(X.ChronoChecker, [6*32, 21*32, 4*32, 4*32]));
        chrono.addCheck(X.new(X.ChronoChecker, [2*32, 21*32, 4*32, 4*32]));
        
//        if(X.Collision.dotInAABB(_(this, '#').childs['car_player'].getPosition(), )
    };
    
    X_object.prototype = X.extend(X.Node);
 
    return X.Scene = X_object;
};
