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
        _(this, '-').timer = new X.Timer(1000);
        
        _(this, '#').opacity = 0.6;
        
        this.onUpdate = function(){
            
            
            if(_(this, '-').timer.isElapsed()) {
                _recordGhost.call(this);
                ;
            }
            
            if(_(this, '-').ghostTempInstance[10]) {
                console.log(_(this, '-').ghostTempInstance[10].position.x);
            }
            
            
            
        };
        
        X.eventManager.addEventListener("chrono-best-lap", function(){
            
            _createNewGhost.call(this);

        });
        
        X.eventManager.addEventListener("chrono-end-lap", function(){
            
            _deleteGhostFrames.call(this);

        });    

    };
    
    var _recordGhost = function() {
        var actualPosition = _(this, '-').targetCar.position;
        var actualOrientation = _(this, '-').targetCar.orientation;
        var ghostFrame = { position : actualPosition, orientation : actualOrientation};
        _(this, '-').ghostTempInstance.push(ghostFrame);
    };
    
    var _createNewGhost = function() {
        _(this, '-').ghostInstance = _(this, '-').ghostTempInstance;
    };
    
    var _deleteGhostFrames = function() {
        _(this, '-').ghostTempInstance.length = 0;
    };
    
    
    
    X_object.prototype = X.extend(X.Car);
    
 
    return X.Ghost = X_object;
};

