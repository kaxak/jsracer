/*
Created : 15/04/16
Authors : ROCHE Emmanuel
Description : Gère le chronomètrage de la voiture
*/

/* global include, X, SAT */

include('js/Vector.js');
include('js/Node.js');

include('js/lib/tool/Collision.js');

X.ChronoChecker = function () {
    
    var _ = X.class.propertiesGetter();
    
    var ChronoChecker = function(protected, x, y, w, h) {
        //* Initialise les propriétés
        _(this, protected);
        //* Appel le super contructeur 
        X.Node.apply(this, [protected, new X.Vector(x, y), 0, new X.Vector(1, 1)]);
        
        /* Propriétés */
        _(this, '-').boundingBox = new X.Rect(new X.Vector(0, 0), w || 0, h || 0);
        _(this, '-').isDone = false;
        
        this.onRender = function(ctx){
//            var _boundingBox = _boundingBox;

            if(true){
                ctx.strokeStyle = (_(this, '-').isDone )?'rgba(0,0,255,1.0)':'rgba(255,255,0,1.0)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.rect(_(this, '-').boundingBox.x, _(this, '-').boundingBox.y, _(this, '-').boundingBox.w, _(this, '-').boundingBox.h);
                ctx.closePath();
                ctx.stroke();
            }
        };
        
    };
    //var ctor = X.class.get(X.Node);
    ChronoChecker.prototype = X.extend(X.Node);
    
    ChronoChecker.prototype.getBoundingBox = function(){
        return _(this, '-').boundingBox;
    };
    ChronoChecker.prototype.getBoxCollider = function(){
        return new X.Rect(this.getGlobalPosition(), _(this, '-').boundingBox.w, _(this, '-').boundingBox.h);
    };
    
    ChronoChecker.prototype.done = function(){
        _(this, '-').isDone = true;
    };
    
    ChronoChecker.prototype.reset = function(){
        _(this, '-').isDone = false;
    };
    
    return X.ChronoChecker = ChronoChecker;
};

X.Chrono = function () {
    
    var _ = X.class.propertiesGetter();
    
    var Chrono = function(protected) {
        //* Initialise les propriétés
        _(this, protected);
        //* Appel le super contructeur 
        X.Node.apply(this, [protected, new X.Vector(0, 0), 0, new X.Vector(1, 1)]);
        
        /* Propriétés */
        _(this, '-').checks = [];
        
        this.onUpdate = function(){
            var _carPosition = this.getRoot().getChilds()['car_player'].getPosition();
            var _childs = _(this, '#').childs;
            for(var key in _childs){
                //_childs[key].update();
                if(X.Collision.dotInAABB(_carPosition, _childs[key].getBoxCollider())){
                    _childs[key].done();
                    if(key === 'chronoCheck0'){
                        this.reset();
                    }
                }
            }
        };
        
    };
    Chrono.prototype = X.extend(X.Node);
    
    Chrono.prototype.addCheck = function(chronoChecker){
        if(chronoChecker instanceof X.ChronoChecker)
            //_(this, '-').checks.push(chronoChecker);
            this.addChild('chronoCheck'+(Object.keys(this.getChilds()).length), chronoChecker);
        else
            throw new Error('X.Chrono.addCheck : argument 1 is not a X.ChronoChecker!');
    };
    
    Chrono.prototype.reset = function(){
        var _childs = this.getChilds();
        for(var key in _childs){
            _childs[key].reset();
        }
    };
    
    
    return X.Chrono = Chrono;
};
