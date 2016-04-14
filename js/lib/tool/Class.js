/*
Created : 13/04/16
Authors : ROCHHE Emmanuel
Description : gère l'instanciation d'objet

*/

/* global include, X */

X.class = function(){
    /**
     * Gère le stockage des propriétes protégés
     */
    var _ = function(){
        var _wm = new WeakMap;
        return function(obj){
            var protectedStock;
            _wm.set(obj, protectedStock = {});
            return protectedStock;
        };
    }();
    
    /**
     * A mettre dans le closure (classe) de tout prototype d'objet.
     * Gère l'accession aux propriétés de l'objet
     */
    this.propertiesGetter = function(){
        var _wm = new WeakMap;
        return function(thisArg, type){
            var _properties = _wm.get(thisArg);
            if (!_properties) {
                _wm.set(thisArg, _properties = [{}, null]);//[private, protected]
            }
            if(_properties[1] === null){
                if(typeof type === 'string' || type instanceof String){
                    throw new Error('[Error] The protected properties is not initialized!');
                }
                else{
                    _properties[1] = type;
                    return true;
                }
            }
            //* UML:
            //      - private
            //      + public
            //      # protected
            switch(type){
                case '+':
                    return thisArg;
                case '-':
                    return _properties[0];//[private, protected]
                case '#':
                    return _properties[1];//[private, protected]
                default:
                    throw new Error('[Error] X.class.propertiesGetter(obj, type) : error on type argument not corresponding to +, - or #');
            }
        };
    };
    
    /**
     * Initialise le patron en constructeur si se n'est déjà pas fait.
     * @param {function} pattern patron d'un objet initialisé ou non
     * @returns {function} le constructeur de l'objet
     */
    this.get = function(pattern){
        try{
            var _pattern = pattern();
            if(!_pattern) return pattern;
            return _pattern;
        }
        catch(err){
            return pattern;
        }
    };
    
    /**
     * Créer et initialise un nouvel objet qui une instance d'un patron.
     * On passe au constructeur l'objet qui stocke les propriétés protégées.
     * ?L'objet est scellé.
     * @param {function} pattern patron de l'objet qui sera créé.
     * @param {array} args tableau contenant les arguments passé au constructeur.
     * @returns {Object} L'objet créé.
     */
    this.new = function(pattern, args){
        var _ctor = X.class.get(pattern);
        var o = Object.create(_ctor.prototype);
        args = [_(o)].concat(args);
        _ctor.apply(o, args);
//        Object.seal(o);
        return o;
        
    };
    
    return this;
}();
X.new = X.class.new;//* Alias pour créer un nouvel objet.

