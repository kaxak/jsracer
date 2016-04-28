/*
Created : 23/02/2016
Authors : ROCHE Emmanuel, DELANNOY Sabrina
Description : Class TileMap
    
*/

/* global include, X, Maps */

include('js/Node.js');
include('js/Vector.js');
include('js/Rect.js');
include('js/TileSet.js');

X.TileMap = function () {
    
    var _ = X.class.propertiesGetter();
    
    var X_object = function(protected, map) {
        //* Initialise les propriétés
        _(this, protected);
        
        //* Appel le super contructeur 
        X.Node.apply(this, [protected, new X.Vector(0, 0), 0, new X.Vector(1, 1)]);
        
        /* Propriétés */
	_(this, '-').map = map;
        _(this, '-').lineLength = Math.floor(_(this, '-').map.width/_(this, '-').map.tileSize);
	_(this, '-').tileSet = X.new(X.TileSet, [_(this, '-').map.tileSize, map.tileSet]);
        
        this.onRender = function(ctx) {
            var x,y,srcPosition;
            var tileSize = _(this, '-').map.tileSize;
            for(var i = 0; i < _(this, '-').map.tileMap.length; i++) {
                y = Math.floor(i/_(this, '-').lineLength) * tileSize;
                x = Math.floor(i%_(this, '-').lineLength) * tileSize;
                
                srcPosition = _(this, '-').tileSet.getSourcePositionOfIndex(_(this, '-').map.tileMap[i]-1);
                
                ctx.drawImage(_(this, '-').tileSet.getImage(), 
                        srcPosition.sx, srcPosition.sy, tileSize, tileSize, 
                        x, y, tileSize, tileSize);
            }

	};
    };
    
    var getTileIndexAtPosition = function(position){
        var ix = Math.floor(_(this, '-').lineLength / position.x);
        var iy = Math.floor(_(this, '-').lineLength / position.y);
        return iy * _(this, '-').lineLength + ix;
    };
    
    X_object.prototype = X.extend(X.Node);
    
    X_object.prototype.getTileSize = function(){
        return _(this, '-').map.tileSize;
    };
    
    X_object.prototype.loadMap = function(map){
        _(this, '-').map = map;
        _(this, '-').lineLength = Math.floor(_(this, '-').map.width/_(this, '-').map.tileSize);
	_(this, '-').tileSet = X.new(X.TileSet, [_(this, '-').map.tileSize, map.tileSet]);
    };
    
    X_object.prototype.getTypeAtPosition = function(position){
        var tileIndex = _(this, '-').map.tileMap[getTileIndexAtPosition.call(this, position)];
        for(var key in _(this, '-').map.tileType){
            if(tileIndex in _(this, '-').map.tileType[key]) return key;
        }
    };
    
    return X.TileMap = X_object;
};