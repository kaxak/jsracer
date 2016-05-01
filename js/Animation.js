/*
Created : 26/04/2016
Authors : ROCHE Emmanuel, GINOT Gilles
Description :
    
*/

/* global include, X */
include('js/lib/tool/Time.js');
/* 

*/
X.Animation = function() {
    
    var _ = X.class.propertiesGetter();
    
    var X_object = function(protected, x, y, boundingBox, urlImage, sequences) {
        //* Initialise les propriétés
        _(this, protected);
        //* Appel le super contructeur 
        X.Shape.apply(this, [protected, x, y, boundingBox, urlImage]);
        
        /* Propriétés */
        
        _(this, '-').col = 0;
        _(this, '-').row = 0;
        _(this, '-').sequenceTimeStart = X.Time.getLastTime();
        _(this, '#').sequences = sequences;
        _(this, '-').reverse = false;
        _(this, '-').endSequence = false;
        _(this, '-').currentSequence = '';
        _(this, '-').rate = 1.0;
        
        this.onRender = function(ctx){
            var _image = _(this, '#').image;
            var _boundingBox = _(this, '#').boundingBox;

            ctx.globalAlpha = _(this, '#').opacity;
            ctx.drawImage(_image, //image
                _(this, '-').col * _boundingBox.w, _(this, '-').row * _boundingBox.h, //sx, sy
                _boundingBox.w, _boundingBox.h, //swidth, sheight
                _boundingBox.x, _boundingBox.y, //x, y
                _boundingBox.w, _boundingBox.h);//width, height
            ctx.globalAlpha = 1;

            if(X.Shape.drawBoudningBox){
                ctx.strokeStyle = 'rgba(255,0,0,1.0)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.rect(_boundingBox.x, _boundingBox.y, _boundingBox.w, _boundingBox.h);
                ctx.closePath();
                ctx.stroke();
            }
        };
        

    };
    /* Methodes */
    
    /* Private Methodes */
    var initSequence = function(name) {
        
        _(this, '-').endSequence = false;
        
        if(typeof _(this, '-').currentSequence === undefined || _(this, '-').currentSequence !== name) {
                _(this, '-').sequenceTimeStart = X.Time.getLastTime();
                _(this, '-').currentSequence = name;
        }
        
    };
    
    var startSequence = function() {
        var _sequence = _(this, '#').sequences[_(this, '-').currentSequence];
        
        if(_(this, '-').sequenceTimeStart === X.Time.getLastTime()) { 
            _(this, '-').col = _sequence.startCol;
            _(this, '-').row = _sequence.Row;
        }
    };
    
    var calculateFrame = function() {
        
        var _name = _(this, '-').currentSequence;
        
        if(Array.isArray(_(this, '#').sequences[_name].interval)) {
            calculateFrameFromArray.call(this);
        } 
        else if(_(this, '#').sequences[_name].interval) {
            calculateFrameIntervalFix.call(this);
        } 
        else{
            _(this, '-').currentInterval = 100 / _(this, '-').rate;
        }
        
    };
    
    var calculateFrameFromArray = function() {
        throw new Error('todo');
    };
    
    var calculateFrameIntervalFix = function() {
        var _sequence = _(this, '#').sequences[ _(this, '-').currentSequence];
        
        var timeElapsed = (X.Time.getLastTime() - _(this, '-').sequenceTimeStart);
        var realInterval = _sequence.interval / _(this, '-').rate;
        var _index = Math.floor(timeElapsed / realInterval) + _sequence.startCol;
        
        if(_index > _sequence.endCol){
            _(this, '-').endSequence = true;
            _(this, '-').col = _sequence.startCol;
        }
        else{
            _(this, '-').col = _index;
        }
    };
    
    var resetSequence = function() {
      _(this, '-').sequenceTimeStart = X.Time.getLastTime();
    };
    
    var stopSequence = function() {
        _(this, '-').endSequence = true;
    };
    
    var playSequence = function(name, loop, rate) {
        if(rate) _(this, '-').rate = rate;
        
        initSequence.call(this, name);
        
        startSequence.call(this);
        
        calculateFrame.call(this);
        
        if(_(this, '-').endSequence){
            resetSequence.call(this, name);
        }
    };
    
    X_object.prototype = X.extend(X.Shape);
    
    /* Public Methodes */
    X_object.prototype.play = function(name, rate) {
        
        playSequence.call(this, name, false, rate);
        
    };
    
    X_object.prototype.playLoop = function(name, rate) {
        
        playSequence.call(this, name, true, rate);
        
    };
    
    
    
    /* Accessors */
    
//    X_object.prototype.setReverse = function(value) {
//        _(this, '-').reverse = value;
//    };
//    
//    X_object.prototype.getReverse = function() {
//        return _(this, '-').reverse;
//    }; return _(this, '-').reverse;
    
    
    return X.Animation = X_object;
    
};

