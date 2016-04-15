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
    
    var X_object = function(protected, nom, url) {
        //* Initialise les propriétés
        _(this, protected);
        
        //* Appel le super contructeur 
        X.Node.apply(this, [protected, new X.Vector(0, 0), 0, new X.Vector(1, 1)]);
        
        /* Propriétés */
	_(this, '+').url = url;
	_(this, '+').nom = nom;
	_(this, '+').terrain = this.nom;
	_(this, '+').tileset = new X.Tiles(this.url);
        
        this.onRender = function(context) {
		//console.info('[Info] dans function dessiner map')
		for(var i = 0, l = Maps.course1.length ; i < l ; i++) {
			var ligne = Maps.course1[i];
			//console.log('ligne'+ ligne);
			//console.info('[Info] dans 1er for dessiner map')
			//console.log('ligne longueur '+ ligne.length);
			var y = i * 32;
			for(var j = 0, k = ligne.length ; j < k ; j++) {
				//console.info('[Info] dans 2eme for dessiner map')
				this.tileset.drawTile(ligne[j], context, j * 32, y);
				//console.info('[Info] dessiner tile dans dessiner map')
			}
		}

	};
    };
    
    X_object.prototype = X.extend(X.Node);
    
    return X.TileMap = X_object;
};