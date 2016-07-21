/*
Created : 26/04/2016
Authors : GINOT Gilles, ROCHE Emmanuel
Description : creer un objet de type Ghost
    Au départ du tour on enregistre la position de la voiture "targetCar" toutes les
    20ms qu'on stock dans un tableau "records.current".
    A la fin du tour, si le temps est le meilleur on sauvegarde le record "records.current"
    dans le "records.best" qu'on va utiliser pour animer le ghost.
    
    Le ghost est géré via 3 évènnements :
        -onStart
        -onChronoBestLap
        -onChronoEndLap
    
Todo : 
    -récupérer l'orientation des roues avant
    -limité la taille du record

*/

/* global include, X, Howl, Blob, URL */

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
        
        _(this, '-').records = {};
        _(this, '-').records.current = [];
        _(this, '-').records.best = null;
        _(this, '-').targetCar = carPlayer;
        _(this, '-').startLapTime = 0;
        _(this, '-').currentLapTime = 0;
        _(this, '-').timer = new X.Timer(100, true);
        _(this, '-').lastPlayIndex = 0;
        _(this, '+').position = new X.Vector(40,40);
        _(this, '#').opacity = 0.0;
        _(this, '#').sounds.engine.stop();
        
        
        
        //* Appellé à chaque frame
        this.onUpdate = function() {
            //* Si le timer de 20ms est écoulé
            if(_(this, '-').timer.isElapsed()) {
                //* Sauvegarde de la position
                _saveTargetPosition.call(this);
            }
            _play.call(this);
        };

    };
    
    var _saveTargetPosition = function() {
        var actualPosition = _(this, '-').targetCar.position;
        var actualOrientation = _(this, '-').targetCar.orientation;
        var time = X.Time.getLastTime() - _(this, '-').startLapTime;
        
        var ghostFrame = { position : actualPosition,
                           orientation : actualOrientation,
                           time : time
                         };
                       
        _(this, '-').records.current.push(ghostFrame);
    };
    
    var _setBestRecord = function() {
        _(this, '-').records.best = _(this, '-').records.current;
    };
    
    var _resetCurrentRecord = function() {
        _(this, '-').records.current = [];
    };
    
    var _moveTo = function(){
        var record = _(this, '-').records.best;
        var i = _(this, '-').lastPlayIndex;
        i = Math.max(0,i-1);
        if(i in record){
            _interpolate.call(this, i);
        }
    };
    
    var _interpolate = function(i){
        var record = _(this, '-').records.best;
        if(i < record.length-1){
            var coef = (_(this, '-').currentLapTime - record[i].time) / (record[i+1].time - record[i].time);
            
            var direction =  record[i].position.Sub(record[i+1].position).Multiply(coef);
            _(this, '+').position.set(record[i].position.Add(direction));
            
            var orientation = (record[i+1].orientation - record[i].orientation) * coef;
            _(this, '+').setOrientation(record[i].orientation + orientation);
            return;
        }
        _(this, '+').position.set(record[i].position.x, record[i].position.y);
        _(this, '+').setOrientation(record[i].orientation);
    };
    
    var _play = function() {
        var record = _(this, '-').records.best;
        var i = _(this, '-').lastPlayIndex;
        
        if(_(this, '-').records.best === null || i >= record.length){
            _(this, '#').opacity = 0.0;
            return;
        }
        
        
        var currentTime = _(this, '-').currentLapTime = X.Time.getLastTime() - _(this, '-').startLapTime;
        while(i < record.length){
            if(record[i].time < currentTime){
                i++;
            }
            else{
                break;
            }
        }
        _(this, '-').lastPlayIndex = i;
        _moveTo.call(this);
        
    };
    
    var _prepareToExport = function(){
        var data = {
            lapTime: X.Chrono.BestLap,
            record:_(this, '-').records.best
        };
        var file = new Blob([JSON.stringify(data)], {type: 'application/json'});
        
        X.GUI.ghostManagerGui.export.HTMLElement.href = URL.createObjectURL(file);
        X.GUI.ghostManagerGui.export.HTMLElement.download = 'JSracer_ghost_'+ Date.now()+'.json';
    };
    
    X_object.prototype = X.extend(X.Car);
    
    X_object.prototype.onStart = function() {
        //console.log('onStart');
        _(this, '-').timer.start();
        _(this, '-').startLapTime = X.Time.getLastTime();
        _(this, '#').opacity = 0.3;
        _(this, '-').lastPlayIndex = 0;
    };
    
    
    X_object.prototype.onChronoBestLap = function() {
        //console.log('onChronoBestLap');
        //console.log(_(this, '-').records.current.length)
        _setBestRecord.call(this);
        _prepareToExport.call(this);
    };
    
    X_object.prototype.onChronoEndLap = function() {
        //console.log('onChronoEndLap');
        _resetCurrentRecord.call(this);
        _(this, '-').timer.reset();
        _(this, '-').startLapTime = X.Time.getLastTime();
        _(this, '#').opacity = 0.3;
        _(this, '-').lastPlayIndex = 0;
    };
    
     X_object.prototype.setBestRecord = function(record) {
         record.forEach(function(e, i, a){
             e.position = new X.Vector(e.position.x, e.position.y);
         });
         _(this, '-').records.best = record;
    };
 
    return X.Ghost = X_object;
};

