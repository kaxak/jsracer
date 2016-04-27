/*
Created : 26/04/2016
Authors : ROCHE Emmanuel
Description : 
    Gère les roues d'une voiture

*/

/* global include, X, Howl */

include('js/Animation.js');

X.Wheel = function () {
    
    var _ = X.class.propertiesGetter();
    
    var X_object = function(protected, x, y, boundingBox, urlImage, directional) {
        //* Initialise les propriétés
        _(this, protected);
        //* Appel le super contructeur 
        X.Animation.apply(this, [protected, x, y, boundingBox, urlImage, {}]);
        
        /* Propriétés */
        _(this, '-').directional = directional;
        _(this, '#').sequences = {
            idle : { Row: 0, startCol: 0, endCol: 0, interval: 10 },
            moving : { Row: 0, startCol: 1, endCol: 6, interval: 10}
        };
        
        this.onUpdate = function(){
            if(_(this, '-').directional)
                this.setOrientation(
                    Math.PI/6 * (this.getParent().getDirection() / 
                    this.getParent().getDirectionMAX()));
            
            if(this.getParent().getVitesse() > 1) {
                this.playLoop('moving',  3 * this.getParent().getVitesse());
            }
            else {
                this.playLoop('idle',  1);
            }
        };
    };
    
    X_object.prototype = X.extend(X.Animation);
    
    return X.Wheel = X_object;
};

