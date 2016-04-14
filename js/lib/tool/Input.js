/*
Created : 23/02/2016
Authors : GINOT Gilles, ROCHE Emmanuel
Description :
    Classe servant à definir les evenement inputs.
*/

/* global include, X */

X.Input = function() {
    
    /* Properties */
    //objet littéral contenant les keycode en provenance de l'utilisateur
    var _keysDown = {};
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
    
    /* Accessors */
    
    // event keypress : https://developer.mozilla.org/fr/docs/Web/Events/keypress
    // connaitre le keyCode d'une touche : http://keycode.info/
    /**
     * Retourne 'true' si la touche correspondante a "key" est pressée.
     * key : touche, keyCode ou string faisant référence à une touche du clavier (touche:'a' ou keyCode:65)
     */
    this.isKeyPress = function(key) {
        return _getKeyCode(key) in _keysDown;
    };
    
    /* Methods */
    
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