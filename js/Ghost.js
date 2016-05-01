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
    
    var X_object = function(protected, boundingBox, urlImageCar, urlImageWheel_L, urlImageWheel_R, carPlayer) {
        //* Initialise les propriétés
        _(this, protected);
        //* Appel le super contructeur 
        X.Car.apply(this, [protected, null, null, null, boundingBox, urlImageCar, urlImageWheel_L, urlImageWheel_R]);
        
        /* Propriétés */
        
        _(this, '-').ghostInstance = null;
        _(this, '-').ghostTempInstance = [];
        _(this, '-').targetCar = carPlayer;
        _(this, '-').timer = new X.Timer(50, true);
        _(this, '-').playBackTick = 0;
        _(this, '-').outOfBound = new X.Vector(-20,-20);
        
        _(this, '#').opacity = 0.5;
        this.position = _(this, '-').outOfBound;
        
        this.onUpdate = function() {
            
            if(_(this, '-').timer.isElapsed()) {
                
                _recordGhost.call(this);
                
                if(_(this, '-').ghostInstance) {
                    
                    _playGhost.call(this);
                
                } 
            }
        };

    };
    
    var _recordGhost = function() {
        
        var actualPosition = _(this, '-').targetCar.position;
        var actualOrientation = _(this, '-').targetCar.orientation;
        var actualDirection = _(this, '-').targetCar.direction;
        var actualSpeed = _(this, '-').targetCar.speed;
        
        var ghostFrame = { position : actualPosition, 
                           orientation : actualOrientation, 
                           direction : actualDirection,
                           speed : actualSpeed};
                       
        _(this, '-').ghostTempInstance.push(ghostFrame);
    };
    
    var _createNewGhost = function() {
        
        _(this, '-').ghostInstance = JSON.stringify(_(this, '-').ghostTempInstance);
    };
    
    var _deleteGhostFrames = function() {
        
        _(this, '-').ghostTempInstance.length = 0;
    };
    
    var _playGhost = function() {
        
        var ghost = JSON.parse(_(this, '-').ghostInstance);
        
        if(_(this, '-').playBackTick <= ghost.length - 1) {

            this.position = ghost[_(this, '-').playBackTick].position;
            this.orientation = ghost[_(this, '-').playBackTick].orientation;
            this.direction = ghost[_(this, '-').playBackTick].direction;
            this.speed = ghost[_(this, '-').playBackTick].speed;
            
            _(this, '-').playBackTick++;
            
        } 
        else this.position = _(this, '-').outOfBound;
    };
    
    X_object.prototype = X.extend(X.Car);
    
    X_object.prototype.onStart = function() {
        
        _(this, '-').timer.start();
        
    };
    
    
    X_object.prototype.onChronoBestLap = function() {
        
        _createNewGhost.call(this);
        
    };
    
    X_object.prototype.onChronoEndLap = function() {
        
        _deleteGhostFrames.call(this);
        _(this, '-').timer.reset;
        _(this, '-').playBackTick = 0;
    };
 
    return X.Ghost = X_object;
};

