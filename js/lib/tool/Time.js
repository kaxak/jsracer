/*
Created : 23/02/2016
Authors : GINOT Gilles, ROCHE Emmanuel
Description :
    Classe servant à definir :
        -le Delta à chaque rafraîchissement.
        -connaitre le temps écoulé depuis le lancement du jeu.
*/

/* global X */

X.Time = new function() {
    /* Properties */
    var _delta;
    var _lastTime = 0;
    var _start; 
    var _compteur;
    /* Méthodes */
    
    
    /* Accessors */
    this.getDelta = function() {
        return _delta;
    };
    
    this.getLastTime = function() {
        return _lastTime;
    };
    
    this.update = function(timeStamp) {
//        var now = +new Date();
        _delta = (timeStamp - _lastTime)/1000;//en seconde
        _lastTime = timeStamp;
        return _delta;
    };
    
    this.getElapseTime = function() {
        var timeElapsed = +new Date() - _start ;
        _compteur = timeElapsed;
        return _compteur;
    };
    
    this.format = function (milli) {
        var seconds = Math.floor((milli / 1000) % 60);
        var minutes = Math.floor((milli / (60 * 1000)) % 60);

        minutes = ('00'+minutes).slice(-2);
        seconds = ('00'+seconds).slice(-2);
        var dixiemeDeSec = ('0000'+milli).slice(-4);

        return minutes + ":" + seconds + "." + dixiemeDeSec;
    };
    
    
    /* Initialisation (contructor) */  
    _start = +new Date();
}();

X.Timer = function(milliseconds, once){
    var _lastExec = +new Date();
    var _step = milliseconds;
    
    this.isElapsed = function(){
        var now = +new Date();
        var current = now - _lastExec;
        if(current > _step){
            _lastExec = now - current + _step;
            return true;
        }
        return false;
    };
};