/*
Created : 23/02/2016
Authors : ROCHE Emmanuel
Description :
    
*/

/* global include, X */

include('js/Scene.js');

X.SceneManager = function () {
    
    var _ = X.class.propertiesGetter();
    
    var X_object = function(protected) {
        //* Initialise les propriétés
        _(this, protected);
        
        /* Propriétés */
        _(this, '-').scene;
        
    };
    
    X_object.prototype.loadScene = function(sceneFile){
        _(this, '-').scene = X.new(X.Scene);
    };
    
    X_object.prototype.update = function(){
        //* Dessine le jeu
        _(this, '-').scene.update();
    };
    
    X_object.prototype.render = function(ctx){
        //* Efface l'écran
        ctx.clearRect(0, 0, X.Screen.width, X.Screen.height);
        
        //* Dessine le jeu
        _(this, '-').scene.render(ctx);
    };
    
    /* Accessors */
    X_object.prototype.getScene = function(){
        return _(this, '-').scene;
    };
    
    return X.SceneManager = X_object;
};