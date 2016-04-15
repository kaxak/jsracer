/*
Created : 23/02/2016
Authors : ROCHE Emmanuel, DELANNOY Sabrina
Description : Class Tiles
    
*/

/*
*/


/* global include, X */
    
   
X.Tiles = function(url){
        
    /* Properties */
	var sizeTile; 	// taille du tile
	var url;		// chemin du tileset
	var propriete;	// propriete des tiles
	var id;			// id de la tile

	this.sizeTile = 32;
	this.url = url;

	// charge l'image du tileset demandé
	this.image = new Image();
	this.image.src = url;

	this.image.referenceDuTileset = this;
	this.image.onload = function() {
        //console.log(this);
		if(!this.complete) 
			throw new Error("Erreur de chargement du tileset nommé \"" + url + "\".");
		this.referenceDuTileset.largeur = this.width / 32;
		//console.info('[Info] chargement tileset')
	}

	this.drawTile = function(numero, context, xDestination, yDestination) {
		var xSourceEnTiles = numero % this.largeur;
		if(xSourceEnTiles == 0) xSourceEnTiles = this.largeur;

		var ySourceEnTiles = Math.ceil(numero / this.largeur);

		var xSource = (xSourceEnTiles - 1) * 32;
		var ySource = (ySourceEnTiles - 1) * 32;
		//console.log('numero = '+ numero, ' , xDestination = '+ xDestination, ' , xDestination = ' + yDestination);
		context.drawImage(this.image, xSource, ySource, 32, 32, xDestination, yDestination, 32, 32);
		
	}
}
    
