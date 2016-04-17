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

            if(false){
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
    
    
    ChronoChecker.getIndex = function(key){
        return parseInt(key.substring(11));
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
        _(this, '-').bestTime = null;
        _(this, '-').checkerCount = 0;
        
        _(this, '-').timerGui = new X.Timer(64);
        _(this, '-').isHintHidden = false;
        
        this.onUpdate = function(){
            //* Met à jour le chronomètre GUI toutes les 32 milliseconds via le Timer
            if(_(this, '-').timerGui.test() && _(this, '-').timeZero !== null){
                X.GUI.chrono.setText('Chronomètre<br />' + X.Time.format(getTime.call(this)));
            }
            
            var _carPosition = this.getRoot().getChilds()['car_player'].getPosition();
            var _childs = _(this, '#').childs;
            //* Pour chaque ChronoChecker on test si la voiture est en collision avec
            for(var key in _childs){
                if(X.Collision.dotInAABB(_carPosition, _childs[key].getBoxCollider())){
                    //* Ligne d'arrivée
                    if(key === 'chronoCheck0'){
                        //* Si on commence ou qu'on passe la ligne on démarre le chrono
                        if(_(this, '-').state === 0 || _(this, '-').state === 2){
                            if(_(this, '-').state !== 0)
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
                        testForPenalty.call(this, X.ChronoChecker.getIndex(key));
                    }
                    return;
                }
            }
        };
        
    };
    
    var chronoStart = function(){
        _(this, '-').state = 1;
        this.reset();
        _(this, '-').timeZero = +new Date();
        
        //* Cache le hint de dépard si besoin
        if(!_(this, '-').isHintHidden){
            _(this, '-').isHintHidden = true;
            X.GUI.hint.hide();
        }
    };
    
    var getTime = function(){
        return +new Date() - _(this, '-').timeZero;
    };
    
    var chronoEnd = function(){
        testForPenalty.call(this, _(this, '-').checkerCount);
        var time = getTime.call(this);
        var formatedTime = X.Time.format(time);
        X.GUI.lastTime.setText('Dernier temps<br />' + formatedTime);
        if(_(this, '-').bestTime === null || _(this, '-').bestTime > time){
            X.GUI.bestTime.setText('Meilleur temps<br />' + formatedTime);
            X.GUI.hint.setText(
                    'Record battu : +'+formatedTime,
                    'rgb(0,220,0)'
            );
            X.GUI.hint.show(2000);
            _(this, '-').bestTime = time;
        }
            
    };
    
    var testForPenalty = function(index){
        var i = index-1;
        var _childs = this.getChilds();
        var current = _childs['chronoCheck'+i];
        var totalPenality = 0;
        while( i > 0 && !current.isDone){
            current.isDone = true;
            totalPenality += 2000;
            --i;
            current = _childs['chronoCheck'+i];
        }
        if(totalPenality > 0){
            X.GUI.hint.setText(
                    'Pénalité pour avoir coupé : +'+(totalPenality/1000)+'secondes!',
                    'red'
            );
            X.GUI.hint.show(2000);
            _(this, '-').timeZero -= totalPenality;
        }
    };
    
    Chrono.prototype = X.extend(X.Node);
    
    Chrono.prototype.addCheck = function(chronoChecker){
        if(chronoChecker instanceof X.ChronoChecker){
            this.addChild('chronoCheck'+(Object.keys(this.getChilds()).length), chronoChecker);
            _(this, '-').checkerCount++;
        }
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
