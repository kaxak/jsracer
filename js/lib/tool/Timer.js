/*
Created : 23/02/2016
Authors : ROCHE Emmanuel
Description :
    Classe permettant de gérer une interval de temps
*/

/* global X */

X.Timer = function(milliseconds, once){
    var _lastExec = X.Time.getLastTime();
    var _step = milliseconds/1000;
    
    this.isElapsed = function(){
        var now = X.Time.getLastTime();
        var current = now - _lastExec;
        if(current > _step){
            _lastExec = now - current + _step;
            return true;
        }
        return false;
    };
};