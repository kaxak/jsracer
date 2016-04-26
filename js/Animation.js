/*
Created : 
Authors : ROCHE Emmanuel, TORRES Julien, GINOT Gilles, DELANNOY Sabrina, PAOLI Jérôme
Description :
    
*/

/* global include, X */
include('js/lib/tool/Time.js');
/* 

*/
X.Animation = function() {
    
    var _ = X.class.propertiesGetter();
    
    var X_object = function(protected, spriteUrl, sequences, options, intervalPattern) {
        //* Initialise les propriétés
        _(this, protected);
        
        /* Propriétés */
        
        _(this, '-').col = 0;
        _(this, '-').row = 0;
        _(this, '-').tickCount = 0;
        _(this, '-').SequenceTimeElapse = 0;
        _(this, '-').sprite = new Image();
        _(this, '-').sprite.src = spriteUrl;
        _(this, '-').options = options;
        _(this, '-').sequences = sequences;
        _(this, '-').reverse = false;
        _(this, '-').endSequence = false;
        _(this, '-').currentSequence = '';
        _(this, '-').currentInterval = 0;
        _(this, '-').intervalPattern = intervalPattern;
        

    };
    /* Methodes */
    
    /* Private Methodes */
    var initSequence = function(Name) {
        
        _(this, '-').endSequence = false;
        
        if(typeof _(this, '-').currentSequence === undefined || _(this, '-').currentSequence !== Name) {
                _(this, '-').SequenceTimeElapse = 0;
                _(this, '-').currentSequence = Name;
        }
        
    };
    
    var startSequence = function(Name) {
        
        if(_(this, '-').SequenceTimeElapse === 0) { 
                _(this, '-').col = _(this, '-').sequences[Name].startCol;
            }
            
        _(this, '-').SequenceTimeElapse += X.Time.getDelta();
        
        _(this, '-').row = _(this, '-').sequences[Name].Row;
            
        _(this, '-').tickCount +=  X.Time.getDelta();
        
    };
    
    var rebootTickCount = function() {
        _(this, '-').tickCount = 0;
    };
    
    var initFramerate = function(Name, value) {
        
        var coef = value || 1;
        
        if(_(this, '-').intervalPattern && _(this, '-').intervalPattern[Name]) {
            
            _(this, '-').currentInterval = _(this, '-').intervalPattern[Name][_(this, '-').col] / coef;
        } 
        else if(_(this, '-').sequences[Name].interval) {
            
            _(this, '-').currentInterval = _(this, '-').sequences[Name].interval / coef;
        } 
        else _(this, '-').currentInterval = 100 / coef;
        
    };
    
    var goNextFrame = function() {
        _(this, '-').col++;
    };
    
    var resetSequence = function(Name) {
      _(this, '-').col = _(this, '-').sequences[Name].startCol;  
    };
    
    var stopSequence = function() {
        _(this, '-').SequenceTimeElapse = 0;
        _(this, '-').endSequence = true;
    };
    
    var playSequence = function(Name, Coef, loop) {
        
        initSequence.call(this, Name);
        
        startSequence.call(this, Name);
        
        initFramerate.call(this, Name, Coef);
        
        if(_(this, '-').tickCount > _(this, '-').currentInterval) {
            
            rebootTickCount.call(this);
            
            if(_(this, '-').col < _(this, '-').sequences[Name].endCol) {
                
                goNextFrame.call(this);
                
            }
            else if(loop) {
                
                resetSequence.call(this, Name);
                
            }
            else {
                
                stopSequence.call(this);
                
            }
        }
    };
    
    /* Public Methodes */
    X_object.prototype.play = function(Name, Coef) {
        
        playSequence.call(this, Name, Coef, false);
        
    };
    
    X_object.prototype.playLoop = function(Name, Coef) {
        
        playSequence.call(this, Name, Coef, true);
        
    };
    
    
    X_object.prototype.draw = function(ctx, x, y) {
        
        if(_(this, '-').reverse) {
            ctx.scale(-1, 1);
        }
        
        ctx.drawImage(
            _(this, '-').sprite, 
            _(this, '-').col * _(this, '-').options.frameW , 
            _(this, '-').row * _(this, '-').options.frameH,
            _(this, '-').options.frameW, 
            _(this, '-').options.frameH, 
            x , 
            y , 
            _(this, '-').options.frameW, 
            _(this, '-').options.frameH );
    };
    
    /* Accessors */
    X_object.prototype.getFrameW = function() {
        return _(this, '-').options.frameW;
    };
    
    X_object.prototype.setReverse = function(value) {
        _(this, '-').reverse = value;
    };
    
    X_object.prototype.getReverse = function() {
        return _(this, '-').reverse;
    };
    
    X_object.prototype.getSequenceTimeElapse = function() {
        return _(this, '-').SequenceTimeElapse;
    };
    
    X_object.prototype.getEndSequence = function() {
        return _(this, '-').endSequence;
    };
    
    X_object.prototype.setEndSequence = function(value) {
        _(this, '-').endSequence = value;
    };
    
    X_object.prototype.getSequences = function() {
        return _(this, '-').sequences;
    };
    
    return X.Animation = X_object;
    
};


