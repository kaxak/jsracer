/*
Created : 23/02/2016
Authors : ROCHE Emmanuel, DELANNOY Sabrina
Description : Class TileMap
    
*/

/* global include, X, Maps */

include('js/Node.js');
include('js/Vector.js');
include('js/Rect.js');
include('js/Tile.js');

X.TileMap = function () {
    
    var _ = X.class.propertiesGetter();
    
    var X_object = function(protected, tileSize, tileSetURL) {
        //* Initialise les propriétés
        _(this, protected);
        
        //* Appel le super contructeur 
        X.Node.apply(this, [protected, new X.Vector(0, 0), 0, new X.Vector(1, 1)]);
        
        /* Propriétés */
	_(this, '-').tileSize = tileSize;
        _(this, '-').lineLength = ~~(X.Screen.width/tileSize);
	_(this, '-').tileSet = new X.Tiles(tileSetURL);
        
        this.onRender = function(context) {
            for(var i = 0; i < Maps.course1.length; i++) {
                var y = ~~(i/_(this, '-').lineLength);
                var x = ~~(i%_(this, '-').lineLength);
                _(this, '-').tileSet.drawTile(
                        Maps.course1[i], 
                context, 
                x * _(this, '-').tileSize, y * _(this, '-').tileSize);
            }

	};
    };
    
    X_object.prototype = X.extend(X.Node);
    
    X_object.prototype.getTileSize = function(){
        return _(this, '-').tileSize;
    };
    
    return X.TileMap = X_object;
};