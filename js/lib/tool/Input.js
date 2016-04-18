/*
Created : 23/02/2016
Authors : GINOT Gilles, ROCHE Emmanuel
Description :
    Récupère les entrées des périphériques clavier, souris et aussis des gamepads.
Aide :
    event keypress : https://developer.mozilla.org/fr/docs/Web/Events/keypress
    connaitre le keyCode d'une touche : http://keycode.info/
*/

/* global include, X */

X.Input = new function() {
    
    /* Properties */
    /**
     * Contient les entrées clavier
     * @type Array
     */
    var _keys = [];
    /**
     * Contient les entrées souris
     * @type Array
     */
    var _mouseButtons = [];
    /**
     * Contient les entrées des gamepads
     * @type Array
     */
    var _gamepadButtons = [];
    
    /**
     * Gère le clavier lorsqu'une touche est enfoncée
     */
    window.addEventListener("keydown", function (e) {
        _preventDefault(e);
        _keys[e.keyCode] = true;
    }, false);
    /**
     * Gère le clavier lorsqu'une touche est relâchée
     */
    window.addEventListener("keyup", function (e) {
        _preventDefault(e);
        delete _keys[e.keyCode];
    }, false);
    
    /**
     * Bloque l’action par défaut de la plus part des touches sauf celles contenue 
     * dans le tableau excepts de la méthode (ctrl, F5, F11)
     * @param {event} e évènnement concerné
     */
    var _preventDefault = function(e){
        if(e.keyCode){
            var excepts = [17,116,122];
            if(!excepts.includes(e.keyCode)){
                e.preventDefault();
            }
        }
    };
    
    /**
     * Test toutes les entrées contenue dans l'argument binds 
     * jusqu'à se qu'il en trouve un vrai qu'il retournera 
     * sinon la méthode retourne faux car aucune de ces entrées 
     * est activées.
     * Exemple d'un bind :
     * var mesBinds = {
     *      keyboard:['d','right',...],
     *      gamepads:{
     *          0:['DRIGHT',...]
     *      },
     *      mouse:[...]
     *  };
     * @param {object} binds
     */
    this.isPressed = function(binds){
        if(typeof binds === 'object' || binds instanceof Object){
            var key = null;
            //* Test les entrées clavier
            if(binds.keyboard){
                for(var i = 0; i < binds.keyboard.length; ++i){
                    key = binds.keyboard[i];
                    if(typeof key === 'string' || key instanceof String){
                        if(_getKeyCode(key.toUpperCase()) in _keys) return true;
                    }
                }
            }
            //* Test les entrées des gamepads
            if(binds.gamepads){
                for(var id in binds.gamepads){
                    for(var i = 0; i < binds.gamepads[id].length; ++i){
                        key = binds.gamepads[id][i];
                        if(typeof key === 'string' || key instanceof String){
                            if(_getX360Code(key.toUpperCase()) in _gamepadButtons[id]) return true;
                        }
                    }
                }
            }
            
        }
        return false;
    };
    
    /**
     * Stocke l'état des gamepads de manière simplifié.
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
     * Récupère le code correspondant à une touche.
     * @param {string} key : nom de la touche du clavier.
     * @returns {Number|Boolean} le code de la touche du clavier ou faux en cas d'échec.
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
        return false;
    };
    
    /**
     * Récupère le code correspondant à une button d'un gamepad Xinput.
     * @param {string} key : nom du bouton du gamepad.
     * @returns {Number|Boolean} le code de la touche du clavier ou faux en cas d'échec.
     */
    var _getX360Code = function(key) {
        if(typeof key === 'string' || key instanceof String){
            switch (key) {
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
        else if(typeof key === 'number'){
            if(key >= 0 && key <= 15) return key;
        }
        return false;
    };
    
    
}();