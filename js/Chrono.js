/*
Created : 15/04/16
Authors : ROCHE Emmanuel
Description : Gère le chronomètrage de la voiture
TODO:
    -
*/

/* global include, X, SAT */

include('js/Vector.js');
include('js/Node.js');

include('js/lib/tool/Collision.js');
include('js/lib/tool/GUI.js');

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

            if(true){
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
    //var ctor = X.class.get(X.Node);
    ChronoChecker.prototype = X.extend(X.Node);
    
    ChronoChecker.prototype.getBoundingBox = function(){
        return _(this, '-').boundingBox;
    };
    ChronoChecker.prototype.getBoxCollider = function(){
        return new X.Rect(this.getGlobalPosition(), _(this, '-').boundingBox.w, _(this, '-').boundingBox.h);
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
        _(this, '-').state = 0;//0 off, 1 starting, 2 started
        _(this, '-').timeZero = null;
        
        _(this, '-').timerGui = new X.Timer(32);
        _(this, '-').isHintHidden = false;
        
        this.onUpdate = function(){
            if(_(this, '-').timerGui.test() && _(this, '-').timeZero !== null){
                X.GUI.chrono.setText('Chronomètre<br />' + X.Time.format(getTime.call(this)));
                
            }
            
            
            var _carPosition = this.getRoot().getChilds()['car_player'].getPosition();
            var _childs = _(this, '#').childs;
            for(var key in _childs){
                //_childs[key].update();
                if(X.Collision.dotInAABB(_carPosition, _childs[key].getBoxCollider())){
                    //* Ligne d'arrivée
                    if(key === 'chronoCheck0'){
                        //* Si on commence ou qu'on passe la ligne on démarre le chrono
                        if(_(this, '-').state === 0 || _(this, '-').state === 2){
                            chronoEnd.call(this);
                            chronoStart.call(this);
                        }
                        else{
                            
                        }
                        
                    }
                    //* Autres point de passage
                    else if(!_childs[key].isDone && _(this, '-').state !== 0){
                        if(_(this, '-').state === 1) _(this, '-').state = 2;
                        _childs[key].isDone = true;
                    }
                }
            }
        };
        
    };
    
    var chronoStart = function(){
        //* Cache le hint de dépard si besoin
        if(!_(this, '-').isHintHidden && _(this, '-').state !== 0){
            _(this, '-').isHintHidden = true;
            X.GUI.hint.hide();
        }
        
        _(this, '-').state = 1;
        this.reset();
        _(this, '-').timeZero = +new Date();
        
        
    };
    
    var getTime = function(){
        return +new Date() - _(this, '-').timeZero;
    };
    
    var chronoEnd = function(){
        X.GUI.bestTime.setText('Meilleur temps<br />' + X.Time.format(getTime.call(this)));
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
            _childs[key].isDone = false;
        }
    };
    
    
    return X.Chrono = Chrono;
};
