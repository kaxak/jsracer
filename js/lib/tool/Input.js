/*
Created : 23/02/2016
Authors : GINOT Gilles, ROCHE Emmanuel
Description :
    Classe servant à definir les evenement inputs.
Aide :
    event keypress : https://developer.mozilla.org/fr/docs/Web/Events/keypress
    connaitre le keyCode d'une touche : http://keycode.info/
*/

/* global include, X */

X.Input = function() {
    
    /* Properties */
    //objet littéral contenant les keycode en provenance de l'utilisateur
    var _keysDown = {};
    var _padBtnDown = [];
    //var _padButtonsDown = {};
    
    /* Initialisation (contructor) */
    //attibut et enleve les keycode de l'objet KeysDown en fonction
    //des touches du clavier utilisées
    window.addEventListener("keydown", function (e) {
            _keysDown[e.keyCode] = true;
        }, false);

    window.addEventListener("keyup", function (e) {
        delete _keysDown[e.keyCode];
    }, false);
    
    /**
     * Retourne 'true' si la touche correspondante a "key" est pressée.
     * @param {string} key : touche, keyCode ou string faisant référence à une touche du clavier (touche:'a' ou keyCode:65)
     */
    this.isKeyPress = function(key) {
        return _getKeyCode(key) in _keysDown;
    };
    
    this.isPadBtnPress = function(btn) {
        
        if(typeof btn === 'string') {
            btn = this.getX360Mapping(btn)
        }
        
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        if (!gamepads) {
          return;
        } else {
         var gp1 = gamepads[0]; 
        }
        
        var manuel = document.getElementById('manuel')
        
        if(typeof gp1 === 'object') {
            
            manuel.innerHTML = 'A : go forward -- B : go backward -- X : handbrake -- D-PAD left : turn left -- D-PAD right: turn right';
            
            for(var i = 0; i < gp1.buttons.length; i++) {
                if(this.buttonPressed(gp1.buttons[i])) {
                    _padBtnDown[i] = true;
                } else {
                    _padBtnDown[i] = false;
                }
            }
        } else { 
            manuel.innerHTML = 'Z : Go forward  -- S :  Go Backward -- SPACE : HandBrake  --  Q/D : turning left / right';
        }
        
        return _padBtnDown[btn];
        
    };
    
    this.buttonPressed = function (b) {
          if (typeof(b) == "object") {
            return b.pressed;
          }
          return b == 1.0;
    };
    
    this.getX360Mapping = function(btn) {
        
        switch (btn) {
                case 'A':
                    btn = 0;
                    break;
                case 'B':
                    btn = 1;
                    break;
                case 'X':
                    btn = 2;
                    break;
                case 'Y':
                    btn = 3;
                    break;
                case 'LB':
                    btn = 4;
                    break;
                case 'RB':
                    btn = 5;
                    break;
                case 'LT':
                    btn = 6;
                    break;
                case 'RT':
                    btn = 7;
                    break;
                case 'BACK':
                    btn = 8;
                    break;
                case 'START':
                    btn = 9;
                    break;
                case 'LEFT_STICK':
                    btn = 10;
                    break;
                case 'RIGHT_STICK':
                    btn = 11;
                    break;
                case 'D-PAD UP':
                    btn = 12;
                    break;
                case 'D-PAD DOWN':
                    btn = 13;
                    break;
                case 'D-PAD LEFT':
                    btn = 14;
                    break;
                case 'D-PAD RIGHT':
                    btn = 15;
                    break;
            }
        return btn;
    };
    //* http://stackoverflow.com/questions/94037/convert-character-to-ascii-code-in-javascript
    /**
     * Retourne le keyCode (integer) d'une touche ou 'false' si la "key" ne correspond à rien.
     * @param {string} key : touche, keyCode ou string faisant référence à une touche du clavier (touche:'a' ou keyCode:65)
     */
    var _getKeyCode = function(key){
        if(typeof key === 'string' || key instanceof String){
            key = key.toUpperCase();
            
            if(key.length === 1){
                //* Si on est entre A et Z on retourne le code ASCII
                var code = key.charCodeAt(0);
                if(code >= 65 && code <= 90){
                    return code;
                }
            }
            switch (key) {
                case 'RETURN':
                case 'ENTER':
                    return 13;
                case 'SPACE':
                    return 32;
            }
        }
        else if(typeof key === 'number'){
            if(key % 1 === 0){
                return key;
            }
        }
        return false;
    };
    
};
X.Input = new X.Input();//genre "singleton"