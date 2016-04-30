/*
Created : 28/04/16
Authors : ROCHE Emmanuel
Description : CheckPoint du circuit pour le chronometrage de la voiture
    -
*/

/* global include, X, SAT */

include('js/Vector.js');
include('js/Node.js');
include('js/Timer.js');
include('js/Chrono.js');

include('js/lib/tool/Collision.js');
include('js/lib/tool/Time.js');

X.ChronoChecker = function () {
    
    var _ = X.class.propertiesGetter();
    
    var ChronoChecker = function(protected, x, y, w, h, tileSize) {
        //* Initialise les propriétés
        _(this, protected);
        //* Appel le super contructeur 
        X.Node.apply(this, [protected, new X.Vector(x*tileSize, y*tileSize), 0, new X.Vector(1, 1)]);
        
        /* Propriétés */
        _(this, '-').boundingBox = new X.Rect(new X.Vector(0, 0), w*tileSize || 0, h*tileSize || 0);
        _(this, '+').isDone = false;
        
        this.onRender = function(ctx){
            var bb = _(this, '-').boundingBox;

            if(ChronoChecker.showBox === true){
                var color;
                if(_(this, '#').name === 'chronoCheck0') color = 'rgba(0,255,0,1.0)';
                else if(_(this, '+').isDone) color = 'rgba(0,0,255,1.0)';
                else color = 'rgba(255,255,0,1.0)';
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.rect(bb.x,bb.y, bb.w, bb.h);
                ctx.closePath();
                ctx.stroke();
            }
        };
        
    };
    
    ChronoChecker.prototype = X.extend(X.Node);
    
    ChronoChecker.prototype.getBoundingBox = function(){
        return _(this, '-').boundingBox;
    };
    ChronoChecker.prototype.getBoxCollider = function(){
        return new X.Rect(this.gposition, _(this, '-').boundingBox.w, _(this, '-').boundingBox.h);
    };
    
    /* Static */
    ChronoChecker.getIndex = function(key){
        return parseInt(key.substring(11));
    };
    
    ChronoChecker.showBox = false;
    
    return X.ChronoChecker = ChronoChecker;
};

