/*
Created : 23/02/2016
Authors : ROCHE Emmanuel
Description :
    
*/

/* global include, X */

include('js/Scene.js');

/*
*/
X.SceneManager = function(){
    /* Properties */
    var _scene;
    
    /* Initialisation (contructor) */
    
    
    /* Méthodes */
    this.loadScene = function(scene){
        _scene = X.new(X.Scene);
    };
    
    this.update = function(ctx){
        //* Dessine le jeu
        _scene.update();
    };
    
    this.render = function(ctx){
        //* Efface l'écran
        ctx.clearRect(0, 0, X.Screen.width, X.Screen.height);
        
        //* Dessine le jeu
        _scene.render(ctx);
    };
    
    /* Accessors */
    this.getScene = function(){
        return _scene;
    };
    
};