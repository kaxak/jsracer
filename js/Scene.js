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
        
        var controled_shape = this.addChild('controled_shape', X.new(X.Car,[
            X.Screen.width/2, X.Screen.height/2,
            new X.Rect(new X.Vector(-20/2, -44/4*3), 20, 44),
            'assets/textures/sprites/carrosserie.png',
            'assets/textures/sprites/wheel.png'
        ]));
    };
    
    X_object.prototype = X.class.get(X.Node).prototype;
    
    
 
    return X.Scene = X_object;
};
/*
 * this.onUpdate = function(){
            var b = controled_shape.getBoundingBox();
            var p = controled_shape.position;
            controled_shape.boxCollider = new SAT.Box(new SAT.Vector(p.x, p.y), b.w, b.h).toPolygon();
            controled_shape.boxCollider.setOffset(b.getPosition());
            controled_shape.boxCollider.setAngle(controled_shape.orientation);

            b = fixed_shape.getBoundingBox();
            p = fixed_shape.position;
            fixed_shape.boxCollider = new SAT.Box(new SAT.Vector(p.x, p.y), b.w, b.h).toPolygon();
            fixed_shape.boxCollider.setOffset(b.getPosition());
            fixed_shape.boxCollider.setAngle(fixed_shape.orientation);

            var result = new SAT.Response();
            if(SAT.testPolygonPolygon(controled_shape.boxCollider, fixed_shape.boxCollider, result)){
                controled_shape.index = 1;
                fixed_shape.index = 1;
            }
            else{
                controled_shape.index = 0;
                fixed_shape.index = 0;
            }
        };
        
 */