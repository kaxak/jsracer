/*
Created : 23/02/2016
Authors : ROCHE Emmanuel, TORRES Julien, GINOT Giles, DELANNOY Sabrina, PAOLI Jérôme
Description :
    Class principale du jeu.
*/

/* global include, X */
include('js/SceneManager.js');
include('js/lib/tool/Time.js');
include('js/lib/tool/Screen.js');

/* Constantes */
Math.PI2 = Math.PI * 2;
Math.PIO2 = Math.PI / 2;

/**
 * 
 * @param {type} canvas : id du canvas dans lequel le jeu sera rendu.
 */
X.Game = function (canvas, gui) {
    var _canvas;
    var _ctx;
    var _sceneMgr;
    
    var _frame = function(timeStamp){
        try{
            //* Met à jour le singleton X.Time
            X.Time.update(timeStamp);
            
            X.Input.pollGamepads();

            //* Met à jour la scène
            _sceneMgr.update();

            //* Dessine la scène
            _sceneMgr.render(_ctx);

            window.requestAnimationFrame(_frame);
        }catch(err){
            console.error(err.stack);
        }
    };
    
    try{ 
        _canvas = document.getElementById(canvas);

        //* Si le canvas existe on crée un contexte de dessin 2D
        if(_canvas){
            X.Screen.InitFromCanvas(_canvas);

            _ctx = _canvas.getContext('2d');

            //* Si on a un contexte, on initialise le jeu et on appelle la première frame
            if(_ctx){
               //* initialisation du jeu
               _sceneMgr = X.new(X.SceneManager);
               _sceneMgr.loadScene();
               //*Input.initMonEcouteur(blabla);

               //* appelle la frame
               window.requestAnimationFrame(_frame);
            }
            else{
                throw new Error('[Error] Cannot get 2D context from canvas');
            }
        }
        else{
            throw new Error('[Error] Cannot get canvas');
        }
    }
    catch(err){
        console.error(err.stack);
    }
};