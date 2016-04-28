/*
Created : 23/02/2016
Authors : ROCHE Emmanuel, DELANNOY Sabrina
Description : Class TileSet
    
*/

/* global include, X */
    
X.TileSet = function () {
    
    var _ = X.class.propertiesGetter();
    
    var X_object = function(protected, tileSize, imageUrl) {
        //* Initialise les propriétés
        _(this, protected);
        
        /* Propriétés */
        _(this, '-').tileSize = tileSize;
        _(this, '-').image = new Image();
        _(this, '-').image.src = imageUrl;
    };
    
    X_object.prototype.getSourcePositionOfIndex = function(tileIndex){
        var sx = tileIndex * _(this, '-').tileSize % _(this, '-').image.width;
        var sy = Math.floor((tileIndex * _(this, '-').tileSize / _(this, '-').image.width)) * _(this, '-').tileSize;
        
        return {sx:sx, sy:sy};
    };
    
    X_object.prototype.getImage = function(){
        return _(this, '-').image;
    };
    
    return X.TileSet = X_object;
};

    
