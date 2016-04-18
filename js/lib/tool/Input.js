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

X.Input = new function() {
    
    /* Properties */
    //objet littéral contenant les keycode en provenance de l'utilisateur
    var _keys = [];
    var _mouseButtons = [];
    var _gamepadButtons = [];
    
    //attibut et enleve les keycode de l'objet KeysDown en fonction
    //des touches du clavier utilisées
    window.addEventListener("keydown", function (e) {
        _preventDefault(e);
        _keys[e.keyCode] = true;
    }, false);

    window.addEventListener("keyup", function (e) {
        _preventDefault(e);
        delete _keys[e.keyCode];
    }, false);
    
    /**
     * Retourne 'true' si la touche correspondante a "key" est pressée.
     * @param {string} key : touche, keyCode ou string faisant référence à une touche du clavier (touche:'a' ou keyCode:65)
     */
    this.isPressed = function(keys){
        if(typeof keys === 'object' || keys instanceof Object){
            var key = null;
            //* Test les entrées clavier
            for(var i = 0; i < keys.keyboard.length; ++i){
                key = keys.keyboard[i];
                if(typeof key === 'string' || key instanceof String){
                    if(_getKeyCode(key.toUpperCase()) in _keys) return true;
                }
            }
            //* Test les entrées des gamepads
            for(var id in keys.gamepads){
                for(var i = 0; i < keys.gamepads[id].length; ++i){
                    key = keys.gamepads[id][i];
                    if(typeof key === 'string' || key instanceof String){
                        if(_getX360Code(key.toUpperCase()) in _gamepadButtons[id]) return true;
                    }
                }
            }
            
        }
        return false;
    };
    
    /**
     * 
     * @returns {undefined}
     */
    this.pollGamepads = function(){
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : null);
        //* Pas de gamepad trouvés ou navigateur imcompatible
        if(gamepads === null) return;
        
        //* Pour chaque gamepad
        for(var i = 0; i < gamepads.length; ++i){
            var gamepad = gamepads[i];
            //* Si le gamepad est valid
            if(!gamepad) continue;
            //* Pour chaque boutons pressés on l'ajoute au tableau _gamepadButtons sinon on l'enlève
            gamepad.buttons.forEach(function(button, i, a){
                if(!_gamepadButtons[gamepad.index]) _gamepadButtons[gamepad.index] = [];
                if(button.pressed){
                    _gamepadButtons[gamepad.index][i] = true;
                }
                else if(_gamepadButtons[gamepad.index][i]){
                    delete _gamepadButtons[gamepad.index][i];
                }
            });
        };
    };
    
    //* http://stackoverflow.com/questions/94037/convert-character-to-ascii-code-in-javascript
    /**
     * Retourne le keyCode (integer) d'une touche ou 'false' si la "key" ne correspond à rien.
     * @param {string} key : touche, keyCode ou string faisant référence à une touche du clavier (touche:'a' ou keyCode:65)
     */
    var _getKeyCode = function(key){
        if(typeof key === 'string' || key instanceof String){
            
            
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
                case 'LEFT':
                    return 37;
                case 'UP':
                    return 38;
                case 'RIGHT':
                    return 39;
                case 'DOWN':
                    return 40;
            }
        }
        else if(typeof key === 'number'){
            if(key % 1 === 0){
                return key;
            }
        }
        return false;
    };
    
    /**
     * 
     * @param {type} btn
     * @returns {Number|Boolean}
     */
    var _getX360Code = function(btn) {
        if(typeof btn === 'string' || btn instanceof String){
            switch (btn) {
                case 'A':
                    return 0;
                    break;
                case 'B':
                    return 1;
                case 'X':
                    return 2;
                case 'Y':
                    return 3;
                case 'LB':
                    return 4;
                case 'RB':
                    return 5;
                case 'LT':
                    return 6;
                case 'RT':
                    return 7;
                case 'BACK':
                    return 8;
                case 'START':
                    return 9;
                case 'LEFT_STICK':
                case 'LSTICK':
                    return 10;
                case 'RIGHT_STICK':
                case 'RSTICK':
                    return 11;
                case 'D-PAD_UP':
                case 'DUP':
                    return 12;
                case 'D-PAD_DOWN':
                case 'DDOWN':
                    return 13;
                case 'D-PAD_LEFT':
                case 'DLEFT':
                    return 14;
                case 'D-PAD_RIGHT':
                case 'DRIGHT':
                    return 15;
            }
        }
        else if(typeof btn === 'number'){
            if(btn >= 0 && btn <= 15) return btn;
        }
        return false;
    };
    
    /**
     * 
     * @param {type} e
     * @returns {undefined}
     */
    var _preventDefault = function(e){
        if(e.keyCode){
            var excepts = [17,116,122];
            if(!excepts.includes(e.keyCode)){
                e.preventDefault();
            }
        }
    };
    
}();