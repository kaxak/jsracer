/*
Created : 23/02/2016
Authors : GINOT Gilles, ROCHE Emmanuel
Description :
    Classe servant à definir :
        -le Delta à chaque rafraîchissement.
        -connaitre le temps écoulé depuis le lancement du jeu.
*/

/* global X */

X.Time = function() {
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
    
    this.displayTime = function (milli) {
        
      var dixiemeDeSec = milli % 100;
      var seconds = Math.floor((milli / 1000) % 60);
      var minutes = Math.floor((milli / (60 * 1000)) % 60);
      
      if(minutes < 10) {
          minutes = '0'+ minutes;
      }
      if(seconds < 10) {
          seconds = '0'+ seconds;
      }
      if(dixiemeDeSec < 10) {
          dixiemeDeSec = '0'+ dixiemeDeSec;
      }

      return minutes + ":" + seconds + "." + dixiemeDeSec;
    }
    
    
    /* Initialisation (contructor) */  
    _start = +new Date();
};
X.Time = new X.Time();