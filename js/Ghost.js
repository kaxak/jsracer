/*
Created : 
Authors : TORRES Julien, GINOT Gilles, ROCHE Emmanuel
Description : creer un objet de type Car

*/

/* global include, X, Howl */

include('js/Node.js');
include('js/Shape.js');
include('js/Vector.js');
include('js/Rect.js');
include('js/lib/tool/Screen.js');
include('js/Wheel.js');


X.Ghost = function () {
    
    var _ = X.class.propertiesGetter();
    
    var X_object = function(protected, x, y, orientation, boundingBox, urlImageCar, urlImageWheel_L, urlImageWheel_R, carPlayer) {
        //* Initialise les propriétés
        _(this, protected);
        //* Appel le super contructeur 
        X.Car.apply(this, [protected, x, y, orientation, boundingBox, urlImageCar, urlImageWheel_L, urlImageWheel_R]);
        //this.setOrientation(orientation);
        /* Propriétés */
        
        /* direction */
        
        _(this, '-').ghostInstance = null;
        _(this, '-').ghostTempInstance = [];
        _(this, '-').targetCar = carPlayer;
        _(this, '-').isPlayingGhost = false;
        _(this, '-').timer = new X.Timer(50);
        _(this, '-').playerTick = 0;
        
        _(this, '#').opacity = 0.6;
        
        this.onUpdate = function(){
            
            
            if(_(this, '-').timer.isElapsed()) {
                console.log(_(this, '-').playerTick);
                _recordGhost.call(this);
                
                if(_(this, '-').ghostInstance) {
                    var ghost = JSON.parse(_(this, '-').ghostInstance);
                    if(_(this, '-').playerTick <= ghost.length - 1) {
                        
                        this.position = ghost[_(this, '-').playerTick].position;
                        this.orientation = ghost[_(this, '-').playerTick].orientation;
                        _(this, '-').playerTick++;
                    }
                    
                    
                
                } 
                
            }
            
        };

    };
    
    var _recordGhost = function() {
        var actualPosition = _(this, '-').targetCar.position;
        var actualOrientation = _(this, '-').targetCar.orientation;
        var ghostFrame = { position : actualPosition, orientation : actualOrientation};
        _(this, '-').ghostTempInstance.push(ghostFrame);
    };
    
    var _createNewGhost = function() {
        _(this, '-').ghostInstance = JSON.stringify(_(this, '-').ghostTempInstance);
    };
    
    var _deleteGhostFrames = function() {
        _(this, '-').ghostTempInstance.length = 0;
    };
    
    
    
    X_object.prototype = X.extend(X.Car);
    
    X_object.prototype.onStart = function() {
        _(this, '-').timer.reset;
        _deleteGhostFrames.call(this);
    };
    
    
    X_object.prototype.onChronoBestLap = function() {
        _createNewGhost.call(this);
        //console.log('new ghost !');
    };
    
    X_object.prototype.onChronoEndLap = function() {
        //console.log(_(this, '-').ghostTempInstance.length+' dans le ghost temp');
        //console.log(_(this, '-').ghostInstance.length+' dans le ghost');
        _deleteGhostFrames.call(this);
        _(this, '-').timer.reset;
        _(this, '-').playerTick = 0;
    };
 
    return X.Ghost = X_object;
};

