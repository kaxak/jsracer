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
        timeStamp /= 1000;
        _delta = timeStamp - _lastTime;//en seconde
        _lastTime = timeStamp;
    };
    
    this.getElapseTime = function() {
        var timeElapsed = _lastTime - _start ;
        _compteur = timeElapsed;
        return _compteur;
    };
    
    this.format = function (seconde) {
        var milli = seconde * 1000;
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
