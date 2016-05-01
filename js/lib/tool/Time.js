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
    
    this.format = function(seconde) {
        var minutes = Math.floor(seconde / 60);
        var secondeSplit = ('00'+(seconde % 60)).split('.');
        return ('00'+minutes).slice(-2) + ":" + secondeSplit[0].slice(-2) + '.' + secondeSplit[1].slice(0,4) ;
    };
    
    
    /* Initialisation (contructor) */  
    _start = +new Date();
}();
