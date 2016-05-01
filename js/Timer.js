/*
Created : 23/02/2016
Authors : ROCHE Emmanuel
Description :
    Classe permettant de gérer une interval de temps
*/

/* global X */

X.Timer = function(milliseconds, isLoop){
    var _lastExec = X.Time.getLastTime();
    var _step = milliseconds/1000;
    var _isLoop = isLoop || false;
    var _enum_state = {
        stopped:0,
        running:1
    };
    var _state = _enum_state.stopped;
    
    this.isElapsed = function(){
        //* Si on le Timer est à l'arrêt on retourne false
        if(_state === _enum_state.stopped) return false;
        
        
        var now = X.Time.getLastTime();
        var current = now - _lastExec;
        if(current >= _step){
            _lastExec = now - current + _step;
            if(_isLoop === false) _state = _enum_state.stopped;
            return true;
        }
        return false;
    };
    
    this.reset = function(){
        _lastExec = X.Time.getLastTime();
    };
    
    this.start = function(step){
        if(step) {
            step /= 1000;
            _step = step;
        }
        _state = _enum_state.running;
        this.reset();
    };
    
    this.stop = function(){
        _state = _enum_state.stopped;
    };
    
    this.isRunning = function(){
        return _state === _enum_state.running;
    };
};