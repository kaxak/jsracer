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
include('js/Timer.js');
include('js/ChronoChecker.js');

include('js/lib/tool/Time.js');

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
        
        _(this, '-').timerGui = new X.Timer(30, true);
        _(this, '-').timerGui.start();
        _(this, '-').isHintHidden = false;
        
        _(this, '-').nbLap = 0;
        
        
        _(this, '-').listeners = {
                EndLap:[],
                BestLap:[],
                FirstLap:[]
        };
        
        this.onUpdate = function(){
            //* Met à jour le chronomètre GUI à chaque tic du timer
            if(_(this, '-').timerGui.isElapsed() && _(this, '-').timeZero !== null){
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
                            if(_(this, '-').state !== 0){
                                chronoEnd.call(this);
                                sendEvents.call(this, 'EndLap');
                            }
                            chronoStart.call(this);
                            _(this, '-').nbLap++;
                            if(_(this, '-').nbLap === 1) {
                               sendEvents.call(this, 'FirstLap');
                            }
                            
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
        _(this, '-').timeZero = X.Time.getLastTime();
        
        //* Cache le hint de dépard si besoin
        if(!_(this, '-').isHintHidden){
            _(this, '-').isHintHidden = true;
            X.GUI.hint.hide();
        }
    };
    
    var getTime = function(){
        return X.Time.getLastTime() - _(this, '-').timeZero;
    };
    
    var chronoEnd = function(){
        testForPenalty.call(this, _(this, '-').checkerCount);
        var time = getTime.call(this);
        var formatedTime = X.Time.format(time);
        X.GUI.lastTime.setText('Dernier temps<br />' + formatedTime);
        if(_(this, '-').bestTime === null || _(this, '-').bestTime > time){
            X.GUI.bestTime.setText('Meilleur temps<br />' + formatedTime);
            X.GUI.hint.setText(
                    'currentRecord battu : +'+formatedTime,
                    'rgb(0,220,0)'
            );
            X.GUI.hint.show(2000);
            _(this, '-').bestTime = time;
            Chrono.BestLap = time;
            
            sendEvents.call(this, 'BestLap');
        }
            
    };
    
    var testForPenalty = function(index){
        var i = index-1;
        var _childs = this.getChilds();
        var current = _childs['chronoCheck'+i];
        var totalPenality = 0;
        while( i > 0 && !current.isDone){
            current.isDone = true;
            totalPenality += 1;
            --i;
            current = _childs['chronoCheck'+i];
        }
        if(totalPenality > 0){
            X.GUI.hint.setText(
                    'Pénalité pour avoir coupé : +'+(totalPenality)+'secondes!',
                    'red'
            );
            X.GUI.hint.show(2000);
            _(this, '-').timeZero -= totalPenality;
        }
    };
    
    var sendEvents = function(eventType){
        _(this, '-').listeners[eventType].forEach(function(e, i, a){
            e.callback.call(e.object);
        });
        
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
    
    Chrono.prototype.addEventListener = function(eventType, callback, listener){
        listener = listener || {};
        //* Si l'évènnement existe
        if(Object.keys(_(this, '-').listeners).includes(eventType)){
            //* Si le callback est bien une fonction
            if(callback || typeof callback === 'function'){
                _(this, '-').listeners[eventType].push({object:listener, callback:callback});
            }
            else{
                throw new Error('X.Chrono.addEventListener: callBack argument is not a function!');
            }
        }
        else{
            throw new Error('X.Chrono.addEventListener: eventType : '+eventType+' not found!');
        }
    };
    
    Chrono.prototype.setBestLap = function(time){
        var formatedTime = X.Time.format(time);
        _(this, '-').bestTime = time;
        X.GUI.bestTime.setText('Meilleur temps<br />' + formatedTime);
        Chrono.BestLap = time;
    };
    
    Chrono.BestLap = 0;
    
    return X.Chrono = Chrono;
};
